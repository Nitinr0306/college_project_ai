import os
import logging
import requests
from flask import Flask, render_template, request, jsonify

# Configure app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key")

# Configure logging
logger = logging.getLogger(__name__)

# Ollama API endpoint
OLLAMA_API_URL = "http://localhost:11434/api/generate"

@app.route('/')
def index():
    """Render the main page of the application"""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate_footprint():
    """Calculate carbon footprint based on user inputs"""
    try:
        data = request.json
        
        # Extract values from form
        electricity = float(data.get('electricity', 0))
        transportation_type = data.get('transportationType', '')
        distance = float(data.get('distance', 0))
        diet = data.get('diet', '')
        
        # Carbon footprint calculation factors (kg CO2e)
        # These are simplified estimates and could be refined
        electricity_factor = 0.5  # kg CO2e per kWh
        
        transportation_factors = {
            'car': 0.192,          # kg CO2e per km
            'bus': 0.105,          # kg CO2e per km
            'train': 0.041,        # kg CO2e per km
            'motorcycle': 0.103,   # kg CO2e per km
            'bicycle': 0,          # kg CO2e per km
            'walking': 0,          # kg CO2e per km
            'plane': 0.255         # kg CO2e per km
        }
        
        diet_factors = {
            'meat-heavy': 7.19,    # kg CO2e per day
            'omnivore': 5.63,      # kg CO2e per day
            'pescatarian': 3.91,   # kg CO2e per day
            'vegetarian': 3.81,    # kg CO2e per day
            'vegan': 2.89          # kg CO2e per day
        }
        
        # Calculate footprint components
        electricity_footprint = electricity * electricity_factor
        transportation_footprint = distance * transportation_factors.get(transportation_type, 0)
        diet_footprint = diet_factors.get(diet, 0)
        
        # Calculate total footprint (daily basis)
        total_footprint = electricity_footprint + transportation_footprint + diet_footprint
        
        # Calculate annual footprint
        annual_footprint = total_footprint * 365
        
        # Prepare response with detailed breakdown
        result = {
            'success': True,
            'totalFootprint': round(total_footprint, 2),
            'annualFootprint': round(annual_footprint, 2),
            'breakdown': {
                'electricity': round(electricity_footprint, 2),
                'transportation': round(transportation_footprint, 2),
                'diet': round(diet_footprint, 2)
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error calculating carbon footprint: {str(e)}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/chat', methods=['POST'])
def chat():
    """Process chat messages using Ollama with Llama2 model"""
    try:
        data = request.json
        user_message = data.get('message', '')
        
        # Context to focus responses on sustainability topics
        prompt = f"""You are a sustainability assistant providing information about carbon footprints, 
        eco-friendly practices, and environmental awareness. 
        
        User question: {user_message}
        
        Please provide a helpful, informative response focused on sustainability and environmental topics.
        Keep your response concise (about 150 words maximum).
        """
        
        # Send request to Ollama API
        response = requests.post(
            OLLAMA_API_URL,
            json={
                "model": "llama2",
                "prompt": prompt,
                "stream": False
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            bot_response = result.get('response', 'Sorry, I could not generate a response.')
            return jsonify({'success': True, 'response': bot_response})
        else:
            logger.error(f"Error from Ollama API: {response.text}")
            return jsonify({
                'success': False, 
                'error': f"Error communicating with Ollama API (Status: {response.status_code})"
            })
            
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        return jsonify({
            'success': False, 
            'error': f"Error processing your request: {str(e)}"
        })

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('index.html'), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    logger.error(f"Server error: {str(e)}")
    return jsonify({'success': False, 'error': 'Internal server error'}), 500
