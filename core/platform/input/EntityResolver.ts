import type { ParsedPurchase } from "@/core/platform/input/InputTypes";
import type { InventoryProduct } from "@/types/domain";

const PRODUCT_ALIASES = new Map<string, string>([
  ["atun", "atun"],
  ["atunes", "atun"],
  ["lechita", "leche"],
  ["leches", "leche"],
  ["huevos", "huevo"],
  ["yogur", "yogurt"],
  ["yogures", "yogurt"],
  ["panes", "pan"],
]);

const PRODUCT_DISPLAY_NAMES = new Map<string, string>([
  ["atun", "Atún"],
  ["leche", "Leche"],
  ["huevo", "Huevos"],
  ["yogurt", "Yogurt"],
]);

const CATEGORY_HINTS = new Map<string, string>([
  ["atun", "Despensa"],
  ["leche", "Lácteos"],
  ["yogurt", "Lácteos"],
  ["queso", "Lácteos"],
  ["huevo", "Despensa"],
  ["arroz", "Despensa"],
  ["azucar", "Despensa"],
  ["aceite", "Despensa"],
  ["pan", "Despensa"],
  ["detergente", "Limpieza"],
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function titleCase(value: string) {
  return value
    .split(" ")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export default class EntityResolver {
  constructor(private readonly inventoryProducts: InventoryProduct[] = []) {}

  resolve(parsedPurchase: ParsedPurchase): ParsedPurchase {
    const products = parsedPurchase.products.map((product) => {
      const normalizedName = normalize(product.productName);
      const aliasName = PRODUCT_ALIASES.get(normalizedName) ?? normalizedName;
      const existingProduct = this.inventoryProducts.find((inventoryProduct) => {
        const inventoryName = normalize(inventoryProduct.name);

        return (
          inventoryName === aliasName ||
          inventoryName.includes(aliasName) ||
          aliasName.includes(inventoryName)
        );
      });
      const category =
        existingProduct?.category ?? CATEGORY_HINTS.get(aliasName) ?? product.category;
      const resolvedName =
        existingProduct?.name ?? PRODUCT_DISPLAY_NAMES.get(aliasName) ?? titleCase(aliasName);

      return {
        ...product,
        productId: existingProduct?.id,
        productName: resolvedName,
        normalizedName: resolvedName,
        category,
        unit: existingProduct?.unit ?? product.unit,
        confidence: Math.min(96, product.confidence + (existingProduct ? 18 : category ? 10 : 0)),
      };
    });

    const duplicateNames = new Set<string>();
    const seenNames = new Set<string>();

    products.forEach((product) => {
      const key = normalize(product.productName);
      if (seenNames.has(key)) duplicateNames.add(product.productName);
      seenNames.add(key);
    });

    return {
      ...parsedPurchase,
      products,
      warnings: [
        ...parsedPurchase.warnings,
        ...Array.from(duplicateNames).map((name) => `Producto repetido detectado: ${name}.`),
      ],
      confidence: Math.min(
        98,
        parsedPurchase.confidence + (products.some((product) => product.productId) ? 8 : 0),
      ),
    };
  }
}
