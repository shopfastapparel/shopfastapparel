import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type InventoryItem = {
  colorName: string;
  colorHex?: string;
  sizeName: string;
  qty: number;
  sku: string;
  basePrice?: number;
};

// This server function runs securely on the backend (Node/Vercel)
// so the API key and Account Number are never exposed to the browser.
export const fetchLiveInventory = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ styleId: z.number() }).parse(d))
  .handler(async ({ data }) => {
    const { styleId } = data;
    
    const accountNo = process.env.SS_ACCOUNT_NUMBER?.trim();
    const apiKey = process.env.SS_API_KEY?.trim();

    // Optional: Log on server to verify keys are loaded
    console.log(`Fetching S&S Activewear Live Inventory for style: ${styleId}`);

    if (!accountNo || !apiKey) {
      console.warn("Missing S&S credentials. Falling back to simulated inventory.");
      return [{ colorName: "DEBUG_ERR", sizeName: "Missing Vercel Env Vars", qty: 0, sku: "ERR-ENV" }];
    }

    try {
      const authHeader = "Basic " + btoa(`${accountNo}:${apiKey}`);
      
      // We fetch all SKUs for the specific styleID
      const res = await fetch(`https://api.ssactivewear.com/v2/products/?styleID=${styleId}`, {
        headers: {
          "Authorization": authHeader,
          "Accept": "application/json"
        }
      });

      if (!res.ok) {
        return [{ colorName: "DEBUG_ERR", sizeName: `HTTP ${res.status}. Acct:${accountNo?.substring(0,3)} Key:${apiKey?.substring(0,3)}`, qty: 0, sku: "ERR-HTTP" }];
      }

      const products: any[] = await res.json();

      // S&S returns an array of SKUs for that style (each SKU is a color/size combo)
      // If no products found or it returns an error object
      if (!Array.isArray(products) || products.length === 0) {
         console.warn(`No inventory found for style ${styleId}. Falling back to simulated.`);
         return [{ colorName: "DEBUG_ERR", sizeName: `No Data from S&S (Type: ${typeof products})`, qty: 0, sku: "ERR-NODATA" }];
      }

      // Map the S&S payload to our simplified frontend matrix
      const inventory: InventoryItem[] = products.map((p) => ({
        colorName: p.colorName || "Unknown",
        colorHex: p.color1 || undefined,
        sizeName: p.sizeName || "OS",
        qty: p.qty || 0,
        sku: p.sku || "",
        basePrice: p.piecePrice || 0,
      }));

      return inventory;

    } catch (err: any) {
      console.error("S&S Activewear API Error:", err);
      return [{ colorName: "DEBUG_ERR", sizeName: `Exception: ${err.message}`, qty: 0, sku: "ERR-EXC" }];
    }
  });


// A helpful fallback generator to ensure the UI renders during testing/development
function generateSimulatedInventory(styleId: number): InventoryItem[] {
  const colors = ["Black", "White", "Navy", "Red", "Heather Grey"];
  const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];
  
  const inventory: InventoryItem[] = [];
  
  for (const color of colors) {
    for (const size of sizes) {
      // Simulate low stock randomly
      const isLowStock = Math.random() > 0.8;
      const isOutOfStock = Math.random() > 0.95;
      
      let qty = Math.floor(Math.random() * 500) + 100;
      if (isOutOfStock) qty = 0;
      else if (isLowStock) qty = Math.floor(Math.random() * 20) + 1;

      inventory.push({
        colorName: color,
        sizeName: size,
        qty,
        sku: `SIM-${styleId}-${color.substring(0,2).toUpperCase()}-${size}`,
      });
    }
  }
  return inventory;
}
