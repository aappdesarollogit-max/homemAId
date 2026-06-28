import type { ParsedPurchase, ParsedPurchaseProduct } from "@/core/platform/input/InputTypes";

const NUMBER_WORDS = new Map<string, number>([
  ["un", 1],
  ["una", 1],
  ["uno", 1],
  ["dos", 2],
  ["tres", 3],
  ["cuatro", 4],
  ["cinco", 5],
  ["seis", 6],
  ["siete", 7],
  ["ocho", 8],
  ["nueve", 9],
  ["diez", 10],
]);

const LEADING_VERBS =
  /\b(compré|compre|compramos|compré hoy|hoy compré|gasté|gaste|gastamos|registré|registre|registra que|registra)\b/gi;

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function parseMoney(text: string) {
  const match = text.match(/\$\s?([\d.]+(?:,\d+)?)/);
  if (!match) return undefined;

  return Number(match[1].replace(/\./g, "").replace(",", "."));
}

function parseStore(text: string) {
  const match = text.match(/\b(?:en|del)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+?)(?:\s+por\s+\$|\s*$|[.,])/);
  return match?.[1]?.trim();
}

function parseDate(text: string) {
  const normalized = normalizeText(text);
  if (normalized.includes("hoy")) return new Date().toISOString().slice(0, 10);
  if (normalized.includes("ayer")) {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().slice(0, 10);
  }

  return undefined;
}

function parseQuantity(value?: string) {
  if (!value) return 1;
  const normalized = normalizeText(value);
  const numeric = Number(normalized.replace(",", "."));

  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  return NUMBER_WORDS.get(normalized) ?? 1;
}

function removeStoreSegment(text: string) {
  return text.replace(
    /\b(?:en|del)\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+?(?=\s+por\s+\$|\s*$|[.,])/gi,
    "",
  );
}

function stripNoise(text: string) {
  return removeStoreSegment(text)
    .replace(/\$\s?[\d.]+(?:,\d+)?/g, "")
    .replace(LEADING_VERBS, "")
    .replace(/\b(hoy|ayer)\b/gi, "")
    .replace(/\b(por|en|del)\b/gi, "")
    .replace(/[.]/g, "")
    .replace(/\s+y\s+/gi, ", ")
    .replace(/\s{2,}/g, " ")
    .replace(/^,\s*/, "")
    .trim();
}

function parseProducts(text: string, totalAmount?: number): ParsedPurchaseProduct[] {
  const productText = stripNoise(text);
  if (!productText) return [];

  const chunks = productText
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const products = chunks
    .map((chunk) => {
      const match = chunk.match(
        /^(\d+(?:[.,]\d+)?|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(.+)$/i,
      );
      const quantity = parseQuantity(match?.[1]);
      const productName = (match?.[2] ?? chunk)
        .replace(LEADING_VERBS, "")
        .replace(/\b(hoy|ayer)\b/gi, "")
        .trim();

      return {
        productName,
        normalizedName: productName,
        quantity,
        unit: "unidades",
        confidence: match ? 76 : 60,
      };
    })
    .filter((product) => product.productName.length > 0);

  const unitPrice = products.length > 0 && totalAmount ? totalAmount / products.length : 0;

  return products.map((product) => ({
    ...product,
    price: Math.round(unitPrice),
  }));
}

export default class TextParser {
  parse(text: string): ParsedPurchase {
    const originalText = text.trim();
    const errors: string[] = [];
    const warnings: string[] = [];
    const totalAmount = parseMoney(originalText);
    const store = parseStore(originalText);
    const date = parseDate(originalText);
    const products = parseProducts(originalText, totalAmount);

    if (!originalText) errors.push("Texto obligatorio.");
    if (products.length === 0) warnings.push("No se detectaron productos con suficiente claridad.");
    if (!store) warnings.push("No se detectó tienda; se usará Entrada de texto.");
    if (!totalAmount) warnings.push("No se detectó monto; los precios quedarán en 0.");

    const confidenceParts = [
      products.length > 0 ? 35 : 0,
      store ? 20 : 0,
      totalAmount ? 20 : 0,
      date ? 10 : 5,
      Math.min(15, products.length * 4),
    ];
    const confidence = Math.min(
      96,
      Math.max(20, confidenceParts.reduce((sum, part) => sum + part, 0)),
    );

    return {
      products,
      store,
      totalAmount,
      date,
      observations: "Parseado desde lenguaje natural local.",
      errors,
      warnings,
      confidence,
      originalText,
    };
  }
}
