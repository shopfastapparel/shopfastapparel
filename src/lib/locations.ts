export interface LocationInfo {
  slug: string;
  city: string;
  state: string;
  region: string;
  zipPrefix: string;
  blurb: string;
  neighborhoods: string[];
  highlights: string[];
}

export const LOCATIONS: LocationInfo[] = [
  {
    slug: "lawrenceville",
    city: "Lawrenceville",
    state: "GA",
    region: "Gwinnett County",
    zipPrefix: "300",
    blurb:
      "Our home base. Lawrenceville's premier custom t-shirt printing shop — DTF, screen printing, and embroidery with same-day pickup for Gwinnett County.",
    neighborhoods: ["Downtown Lawrenceville", "Sugarloaf", "Collins Hill", "Five Forks", "Grayson"],
    highlights: [
      "Local Lawrenceville shop — walk-ins welcome",
      "Same-day pickup for Gwinnett County orders",
      "Trusted by Gwinnett schools, churches, and small businesses",
    ],
  },
  {
    slug: "atlanta",
    city: "Atlanta",
    state: "GA",
    region: "Metro Atlanta",
    zipPrefix: "303",
    blurb:
      "Atlanta's go-to custom t-shirt printing shop. DTF, screen printing, and embroidery with the fastest turnaround in the city.",
    neighborhoods: ["Midtown", "Buckhead", "West Midtown", "Old Fourth Ward", "Inman Park"],
    highlights: [
      "Same-week turnaround inside the perimeter",
      "Free local pickup for ATL businesses",
      "Trusted by Atlanta schools, churches, and small businesses",
    ],
  },
  {
    slug: "marietta",
    city: "Marietta",
    state: "GA",
    region: "Cobb County",
    zipPrefix: "300",
    blurb:
      "Custom apparel printing for Marietta and Cobb County. Bulk team uniforms, business merch, and event shirts done fast.",
    neighborhoods: ["East Cobb", "West Cobb", "Kennesaw", "Smyrna", "Powder Springs"],
    highlights: [
      "Local Cobb County delivery",
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
    blurb:
      "Alpharetta's premium custom shirt printer. Corporate-grade DTG, embroidery, and bulk orders for North Fulton businesses.",
    neighborhoods: ["Avalon", "Downtown Alpharetta", "Halcyon", "Crabapple", "Windward"],
    highlights: [
      "Tech park & corporate branded apparel",
      "On-time delivery to Alpharetta offices",
      "Premium retail-quality printing",
    ],
  },
  {
    slug: "sandy-springs",
    city: "Sandy Springs",
    state: "GA",
    region: "North Metro Atlanta",
    zipPrefix: "303",
    blurb:
      "Sandy Springs custom printing — fast, professional apparel for offices, gyms, and community events along GA-400.",
    neighborhoods: ["Perimeter", "City Springs", "Dunwoody border", "Roswell Road corridor"],
    highlights: [
      "Same-week corporate orders",
      "Free mockups before you commit",
      "Direct delivery to Perimeter offices",
    ],
  },
  {
    slug: "decatur",
    city: "Decatur",
    state: "GA",
    region: "DeKalb County",
    zipPrefix: "300",
    blurb:
      "Decatur's local custom apparel shop. Small-batch DTF, event tees, and embroidered hats — no minimums.",
    neighborhoods: ["Oakhurst", "Kirkwood", "Avondale Estates", "Druid Hills", "Emory area"],
    highlights: [
      "No-minimum custom shirt orders",
      "Quick local pickup",
      "Perfect for Decatur events and festivals",
    ],
  },
  {
    slug: "roswell",
    city: "Roswell",
    state: "GA",
    region: "North Fulton",
    zipPrefix: "300",
    blurb:
      "Roswell custom t-shirt and merch printing. Premium quality with fast turnaround for Roswell schools, teams, and businesses.",
    neighborhoods: ["Historic Roswell", "East Roswell", "Crabapple", "Martin's Landing"],
    highlights: [
      "Roswell youth sports uniform specialist",
      "Local pickup & delivery",
      "Embroidered polos for Roswell businesses",
    ],
  },
];

export const PRIMARY_PHONE = "678-491-2655";
export const PRIMARY_EMAIL = "hello@fastapparel.com";

export function getLocation(slug: string) {
  return LOCATIONS.find((l) => l.slug === slug);
}
