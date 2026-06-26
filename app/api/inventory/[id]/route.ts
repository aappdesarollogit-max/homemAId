import { inventoryProducts } from "@/lib/mock-home";

export async function GET(_request: Request, context: RouteContext<"/api/inventory/[id]">) {
  const { id } = await context.params;
  const product = inventoryProducts.find((item) => item.id === id);

  if (!product) {
    return Response.json(
      {
        error: {
          code: "PRODUCT_NOT_FOUND",
          message: "No encontramos ese producto en el inventario.",
        },
      },
      { status: 404 },
    );
  }

  return Response.json({ data: product });
}
