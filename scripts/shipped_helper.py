import os
import json
import resend
from dotenv import load_dotenv

load_dotenv("/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/.env")
load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
ADMIN_EMAIL = os.environ.get("RESEND_TO_EMAIL", "shopfastapparel@gmail.com")
FROM_EMAIL = os.environ.get("RESEND_FROM_EMAIL", "Fast Apparel <info@shopfastapparel.com>")

TEMPLATE_PATH = "/Users/tavarus/.gemini/antigravity/scratch/shopfastapparel/scripts/email_template_shipped.html"


def render_proof_gallery_html(proof_urls):
    """
    Renders the HTML section for approved master proofs and garment mockups.
    proof_urls: list of dicts, e.g.:
      [
        {"label": "Official Master Proof Sheet", "url": "https://...", "is_master": True},
        {"label": "Front & Sleeve View", "url": "https://...", "note": "Left Chest + Right Sleeve"},
        {"label": "Back View", "url": "https://...", "note": "Full Back Centered Graphic"}
      ]
    """
    if not proof_urls:
        return ""

    master_proofs = [p for p in proof_urls if p.get("is_master")]
    item_mockups = [p for p in proof_urls if not p.get("is_master")]

    html_parts = []

    for mp in master_proofs:
        label = mp.get("label", "Approved Master Production Proof")
        url = mp.get("url", "")
        html_parts.append(f"""
        <div style="margin: 26px 0; background-color: #F8FAFC; padding: 18px; border-radius: 12px; border: 2px solid #E2E8F0; text-align: center;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <strong style="font-size: 15px; color: #0F172A;">🎨 {label}</strong>
            <span style="font-size: 11px; color: #0284C7; font-weight: 700; background: #E0F2FE; padding: 4px 12px; border-radius: 12px; border: 1px solid #BAE6FD;">🔍 Ultra HD Commercial DTF Proof</span>
          </div>
          <a href="{url}" target="_blank" style="display: block; text-decoration: none;">
            <img src="{url}" alt="{label}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); display: block; margin: 0 auto; border: 1px solid #CBD5E1;" />
          </a>
          <p style="font-size: 12px; color: #64748B; margin: 8px 0 0 0;">
            <em>Click proof sheet to inspect high-resolution print placements in full detail.</em>
          </p>
        </div>
        """)

    if item_mockups:
        col_width = f"{100.0 / len(item_mockups):.1f}%" if len(item_mockups) <= 3 else "50%"
        cards_html = ""
        for m in item_mockups:
            label = m.get("label", "Garment Proof")
            url = m.get("url", "")
            note = m.get("note", "")
            note_html = f'<span style="font-size: 12px; color: #0284C7; font-weight: 600; display: block; margin-top: 2px;">{note}</span>' if note else ""
            cards_html += f"""
            <td width="{col_width}" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 12px; text-align: center; vertical-align: top;">
              <a href="{url}" target="_blank" style="text-decoration: none;">
                <img src="{url}" alt="{label}" style="width: 100%; height: auto; border-radius: 6px; display: block; margin-bottom: 8px;" />
              </a>
              <strong style="font-size: 13.5px; color: #0F172A; display: block;">{label}</strong>
              {note_html}
            </td>
            """
        html_parts.append(f"""
        <div style="margin: 24px 0;">
          <h4 style="font-size: 15px; color: #0F172A; margin: 0 0 12px 0;">👕 Garment Proofs In Your Package</h4>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate; border-spacing: 12px 0;">
            <tr>{cards_html}</tr>
          </table>
        </div>
        """)

    return "".join(html_parts)


