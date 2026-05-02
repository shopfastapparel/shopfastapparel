import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative h-9 w-9 shrink-0">
        <span className="absolute inset-0 rounded-md bg-cyan-brand mix-blend-multiply translate-x-[-3px] translate-y-[-3px]" />
        <span className="absolute inset-0 rounded-md bg-magenta-brand mix-blend-multiply" />
        <span className="absolute inset-0 rounded-md bg-yellow-brand mix-blend-multiply translate-x-[3px] translate-y-[3px]" />
        <span className="absolute inset-0 grid place-items-center font-display text-ink text-sm">
          FA
        </span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg tracking-tight">FAST APPAREL</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Custom Print Shop
        </span>
      </div>
    </Link>
  );
}
