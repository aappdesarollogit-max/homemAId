import { normalizeText } from "@/core/platform/input/parser/NormalizationEngine";

export default class MoneyParser {
  parse(text: string) {
    const normalized = normalizeText(text);
    const scaledMatch = normalized.match(/\b(\d+)\s*(mil|lucas?)\b/);
    if (scaledMatch?.[1]) return Number(scaledMatch[1]) * 1000;

    const explicitMatch =
      normalized.match(/\$\s*(\d{1,3}(?:\.\d{3})+|\d+)/) ??
      normalized.match(/\b(\d{1,3}(?:\.\d{3})+|\d+)\s*(?:pesos?|clp)\b/) ??
      normalized.match(/\bpor\s+(\d{1,3}(?:\.\d{3})+|\d+)\b/);
    if (explicitMatch?.[1]) {
      const amount = Number(explicitMatch[1].replace(/\./g, ""));
      return Number.isFinite(amount) ? amount : undefined;
    }

    const bareAmount = normalized
      .match(/\b\d{4,}\b/g)
      ?.map((value) => Number(value))
      .find((value) => Number.isFinite(value));
    return bareAmount;
  }

  strip(text: string) {
    return normalizeText(text)
      .replace(/\$\s*(\d{1,3}(?:\.\d{3})+|\d+)/g, " ")
      .replace(/\b(\d{1,3}(?:\.\d{3})+|\d+)\s*(?:pesos?|clp)\b/g, " ")
      .replace(/\bpor\s+(\d{1,3}(?:\.\d{3})+|\d+)\b/g, " ")
      .replace(/\b\d+\s*(?:mil|lucas?)\b/g, " ")
      .replace(/\b\d{4,}\b/g, " ");
  }
}
