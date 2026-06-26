import { purchases } from "@/lib/mock-home";

export async function GET() {
  const totalSpend = purchases.reduce((sum, purchase) => sum + purchase.total, 0);

  return Response.json({
    data: purchases,
    meta: {
      total: purchases.length,
      totalSpend,
    },
  });
}
