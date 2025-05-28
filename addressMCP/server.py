from mcp.server.fastmcp import FastMCP
from app import validate_address

# Initialize MCP server
mcp = FastMCP("address-validator-mcp")

@mcp.tool()
async def validate_address_tool(address: str) -> dict:
    """
    Validate an address and get its coordinates.
    
    Args:
        address (str): Address string in format "Street, City, State, PostalCode, Country"
        
    Returns:
        dict: Validation results containing:
            - is_valid: Whether the address is valid
            - coordinates: Latitude and longitude if valid
            - input_address: Parsed address components
    """
    # Call the function from app.py (no await since validate_address is sync)
    result = validate_address(address)
    return result

if __name__ == "__main__":
    mcp.run(transport="stdio")