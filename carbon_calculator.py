import logging

logger = logging.getLogger(__name__)

# Carbon footprint conversion factors
# These values are approximate and would ideally come from scientific sources
CARBON_FACTORS = {
    # Electricity (kg CO2e per kWh)
    'electricity': 0.41,  # Global average
    
    # Transportation (kg CO2e per km)
    'transport': {
        'car': 0.192,      # Average car
        'bus': 0.105,      # Public bus
        'train': 0.041,    # Train
        'bicycle': 0,      # Bicycle (zero emissions)
        'walking': 0,      # Walking (zero emissions)
        'motorcycle': 0.103, # Motorcycle
        'plane': 0.255     # Air travel (economy)
    },
    
    # Diet (kg CO2e per day)
    'diet': {
        'meat_heavy': 7.19,  # Meat with every meal
        'meat_medium': 5.63, # Meat a few times per week
        'pescatarian': 3.91, # Fish but no meat
        'vegetarian': 3.81,  # No meat or fish
        'vegan': 2.89        # No animal products
    }
}

def calculate_carbon_footprint(electricity, transport_type, distance, diet):
    """
    Calculate the carbon footprint based on provided inputs
    
    Args:
        electricity: Electricity usage in kWh
        transport_type: Type of transportation used
        distance: Distance traveled in km
        diet: Diet preference
        
    Returns:
        Dictionary with carbon footprint results in kg CO2e
    """
    try:
        # Calculate electricity footprint
        electricity_footprint = electricity * CARBON_FACTORS['electricity']
        
        # Calculate transportation footprint
        if transport_type in CARBON_FACTORS['transport']:
            transport_footprint = distance * CARBON_FACTORS['transport'][transport_type]
        else:
            transport_footprint = 0
            logger.warning(f"Unknown transport type: {transport_type}")
            
        # Calculate diet footprint (assuming a daily value)
        if diet in CARBON_FACTORS['diet']:
            diet_footprint = CARBON_FACTORS['diet'][diet]
        else:
            diet_footprint = 0
            logger.warning(f"Unknown diet type: {diet}")
            
        # Calculate total footprint
        total_footprint = electricity_footprint + transport_footprint + diet_footprint
        
        # Round to 2 decimal places for readability
        results = {
            "electricity": round(electricity_footprint, 2),
            "transport": round(transport_footprint, 2),
            "diet": round(diet_footprint, 2),
            "total": round(total_footprint, 2)
        }
        
        logger.debug(f"Carbon calculation results: {results}")
        return results
        
    except Exception as e:
        logger.error(f"Error calculating carbon footprint: {str(e)}")
        raise
