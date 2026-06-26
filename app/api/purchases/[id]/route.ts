import { purchases } from "@/lib/mock-home";

export async function GET(_request: Request, context: RouteContext<"/api/purchases/[id]">) {
  const { id } = await context.params;
  const purchase = purchases.find((item) => item.id === id);

  if (!purchase) {
    return Response.json(
      {
        error: {
          code: "PURCHASE_NOT_FOUND",
          message: "No encontramos esa compra.",
        },
      },
      { status: 404 },
    );
  }

  return Response.json({ data: purchase });
}
