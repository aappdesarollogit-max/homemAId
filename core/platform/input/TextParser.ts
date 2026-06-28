import type { ParsedPurchase, ParsedPurchaseProduct } from "@/core/platform/input/InputTypes";

const NUMBER_WORDS = new Map<string, number>([
  ["un", 1],
  ["una", 1],
  ["uno", 1],
  ["unos", 1],
  ["unas", 1],
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

const VERB_PATTERN =
  /\b(compre|compramos|gaste|gastamos|gasto|registre|registra|registramos|que)\b/g;

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseMoney(text: string) {
  const match = text.match(/\$\s?([\d.]+(?:,\d+)?)/);
  if (!match) return undefined;

  return Number(match[1].replace(/\./g, "").replace(",", "."));
}

function parseStore(text: string) {
  const normalized = normalizeText(text);
  const leadingStore = normalized.match(
    /^(?:en|del)\s+([a-z0-9\s]+?)\s+(?:compre|compramos|gaste|gastamos|gasto)\b/,
  );
  if (leadingStore?.[1]) return titleCase(leadingStore[1]);

  const trailingStore = normalized.match(
    /\b(?:en|del)\s+([a-z0-9\s]+?)(?=\s+por\s+\$|\s+por\s+[\d.]|\s*$|[.,])/,
  );
  if (trailingStore?.[1]) return titleCase(trailingStore[1]);

  return undefined;
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

function removeStoreContext(text: string, store?: string) {
  let nextText = text;

  if (store) {
    const normalizedStore = normalizeText(store);
    const storePattern = escapeRegExp(normalizedStore);

    nextText = nextText.replace(
      new RegExp(`^(?:en|del)\\s+${storePattern}\\s+`, "i"),
      "",
    );
    nextText = nextText.replace(
      new RegExp(`\\s+(?:en|del)\\s+${storePattern}(?:\\s+por\\s*)?.*$`, "i"),
      "",
    );
  }

  return nextText;
}

function stripNoise(text: string, store?: string) {
  return removeStoreContext(normalizeText(text), store)
    .replace(/\$\s?[\d.]+(?:,\d+)?/g, "")
    .replace(VERB_PATTERN, "")
    .replace(/\b(hoy|ayer)\b/g, "")
    .replace(/\b(por|en|del)\b/g, "")
    .replace(/[.]/g, "")
    .replace(/\s+y\s+/g, ", ")
    .replace(/\s{2,}/g, " ")
    .replace(/^,\s*/, "")
    .trim();
}

function parseProducts(text: string, store?: string, totalAmount?: number): ParsedPurchaseProduct[] {
  const productText = stripNoise(text, store);
  if (!productText) return [];

  const chunks = productText
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const products = chunks
    .map((chunk) => {
      const match = chunk.match(
        /^(\d+(?:[.,]\d+)?|un|una|uno|unos|unas|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(.+)$/i,
      );
      const quantity = parseQuantity(match?.[1]);
      const productName = (match?.[2] ?? chunk)
        .replace(VERB_PATTERN, "")
        .replace(/\b(hoy|ayer)\b/g, "")
        .trim();

      return {
        productName,
        normalizedName: productName,
        quantity,
        unit: "unidades",
        confidence: match ? 78 : 60,
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
    const products = parseProducts(originalText, store, totalAmount);

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
