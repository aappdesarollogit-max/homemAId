import { normalizeText } from "@/core/platform/input/parser/NormalizationEngine";

const numberWords = new Map<string, number>([
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

export const quantityTokenPattern =
  "\\d+(?:[.,]\\d+)?|un|una|uno|unos|unas|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez";

export default class QuantityParser {
  parse(value?: string) {
    if (!value) return 1;

    const normalized = normalizeText(value);
    const numeric = Number(normalized.replace(",", "."));

    if (Number.isFinite(numeric) && numeric > 0) return numeric;
    return numberWords.get(normalized) ?? 1;
  }
}
