### app.py
import requests

def validate_address(address_text: str) -> dict:
    """
    Validate an address and get its coordinates using Cloudmersive API.
    """
    # API configuration
    API_KEY = "7a8b4fb5-63d2-40be-ad09-ebc85ce91de7"
    API_URL = "https://api.cloudmersive.com/validate/address/street-address"

    # Parse address components
    parts = address_text.split(',')
    address_parts = {
        'street_address': parts[0].strip() if len(parts) > 0 else '',
        'city': parts[1].strip() if len(parts) > 1 else '',
        'state': parts[2].strip() if len(parts) > 2 else '',
        'postal_code': parts[3].strip() if len(parts) > 3 else '',
        'country': parts[4].strip() if len(parts) > 4 else 'Turkey'
    }

    # Prepare API request
    headers = {
        "Apikey": API_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "StreetAddress": address_parts['street_address'],
        "City": address_parts['city'],
        "StateOrProvince": address_parts['state'],
        "PostalCode": address_parts['postal_code'],
        "CountryFullName": address_parts['country']
    }

    # Make the API request
    response = requests.post(API_URL, json=payload, headers=headers)

    # Process response
    if response.status_code == 200:
        data = response.json()
        return {
            "is_valid": data.get("ValidAddress", False),
            "coordinates": {
                "latitude": data.get("Latitude"),
                "longitude": data.get("Longitude")
            } if data.get("ValidAddress", False) else None,
            "input_address": address_parts
        }
    else:
        return {
            "is_valid": False,
            "error": f"API request failed with status code {response.status_code}",
            "input_address": address_parts
        }

# Test the function with a sample address
print(validate_address("Barbaros Bulvarı No:145, Beşiktaş, İstanbul, 34349, Turkey"))

