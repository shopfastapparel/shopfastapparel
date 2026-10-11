import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const envText = fs.readFileSync('.env', 'utf-8');
const key = envText.split('\n').find(l => l.startsWith('RESEND_API_KEY='))?.split('=')[1]?.trim().replace(/['"]/g, '');
const from = envText.split('\n').find(l => l.startsWith('RESEND_FROM_EMAIL='))?.split('=')[1]?.trim().replace(/['"]/g, '') || 'Fast Apparel Quotes <info@shopfastapparel.com>';
const to = envText.split('\n').find(l => l.startsWith('RESEND_TO_EMAIL='))?.split('=')[1]?.trim().replace(/['"]/g, '') || 'shopfastapparel@gmail.com';

const resend = new Resend(key);

const previews = [
  {
    subject: '[MASCOT PREVIEW 1/3] Auto-Response: Quote Request Confirmation (Dash + Animated Signature)',
    file: 'scripts/preview_mascot_emails/preview_1_auto_response.html'
  },
  {
    subject: '[MASCOT PREVIEW 2/3] Price Quote: Official Proposal & Proofs (Dash + Animated Signature)',
    file: 'scripts/preview_mascot_emails/preview_2_quote_email.html'
  },
  {
    subject: '[MASCOT PREVIEW 3/3] Customer Invoice: Payment & Production Kickoff (Dash + Animated Signature)',
    file: 'scripts/preview_mascot_emails/preview_3_invoice_email.html'
  }
];

async function dispatchAll() {
  console.log(`Dispatching 3 mascot email previews to ${to} from ${from}...`);
  for (const item of previews) {
    if (!fs.existsSync(item.file)) {
      console.error('File not found:', item.file);
      continue;
    }
    const html = fs.readFileSync(item.file, 'utf-8');
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject: item.subject,
      html
    });
    if (error) {
      console.error('Failed to send:', item.subject, error);
    } else {
      console.log('✅ Sent successfully:', item.subject, '-> ID:', data?.id);
    }
  }
}

dispatchAll();
