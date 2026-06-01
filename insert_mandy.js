import fs from 'fs';

// Read the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env
const envText = fs.readFileSync('.env', 'utf-8');
const extract = (key) => {
  const match = envText.match(new RegExp(`${key}="(.*?)"`));
  return match ? match[1] : null;
};

const SUPABASE_URL = extract('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = extract('VITE_SUPABASE_PUBLISHABLE_KEY');

const body = {
  name: "Mandy Smith",
  email: "mandysmith123@example.com",
  service: "Family Tees",
  quantity: "12-23",
  turnaround: "Standard",
  turnaround_estimate: "7-10 business days",
  city: "Atlanta",
  details: "Looking to get custom shirts printed for my grandma's 80th birthday. Needs to be a premium material, and we want to have individual names on the sleeves.",
  status: "New Request",
  phone: "404-555-9876",
};

fetch(`${SUPABASE_URL}/rest/v1/quote_requests`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify(body)
}).then(res => res.text()).then(console.log).catch(console.error);

