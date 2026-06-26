import os
import time
import requests
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import re

NOTIFIED_FILE = "DELIVERED_NOTIFIED.json"

def load_env():
    env_dict = {}
    if os.path.exists(".env"):
        with open(".env", "r") as f:
            for line in f:
                if "=" in line:
                    key, val = line.strip().split("=", 1)
                    env_dict[key] = val.strip("'").strip('"')
    return env_dict

def update_env(access_token, refresh_token):
    if os.path.exists(".env"):
        with open(".env", "r") as f:
            content = f.read()
        content = re.sub(r"ETSY_ACCESS_TOKEN=.*", f"ETSY_ACCESS_TOKEN='{access_token}'", content)
        content = re.sub(r"ETSY_REFRESH_TOKEN=.*", f"ETSY_REFRESH_TOKEN='{refresh_token}'", content)
        with open(".env", "w") as f:
            f.write(content)

def get_notified():
    if os.path.exists(NOTIFIED_FILE):
        with open(NOTIFIED_FILE, "r") as f:
            return json.load(f)
    return []

def save_notified(notified):
    with open(NOTIFIED_FILE, "w") as f:
        json.dump(notified, f)

def send_email(order, env_dict, image_url):
    sender_email = env_dict.get("SENDER_EMAIL", "shopfastapparel@gmail.com")
    sender_password = env_dict.get("SENDER_PASSWORD", "gutcjhfuvljllxtm")
    to_email = "shopfastapparel@gmail.com"

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f"DELIVERED: Order #{order['receipt_id']} for {order['name']}"
    msg['From'] = f"Delivery Watcher Agent <{sender_email}>"
    msg['To'] = to_email

    html_body = f"""
    <html>
      <head>
        <style>
          body {{ font-family: Arial, sans-serif; color: #333; }}
          .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
          .image-container {{ text-align: center; margin: 20px 0; }}
          img {{ max-width: 300px; border-radius: 8px; border: 1px solid #ddd; }}
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello!</h2>
          <p>Your Delivery Watcher Agent here.</p>
          <p>Order <strong>#{order['receipt_id']}</strong> for <strong>{order['name']}</strong> has just been marked as DELIVERED by the carrier!</p>
          
          {"<div class='image-container'><img src='" + image_url + "' alt='Purchased Item' /></div>" if image_url else ""}

          <p>Please provide your AI assistant with their email address so the 'Your Order has Arrived' email can be generated and sent.</p>
          <p>Thanks!<br>- Delivery Watcher Agent</p>
        </div>
      </body>
    </html>
    """
    msg.attach(MIMEText(html_body, 'html'))
    
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print(f"Email sent for order #{order['receipt_id']}")
    except Exception as e:
        print(f"Failed to send email: {e}")

def run_watcher():
    print("Delivery Watcher Agent started...")
    while True:
        try:
            env = load_env()
            api_key = env.get("ETSY_API_KEY")
            shared_secret = env.get("ETSY_SHARED_SECRET")
            access_token = env.get("ETSY_ACCESS_TOKEN")
            shippo_key = env.get("SHIPPO_API_KEY")
            shop_id = "54596835"

            headers = {
                "x-api-key": f"{api_key}:{shared_secret}",
                "Authorization": f"Bearer {access_token}"
            }

            res = requests.get(f"https://api.etsy.com/v3/application/shops/{shop_id}/receipts?limit=25", headers=headers)
            
            if res.status_code == 401:
                print("Token expired, refreshing...")
                refresh_str = env.get("ETSY_REFRESH_TOKEN")
                token_res = requests.post("https://api.etsy.com/v3/public/oauth/token", data={
                    "grant_type": "refresh_token",
                    "client_id": api_key,
                    "refresh_token": refresh_str
                })
                if token_res.status_code == 200:
                    data = token_res.json()
                    access_token = data.get("access_token")
                    refresh_token = data.get("refresh_token")
                    update_env(access_token, refresh_token)
                    headers["Authorization"] = f"Bearer {access_token}"
                    res = requests.get(f"https://api.etsy.com/v3/application/shops/{shop_id}/receipts?limit=25", headers=headers)
                else:
                    print("Failed to refresh token:", token_res.text)

            if res.status_code == 200:
                data = res.json()
                orders = data.get("results", [])
                notified = get_notified()

                for order in orders:
                    receipt_id = order.get("receipt_id")
                    if not order.get("is_shipped"):
                        continue
                    
                    if receipt_id in notified:
                        continue
                        
                    shipments = order.get("shipments", [])
                    if shipments and shippo_key:
                        tracking_code = shipments[0].get("tracking_code")
                        carrier = (shipments[0].get("carrier_name") or "").lower()
                        
                        if tracking_code and carrier:
                            track_res = requests.get(f"https://api.goshippo.com/tracks/{carrier}/{tracking_code}", headers={
                                "Authorization": f"ShippoToken {shippo_key}"
                            })
                            if track_res.status_code == 200:
                                track_data = track_res.json()
                                status = track_data.get("tracking_status", {}).get("status")
                                if status == "DELIVERED":
                                    print(f"Order {receipt_id} is DELIVERED. Fetching image...")
                                    
                                    # Fetch image
                                    image_url = None
                                    if order.get("transactions") and len(order["transactions"]) > 0:
                                        t = order["transactions"][0]
                                        listing_id = t.get("listing_id")
                                        image_id = t.get("listing_image_id")
                                        if listing_id and image_id:
                                            try:
                                                img_res = requests.get(f"https://api.etsy.com/v3/application/listings/{listing_id}/images/{image_id}", headers=headers)
                                                if img_res.status_code == 200:
                                                    img_data = img_res.json()
                                                    image_url = img_data.get("url_570xN") or img_data.get("url_170x135") or img_data.get("url_75x75")
                                            except Exception as e:
                                                print(f"Failed to fetch image: {e}")

                                    send_email(order, env, image_url)
                                    notified.append(receipt_id)
                                    save_notified(notified)

            else:
                print(f"Error fetching orders: {res.status_code}")
                
        except Exception as e:
            print(f"Watcher error: {e}")

        # Sleep for 1 hour before checking again
        time.sleep(3600)

if __name__ == "__main__":
    run_watcher()
