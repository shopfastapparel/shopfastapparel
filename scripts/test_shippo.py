import urllib.request
import json
import os

token = os.environ.get("SHIPPO_API_KEY", "")
url = "https://api.goshippo.com/orders/"

req = urllib.request.Request(
    url,
    headers={
        "Authorization": f"ShippoToken {token}",
        "Content-Type": "application/json"
    }
)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
        orders = data.get("results", [])
        if not orders:
            print("Successfully connected to Shippo, but no orders were found.")
        else:
            print(f"Successfully connected! Found {len(orders)} recent orders. Here are the top 3:")
            for order in orders[:3]:
                order_number = order.get('order_number')
                status = order.get('order_status')
                shop_app = order.get('shop_app')
                total_price = order.get('total_price')
                currency = order.get('total_price_currency')
                items = order.get('line_items', [])
                
                item_names = [item.get('title') for item in items]
                
                print(f"- Order #{order_number} ({shop_app}) | Status: {status} | Total: {total_price} {currency}")
                print(f"  Items: {', '.join(item_names) if item_names else 'N/A'}")
except Exception as e:
    print(f"Error fetching orders from Shippo: {e}")
