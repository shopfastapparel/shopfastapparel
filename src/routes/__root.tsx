import { Outlet, Link, createRootRoute, HeadContent, Scripts, ScrollRestoration } from "@tanstack/react-router";
import { DiscountPopup } from "@/components/DiscountPopup";
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
      { title: "Fast Apparel — DTF Custom T-Shirt Printing in Lawrenceville, GA" },
      {
        name: "description",
        content:
          "Lawrenceville's fastest DTF custom t-shirt printer. Full-color DTF prints for teams, businesses, and events. Free mockups, low minimums, free shipping on bulk orders.",
      },
      { name: "author", content: "Fast Apparel LLC" },
      { property: "og:title", content: "Fast Apparel — DTF Custom T-Shirt Printing in Lawrenceville, GA" },
      {
        property: "og:description",
        content:
          "DTF custom apparel and promotional products done fast. Serving Lawrenceville, Atlanta, Marietta, Alpharetta, Sandy Springs, Decatur & Roswell.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0f172a" },
      { name: "twitter:title", content: "Fast Apparel — DTF Custom T-Shirt Printing in Lawrenceville, GA" },
      { name: "description", content: "SEO Shirt Finder is an e-commerce platform for custom apparel, optimized for local search and lead generation." },
      { property: "og:description", content: "SEO Shirt Finder is an e-commerce platform for custom apparel, optimized for local search and lead generation." },
      { name: "twitter:description", content: "SEO Shirt Finder is an e-commerce platform for custom apparel, optimized for local search and lead generation." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fe155d54-5040-492c-ada5-149c7b8bba47/id-preview-20374dae--dd11a175-0db8-4bc2-878d-abff80c8f5c9.lovable.app-1778075118442.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fe155d54-5040-492c-ada5-149c7b8bba47/id-preview-20374dae--dd11a175-0db8-4bc2-878d-abff80c8f5c9.lovable.app-1778075118442.png" },
    ],
    links: [
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
        {children}
        <DiscountPopup />
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
