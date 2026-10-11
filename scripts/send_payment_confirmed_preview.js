import fs from 'fs';
import { Resend } from 'resend';

const envText = fs.readFileSync('.env', 'utf-8');
const key = envText.split('\n').find(l => l.startsWith('RESEND_API_KEY='))?.split('=')[1]?.trim().replace(/['"]/g, '');
const from = 'Fast Apparel <info@shopfastapparel.com>';
const to = envText.split('\n').find(l => l.startsWith('RESEND_TO_EMAIL='))?.split('=')[1]?.trim().replace(/['"]/g, '') || 'shopfastapparel@gmail.com';

const resend = new Resend(key);

const templatePath = 'scripts/email_template_invoice_paid.html';
let html = fs.readFileSync(templatePath, 'utf-8');

html = html
  .replace('{{TITLE}}', '[DRAFT REVIEW] Payment Confirmed! Invoice #INV-8821 — Production Kickoff 🚀')
  .replace('{{DRAFT_BANNER}}', `
    <div style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
      <strong style="color: #92400E; font-size: 14px;">⚠️ REAL-TIME PAYMENT DETECTED: OWNER REVIEW DRAFT</strong>
      <p style="color: #78350F; font-size: 13px; margin: 4px 0 0 0; line-height: 1.5;">
        Stripe just confirmed receipt of <strong>$450.00</strong> from <strong>Marcus Vance</strong> (<code>marcus@apexfitness.com</code>) for Invoice #<strong>INV-8821</strong>.<br/>
        <strong>STRICT STATUS: ZERO EMAILS SENT TO CUSTOMER.</strong> Awaiting owner review and explicit chat approval.
      </p>
    </div>
  `)
  .replace(/{{CUSTOMER_NAME}}/g, 'Marcus Vance')
  .replace(/{{CUSTOMER_EMAIL}}/g, 'marcus@apexfitness.com')
  .replace(/{{INVOICE_NUMBER}}/g, 'INV-8821')
  .replace(/{{AMOUNT_PAID}}/g, '$450.00')
  .replace(/{{PAYMENT_DATE}}/g, 'Today')
  .replace(/{{DELIVERY_METHOD}}/g, 'Tracked Carrier Ground Delivery')
  .replace(/{{SHIPPING_ADDRESS}}/g, 'Confirmed on file (Duluth, GA)')
  .replace('{{RECEIPT_CTA}}', `
    <div style="text-align: center; margin-top: 14px;">
      <a href="https://pay.stripe.com/receipts/test_receipt" target="_blank" style="display: inline-block; background: #0284C7; color: #FFF; font-weight: 700; font-size: 13.5px; padding: 10px 22px; border-radius: 6px; text-decoration: none;">
        View Official Stripe Receipt &rarr;
      </a>
    </div>
  `)
  .replace('{{PROOF_GALLERY}}', `
    <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 14px; padding: 18px; margin: 24px 0;">
      <strong style="color: #0F172A; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 12px;">
        🎨 Approved Production Proofs:
      </strong>
      <table width="100%" cellpadding="6" cellspacing="0" border="0">
        <tr>
          <td width="50%" align="center">
            <div style="border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; background: #FFFFFF; padding: 6px;">
              <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/choi_mockup_grey_front.jpg" alt="Front Mockup" style="width: 100%; max-width: 240px; height: auto; border-radius: 6px; display: block;">
              <span style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px;">Front: Left Chest</span>
            </div>
          </td>
          <td width="50%" align="center">
            <div style="border: 1px solid #CBD5E1; border-radius: 10px; overflow: hidden; background: #FFFFFF; padding: 6px;">
              <img src="https://dwtvfrpqizanpnvgkpux.supabase.co/storage/v1/object/public/quote_artwork/mockups/choi_mockup_navy_back.jpg" alt="Back Mockup" style="width: 100%; max-width: 240px; height: auto; border-radius: 6px; display: block;">
              <span style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-top: 6px;">Back: Full Graphic Hero</span>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `)
  .replace('{{MANIFEST_TABLE}}', `
    <div style="border: 2px solid #E2E8F0; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
      <div style="background: #0F172A; color: #FFFFFF; padding: 10px 16px; font-weight: 800; font-size: 13px; text-transform: uppercase;">
        📋 Order Manifest: Gildan Softstyle 64000 (36 Tees)
      </div>
      <table width="100%" cellpadding="10" cellspacing="0" border="0" style="font-size: 13.5px; color: #334155;">
        <tr style="background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-weight: 700;">
          <td align="left">Size</td>
          <td align="center">Color</td>
          <td align="center">Qty</td>
          <td align="right">Unit Price</td>
          <td align="right">Amount</td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td>Small (S)</td>
          <td align="center">Black</td>
          <td align="center">6</td>
          <td align="right">$12.50</td>
          <td align="right">$75.00</td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td>Medium (M)</td>
          <td align="center">Black</td>
          <td align="center">12</td>
          <td align="right">$12.50</td>
          <td align="right">$150.00</td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td>Large (L)</td>
          <td align="center">Black</td>
          <td align="center">12</td>
          <td align="right">$12.50</td>
          <td align="right">$150.00</td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td>X-Large (XL)</td>
          <td align="center">Heather Grey</td>
          <td align="center">6</td>
          <td align="right">$12.50</td>
          <td align="right">$75.00</td>
        </tr>
        <tr style="background: #F8FAFC; font-weight: 800; border-top: 2px solid #CBD5E1;">
          <td colspan="4" align="right">Total (Zero Setup Fees, Free US Shipping):</td>
          <td align="right" style="color: #0F172A; font-size: 15px;">$450.00</td>
        </tr>
      </table>
    </div>
  `)
  .replace('{{CLOSING_NOTE}}', 'Thank you again for partnering with Fast Apparel! Our team is excited to produce this order for you.');

async function run() {
  console.log(`Sending payment confirmed preview email to ${to}...`);
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: '[MASCOT PREVIEW 4/4] Payment Received & Confirmed: Order in Production 🚀 (Dash + Animated Signature)',
    html
  });
  if (error) {
    console.error('Failed to send:', error);
  } else {
    console.log('✅ Sent successfully! ID:', data?.id);
  }
}

run();