def render_manifest_table_html(manifest_rows, total_qty_label="TOTAL CUSTOM TEES IN SHIPMENT:"):
    """
    Renders the itemized size breakdown and garment table.
    manifest_rows: list of dicts:
      [
        {
          "garment": "Gildan 5000 Heavy Cotton™",
          "colorway": "Dark Heather Charcoal / Grey (5.3 oz)",
          "prints": ["Left Chest Pocket Logo", "Full Back Graphic", "Right Sleeve 3D Infinity Loop"],
          "sizes": {"Small": 4, "Medium": 10, "Large": 12, "XL": 10, "2XL": 4},
          "qty": 40
        }
      ]
    """
    if not manifest_rows:
        return ""

    total_qty = sum(r.get("qty", 0) for r in manifest_rows)
    rows_html = ""

    for r in manifest_rows:
        prints_list = "<br/>".join([f"• {p}" for p in r.get("prints", [])])
        size_items = "".join([f"<tr><td width='55'><strong>{k}:</strong></td><td>{v}</td></tr>" for k, v in r.get("sizes", {}).items()])
        sizes_table = f"<table cellpadding='2' cellspacing='0' style='font-size: 12.5px;'>{size_items}</table>" if size_items else ""

        rows_html += f"""
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 12px 14px; vertical-align: top;">
            <strong style="color: #0F172A;">{r.get('garment', '')}</strong><br/>
            <span style="font-size: 12px; color: #64748B;">{r.get('colorway', '')}</span>
          </td>
          <td style="padding: 12px 14px; vertical-align: top; font-size: 12.5px;">
            {prints_list}
          </td>
          <td style="padding: 12px 14px; vertical-align: top;">
            {sizes_table}
          </td>
          <td style="padding: 12px 14px; text-align: center; font-weight: 700; font-size: 15px; color: #0F172A; vertical-align: middle;">
            {r.get('qty', 0)}
          </td>
        </tr>
        """

    return f"""
    <div style="margin: 25px 0; background-color: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #111827; padding: 12px 18px; color: #FFFFFF;">
        <h3 style="margin: 0; font-size: 15px; font-weight: 700;">📋 Final Shipment Manifest &amp; Size Breakdown</h3>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; color: #374151;">
        <thead>
          <tr style="background-color: #F8FAFC; border-bottom: 2px solid #E2E8F0; text-align: left;">
            <th style="padding: 10px 14px; font-weight: 600;">Garment &amp; Colorway</th>
            <th style="padding: 10px 14px; font-weight: 600;">Print Setup</th>
            <th style="padding: 10px 14px; font-weight: 600;">Size Breakdown</th>
            <th style="padding: 10px 14px; font-weight: 600; text-align: center;">Qty</th>
          </tr>
        </thead>
        <tbody>
          {rows_html}
          <tr style="background-color: #F8FAFC; border-top: 2px solid #E2E8F0;">
            <td colspan="3" style="padding: 12px 14px; font-weight: 700; color: #0F172A;">
              {total_qty_label}
            </td>
            <td style="padding: 12px 14px; text-align: center; font-weight: 800; font-size: 16px; color: #059669;">
              {total_qty}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    """


def generate_shipped_html(
    customer_name,
    customer_company,
    carrier,
    tracking_number,
    tracking_url,
    shipping_address,
    invoice_number,
    amount_paid,
    invoice_subtitle,
    proof_urls=None,
    manifest_rows=None,
    closing_note=None,
    is_draft=False
):
    with open(TEMPLATE_PATH, "r") as f:
        template = f.read()

    draft_banner = ""
    if is_draft:
        draft_banner = f"""
        <div style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
          <strong style="color: #92400E; font-size: 14px;">⚠️ INTERNAL SHOP OWNER REVIEW DRAFT (ENHANCED DASH MASCOT)</strong>
          <p style="color: #78350F; font-size: 13px; margin: 4px 0 0 0; line-height: 1.5;">
            Prominently featuring <strong>Dash the Cheetah</strong> across the Hero Dispatch Card (sprinting graphic), Live Carrier Tracker badge, Quality &amp; Precision Seal, and Re-Order sign-off.<br/>
            Draft shipment notification for <strong>{customer_name}</strong> at <strong>{customer_company}</strong>.<br/>
            Includes official {carrier} Tracking (<code>{tracking_number}</code>), itemized manifest, approved proofs, and care guide.<br/>
            <strong>STRICT STATUS: ZERO EMAILS SENT TO CUSTOMER.</strong> Awaiting owner review and chat approval.
          </p>
        </div>
        """

    proof_gallery_html = render_proof_gallery_html(proof_urls) if proof_urls else ""
    manifest_html = render_manifest_table_html(manifest_rows) if manifest_rows else ""
    default_closing = f"Thank you so much for partnering with Fast Apparel for <strong>{customer_company}</strong>! We loved bringing these shirts to life and know your team will wear them with pride. Whenever you are ready for reorders, staff additions, or future events, Dash and our crew are always here for you!"
    closing_text = closing_note or default_closing

    html = (
        template
        .replace("{{TITLE}}", "Your Custom Apparel Order Has Shipped! 🚚📦")
        .replace("{{DRAFT_BANNER}}", draft_banner)
        .replace("{{CARRIER}}", carrier)
        .replace("{{CUSTOMER_NAME}}", customer_name)
        .replace("{{CUSTOMER_COMPANY}}", customer_company)
        .replace("{{TRACKING_NUMBER}}", tracking_number)
        .replace("{{TRACKING_URL}}", tracking_url)
        .replace("{{SHIPPING_ADDRESS}}", shipping_address)
        .replace("{{INVOICE_NUMBER}}", invoice_number)
        .replace("{{AMOUNT_PAID}}", amount_paid)
        .replace("{{INVOICE_SUBTITLE}}", invoice_subtitle)
        .replace("{{PROOF_GALLERY}}", proof_gallery_html)
        .replace("{{MANIFEST_TABLE}}", manifest_html)
        .replace("{{CLOSING_NOTE}}", closing_text)
    )

    return html
