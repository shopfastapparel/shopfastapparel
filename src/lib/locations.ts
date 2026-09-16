export interface LocationInfo {
  slug: string;
  city: string;
  state: string;
  region: string;
  zipPrefix: string;
  blurb: string;
  neighborhoods: string[];
  highlights?: string[];
  features?: string[];
  bannerImage?: string;
  bannerCaption?: string;
}

export const LOCATIONS: LocationInfo[] = [
  {
    slug: "lawrenceville",
    city: "Lawrenceville",
    state: "GA",
    region: "Gwinnett County",
    zipPrefix: "300",
    bannerImage: "/images/locations/lawrenceville.webp",
    bannerCaption: "Historic Gwinnett County Courthouse — Downtown Lawrenceville Square",
    blurb:
      "Our home base. Lawrenceville's premier custom t-shirt printer — full-color DTF and promotional products with local delivery options for Gwinnett County.",
    neighborhoods: ["Downtown Lawrenceville", "Sugarloaf", "Collins Hill", "Five Forks", "Grayson"],
    highlights: [
      "Local delivery available within 10 miles",
      "Free shipping on orders over $149",
      "Trusted by Gwinnett schools, churches, and small businesses",
    ],
  },
  {
    slug: "atlanta",
    city: "Atlanta",
    state: "GA",
    region: "Metro Atlanta",
    zipPrefix: "303",
    bannerImage: "/images/locations/atlanta.webp",
    bannerCaption: "Downtown Atlanta Skyline from Jackson Street Bridge",
    blurb:
      "Atlanta's go-to custom DTF t-shirt printer. Full-color, photo-quality prints with the fastest turnaround in the city.",
    neighborhoods: ["Midtown", "Buckhead", "West Midtown", "Old Fourth Ward", "Inman Park"],
    highlights: [
      "Most orders completed in as little as 7 days inside the perimeter",
      "Free shipping on bulk ATL orders",
      "Trusted by Atlanta schools, churches, and small businesses",
    ],
  },
  {
    slug: "marietta",
    city: "Marietta",
    state: "GA",
    region: "Cobb County",
    zipPrefix: "300",
    bannerImage: "/images/locations/marietta.webp",
    bannerCaption: "Historic Marietta Square & Glover Park Fountain",
    blurb:
      "Custom apparel printing for Marietta and Cobb County. Bulk team uniforms, business merch, and event shirts done fast.",
    neighborhoods: ["East Cobb", "West Cobb", "Kennesaw", "Smyrna", "Powder Springs"],
    highlights: [
      "Free shipping on bulk Cobb County orders",
      "Custom uniforms for Marietta schools and youth sports",
      "Business merch for Cobb-area startups",
    ],
  },
  {
    slug: "alpharetta",
    city: "Alpharetta",
    state: "GA",
    region: "North Fulton",
    zipPrefix: "300",
    bannerImage: "/images/locations/alpharetta.webp",
    bannerCaption: "Alpharetta City Center & Town Green",
    blurb:
      "Alpharetta's premium custom shirt printer. Full-color DTF and bulk orders for North Fulton businesses.",
    neighborhoods: ["Avalon", "Downtown Alpharetta", "Halcyon", "Crabapple", "Windward"],
    highlights: [
      "Tech park & corporate branded apparel",
      "On-time delivery to Alpharetta offices",
      "Premium retail-quality DTF printing",
    ],
  },
  {
    slug: "sandy-springs",
    city: "Sandy Springs",
    state: "GA",
    region: "North Metro Atlanta",
    zipPrefix: "303",
    bannerImage: "/images/locations/sandy-springs.webp",
    bannerCaption: "Iconic Concourse King & Queen Towers — Sandy Springs",
    blurb:
      "Sandy Springs custom printing — fast, professional apparel for offices, gyms, and community events along GA-400.",
    neighborhoods: ["Perimeter", "City Springs", "Dunwoody border", "Roswell Road corridor"],
    highlights: [
      "Corporate orders completed in as little as 7 days",
      "Free mockups before you commit",
      "Free shipping on bulk orders to Perimeter offices",
    ],
  },
  {
    slug: "decatur",
    city: "Decatur",
    state: "GA",
    region: "DeKalb County",
    zipPrefix: "300",
    bannerImage: "/images/locations/decatur.webp",
    bannerCaption: "Historic DeKalb County Courthouse — Decatur Square",
    blurb:
      "Decatur's local custom apparel shop. Small-batch DTF and event tees — low minimums.",
    neighborhoods: ["Oakhurst", "Kirkwood", "Avondale Estates", "Druid Hills", "Emory area"],
    highlights: [
      "Local delivery available for DeKalb businesses",
      "Low minimums on DTF transfers",
      "Perfect for Decatur events and festivals",
    ],
  },
  {
    slug: "roswell",
    city: "Roswell",
    state: "GA",
    region: "North Fulton",
    zipPrefix: "300",
    bannerImage: "/images/locations/roswell.webp",
    bannerCaption: "Historic Roswell Mill Covered Bridge at Vickery Creek",
    blurb:
      "Roswell custom t-shirt and merch printing. Premium DTF quality with fast turnaround for Roswell schools, teams, and businesses.",
    neighborhoods: ["Historic Roswell", "East Roswell", "Crabapple", "Martin's Landing"],
    highlights: [
      "Roswell youth sports uniform specialist",
      "Free shipping on bulk orders",
      "Custom DTF prints for Roswell businesses",
    ],
  },
  {
    slug: "dacula",
    city: "Dacula",
    state: "GA",
    region: "Gwinnett County",
    zipPrefix: "300",
    bannerImage: "/images/locations/dacula.webp",
    bannerCaption: "Historic 2nd Avenue District — Downtown Dacula",
    blurb:
      "Dacula's local choice for custom t-shirts, hoodies, and team uniforms. Vibrant full-color DTF printing, school spirit wear, and business apparel with fast local delivery across Gwinnett.",
    neighborhoods: ["Downtown Dacula", "Hamilton Mill", "Harbins", "Apalachee", "Alcovy"],
    highlights: [
      "School spirit wear for Dacula High & Hamilton Mill teams",
      "Local delivery and rush turnaround available across Gwinnett",
      "Vibrant full-color DTF printing with zero screen or setup fees",
    ],
  },
  {
    slug: "johns-creek",
    city: "Johns Creek",
    state: "GA",
    region: "North Fulton",
    zipPrefix: "300",
    bannerImage: "/images/locations/johns-creek.webp",
    bannerCaption: "Johns Creek Municipal Center & Heritage District",
    blurb:
      "Premium custom t-shirts and corporate apparel in Johns Creek. Professional DTF printing for medical practices, tech offices, private academies, and community events.",
    neighborhoods: ["Technology Park Johns Creek", "Medlock Bridge", "Abbotts Bridge", "Country Club of the South", "Ocee"],
    highlights: [
      "High-end corporate merch and medical clinic uniforms",
      "Ultra-soft retail blanks (Comfort Colors 1717, Bella+Canvas 3001)",
      "Fast delivery along Medlock Bridge and State Bridge corridors",
    ],
  },
  {
    slug: "norcross",
    city: "Norcross",
    state: "GA",
    region: "Gwinnett County",
    zipPrefix: "300",
    bannerImage: "/images/locations/norcross.webp",
    bannerCaption: "Historic Norcross Train Depot & Downtown District",
    blurb:
      "Custom apparel and merchandise printing for Historic Norcross and Peachtree Corners. Durable workwear, restaurant tees, and event shirts made locally.",
    neighborhoods: ["Historic Downtown Norcross", "Peachtree Corners border", "Jimmy Carter Blvd", "Holcomb Bridge corridor", "Beaver Ruin"],
    highlights: [
      "Commercial district & industrial park workwear uniforms",
      "Durable DTF printing built for high-wash commercial demands",
      "Zero setup fees and fast 3–7 business day delivery",
    ],
  },
  {
    slug: "brookhaven",
    city: "Brookhaven",
    state: "GA",
    region: "DeKalb County",
    zipPrefix: "303",
    bannerImage: "/images/locations/brookhaven.webp",
    bannerCaption: "Historic Oglethorpe University — Brookhaven Landmark",
    blurb:
      "Brookhaven custom t-shirt printing and event apparel. Soft-style tees, boutique fitness merch, and neighborhood festival gear delivered fast.",
    neighborhoods: ["Town Brookhaven", "Ashford Park", "Oglethorpe", "Dresden Drive", "Lynwood Park"],
    highlights: [
      "Boutique fitness, beauty studio, and hospitality staff shirts",
      "Free digital mockups and safe-zone placement previews",
      "Fast turnaround inside the perimeter (ITP)",
    ],
  },
  {
    slug: "tucker",
    city: "Tucker",
    state: "GA",
    region: "DeKalb & Gwinnett",
    zipPrefix: "300",
    bannerImage: "/images/locations/tucker.webp",
    bannerCaption: "Historic Tucker Train Depot & Main Street",
    blurb:
      "Tucker's local source for custom printed tees, hoodies, and work uniforms. Vibrant full-color DTF prints for Main Street businesses, breweries, and sports clubs.",
    neighborhoods: ["Main Street Tucker", "Smoke Rise", "Midvale", "Northlake area", "Idlewood"],
    highlights: [
      "Craft brewery merch, restaurant uniforms, and race event shirts",
      "Fast turnaround along Lawrenceville Highway and US-78 corridor",
      "Wholesale volume pricing with zero per-color screen penalties",
    ],
  },
  {
    slug: "auburn",
    city: "Auburn",
    state: "GA",
    region: "Barrow & Gwinnett County",
    zipPrefix: "300",
    bannerImage: "/images/locations/auburn.webp",
    bannerCaption: "Historic Downtown Auburn & Depot District",
    blurb:
      "Custom t-shirt printing for Auburn, Carl, and surrounding Barrow and Gwinnett communities. Reliable team shirts, family reunion tees, and small business apparel.",
    neighborhoods: ["Downtown Auburn", "County Line", "Carl border", "Parks Mill", "Whistleville Park area"],
    highlights: [
      "Local delivery for Auburn family events, churches, and youth teams",
      "Vibrant full-color DTF printing on all cotton and blend fabrics",
      "Zero minimum order requirements for quick restocks",
    ],
  },
  {
    slug: "snellville",
    city: "Snellville",
    state: "GA",
    region: "South Gwinnett",
    zipPrefix: "300",
    bannerImage: "/images/locations/snellville.webp",
    bannerCaption: "Snellville Town Center & City Hall",
    blurb:
      "Snellville custom apparel and t-shirt printing. Premium shirts for South Gwinnett schools, churches, youth sports, and healthcare practices.",
    neighborhoods: ["The Grove at Snellville", "Scenic Highway corridor", "Centerville", "Brookwood area", "North Road"],
    highlights: [
      "South Gwinnett church and school spirit wear specialist",
      "Fast turnaround on Highway 124 & 78 corridors",
      "Heavyweight cotton, ringspun blends, and performance dry-fit",
    ],
  },
];

export const PRIMARY_PHONE = "678-491-2655";
export const PRIMARY_EMAIL = "info@shopfastapparel.com";

export function getLocation(slug: string) {
  return LOCATIONS.find((l) => l.slug === slug);
}
