import { formatCurrency } from "@/lib/mock-home";
import type { TopPurchasedProduct } from "@/lib/services/consumption-service";

type TopProductsProps = {
  products: TopPurchasedProduct[];
};

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-black">Productos más comprados</h2>
      <div className="mt-5 space-y-3">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.productName} className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black">{product.productName}</p>
                  <p className="mt-1 text-sm text-white/50">
                    {product.quantity} {product.unit}
                  </p>
                </div>
                <p className="font-black text-violet-300">{formatCurrency(product.totalSpend)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm font-bold text-white/55">Aún no hay productos comprados.</p>
        )}
      </div>
    </section>
  );
}
