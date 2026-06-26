import smtplib

old_email = "shopfastapparel@gmail.com"
new_email = "info@shopfastapparel.com"
old_pwd = "gutcjhfuvljllxtm"
new_pwd = "rrrroxlgnoisvmnzy"

def test_login(email, pwd, label):
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(email, pwd)
        print(f"Login successful for {label}!")
        server.quit()
    except Exception as e:
        print(f"Login failed for {label}: {e}")

test_login(old_email, old_pwd, "old_email + old_pwd")
test_login(old_email, new_pwd, "old_email + new_pwd")
test_login(new_email, old_pwd, "new_email + old_pwd")
test_login(new_email, new_pwd, "new_email + new_pwd")
