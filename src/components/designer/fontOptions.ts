export interface FontOption {
  name: string;
  family: string;
  category: "Athletic" | "Display" | "Script" | "Sans" | "Serif";
  googleFont?: string;
  previewText?: string;
}

export const DESIGNER_FONTS: FontOption[] = [
  { name: "Varsity / College", family: "Alfa Slab One", category: "Athletic", googleFont: "Alfa+Slab+One" },
  { name: "Impact Heavy", family: "Anton", category: "Athletic", googleFont: "Anton" },
  { name: "Bebas Neue (Bold)", family: "Bebas Neue", category: "Display", googleFont: "Bebas+Neue" },
  { name: "Montserrat Black", family: "Montserrat", category: "Sans", googleFont: "Montserrat:wght@900" },
  { name: "Pacifico (Brush Script)", family: "Pacifico", category: "Script", googleFont: "Pacifico" },
  { name: "Permanent Marker", family: "Permanent Marker", category: "Script", googleFont: "Permanent+Marker" },
  { name: "Lobster (Vintage)", family: "Lobster", category: "Script", googleFont: "Lobster" },
  { name: "Oswald Bold", family: "Oswald", category: "Display", googleFont: "Oswald:wght@700" },
  { name: "Playfair Display", family: "Playfair Display", category: "Serif", googleFont: "Playfair+Display:wght@700" },
  { name: "Cinzel (Classic)", family: "Cinzel", category: "Serif", googleFont: "Cinzel:wght@700" },
  { name: "Righteous (Retro)", family: "Righteous", category: "Display", googleFont: "Righteous" },
  { name: "Russo One", family: "Russo One", category: "Athletic", googleFont: "Russo+One" },
  { name: "Creepster (Horror/Grit)", family: "Creepster", category: "Display", googleFont: "Creepster" },
  { name: "Satisfy (Casual Script)", family: "Satisfy", category: "Script", googleFont: "Satisfy" },
  { name: "Bungee (Urban Block)", family: "Bungee", category: "Display", googleFont: "Bungee" },
];

export function loadGoogleFont(fontName: string, googleFontQuery?: string) {
  if (!googleFontQuery) return;
  const id = `gfont-${fontName.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${googleFontQuery}&display=swap`;
  document.head.appendChild(link);
}
