import json
import requests
import logging
import os

logger = logging.getLogger(__name__)

# Ollama API endpoint - assuming it's running locally by default
# If OLLAMA_API_HOST is set in environment, use that instead
OLLAMA_API_HOST = os.environ.get('OLLAMA_API_HOST', 'localhost')
OLLAMA_API_PORT = os.environ.get('OLLAMA_API_PORT', '11434')
OLLAMA_API_URL = f"http://{OLLAMA_API_HOST}:{OLLAMA_API_PORT}/api/generate"

logger.debug(f"Using Ollama API URL: {OLLAMA_API_URL}")

def get_chatbot_response(user_message):
    """
    Get a response from the Ollama Llama2 model based on the user's message
    
    Args:
        user_message: The message sent by the user
        
    Returns:
        The model's response as a string
    """
    try:
        # Create a prompt focused on sustainability
        prompt = f"""You are a helpful sustainability assistant focused on providing information about 
        carbon footprints, climate change, and environmental topics. 
        
        User query: {user_message}
        
        Please provide an informative, accurate, and helpful response about this environmental topic.
        Keep your answer concise, clear, and focused on sustainability.
        """
        
        # Prepare the payload for Ollama API
        payload = {
            "model": "llama2",
            "prompt": prompt,
            "stream": False
        }
        
        logger.debug(f"Sending request to Ollama API with message: {user_message}")
        
        # Make a request to the Ollama API
        response = requests.post(OLLAMA_API_URL, json=payload)
        
        # Check if request was successful
        if response.status_code == 200:
            response_data = response.json()
            bot_response = response_data.get('response', '')
            logger.debug(f"Received response from Ollama: {bot_response[:50]}...")
            return bot_response
        else:
            error_message = f"Ollama API error: {response.status_code} - {response.text}"
            logger.error(error_message)
            return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later."
            
    except requests.exceptions.ConnectionError:
        logger.error("Connection error: Unable to connect to Ollama API")
        return "I'm sorry, I can't connect to the Llama2 model. Please ensure Ollama is running on your system."
        
    except Exception as e:
        logger.error(f"Error in chatbot response: {str(e)}")
        return "I'm sorry, an unexpected error occurred. Please try again later."
