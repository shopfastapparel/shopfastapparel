import { useState, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { CheckCircle2, X } from "lucide-react";

const NAMES = [
  "Michael", "Sarah", "David", "Jessica", "Chris", "Ashley", 
  "Matthew", "Amanda", "John", "Emily", "Justin", "Melissa", 
  "Robert", "Stephanie", "James", "Rebecca", "Tyler", "Lauren"
];

const LOCATIONS = [
  "Atlanta, GA", "Lawrenceville, GA", "Marietta, GA", "Alpharetta, GA", 
  "Decatur, GA", "Sandy Springs, GA", "Roswell, GA", "Suwanee, GA", 
  "Duluth, GA", "Chicago, IL", "Austin, TX", "Dallas, TX", 
  "Orlando, FL", "Charlotte, NC", "Nashville, TN", "Miami, FL"
];

const PRODUCTS = [
  "Custom T-Shirts", "Team Uniforms", "Promotional Tumblers", 
  "Corporate Polos", "DTF Transfers", "Custom Hoodies", 
  "Athletic Quarter-Zips", "Tote Bags", "Hats & Caps"
];

const TIMES = [
  "Just now", "2 minutes ago", "5 minutes ago", "12 minutes ago", 
  "15 minutes ago", "1 hour ago", "2 hours ago", "5 hours ago", 
  "12 hours ago", "1 day ago", "2 days ago"
];

export function FomoPopup() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  const [data, setData] = useState({
    name: "",
    location: "",
    product: "",
    time: ""
  });

  // Hide on admin/login routes
  const isHiddenRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  const generateRandomData = () => {
    setData({
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
      time: TIMES[Math.floor(Math.random() * TIMES.length)],
    });
  };

  useEffect(() => {
    if (isHiddenRoute || isDismissed) return;

    const runCycle = () => {
      // 1. Generate new fake data
      generateRandomData();
      
      // 2. Show the popup
      setIsVisible(true);
      
      // 3. Hide the popup after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    // Initial delay before first popup shows (e.g. 5 seconds after page load)
    const initialTimer = setTimeout(runCycle, 5000);

    // Then set up an interval to show it every ~25 seconds (so it's hidden for ~19s between popups)
    const interval = setInterval(runCycle, 25000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isHiddenRoute, isDismissed]);

  if (isHiddenRoute || isDismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500 ease-out">
      <div className="bg-white/90 backdrop-blur-md shadow-xl border border-gray-100 rounded-xl p-4 pr-10 flex items-center max-w-sm relative group">
        <button 
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex-shrink-0 h-10 w-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
        
        <div className="ml-3">
          <p className="text-sm text-gray-900 leading-snug">
            <span className="font-semibold">{data.name}</span> in <span className="font-medium">{data.location}</span>
          </p>
          <p className="text-sm text-gray-600 leading-snug">
            recently requested a quote for <span className="font-medium text-magenta-brand">{data.product}</span>.
          </p>
          <p className="text-xs text-gray-400 mt-1 font-medium flex items-center">
             {data.time}
          </p>
        </div>
      </div>
    </div>
  );
}
