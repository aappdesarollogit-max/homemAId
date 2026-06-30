import type { ParsedPurchase } from "@/core/platform/input/InputTypes";
import MoneyParser from "@/core/platform/input/parser/MoneyParser";
import ProductParser from "@/core/platform/input/parser/ProductParser";
import SentenceCleaner from "@/core/platform/input/parser/SentenceCleaner";
import StoreParser from "@/core/platform/input/parser/StoreParser";

export default class TextParser {
  constructor(
    private readonly moneyParser = new MoneyParser(),
    private readonly storeParser = new StoreParser(),
    private readonly sentenceCleaner = new SentenceCleaner(),
    private readonly productParser = new ProductParser(),
  ) {}

  parse(text: string): ParsedPurchase {
    const originalText = text.trim();
    const errors: string[] = [];
    const warnings: string[] = [];
    const totalAmount = this.moneyParser.parse(originalText);
    const store = this.storeParser.parse(originalText);
    const date = this.sentenceCleaner.date(originalText);
    const productText = this.sentenceCleaner.clean(originalText, store);
    const products = this.productParser.parse(productText, totalAmount);

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
