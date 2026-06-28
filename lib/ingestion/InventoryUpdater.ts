import type { NormalizedPurchase } from "@/lib/ingestion/DataIngestionEngine";
import type { InventoryProduct } from "@/types/domain";

export interface InventoryUpdaterProvider {
  findProductById(id: string): InventoryProduct | undefined;
  findProductByName(name: string): InventoryProduct | undefined;
  increaseProductStock(id: string, quantity: number, unit: string): void;
  createProductFromPurchase(input: {
    name: string;
    category?: string;
    quantity: number;
    unit: string;
  }): void;
}

export default class InventoryUpdater {
  constructor(private readonly inventoryProvider: InventoryUpdaterProvider) {}

  updateInventory(purchase: NormalizedPurchase) {
    purchase.items.forEach((item) => {
      const product = item.productId
        ? this.inventoryProvider.findProductById(item.productId)
        : this.inventoryProvider.findProductByName(item.productName);

      if (product) {
        this.inventoryProvider.increaseProductStock(product.id, item.quantity, item.unit);
        return;
      }

      this.inventoryProvider.createProductFromPurchase({
        name: item.productName,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
      });
    });
  }
}
