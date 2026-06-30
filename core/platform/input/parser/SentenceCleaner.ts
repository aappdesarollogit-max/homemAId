import MoneyParser from "@/core/platform/input/parser/MoneyParser";
import StoreParser from "@/core/platform/input/parser/StoreParser";
import { normalizeText } from "@/core/platform/input/parser/NormalizationEngine";

const noisePattern =
  /\b(compre|compramos|gaste|gastamos|gasto|registre|registra|registramos|que|hoy|ayer|por|en|del|de|la|el)\b/g;

export default class SentenceCleaner {
  constructor(
    private readonly moneyParser = new MoneyParser(),
    private readonly storeParser = new StoreParser(),
  ) {}

  clean(text: string, store?: string) {
    return this.moneyParser
      .strip(this.storeParser.strip(text, store))
      .replace(noisePattern, " ")
      .replace(/\s+y\s+/g, ", ")
      .replace(/[.]/g, "")
      .replace(/\s+/g, " ")
      .replace(/^,\s*/, "")
      .trim();
  }

  date(text: string) {
    const normalized = normalizeText(text);
    if (normalized.includes("hoy")) return new Date().toISOString().slice(0, 10);
    if (!normalized.includes("ayer")) return undefined;

    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().slice(0, 10);
  }
}
