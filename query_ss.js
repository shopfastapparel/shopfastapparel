import fs from 'fs';

const accountNumber = '902068';
const apiKey = 'a9ad940a-d2e8-4bd5-a605-f51fe06990bb';
const authHeader = 'Basic ' + Buffer.from(`${accountNumber}:${apiKey}`).toString('base64');

async function searchProduct(term) {
  try {
    const res = await fetch('https://api.ssactivewear.com/v2/products', {
      headers: { 'Authorization': authHeader }
    });
    if (!res.ok) {
      console.log('Error fetching:', res.status, res.statusText);
      const text = await res.text();
      console.log(text);
      return;
    }
    const data = await res.json();
    const found = data.filter(p => p.title.toLowerCase().includes(term.toLowerCase()) || p.styleName.toLowerCase().includes(term.toLowerCase()) || p.brandName.toLowerCase().includes(term.toLowerCase()));
    
    // Just find exact style names if possible
    console.log(`\nSearch results for "${term}":`);
    found.slice(0, 5).forEach(p => {
      console.log(`Style ID: ${p.styleID} | Brand: ${p.brandName} | Style: ${p.styleName} | Title: ${p.title}`);
    });
  } catch(e) {
    console.error(e);
  }
}

async function run() {
  await searchProduct('3001');
  await searchProduct('64000');
}
run();
