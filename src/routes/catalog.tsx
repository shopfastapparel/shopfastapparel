import { useState, useEffect, useTransition } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { searchCatalogStyles, type CatalogStyle } from "@/lib/ssactivewear.functions";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  RefreshCw,
  Info,
  Package,
  Layers,
  Phone,
  X,
} from "lucide-react";
import { PRIMARY_PHONE } from "@/lib/locations";

type CatalogSearch = {
  q?: string;
  brand?: string;
  category?: string;
};

export const Route = createFileRoute("/catalog")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: search.q as string | undefined,
    brand: search.brand as string | undefined,
    category: search.category as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Wholesale Apparel Catalog (5,000+ Styles) | S&S Activewear Live Search | Fast Apparel" },
      {
        name: "description",
        content:
          "Search over 5,000 blank apparel styles from Champion, Adidas, Richardson, Comfort Colors, Bella+Canvas, and more. Direct S&S Activewear live catalog with 1-click custom print quotes.",
      },
      { property: "og:title", content: "Live Wholesale Apparel Catalog | Fast Apparel Atlanta" },
      {
        property: "og:description",
        content:
          "Looking for a specific brand or garment? Search 5,000+ wholesale blanks and get a custom print quote in 24 hours.",
      },
    ],
  }),
  component: CatalogPage,
});

const FEATURED_BRANDS = [
  "All Brands",
  "Champion",
  "Richardson",
  "Comfort Colors",
  "BELLA + CANVAS",
  "Next Level",
  "Gildan",
  "Adidas",
  "Columbia",
  "Independent Trading Co.",
  "Augusta Sportswear",
  "Badger",
];

const CATEGORIES = [
  { id: "all", label: "All Items", query: "" },
  { id: "tees", label: "T-Shirts", query: "tee" },
  { id: "hoodies", label: "Hoodies & Fleece", query: "hoodie" },
  { id: "hats", label: "Hats & Caps", query: "cap" },
  { id: "polos", label: "Polos", query: "polo" },
  { id: "outerwear", label: "Jackets & Outerwear", query: "jacket" },
  { id: "athletic", label: "Gym & Athletics", query: "athletic" },
  { id: "totes", label: "Bags & Totes", query: "tote" },
];

