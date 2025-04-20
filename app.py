import os
import logging
from flask import Flask, render_template, request, jsonify
import requests

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

# Ollama API endpoint
OLLAMA_API_URL = "http://localhost:11434/api/generate"

# Carbon footprint conversion factors
CARBON_FACTORS = {
    "electricity": {
        "unit": "kWh",
        "factor": 0.233  # kg CO2e per kWh (global average)
    },
    "transportation": {
        "car": {
            "unit": "km",
            "factor": 0.192  # kg CO2e per km
        },
        "bus": {
            "unit": "km",
            "factor": 0.105  # kg CO2e per km
        },
        "train": {
            "unit": "km",
            "factor": 0.041  # kg CO2e per km
        },
        "plane": {
            "unit": "km",
            "factor": 0.255  # kg CO2e per km
        }
    },
    "diet": {
        "meat_heavy": 7.19,  # kg CO2e per day
        "meat_medium": 5.63,  # kg CO2e per day
        "pescatarian": 3.91,  # kg CO2e per day
        "vegetarian": 3.81,   # kg CO2e per day
        "vegan": 2.89         # kg CO2e per day
    }
}

@app.route('/')
def index():
    """Render the main page of the application."""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """Calculate carbon footprint based on user inputs."""
    try:
        data = request.json
        logger.debug(f"Received data: {data}")
        
        # Extract values from form data
        electricity = float(data.get('electricity', 0))
        transport_type = data.get('transportType', 'car')
        transport_distance = float(data.get('transportDistance', 0))
        diet_type = data.get('dietType', 'meat_medium')
        
        # Calculate carbon footprint components
        electricity_footprint = electricity * CARBON_FACTORS['electricity']['factor']
        
        transport_footprint = transport_distance * CARBON_FACTORS['transportation'][transport_type]['factor']
        
        diet_footprint = CARBON_FACTORS['diet'][diet_type]
        
        # Calculate total carbon footprint
        total_footprint = electricity_footprint + transport_footprint + diet_footprint
        
        # Prepare the result
        result = {
            'total': round(total_footprint, 2),
            'components': {
                'electricity': round(electricity_footprint, 2),
                'transportation': round(transport_footprint, 2),
                'diet': round(diet_footprint, 2)
            }
        }
        
        logger.debug(f"Calculation result: {result}")
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error calculating carbon footprint: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages by forwarding them to the Ollama API."""
    try:
        data = request.json
        user_message = data.get('message', '')
        
        # Create a prompt that guides the model to respond about sustainability
        prompt = f"""You are a helpful sustainability assistant. Your primary focus is on environmental topics, 
carbon footprint reduction, and sustainable living practices. 

User message: {user_message}

Provide a helpful, informative, and concise response related to sustainability, carbon footprint, 
or environmental topics. If the question is not related to these areas, gently guide the conversation 
back to sustainability topics."""
        
        # Prepare request to Ollama API
        payload = {
            "model": "llama2",
            "prompt": prompt,
            "stream": False,
            "max_tokens": 500
        }
        
        logger.debug(f"Sending request to Ollama API: {payload}")
        
        # Send request to Ollama API
        response = requests.post(OLLAMA_API_URL, json=payload)
        
        if response.status_code == 200:
            # Extract the response text from Ollama
            response_data = response.json()
            bot_response = response_data.get('response', '')
            logger.debug(f"Received response from Ollama: {bot_response[:50]}...")
            
            return jsonify({'response': bot_response})
        else:
            logger.error(f"Error from Ollama API: {response.text}")
            return jsonify({'error': 'Failed to get response from chatbot'}), 500
    
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
