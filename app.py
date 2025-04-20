import os
import logging
from flask import Flask, render_template, request, jsonify
from carbon_calculator import calculate_carbon_footprint
from web_carbon_calculator import calculate_website_carbon_footprint, extract_website_text
from chatbot import get_chatbot_response

# Create the Flask application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """Render the main page with calculator and chatbot"""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """API endpoint for carbon footprint calculation"""
    try:
        data = request.json
        
        # Extract form data
        electricity = float(data.get('electricity', 0))
        transport_type = data.get('transport_type', '')
        distance = float(data.get('distance', 0))
        diet = data.get('diet', '')
        
        # Calculate carbon footprint
        result = calculate_carbon_footprint(electricity, transport_type, distance, diet)
        
        logger.debug(f"Calculation result: {result}")
        return jsonify({
            "success": True,
            "result": result
        })
    except Exception as e:
        logger.error(f"Error in calculation: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
        
@app.route('/calculate-website', methods=['POST'])
def calculate_website():
    """API endpoint for website carbon footprint calculation"""
    try:
        data = request.json
        
        # Extract form data
        website_url = data.get('website_url', '')
        monthly_views = int(data.get('monthly_views', 0))
        
        if not website_url:
            return jsonify({
                "success": False,
                "error": "Please enter a website URL"
            }), 400
        
        # Calculate website carbon footprint
        result = calculate_website_carbon_footprint(website_url, monthly_views)
        
        # Get website text content for summary (optional)
        website_text = extract_website_text(website_url)
        
        result['website_text_preview'] = website_text[:200] + '...' if website_text and len(website_text) > 200 else website_text
        
        logger.debug(f"Website calculation result: {result}")
        return jsonify({
            "success": True,
            "result": result
        })
    except Exception as e:
        logger.error(f"Error in website calculation: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

@app.route('/chat', methods=['POST'])
def chat():
    """API endpoint for chatbot interaction"""
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({
                "success": False,
                "error": "No message provided"
            }), 400
        
        # Get response from Ollama Llama2 model
        response = get_chatbot_response(user_message)
        
        return jsonify({
            "success": True,
            "response": response
        })
    except Exception as e:
        logger.error(f"Error in chatbot: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html'), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": "Server error occurred"}), 500
