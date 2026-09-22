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

export type CatalogStyle = {
  styleID: number;
  brandName: string;
  styleName: string;
  title: string;
  description: string;
  baseCategory?: string;
  categories?: string;
  styleImage: string;
  brandImage?: string;
};

export type SearchCatalogResult = {
  styles: CatalogStyle[];
  totalCount: number;
  query: string;
};

// In-memory server-side cache for catalog queries (10 min TTL)
const catalogCache = new Map<string, { timestamp: number; data: CatalogStyle[] }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

export const searchCatalogStyles = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        query: z.string().optional(),
        brand: z.string().optional(),
        category: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
      .parse(d || {})
  )
  .handler(async ({ data }): Promise<SearchCatalogResult> => {
    const rawQuery = (data?.query || "").trim();
    const brand = (data?.brand || "").trim();
    const category = (data?.category || "").trim();
    const limit = data?.limit || 36;
    const offset = data?.offset || 0;

    // Combine search tokens
    let searchTerm = rawQuery;
    if (brand && !searchTerm.toLowerCase().includes(brand.toLowerCase())) {
      searchTerm = searchTerm ? `${brand} ${searchTerm}` : brand;
    }
    if (category && !searchTerm.toLowerCase().includes(category.toLowerCase())) {
      // Map category friendly name to search keyword if needed
      const catKeyword =
        category.toLowerCase() === "hats & caps" || category.toLowerCase() === "headwear"
          ? "cap"
          : category.toLowerCase() === "fleece & hoodies"
          ? "hoodie"
          : category.toLowerCase() === "t-shirts"
          ? "tee"
          : category;
      searchTerm = searchTerm ? `${searchTerm} ${catKeyword}` : catKeyword;
    }

    if (!searchTerm) {
      searchTerm = "tee"; // default popular blanks
    }

    const cacheKey = searchTerm.toLowerCase();
    const now = Date.now();
    const cached = catalogCache.get(cacheKey);

    let allStyles: CatalogStyle[] = [];

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      allStyles = cached.data;
    } else {
      const accountNo = process.env.SS_ACCOUNT_NUMBER?.trim();
      const apiKey = process.env.SS_API_KEY?.trim();

      if (!accountNo || !apiKey) {
        console.warn("Missing S&S credentials for catalog search.");
        return { styles: [], totalCount: 0, query: searchTerm };
      }

      try {
        const authHeader = "Basic " + btoa(`${accountNo}:${apiKey}`);
        const url = `https://api.ssactivewear.com/v2/styles/?search=${encodeURIComponent(searchTerm)}`;
        
        const res = await fetch(url, {
          headers: {
            Authorization: authHeader,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          console.error(`S&S Catalog API returned HTTP ${res.status}`);
          return { styles: [], totalCount: 0, query: searchTerm };
        }

        const rawData: any[] = await res.json();

        if (Array.isArray(rawData)) {
          allStyles = rawData
            .filter((item) => item.styleID && (item.title || item.styleName))
            .map((item) => {
              let styleImg = item.styleImage || "";
              if (styleImg && !styleImg.startsWith("http")) {
                styleImg = `https://cdn.ssactivewear.com/${styleImg.replace(/^\/+/, "")}`;
              }

              let brandImg = item.brandImage || "";
              if (brandImg && !brandImg.startsWith("http")) {
                brandImg = `https://cdn.ssactivewear.com/${brandImg.replace(/^\/+/, "")}`;
              }

              return {
                styleID: Number(item.styleID),
                brandName: item.brandName || "Specialty Apparel",
                styleName: item.styleName || "",
                title: item.title || item.styleName || "Blank Garment",
                description: item.description || "",
                baseCategory: item.baseCategory || "",
                categories: item.categories || "",
                styleImage: styleImg,
                brandImage: brandImg || undefined,
              };
            });

          // Store in cache
          catalogCache.set(cacheKey, { timestamp: now, data: allStyles });
        }
      } catch (err) {
        console.error("Failed to query S&S styles:", err);
        return { styles: [], totalCount: 0, query: searchTerm };
      }
    }

    const totalCount = allStyles.length;
    const paginated = allStyles.slice(offset, offset + limit);

    return {
      styles: paginated,
      totalCount,
      query: searchTerm,
    };
  });


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
