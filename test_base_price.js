const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  const accountNo = process.env.SS_ACCOUNT_NUMBER?.trim();
  const apiKey = process.env.SS_API_KEY?.trim();
  const authHeader = "Basic " + Buffer.from(`${accountNo}:${apiKey}`).toString("base64");
  
  const res = await fetch(`https://api.ssactivewear.com/v2/products/?styleID=32`, {
    headers: {
      "Authorization": authHeader,
      "Accept": "application/json"
    }
  });
  const products = await res.json();
  console.log(products[0].piecePrice, products[0].customerPrice);
}
run();
