import type { InventoryProduct, Purchase } from "@/types/domain";

type ApiListResponse<T> = {
  data: T[];
  meta: Record<string, unknown>;
};

type ApiItemResponse<T> = {
  data: T;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getInventoryProducts(params?: {
  status?: InventoryProduct["status"];
  category?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.status) searchParams.set("status", params.status);
  if (params?.category) searchParams.set("category", params.category);

  const query = searchParams.toString();
  const path = query ? `/api/inventory?${query}` : "/api/inventory";

  return getJson<ApiListResponse<InventoryProduct>>(path);
}

export async function getInventoryProduct(id: string) {
  return getJson<ApiItemResponse<InventoryProduct>>(`/api/inventory/${id}`);
}

export async function getPurchases() {
  return getJson<ApiListResponse<Purchase>>("/api/purchases");
}

export async function getPurchase(id: string) {
  return getJson<ApiItemResponse<Purchase>>(`/api/purchases/${id}`);
}
