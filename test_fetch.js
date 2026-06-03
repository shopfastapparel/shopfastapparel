const accountNo = "902068";
const apiKey = "a9ad940a-d2e8-4bd5-a605-f51fe06990bb";
const authHeader = "Basic " + Buffer.from(`${accountNo}:${apiKey}`).toString("base64");
fetch("https://api.ssactivewear.com/v2/products/?styleID=32", {
  headers: { "Authorization": authHeader, "Accept": "application/json" }
}).then(res => console.log(res.status, res.statusText)).catch(err => console.error(err));
