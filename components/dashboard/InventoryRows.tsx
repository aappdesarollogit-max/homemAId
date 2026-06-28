import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { statusTone } from "@/lib/dashboard-utils";
import type { InventoryProduct } from "@/types/domain";

function getCategoryTone(category: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("lácteos") || normalizedCategory.includes("lacteos")) {
    return "from-sky-300/30 to-violet-300/20 text-sky-100";
  }
  if (normalizedCategory.includes("limpieza")) return "from-cyan-300/30 to-emerald-300/15 text-cyan-100";
  if (normalizedCategory.includes("mascota")) return "from-pink-300/30 to-rose-300/15 text-pink-100";
  if (normalizedCategory.includes("bebida")) return "from-blue-300/30 to-indigo-300/15 text-blue-100";
  if (normalizedCategory.includes("snack")) return "from-fuchsia-300/30 to-orange-300/15 text-fuchsia-100";
  if (normalizedCategory.includes("carne")) return "from-red-300/30 to-orange-300/15 text-red-100";
  if (normalizedCategory.includes("verdura")) return "from-emerald-300/30 to-lime-300/15 text-emerald-100";

  return "from-amber-300/30 to-violet-300/15 text-amber-100";
}

function CategoryIcon({ category }: { category: string }) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("limpieza")) {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
        <path d="M8 10h8l-1 10H9L8 10Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 10V6a2 2 0 1 1 4 0v4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (normalizedCategory.includes("lácteos") || normalizedCategory.includes("lacteos")) {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
        <path d="M9 3h6l1 5v12H8V8l1-5Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 9h8M10 3v3h4V3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (normalizedCategory.includes("verdura")) {
    return (
      <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
        <path d="M5 13c6-8 12-7 14-6-1 9-7 12-14 6Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 13c4-.5 7-2 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
      <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 8.5 8 4.5 8-4.5M12 13v7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function getDaysProgress(product: InventoryProduct) {
  if (product.status === "out") return 8;
  if (product.status === "critical") return Math.max(14, Math.min(38, product.estimatedDaysLeft * 8));
  if (product.status === "low") return Math.max(38, Math.min(62, product.estimatedDaysLeft * 7));
  return Math.max(62, Math.min(100, product.estimatedDaysLeft * 4));
}

function InventoryCardContent({ product }: { product: InventoryProduct }) {
  return (
    <>
      <div className="absolute right-4 top-4">
        <Badge tone={statusTone(product.status)}>{product.statusLabel}</Badge>
      </div>
      <div className="flex min-w-0 items-center gap-4 pr-20">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getCategoryTone(product.category)} ring-1 ring-white/10`}>
          <CategoryIcon category={product.category} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-black text-white">{product.name}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-white/50">
            {product.category} · {product.quantity}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-1.5 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-200"
            style={{ width: `${getDaysProgress(product)}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-bold text-white/45">
          {product.estimatedDaysLeft} días restantes
        </p>
      </div>
    </>
  );
}

export function InventoryRow({ product }: { product: InventoryProduct }) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/10">
      <InventoryCardContent product={product} />
    </div>
  );
}

export function InventoryLinkRow({
  product,
  href,
  isSelected,
  onSelect,
}: {
  product: InventoryProduct;
  href: string;
  isSelected: boolean;
  onSelect?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className={`relative block rounded-3xl border p-4 shadow-xl shadow-black/10 transition duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.99] ${
        isSelected
          ? "border-violet-300 bg-violet-500/18 ring-1 ring-violet-300/20"
          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
      }`}
    >
      <InventoryCardContent product={product} />
    </Link>
  );
}
