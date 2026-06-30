import type { ParsedPurchaseProduct } from "@/core/platform/input/InputTypes";
import NormalizationEngine, {
  singularize,
} from "@/core/platform/input/parser/NormalizationEngine";
import QuantityParser, {
  quantityTokenPattern,
} from "@/core/platform/input/parser/QuantityParser";

export default class ProductParser {
  constructor(
    private readonly quantityParser = new QuantityParser(),
    private readonly normalization = new NormalizationEngine(),
  ) {}

  parse(text: string, totalAmount?: number): ParsedPurchaseProduct[] {
    const chunks = text
      .split(",")
      .map((chunk) => chunk.trim())
      .filter(Boolean);

    const products = chunks
      .map((chunk) => this.parseChunk(chunk))
      .filter((product): product is ParsedPurchaseProduct => Boolean(product));
    const unitPrice = products.length > 0 && totalAmount ? totalAmount / products.length : 0;

    return products.map((product) => ({
      ...product,
      price: Math.round(unitPrice),
    }));
  }

  private parseChunk(chunk: string) {
    const match = chunk.match(new RegExp(`^(${quantityTokenPattern})\\s+(.+)$`, "i"));
    const quantity = this.quantityParser.parse(match?.[1]);
    const rawName = (match?.[2] ?? chunk)
      .replace(/\b(unidad|unidades|pack|packs)\b/g, "")
      .trim();
    const normalizedName = singularize(rawName);

    if (!normalizedName) return undefined;

    return {
      productName: this.normalization.productName(normalizedName),
      normalizedName,
      quantity,
      unit: "unidades",
      confidence: match ? 84 : 62,
    };
  }
}
