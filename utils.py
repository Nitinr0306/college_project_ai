"""
Utility functions for carbon footprint calculations and other helpers
"""

def get_carbon_reduction_tips(footprint):
    """
    Generate carbon reduction tips based on footprint size
    
    Args:
        footprint (float): Carbon footprint in kg CO2e
        
    Returns:
        list: List of tips for reducing carbon footprint
    """
    # General tips for everyone
    general_tips = [
        "Use LED bulbs which use up to 85% less energy than traditional bulbs",
        "Turn off lights and unplug electronics when not in use",
        "Reduce water usage with shorter showers and fixing leaks",
        "Eat locally grown, seasonal food to reduce transportation emissions",
        "Reduce food waste by planning meals and composting scraps"
    ]
    
    # Additional tips based on footprint size
    if footprint > 20:
        return general_tips + [
            "Consider renewable energy options for your home",
            "Evaluate home insulation to reduce heating/cooling needs",
            "Look into carbon offset programs for unavoidable emissions",
            "Consider reducing air travel when possible"
        ]
    elif footprint > 10:
        return general_tips + [
            "Try to reduce meat consumption a few days per week",
            "Use public transportation more frequently",
            "Consider carpooling or ride-sharing options"
        ]
    else:
        return general_tips + [
            "Continue your great sustainability practices",
            "Share your sustainability knowledge with friends and family"
        ]
