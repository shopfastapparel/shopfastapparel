import { Outlet, Link, createRootRoute, HeadContent, Scripts, ScrollRestoration } from "@tanstack/react-router";
import { DiscountPopup } from "@/components/DiscountPopup";
import { FomoPopup } from "@/components/FomoPopup";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fast Custom Apparel | Commercial DTF Printing & Custom T-Shirts" },
      {
        name: "description",
        content:
          "Lawrenceville & Atlanta's fastest custom apparel printer. High-definition commercial DTF prints with 7-10 day turnaround, free digital mockups, and low minimums.",
      },
      { name: "author", content: "Fast Apparel LLC" },
      { property: "og:title", content: "Fast Custom Apparel | Commercial DTF Printing & Custom T-Shirts" },
      {
        property: "og:description",
        content:
          "Full-color commercial DTF custom t-shirts, team uniforms, and promotional products done fast. Serving Lawrenceville, Gwinnett, and Metro Atlanta.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shopfastapparel.com" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0f172a" },
      { name: "twitter:title", content: "Fast Custom Apparel | Commercial DTF Printing & Custom T-Shirts" },
      {
        name: "twitter:description",
        content:
          "Full-color commercial DTF custom t-shirts, team uniforms, and promotional products done fast. Serving Lawrenceville, Gwinnett, and Metro Atlanta.",
      },
      { property: "og:image", content: "https://shopfastapparel.com/images/fast_logo_contrasted.png" },
      { name: "twitter:image", content: "https://shopfastapparel.com/images/fast_logo_contrasted.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/images/fast_logo_contrasted.png" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://shopfastapparel.com/#website",
              "url": "https://shopfastapparel.com/",
              "name": "Fast Custom Apparel",
              "alternateName": [
                "Fast Apparel",
                "Shop Fast Apparel",
                "Fast Apparel LLC"
              ],
              "description": "Lawrenceville's fastest DTF custom t-shirt printer and apparel decorator. Commercial DTF transfers, team jerseys, corporate apparel, and custom gear.",
              "publisher": {
                "@id": "https://shopfastapparel.com/#organization"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://shopfastapparel.com/catalog?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": ["ClothingStore", "LocalBusiness"],
              "@id": "https://shopfastapparel.com/#organization",
              "name": "Fast Custom Apparel",
              "legalName": "Fast Apparel LLC",
              "url": "https://shopfastapparel.com",
              "logo": "https://shopfastapparel.com/images/fast_logo_contrasted.png",
              "image": "https://shopfastapparel.com/images/fast_logo_contrasted.png",
              "description": "Commercial Ultra HD DTF custom t-shirt printing and apparel decoration in Lawrenceville & Greater Atlanta. Fast turnaround, low minimums, vibrant prints.",
              "telephone": "678-491-2655",
              "email": "info@shopfastapparel.com",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lawrenceville",
                "addressRegion": "GA",
                "postalCode": "30043",
                "addressCountry": "US"
              },
              "areaServed": [
                { "@type": "City", "name": "Lawrenceville" },
                { "@type": "City", "name": "Atlanta" },
                { "@type": "City", "name": "Duluth" },
                { "@type": "City", "name": "Suwanee" },
                { "@type": "City", "name": "Buford" },
                { "@type": "City", "name": "Marietta" },
                { "@type": "City", "name": "Alpharetta" },
                { "@type": "AdministrativeArea", "name": "Georgia" }
              ]
            },
            {
              "@type": "SiteNavigationElement",
              "@id": "https://shopfastapparel.com/#navigation",
              "name": "Main Site Navigation",
              "hasPart": [
                {
                  "@type": "WebPage",
                  "name": "Custom T-Shirts",
                  "description": "Design and order high-definition custom t-shirts with lightning-fast turnaround, zero hidden fees, and vibrant commercial DTF printing.",
                  "url": "https://shopfastapparel.com/services/custom-tshirts"
                },
                {
                  "@type": "WebPage",
                  "name": "Design Studio",
                  "description": "Design custom t-shirts and apparel online. Upload artwork, add text, select garment styles, and preview mockups in real time.",
                  "url": "https://shopfastapparel.com/designer"
                },
                {
                  "@type": "WebPage",
                  "name": "Full Catalog",
                  "description": "Search over 5,000 blank apparel styles from Champion, Adidas, Richardson, Comfort Colors, Bella+Canvas, and more with live warehouse inventory.",
                  "url": "https://shopfastapparel.com/catalog"
                },
                {
                  "@type": "WebPage",
                  "name": "Bulk & Teams",
                  "description": "Volume discounts and custom apparel printing for sports leagues, schools, churches, businesses, and family events across metro Atlanta.",
                  "url": "https://shopfastapparel.com/services/team-bulk"
                },
                {
                  "@type": "WebPage",
                  "name": "Why Fast Apparel?",
                  "description": "Meet Dash the Cheetah, our mascot and Chief Speed Officer, delivering top-quality commercial DTF prints with fast 7-10 day turnaround.",
                  "url": "https://shopfastapparel.com/about"
                },
                {
                  "@type": "WebPage",
                  "name": "Free Quote",
                  "description": "Get an instant custom apparel price quote with free digital mockups and proofing before production.",
                  "url": "https://shopfastapparel.com/quote"
                }
              ]
            }
          ]
        }),
      },
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-QG5KZGRR5L",
        async: true,
      },
      {
        src: "https://www.googletagmanager.com/gtag/js?id=AW-18202378841",
        async: true,
      },
      {
        type: "text/javascript",
        children: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-QG5KZGRR5L'); gtag('config', 'AW-18202378841');`,
      },
      {
        type: "text/javascript",
        children: `window.$crisp=[];window.CRISP_WEBSITE_ID="9a96f679-965b-4217-a072-ba5117483d9a";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
      },
      {
        type: "text/javascript",
        children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '1153834859032114');fbq('track', 'PageView');`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1153834859032114&ev=PageView&noscript=1" alt="" />
        </noscript>
        {children}
        <DiscountPopup />
        <FomoPopup />
        <Toaster position="top-center" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
