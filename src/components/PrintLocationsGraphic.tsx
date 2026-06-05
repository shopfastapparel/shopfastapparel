import React from "react";

// T-Shirt SVG Outlines
const FrontShirt = ({ children }: { children?: React.ReactNode }) => (
  <svg viewBox="0 0 100 100" className="w-full drop-shadow-md relative" fill="#ffffff" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M 33 12 C 40 18, 60 18, 67 12 L 95 30 L 82 45 L 75 38 L 75 95 L 25 95 L 25 38 L 18 45 L 5 30 Z" />
    <path d="M 33 12 C 40 22, 60 22, 67 12" fill="none" />
    {children}
  </svg>
);

const BackShirt = ({ children }: { children?: React.ReactNode }) => (
  <svg viewBox="0 0 100 100" className="w-full drop-shadow-md relative" fill="#ffffff" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M 33 12 C 40 15, 60 15, 67 12 L 95 30 L 82 45 L 75 38 L 75 95 L 25 95 L 25 38 L 18 45 L 5 30 Z" />
    <path d="M 33 12 C 40 10, 60 10, 67 12" fill="none" />
    {children}
  </svg>
);

const SleeveShirt = ({ children }: { children?: React.ReactNode }) => (
  <svg viewBox="0 0 100 100" className="w-full drop-shadow-md relative" fill="#ffffff" stroke="#111827" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M 40 12 C 55 15, 65 25, 75 35 L 75 60 L 60 60 L 60 95 L 30 95 L 30 18 Z" />
    <path d="M 40 12 C 45 15, 48 18, 50 25" fill="none" />
    {children}
  </svg>
);

const PrintArea = ({ x, y, width, height }: { x: number, y: number, width: number, height: number }) => (
  <rect 
    x={x} 
    y={y} 
    width={width} 
    height={height} 
    fill="#ffe347" 
    fillOpacity="0.8"
    stroke="#ffb100" 
    strokeWidth="1" 
    strokeDasharray="2,2" 
    rx="1"
  />
);

const LOCATIONS = [
  {
    title: "Left Chest",
    widthInfo: '2.5" - 5" wide',
    heightInfo: '2.5" - 5" tall',
    view: "front",
    area: { x: 55, y: 30, width: 12, height: 8 }
  },
  {
    title: "Center Chest",
    widthInfo: '6" - 10" wide',
    heightInfo: '6" - 8" tall',
    view: "front",
    area: { x: 35, y: 32, width: 30, height: 16 }
  },
  {
    title: "Full Front",
    widthInfo: '10" - 12" wide',
    heightInfo: '10" - 14" tall',
    view: "front",
    area: { x: 32, y: 30, width: 36, height: 38 }
  },
  {
    title: "Oversize Front",
    widthInfo: '12" - 15" wide',
    heightInfo: '14" - 16" tall',
    view: "front",
    area: { x: 28, y: 28, width: 44, height: 50 }
  },
  {
    title: "Back Collar",
    widthInfo: '1" - 3" wide',
    heightInfo: '1" - 3" tall',
    view: "back",
    area: { x: 45, y: 18, width: 10, height: 4 }
  },
  {
    title: "Upper Back",
    widthInfo: '10" - 14" wide',
    heightInfo: '1" - 6" tall',
    view: "back",
    area: { x: 35, y: 22, width: 30, height: 10 }
  },
  {
    title: "Full Back",
    widthInfo: '10" - 14" wide',
    heightInfo: '6" - 15" tall',
    view: "back",
    area: { x: 32, y: 24, width: 36, height: 44 }
  },
  {
    title: "Sleeve",
    widthInfo: '1" - 4" wide',
    heightInfo: '1" - 4" tall',
    view: "sleeve",
    area: { x: 60, y: 40, width: 10, height: 8 }
  }
];

export function PrintLocationsGraphic() {
  return (
    <div className="bg-cyan-brand rounded-3xl p-6 md:p-12 text-white font-display overflow-hidden relative shadow-pop border-2 border-ink my-10">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '16px 16px' }} />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h2 className="text-4xl md:text-5xl font-black drop-shadow-md m-0">Top 8 Print Locations</h2>
        <div className="flex items-center gap-2 bg-ink/10 px-4 py-2 rounded-full font-sans font-bold">
          <span className="text-xl">📏</span> Fast Apparel Guide
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 relative z-10">
        {LOCATIONS.map((loc, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-full max-w-[200px] mb-4">
              {loc.view === "front" && (
                <FrontShirt>
                  <PrintArea {...loc.area} />
                </FrontShirt>
              )}
              {loc.view === "back" && (
                <BackShirt>
                  <PrintArea {...loc.area} />
                </BackShirt>
              )}
              {loc.view === "sleeve" && (
                <SleeveShirt>
                  <PrintArea {...loc.area} />
                </SleeveShirt>
              )}
            </div>
            <div className="text-center font-sans font-medium text-white/90">
              <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{loc.title}</h3>
              <div className="text-sm">{loc.widthInfo}</div>
              <div className="text-sm">{loc.heightInfo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
