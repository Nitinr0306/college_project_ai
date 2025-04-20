import logging
import requests
import re
from urllib.parse import urlparse
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

# Approximate carbon emission factors
CARBON_FACTORS = {
    # kg CO2e per GB of data transfer
    'data_transfer': 0.81,
    # kg CO2e per kWh of server energy
    'server_energy': 0.475,
    # Average page size in MB if we can't determine it
    'default_page_size_mb': 2.0,
    # Average page views per month for small websites
    'default_monthly_views': 10000
}

def get_website_size(url):
    """
    Get the size of a website in MB by fetching the content
    
    Args:
        url: URL of the website to analyze
    
    Returns:
        Size of the website in MB
    """
    try:
        # Check if the URL has a scheme, add http if not
        if not urlparse(url).scheme:
            url = 'http://' + url
            
        # Fetch the website content
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Get content length in bytes from headers if available
        content_length = response.headers.get('Content-Length')
        
        if content_length:
            # Convert bytes to MB
            size_mb = int(content_length) / (1024 * 1024)
        else:
            # If Content-Length header is not available, use the actual response size
            size_mb = len(response.content) / (1024 * 1024)
            
        logger.debug(f"Website size: {size_mb:.2f} MB")
        return size_mb
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching website: {str(e)}")
        # Return default page size if we can't determine the actual size
        return CARBON_FACTORS['default_page_size_mb']

def extract_website_text(url):
    """
    Extract the text content of a website using BeautifulSoup
    
    Args:
        url: URL of the website to analyze
    
    Returns:
        Text content of the website
    """
    try:
        # Make sure the URL has a scheme
        if not urlparse(url).scheme:
            url = 'http://' + url
            
        # Fetch the website with a user agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, timeout=10, headers=headers)
        response.raise_for_status()
        
        # Parse the HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove non-content elements
        for element in soup(['script', 'style', 'header', 'footer', 'nav', 'aside']):
            element.decompose()
            
        # Get text and clean it up
        text = soup.get_text(separator=' ')
        
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        # Remove excess whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Get a preview of the text
        if text:
            # Take first 500 characters as preview
            preview = text[:500]
            if len(text) > 500:
                preview += "..."
            return preview
        else:
            return "No text content could be extracted from this website."
            
    except Exception as e:
        logger.error(f"Error extracting website text: {str(e)}")
        return f"Error extracting website content: {str(e)}"

def calculate_website_carbon_footprint(url, monthly_views=None):
    """
    Calculate the carbon footprint of a website
    
    Args:
        url: URL of the website to analyze
        monthly_views: Estimated monthly page views (defaults to 10000)
    
    Returns:
        Dictionary with carbon footprint results in kg CO2e
    """
    try:
        # Use provided monthly views or default
        if monthly_views is None or monthly_views <= 0:
            monthly_views = CARBON_FACTORS['default_monthly_views']
            
        # Get website size
        website_size_mb = get_website_size(url)
        
        # Convert MB to GB for calculation
        website_size_gb = website_size_mb / 1024
        
        # Calculate carbon per visit (data transfer + server energy)
        # Data transfer carbon
        data_carbon = website_size_gb * CARBON_FACTORS['data_transfer']
        
        # Estimated server energy (assuming 0.2 kWh per GB as a rough estimate)
        server_energy_kwh = website_size_gb * 0.2
        server_carbon = server_energy_kwh * CARBON_FACTORS['server_energy']
        
        # Total per visit
        carbon_per_visit = data_carbon + server_carbon
        
        # Monthly and annual carbon
        monthly_carbon = carbon_per_visit * monthly_views
        annual_carbon = monthly_carbon * 12
        
        # Round results for readability
        results = {
            "website_size_mb": round(website_size_mb, 2),
            "carbon_per_visit": round(carbon_per_visit * 1000, 2),  # convert to grams for readability
            "monthly_carbon": round(monthly_carbon, 2),
            "annual_carbon": round(annual_carbon, 2),
            "monthly_views": monthly_views
        }
        
        logger.debug(f"Website carbon calculation results: {results}")
        return results
        
    except Exception as e:
        logger.error(f"Error calculating website carbon footprint: {str(e)}")
        raise