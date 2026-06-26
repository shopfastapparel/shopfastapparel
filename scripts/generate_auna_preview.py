import os

template_path = "scripts/email_template.html"
with open(template_path, "r") as f:
    template = f.read()

title = "Your Invoice & Order Mockup from Fast Apparel"

body = """
<p>Hi Auna,</p>
<p>Thank you for choosing Fast Apparel! We are excited to work on your custom church tees order.</p>
<p>Below is a summary of your invoice <strong>#0002313</strong>:</p>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
    <thead>
        <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
            <th style="padding: 10px; text-align: left;">Description</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Total</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px;"><strong>Custom Church Tees - Small-XL</strong><br/>Gildan Softstyle Tees - Heather Red<br/>Front & Back Placements - White Prints<br/><small>10 S, 15 M, 14 L, 5 XL</small></td>
            <td style="padding: 10px; text-align: center;">44</td>
            <td style="padding: 10px; text-align: right;">$657.36</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px;"><strong>Custom Church Tees - 2XL</strong><br/>Gildan Softstyle Tees - Heather Red<br/>Front & Back Placements - White Prints</td>
            <td style="padding: 10px; text-align: center;">2</td>
            <td style="padding: 10px; text-align: right;">$37.88</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px;"><strong>Custom Church Tees - Small-XL</strong><br/>Gildan Light Cotton Unisex Tees - White<br/>Front Placement - Black Prints<br/><small>10 XS, 11 S, 8 M, 4 L</small></td>
            <td style="padding: 10px; text-align: center;">33</td>
            <td style="padding: 10px; text-align: right;">$165.00</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px;"><strong>Custom Church Tees - 2XL</strong><br/>Gildan Light Cotton Unisex Tees - White<br/>Front Placement - Black Prints</td>
            <td style="padding: 10px; text-align: center;">2</td>
            <td style="padding: 10px; text-align: right;">$18.00</td>
        </tr>
        <tr>
            <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total Due:</strong></td>
            <td style="padding: 10px; text-align: right;"><strong>$878.24</strong></td>
        </tr>
    </tbody>
</table>

<p>You can securely pay your invoice online using the button below:</p>

<div class="cta-container">
    <a href="https://my.freshbooks.com/#/link/IioQpAl87rx0aw" class="cta-button">Pay Invoice ($878.24)</a>
</div>

<p>We've also included a preview of your mockups below:</p>

<div style="text-align: center; margin-bottom: 20px;">
    <img src="/absolute/path/to/media__1782478338281.png" alt="Church Tees Mockup" style="max-width: 100%; border-radius: 8px; border: 1px solid #e5e7eb;" />
</div>

<p>Please let us know if you have any questions or if you need any adjustments before production.</p>
<p>Thanks again!</p>
"""

html_content = template.replace("{{TITLE}}", title).replace("{{BODY}}", body)

# We want to create a markdown artifact
md_content = f"""# Auna Nelson Invoice Email Preview

Below is the generated HTML for the email:

```html
{html_content}
```

![Mockup Image Preview](/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/media__1782478338281.png)
"""

with open("/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/auna_invoice_email_preview.md", "w") as f:
    f.write(md_content)

print("Generated preview.")
