import { inventoryProducts } from "@/lib/mock-home";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  const products = inventoryProducts.filter((product) => {
    if (status && product.status !== status) return false;
    if (category && product.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    return true;
  });

  return Response.json({
    data: products,
    meta: {
      total: products.length,
      filters: {
        status,
        category,
      },
    },
  });
}
