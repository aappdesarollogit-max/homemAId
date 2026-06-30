import { normalizeText } from "@/core/platform/input/parser/NormalizationEngine";

export type RetailMatch = {
  canonical: string;
  aliases: string[];
};

export const retailStores: RetailMatch[] = [
  { canonical: "Santa Isabel", aliases: ["santa isabel"] },
  { canonical: "Lider", aliases: ["lider", "líder"] },
  { canonical: "Jumbo", aliases: ["jumbo"] },
  { canonical: "Tottus", aliases: ["tottus"] },
  { canonical: "Unimarc", aliases: ["unimarc"] },
  { canonical: "Mayorista", aliases: ["mayorista"] },
  { canonical: "Acuenta", aliases: ["acuenta", "a cuenta"] },
  { canonical: "Central Mayorista", aliases: ["central mayorista"] },
];

export function findRetailStore(text: string) {
  const normalized = normalizeText(text);

  return retailStores.find((store) =>
    store.aliases.some((alias) => normalized.includes(normalizeText(alias))),
  );
}
