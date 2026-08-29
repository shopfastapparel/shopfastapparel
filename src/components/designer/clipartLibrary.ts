export interface ClipartItem {
  id: string;
  name: string;
  category: string;
  svg: string;
}

export const CLIPART_CATEGORIES = [
  "All",
  "Athletics & Sports",
  "Badges & Emblems",
  "Banners & Ribbons",
  "Shapes & Symbols",
  "Trades & Business"
] as const;

export const CLIPART_LIBRARY: ClipartItem[] = [
  // Athletics
  {
    id: "baseball-crossed-bats",
    name: "Crossed Baseball Bats & Ball",
    category: "Athletics & Sports",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" stroke-width="4"/><path d="M40 37 Q50 45 40 63 M60 37 Q50 45 60 63" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3,2"/><line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>`
  },
  {
    id: "basketball-hoop",
    name: "Basketball",
    category: "Athletics & Sports",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5"><circle cx="50" cy="50" r="42"/><line x1="8" y1="50" x2="92" y2="50"/><line x1="50" y1="8" x2="50" y2="92"/><path d="M22 20 Q50 50 22 80"/><path d="M78 20 Q50 50 78 80"/></svg>`
  },
  {
    id: "football-ball",
    name: "Football",
    category: "Athletics & Sports",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5"><ellipse cx="50" cy="50" rx="42" ry="26" transform="rotate(-30 50 50)"/><line x1="30" y1="38" x2="70" y2="62" stroke-width="4"/><line x1="42" y1="41" x2="46" y2="47" stroke-width="3"/><line x1="49" y1="46" x2="53" y2="52" stroke-width="3"/><line x1="56" y1="50" x2="60" y2="56" stroke-width="3"/></svg>`
  },
  {
    id: "soccer-ball",
    name: "Soccer Ball",
    category: "Athletics & Sports",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="5"/><polygon points="50,32 62,41 57,56 43,56 38,41"/><line x1="50" y1="32" x2="50" y2="10" stroke="currentColor" stroke-width="4"/><line x1="62" y1="41" x2="85" y2="30" stroke="currentColor" stroke-width="4"/><line x1="57" y1="56" x2="75" y2="78" stroke="currentColor" stroke-width="4"/><line x1="43" y1="56" x2="25" y2="78" stroke="currentColor" stroke-width="4"/><line x1="38" y1="41" x2="15" y2="30" stroke="currentColor" stroke-width="4"/></svg>`
  },
  {
    id: "trophy-cup",
    name: "Champion Trophy",
    category: "Athletics & Sports",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M30 20 L70 20 L65 50 C65 60 55 65 50 65 C45 65 35 60 35 50 Z" fill="none" stroke="currentColor" stroke-width="5"/><path d="M30 25 C15 25 15 45 35 48 M70 25 C85 25 85 45 65 48" fill="none" stroke="currentColor" stroke-width="4"/><line x1="50" y1="65" x2="50" y2="80" stroke="currentColor" stroke-width="6"/><rect x="30" y="80" width="40" height="10" rx="3" stroke="currentColor" stroke-width="4"/></svg>`
  },

  // Badges & Emblems
  {
    id: "vintage-crest-shield",
    name: "Vintage Crest Shield",
    category: "Badges & Emblems",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5"><path d="M20 15 L80 15 L80 50 C80 75 50 90 50 90 C50 90 20 75 20 50 Z"/><path d="M28 22 L72 22 L72 48 C72 68 50 80 50 80 C50 80 28 68 28 48 Z" stroke-width="2" stroke-dasharray="3,2"/></svg>`
  },
  {
    id: "circular-heritage-badge",
    name: "Circular Heritage Seal",
    category: "Badges & Emblems",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="36" stroke-dasharray="4,3"/><circle cx="50" cy="50" r="28" stroke-width="2"/><polygon points="50,38 53,46 62,46 55,51 57,59 50,54 43,59 45,51 38,46 47,46" fill="currentColor"/></svg>`
  },
  {
    id: "laurel-wreath",
    name: "Victory Laurel Wreath",
    category: "Badges & Emblems",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M25 80 C15 50 25 25 45 15 C42 22 35 32 35 45 C35 60 42 70 50 78 C38 82 30 82 25 80 Z"/><path d="M75 80 C85 50 75 25 55 15 C58 22 65 32 65 45 C65 60 58 70 50 78 C62 82 70 82 75 80 Z"/><circle cx="50" cy="85" r="4"/></svg>`
  },
  {
    id: "crown-royal",
    name: "Royal Crown",
    category: "Badges & Emblems",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M15 70 L25 30 L40 50 L50 25 L60 50 L75 30 L85 70 Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><rect x="15" y="70" width="70" height="10" rx="3" stroke="currentColor" stroke-width="4"/><circle cx="25" cy="26" r="4"/><circle cx="50" cy="20" r="4"/><circle cx="75" cy="26" r="4"/></svg>`
  },

  // Banners & Ribbons
  {
    id: "classic-arched-ribbon",
    name: "Classic Arched Ribbon",
    category: "Banners & Ribbons",
    svg: `<svg viewBox="0 0 120 60" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M10 20 L25 15 L25 35 L10 40 L18 30 Z" fill="currentColor"/><path d="M110 20 L95 15 L95 35 L110 40 L102 30 Z" fill="currentColor"/><path d="M20 22 Q60 5 100 22 L95 42 Q60 25 25 42 Z" fill="none" stroke="currentColor" stroke-width="4"/></svg>`
  },
  {
    id: "retro-banner-straight",
    name: "Retro Fishtail Banner",
    category: "Banners & Ribbons",
    svg: `<svg viewBox="0 0 120 50" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M15 15 L105 15 L105 35 L15 35 Z"/><path d="M15 15 L5 25 L15 35 M105 15 L115 25 L105 35"/></svg>`
  },

  // Shapes & Symbols
  {
    id: "five-point-star",
    name: "5-Point Star",
    category: "Shapes & Symbols",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><polygon points="50,10 63,38 93,38 68,57 78,86 50,68 22,86 32,57 7,38 37,38"/></svg>`
  },
  {
    id: "vintage-sunburst",
    name: "Sunburst Rays",
    category: "Shapes & Symbols",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="14"/><path d="M50 5 L50 22 M50 78 L50 95 M5 50 L22 50 M78 50 L95 50 M18 18 L30 30 M70 70 L82 82 M82 18 L70 30 M30 70 L18 82" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`
  },
  {
    id: "heart-solid",
    name: "Heart",
    category: "Shapes & Symbols",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 85 C20 60 10 40 10 25 C10 12 22 5 35 5 C43 5 48 10 50 15 C52 10 57 5 65 5 C78 5 90 12 90 25 C90 40 80 60 50 85 Z"/></svg>`
  },
  {
    id: "flame-fire",
    name: "Fire Flame",
    category: "Shapes & Symbols",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 10 C50 30 70 35 65 55 C60 45 55 42 50 48 C45 35 30 45 30 65 C30 80 40 90 55 90 C75 90 85 75 85 55 C85 30 65 15 50 10 Z"/></svg>`
  },
  {
    id: "lightning-bolt",
    name: "Lightning Bolt",
    category: "Shapes & Symbols",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><polygon points="55,5 20,55 48,55 35,95 80,45 52,45"/></svg>`
  },

  // Trades & Business
  {
    id: "crossed-wrenches",
    name: "Crossed Wrenches",
    category: "Trades & Business",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M25 15 C18 15 15 22 18 28 L35 45 L45 35 L28 18 C22 15 25 15 25 15 Z M75 15 C82 15 85 22 82 28 L65 45 L55 35 L72 18 C78 15 75 15 75 15 Z" stroke="currentColor" stroke-width="4"/><line x1="30" y1="30" x2="80" y2="80" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><line x1="70" y1="30" x2="20" y2="80" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`
  },
  {
    id: "paint-roller",
    name: "Paint Roller",
    category: "Trades & Business",
    svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5"><rect x="25" y="15" width="50" height="20" rx="4" fill="currentColor"/><path d="M75 25 L85 25 L85 55 L55 55 L55 75"/><rect x="50" y="75" width="10" height="20" rx="2" fill="currentColor"/></svg>`
  },
  {
    id: "tree-nature",
    name: "Evergreen / Lawn Tree",
    category: "Trades & Business",
    svg: `<svg viewBox="0 0 100 100" fill="currentColor"><polygon points="50,10 65,30 58,30 72,50 63,50 78,75 22,75 37,50 28,50 42,30 35,30"/><rect x="45" y="75" width="10" height="18"/></svg>`
  }
];
