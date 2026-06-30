import { findRetailStore } from "@/core/platform/input/parser/RetailDictionary";
import {
  normalizeText,
  titleCase,
} from "@/core/platform/input/parser/NormalizationEngine";

export default class StoreParser {
  parse(text: string) {
    const dictionaryMatch = findRetailStore(text);
    if (dictionaryMatch) return dictionaryMatch.canonical;

    const normalized = normalizeText(text);
    const contextualMatch = normalized.match(
      /\b(?:en|del|de)\s+([a-z0-9\s]+?)(?=\s+(?:por|compre|compramos|gaste|gastamos)|$|[.,])/,
    );

    if (!contextualMatch?.[1]) return undefined;
    return titleCase(contextualMatch[1]);
  }

  strip(text: string, store?: string) {
    let nextText = normalizeText(text);
    if (!store) return nextText;

    normalizeText(store)
      .split(" ")
      .filter(Boolean)
      .forEach((part) => {
        nextText = nextText.replace(new RegExp(`\\b${part}\\b`, "g"), " ");
      });

    return nextText;
  }
}
