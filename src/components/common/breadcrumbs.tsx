import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumbs" className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.16em] text-ink-soft/70 py-3">
      <Link href="/" className="hover:text-ink transition-colors">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center space-x-2">
            <ChevronRight className="w-3 h-3 text-ink-soft/40" />
            {isLast || !item.href ? (
              <span className="text-olive-deep font-semibold">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-ink transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