function CatalogPage() {
  const searchParams = Route.useSearch();
  const searchCatalogFn = useServerFn(searchCatalogStyles);

  const [searchQuery, setSearchQuery] = useState(searchParams.q || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.brand || "All Brands");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || "all");

  const [styles, setStyles] = useState<CatalogStyle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedModalStyle, setSelectedModalStyle] = useState<CatalogStyle | null>(null);

  const PAGE_SIZE = 36;

  // Execute catalog search when filters or debounced query change
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const brandFilter = selectedBrand === "All Brands" ? "" : selectedBrand;
        const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
        const catQuery = catObj && catObj.id !== "all" ? catObj.query : "";

        const result = await searchCatalogFn({
          data: {
            query: searchQuery.trim(),
            brand: brandFilter,
            category: catQuery,
            limit: PAGE_SIZE,
            offset: 0,
          },
        });

        if (isCurrent) {
          setStyles(result.styles || []);
          setTotalCount(result.totalCount || 0);
          setPage(1);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error searching catalog:", err);
        if (isCurrent) {
          setStyles([]);
          setTotalCount(0);
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedBrand, selectedCategory]);

  // Load more styles
  const handleLoadMore = async () => {
    if (loading) return;
    try {
      const nextOffset = page * PAGE_SIZE;
      const brandFilter = selectedBrand === "All Brands" ? "" : selectedBrand;
      const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
      const catQuery = catObj && catObj.id !== "all" ? catObj.query : "";

      const result = await searchCatalogFn({
        data: {
          query: searchQuery.trim(),
          brand: brandFilter,
          category: catQuery,
          limit: PAGE_SIZE,
          offset: nextOffset,
        },
      });

      if (result.styles && result.styles.length > 0) {
        setStyles((prev) => [...prev, ...result.styles]);
        setPage((p) => p + 1);
      }
    } catch (err) {
      console.error("Failed to load more:", err);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("All Brands");
    setSelectedCategory("all");
  };

  return (
    <SiteLayout>
      {/* Hero Header */}
      <section className="border-b bg-gradient-to-b from-muted/40 via-background to-background relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-brand/10 border border-cyan-brand/30 text-ink text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-brand" /> Direct Distributor Live Inventory
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight text-ink">
                Wholesale Apparel Catalog
              </h1>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Looking for a specific brand, heavyweight hoodie, snapback, or athletic apparel? Search over{" "}
                <span className="font-bold text-ink">5,000+ blank styles</span> from S&S Activewear. If they carry it,
                Fast Apparel can acquire it, print your design, and deliver it fast.
              </p>
            </div>

            <div className="shrink-0">
              <Button asChild size="lg" className="bg-magenta-brand text-white hover:bg-magenta-brand/90 font-bold shadow-pop border-2 border-ink">
                <Link to="/quote">
                  Start a Free Quote <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Search & Filter Controls */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b-2 border-ink py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 space-y-3">
          {/* Main Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search style number, brand, or keyword (e.g. 'Richardson 112', 'Champion S700', 'Bella 3001', 'Apron', 'Polo')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-10 py-6 text-base md:text-lg rounded-xl border-2 border-ink shadow-sm focus-visible:ring-2 focus-visible:ring-yellow-brand focus-visible:border-ink bg-background"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {(searchQuery || selectedBrand !== "All Brands" || selectedCategory !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="hidden sm:inline-flex border-2 border-ink font-semibold text-xs"
              >
                Reset
              </Button>
            )}
          </div>

          {/* Brand Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Brands:
            </span>
            {FEATURED_BRANDS.map((brand) => {
              const active = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all border shrink-0 ${
                    active
                      ? "bg-ink text-background border-ink shadow-sm"
                      : "bg-muted/60 text-foreground/80 hover:bg-muted border-border hover:border-ink/40"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Types:
            </span>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    active
                      ? "bg-yellow-brand text-ink border-ink font-bold shadow-xs"
                      : "bg-background text-foreground/70 hover:bg-muted border-border"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalog Grid Area */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        {/* Results Metadata Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink">
              {loading ? (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin text-magenta-brand" /> Searching live inventory...
                </span>
              ) : (
                <span>
                  Found <span className="text-magenta-brand">{totalCount.toLocaleString()}</span> wholesale styles
                  {selectedBrand !== "All Brands" && ` in ${selectedBrand}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="bg-muted px-2.5 py-1 rounded border font-medium">
              Real-time S&S Activewear Stock Available
            </span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && styles.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-muted/20 p-3 space-y-3">
                <div className="aspect-[3/4] bg-muted/60 rounded-lg w-full" />
                <div className="h-4 bg-muted/80 rounded w-2/3" />
                <div className="h-3 bg-muted/60 rounded w-full" />
                <div className="h-8 bg-muted rounded w-full mt-2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && styles.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-border max-w-xl mx-auto px-6">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-ink">No styles found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn't find any items matching your exact search. Try simplifying your keyword or clearing brand filters.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("Champion")}
                className="border-ink text-xs font-semibold"
              >
                Try "Champion"
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("Richardson 112")}
                className="border-ink text-xs font-semibold"
              >
                Try "Richardson 112"
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("Hoodie")}
                className="border-ink text-xs font-semibold"
              >
                Try "Hoodie"
              </Button>
              <Button
                size="sm"
                onClick={handleClearFilters}
                className="bg-ink text-background text-xs font-semibold"
              >
                Reset Filters
              </Button>
            </div>
            <div className="mt-8 pt-6 border-t text-xs text-muted-foreground">
              Need something very specific? Call or text us directly at{" "}
              <a href={`tel:${PRIMARY_PHONE}`} className="font-bold text-magenta-brand underline">
                {PRIMARY_PHONE}
              </a>
              .
            </div>
          </div>
        )}

        {/* Grid of Styles */}
        {styles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {styles.map((style) => (
              <div
                key={style.styleID}
                className="group relative flex flex-col bg-background rounded-xl border-2 border-ink overflow-hidden shadow-sm hover:shadow-pop transition-all hover:-translate-y-1"
              >
                {/* Image Box */}
                <div className="relative aspect-[3/4] bg-muted/10 p-3 overflow-hidden flex items-center justify-center border-b border-border">
                  {style.styleImage ? (
                    <img
                      src={style.styleImage}
                      alt={`${style.brandName} ${style.styleName} - ${style.title}`}
                      loading="lazy"
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Package className="w-12 h-12 text-muted-foreground/40" />
                  )}

                  {/* Brand Tag */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-background/90 text-ink border border-ink/30 rounded backdrop-blur-sm shadow-xs">
                    {style.brandName}
                  </span>

                  {/* Style # Tag */}
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-ink text-background rounded">
                    #{style.styleName || style.styleID}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-ink line-clamp-2 leading-snug group-hover:text-magenta-brand transition-colors">
                      {style.title}
                    </h3>
                    {style.baseCategory && (
                      <p className="text-[11px] text-muted-foreground mt-1 font-medium capitalize">
                        {style.baseCategory}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                    {/* Quick Specs Modal Trigger */}
                    {style.description && (
                      <button
                        type="button"
                        onClick={() => setSelectedModalStyle(style)}
                        className="w-full text-center text-[11px] font-semibold text-muted-foreground hover:text-ink flex items-center justify-center gap-1 py-1"
                      >
                        <Info className="w-3 h-3" /> View Fabric Specs
                      </button>
                    )}

                    {/* Request Quote Button */}
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-yellow-brand text-ink hover:bg-yellow-brand/90 font-bold text-xs border border-ink shadow-xs"
                    >
                      <Link
                        to="/quote"
                        search={{
                          styleId: style.styleID,
                          brandName: style.brandName,
                          styleName: style.styleName,
                          title: style.title,
                          styleImage: style.styleImage,
                        }}
                      >
                        Quote This Garment &rarr;
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && styles.length > 0 && styles.length < totalCount && (
          <div className="mt-12 text-center">
            <Button
              onClick={handleLoadMore}
              size="lg"
              variant="outline"
              className="border-2 border-ink font-bold px-8 shadow-sm hover:shadow-pop transition-all hover:-translate-y-0.5"
            >
              Load More Styles ({styles.length} of {totalCount.toLocaleString()})
            </Button>
          </div>
        )}

        {/* Bottom Helper Banner */}
        <div className="mt-16 bg-ink text-background rounded-2xl p-6 sm:p-8 border-2 border-ink flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="font-display text-2xl sm:text-3xl text-yellow-brand">
              Don't see the exact color, cut, or accessory you need?
            </h3>
            <p className="mt-2 text-sm text-background/80 leading-relaxed">
              We have direct access to S&S Activewear's multi-million unit warehouse inventory. Tell us what you're
              looking for and our production team will source it with volume wholesale discounts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button asChild variant="outline" className="border-2 border-background text-background hover:bg-background hover:text-ink font-bold">
              <a href={`tel:${PRIMARY_PHONE}`}>
                <Phone className="w-4 h-4 mr-2" /> Call {PRIMARY_PHONE}
              </a>
            </Button>
            <Button asChild className="bg-magenta-brand text-white hover:bg-magenta-brand/90 font-bold border-2 border-background shadow-pop">
              <Link to="/quote">Custom Quote Request</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Fabric Specs Modal */}
      {selectedModalStyle && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl border-2 border-ink max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-pop animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setSelectedModalStyle(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-ink border border-ink/20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pr-8">
              {selectedModalStyle.styleImage && (
                <img
                  src={selectedModalStyle.styleImage}
                  alt={selectedModalStyle.title}
                  className="w-20 h-24 object-contain rounded-lg border border-ink/20 bg-muted/20 shrink-0"
                />
              )}
              <div>
                <span className="text-xs font-extrabold uppercase text-magenta-brand tracking-wider">
                  {selectedModalStyle.brandName}
                </span>
                <h3 className="text-xl font-bold text-ink leading-tight">
                  {selectedModalStyle.title}
                </h3>
                <p className="text-xs font-mono font-bold text-muted-foreground mt-1">
                  Style #{selectedModalStyle.styleName || selectedModalStyle.styleID}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-2">
                Garment & Fabric Specifications:
              </h4>
              {selectedModalStyle.description ? (
                <div
                  className="text-xs text-muted-foreground leading-relaxed prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: selectedModalStyle.description }}
                />
              ) : (
                <p className="text-xs text-muted-foreground">Standard wholesale specifications apply.</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t flex items-center justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedModalStyle(null)}>
                Close
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-yellow-brand text-ink hover:bg-yellow-brand/90 font-bold border border-ink shadow-xs"
              >
                <Link
                  to="/quote"
                  search={{
                    styleId: selectedModalStyle.styleID,
                    brandName: selectedModalStyle.brandName,
                    styleName: selectedModalStyle.styleName,
                    title: selectedModalStyle.title,
                    styleImage: selectedModalStyle.styleImage,
                  }}
                  onClick={() => setSelectedModalStyle(null)}
                >
                  Request Quote for This Garment &rarr;
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
