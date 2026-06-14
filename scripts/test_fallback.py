import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from send_campaign import send_prospect_email

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fallback_path = os.path.join(project_root, 'public', 'images', 'apparel', 'fallback-mockup.png')

try:
    with open(fallback_path, 'rb') as f:
        fallback_bytes = f.read()
    
    admin_email = "info@shopfastapparel.com"
    success = send_prospect_email(admin_email, "Test Company", fallback_bytes, "test-lead-id")
    
    if success:
        print("Test email sent successfully!")
    else:
        print("Failed to send test email.")
except Exception as e:
    print(f"Error: {e}")
