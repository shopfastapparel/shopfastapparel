import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('.env', 'utf-8');
const extract = (key) => {
  const match = envText.match(new RegExp(`${key}="(.*?)"`));
  return match ? match[1] : null;
};

const SUPABASE_URL = extract('VITE_SUPABASE_URL');
const SUPABASE_SERVICE_KEY = extract('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function run() {
  console.log("Checking bucket...");
  const { data: buckets, error: getErr } = await supabase.storage.listBuckets();
  if (getErr) {
    console.error("Failed to get buckets:", getErr);
    return;
  }
  
  const bucket = buckets.find(b => b.name === 'quote_artwork');
  if (!bucket) {
    console.log("Bucket not found. Creating as public...");
    const { error: createErr } = await supabase.storage.createBucket('quote_artwork', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 10485760
    });
    if (createErr) console.error("Create error:", createErr);
    else console.log("Created quote_artwork successfully!");
  } else {
    console.log("Bucket exists. Ensuring it is public...");
    const { error: updateErr } = await supabase.storage.updateBucket('quote_artwork', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 10485760
    });
    if (updateErr) console.error("Update error:", updateErr);
    else console.log("Updated quote_artwork to public!");
  }
}
run();
