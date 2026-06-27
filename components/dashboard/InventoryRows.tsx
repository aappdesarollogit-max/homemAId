import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { statusTone } from "@/lib/dashboard-utils";
import type { InventoryProduct } from "@/types/domain";

export function InventoryRow({ product }: { product: InventoryProduct }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
          {product.icon}
        </div>
        <div>
          <p className="font-black text-white">{product.name}</p>
          <p className="mt-1 text-sm text-white/50">
            {product.category} · {product.quantity}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Badge tone={statusTone(product.status)}>{product.statusLabel}</Badge>
        <p className="mt-2 text-xs font-semibold text-white/45">
          {product.estimatedDaysLeft} días estimados
        </p>
      </div>
    </div>
  );
}

export function InventoryLinkRow({
  product,
  href,
  isSelected,
}: {
  product: InventoryProduct;
  href: string;
  isSelected: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-4 rounded-3xl border p-4 transition ${
        isSelected
          ? "border-violet-400 bg-violet-500/20"
          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
          {product.icon}
        </div>
        <div>
          <p className="font-black text-white">{product.name}</p>
          <p className="mt-1 text-sm text-white/50">
            {product.category} · {product.quantity}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Badge tone={statusTone(product.status)}>{product.statusLabel}</Badge>
        <p className="mt-2 text-xs font-semibold text-white/45">
          {product.estimatedDaysLeft} días estimados
        </p>
      </div>
    </Link>
  );
}
