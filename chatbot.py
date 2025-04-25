import os
import requests
import logging
import google.genai as genai
from google.genai import types
from fuzzywuzzy import fuzz
import re

logger = logging.getLogger(__name__)

def get_gemini_response(message):
    gemini_chatbot = GeminiChatbot()
    return gemini_chatbot.generate_response(message)

def get_chatbot_response(message):
    chatbot = OllamaChatbot()
    return chatbot.chat(message)

class GeminiChatbot:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY") or "AIzaSyB4YNds9a3nGzWH8G6u5mNOv1bQU9w9yg0"
        self.model = "gemini-2.5-flash-preview-04-17"

    def generate_response(self, prompt):
        try:
            client = genai.Client(api_key=self.api_key)
            contents = [
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=prompt)],
                ),
            ]
            generate_content_config = types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0),
                response_mime_type="text/plain",
            )
            response_text = ""
            for chunk in client.models.generate_content_stream(
                model=self.model,
                contents=contents,
                config=generate_content_config,
            ):
                response_text += chunk.text
            return response_text.strip()
        except Exception as e:
            logger.error(f"[GEMINI] SDK error: {str(e)}")
            raise Exception(f"Gemini SDK error: {str(e)}")

class OllamaChatbot:
    def __init__(self):
        self.api_host = os.getenv('OLLAMA_API_HOST', 'localhost')
        self.api_port = os.getenv('OLLAMA_API_PORT', '11434')
        self.model = os.getenv('OLLAMA_MODEL', 'llama2')
        self.endpoint = '/api/generate'

    def set_endpoint(self, endpoint):
        if endpoint in ['/api/generate', '/api/chat']:
            self.endpoint = endpoint
        else:
            logger.warning(f'Invalid endpoint: {endpoint}. Using default /api/generate')

    def get_api_url(self):
        return f'http://{self.api_host}:{self.api_port}{self.endpoint}'

    def validate_response(self, response):
        if not response:
            raise ValueError('Empty response from API')
        if self.endpoint == '/api/generate' and 'response' not in response:
            raise ValueError('Missing required field: response')
        elif self.endpoint == '/api/chat' and 'message' not in response:
            raise ValueError('Missing required field: message')
        return True
        
    def format_response(self, text):
        """Format the response text for better readability"""
        if not text:
            return ""
            
        # Clean up common formatting issues
        formatted = text.strip()
        
        # Ensure proper sentence spacing
        formatted = re.sub(r'\.\s*([A-Z])', r'. \1', formatted)
        
        # Add line breaks for readability when appropriate
        if len(formatted) > 150 and '\n' not in formatted:
            sentences = re.split(r'(?<=[.!?])\s+', formatted)
            if len(sentences) > 2:
                formatted = '\n'.join([' '.join(sentences[i:i+2]) for i in range(0, len(sentences), 2)])
                
        return formatted

    def handle_fallback(self, query, threshold=70):
        fallback_responses = {
            'greeting': 'Hello! How can I assist you today?',
            'farewell': 'Goodbye! Have a great day!',
            'help': 'I can help answer your questions about carbon footprints and sustainability.',
            'carbon': 'Carbon footprints measure the total greenhouse gas emissions caused by an individual, event, organization, or product. Reducing your carbon footprint helps combat climate change.',
            'sustainability': 'Some sustainability tips: use public transport, reduce meat consumption, minimize single-use plastics, and conserve energy at home.',
            'connection_error': 'Sorry, I\'m having trouble connecting to my knowledge base right now. Here\'s a sustainability tip while I recover: Reduce, reuse, and recycle to minimize your environmental impact.'
        }

        # Check for common keywords in the query
        query_lower = query.lower()
        
        # Direct keyword matching for better fallback responses
        if any(word in query_lower for word in ['hello', 'hi', 'hey']):
            return fallback_responses['greeting']
        elif any(word in query_lower for word in ['bye', 'goodbye', 'see you']):
            return fallback_responses['farewell']
        elif any(word in query_lower for word in ['help', 'assist', 'support']):
            return fallback_responses['help']
        elif any(word in query_lower for word in ['carbon', 'footprint', 'emission']):
            return fallback_responses['carbon']
        elif any(word in query_lower for word in ['sustainable', 'green', 'eco']):
            return fallback_responses['sustainability']
            
        # Fuzzy matching as backup
        best_match = max(fallback_responses.keys(), key=lambda x: fuzz.ratio(query_lower, x))
        if fuzz.ratio(query_lower, best_match) >= threshold:
            return fallback_responses[best_match]
            
        return fallback_responses['connection_error']

    def generate_response(self, prompt, stream=False):
        try:
            # Add context about carbon footprint to improve responses
            enhanced_prompt = f"Question about carbon footprint or sustainability: {prompt}\n\nPlease provide a helpful, accurate response about sustainability and carbon footprint tracking."
            
            payload = {
                'model': self.model,
                'prompt': enhanced_prompt,
                'stream': stream
            }

            # Increase timeout to 5 seconds for better connection handling
            response = requests.post(self.get_api_url(), json=payload, timeout=5)
            response.raise_for_status()
            data = response.json()

            self.validate_response(data)

            if self.endpoint == '/api/generate':
                return data['response']
            elif self.endpoint == '/api/chat':
                return data['message']['content']

        except requests.exceptions.RequestException as e:
            logger.error(f'API request failed: {str(e)}')
            if '404' in str(e):
                return f'API endpoint not found. Please verify the API URL: {self.get_api_url()}'
            elif 'timeout' in str(e).lower():
                logger.warning(f'Request timed out after 5 seconds. Ollama may not be running.')
                return self.handle_fallback(prompt, threshold=60)  # Lower threshold for timeouts
            fallback = self.handle_fallback(prompt)
            return fallback

    def chat(self, message):
        try:
            # Set the endpoint to /api/generate if not already set
            if not self.endpoint or self.endpoint not in ['/api/generate', '/api/chat']:
                self.endpoint = '/api/generate'
                
            logger.info(f"Sending chat request to Ollama API at {self.get_api_url()}")
            
            # Sanitize the message to prevent potential issues
            sanitized_message = message.strip()
            if not sanitized_message:
                return "I didn't receive a valid message. Please try again."
                
            # Use the generate_response method which already has proper error handling
            response = self.generate_response(sanitized_message)
            
            # Ensure we have a valid response
            if response:
                logger.debug(f"Received response from Ollama: {response[:50]}...")
                return response
            else:
                logger.warning("Empty response received from Ollama API")
                return self.handle_fallback(sanitized_message, threshold=65)
            
        except Exception as e:
            logger.error(f"Unexpected error in chat method: {str(e)}")
            # Return a user-friendly error message instead of the actual error
            return self.handle_fallback(message)