export type ApparelStyle = {
  id: string;
  name: string;
  brand: string;
  model: string;
  image: string;
  fabricComposition: string;
  fabricWeight: string;
  features: string[];
  description: string;
  specSheetUrl: string;
};

export const APPAREL_STYLES: ApparelStyle[] = [
  {
    id: "gildan-64000",
    name: "Gildan Softstyle T-Shirt",
    brand: "Gildan",
    model: "64000",
    image: "/images/apparel/gildan-64000.png",
    fabricComposition: "100% ring-spun cotton (Heathers are 65/35 poly/cotton)",
    fabricWeight: "4.5 oz/yd²",
    features: [
      "Tear-away label",
      "Modern classic fit",
      "Seamless tubular body",
      "High stitch density"
    ],
    description: "The Gildan Softstyle offers an incredibly soft feel and a modern classic fit, making it an everyday staple. With its lightweight, breathable fabric, it provides a perfect canvas for high-quality custom prints.",
    specSheetUrl: "/specs/gildan-64000.pdf"
  },
  {
    id: "gildan-64000b",
    name: "Gildan Softstyle Youth T-Shirt",
    brand: "Gildan",
    model: "64000B",
    image: "/images/apparel/gildan-64000b.png",
    fabricComposition: "100% ring-spun US cotton",
    fabricWeight: "4.5 oz/yd²",
    features: [
      "Tear-away label",
      "Modern classic youth fit",
      "Seamless tubular body",
      "CPSIA Tracking Label Compliant"
    ],
    description: "Designed for comfort and durability, this youth tee brings the beloved softness of the adult Softstyle line to kids. Perfect for playground adventures and custom team gear.",
    specSheetUrl: "https://cloudfront.net/Gildan_64000B_Spec_Sheet.pdf"
  },
  {
    id: "gildan-18500",
    name: "Gildan Heavy Blend Hoodie",
    brand: "Gildan",
    model: "18500",
    image: "/images/apparel/gildan-18500.png",
    fabricComposition: "50% cotton, 50% polyester",
    fabricWeight: "8.0 oz/yd²",
    features: [
      "Tear-away label",
      "Air-jet spun yarn for reduced pilling",
      "Double-lined hood with drawcord",
      "Front pouch pocket"
    ],
    description: "Stay cozy and warm with this classic, midweight hooded sweatshirt. Featuring a soft, pill-resistant fleece interior and a spacious front pocket, it's the ultimate go-to layer for chilly days.",
    specSheetUrl: "/specs/gildan-18500.pdf"
  },
  {
    id: "gildan-18000",
    name: "Gildan Heavy Blend Crewneck",
    brand: "Gildan",
    model: "18000",
    image: "/images/apparel/gildan-18000.png",
    fabricComposition: "50% cotton, 50% polyester",
    fabricWeight: "8.0 oz/yd²",
    features: [
      "Tear-away label",
      "Air-jet spun yarn for reduced pilling",
      "1x1 rib with spandex cuffs and waistband",
      "Double-needle stitching"
    ],
    description: "This essential crewneck sweatshirt delivers the perfect balance of warmth and comfort without the bulk. Its durable, pill-resistant fabric ensures long-lasting wear and a smooth printing surface.",
    specSheetUrl: "https://www.fullsource.com/media/pdf/Gildan_18000_Spec_Sheet.pdf"
  },
  {
    id: "c2-sport-5100",
    name: "C2 Sport Performance T-Shirt",
    brand: "C2 Sport",
    model: "5100",
    image: "/images/apparel/c2-sport-5100.png",
    fabricComposition: "100% polyester",
    fabricWeight: "3.5 oz/yd²",
    features: [
      "Tear-away label",
      "Moisture-management properties",
      "Antimicrobial properties",
      "Double-needle stitched hem"
    ],
    description: "Engineered for active lifestyles, this performance tee wicks away sweat and controls odor to keep you cool and dry. Its ultra-lightweight fabric makes it a top choice for workouts and sports teams.",
    specSheetUrl: "https://pattillmanfoundation.org/wp-content/uploads/2023/02/C2-Sport_5100_Spec_Sheet.pdf"
  },
  {
    id: "comfort-colors-1717",
    name: "Comfort Colors Heavyweight T-Shirt",
    brand: "Comfort Colors",
    model: "1717",
    image: "/images/apparel/comfort-colors-1717.png",
    fabricComposition: "100% ring-spun US cotton",
    fabricWeight: "6.1 oz/yd²",
    features: [
      "Garment-dyed vintage wash",
      "Relaxed classic fit",
      "Seamless tubular body",
      "Highly pre-shrunk"
    ],
    description: "Experience the ultimate lived-in comfort with this premium, heavyweight garment-dyed tee. Its relaxed fit and vintage wash give it a perfectly broken-in look and incredibly soft feel right from the first wear.",
    specSheetUrl: "https://www.ssactivewear.com/p/comfort_colors/1717"
  },
  {
    id: "bella-canvas-3001",
    name: "Bella Canvas Premium Jersey T-Shirt",
    brand: "Bella Canvas",
    model: "3001",
    image: "/images/apparel/bella-canvas-3001.png",
    fabricComposition: "100% Airlume combed and ring-spun cotton",
    fabricWeight: "4.2 oz/yd²",
    features: [
      "Tear-away label",
      "Side-seamed construction",
      "Retail fit",
      "Shoulder-to-shoulder taping"
    ],
    description: "A modern classic, this premium jersey tee features a tailored, retail-ready fit and unparalleled softness. Crafted from high-quality Airlume combed cotton, it offers a flawless, smooth surface.",
    specSheetUrl: "https://www.bellacanvas.com/spec/3001%20specs.pdf"
  },
  {
    id: "next-level-6210",
    name: "Next Level CVC Crew T-Shirt",
    brand: "Next Level",
    model: "6210",
    image: "/images/apparel/next-level-6210.png",
    fabricComposition: "60% combed ring-spun cotton, 40% polyester jersey",
    fabricWeight: "4.3 oz/yd²",
    features: [
      "Tear-away label",
      "Fabric laundered for reduced shrinkage",
      "Slightly heathered appearance",
      "Side-seamed construction"
    ],
    description: "Blending the best of cotton and polyester, this top-selling CVC tee delivers supreme softness, durability, and a subtle heathered look. Its lightweight, breathable fabric and flattering retail fit make it a premium choice.",
    specSheetUrl: "https://www.ssactivewear.com/p/next_level/6210"
  }
];
