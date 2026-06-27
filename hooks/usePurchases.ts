"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculatePurchaseTotal,
  createPurchase,
  deletePurchase,
  getPurchases,
  type PurchaseInput,
} from "@/lib/services/purchase-service";
import type { Purchase } from "@/types/domain";

export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setPurchases(getPurchases());
      setIsLoaded(true);
    });
  }, []);

  const filteredPurchases = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) return purchases;

    return purchases.filter((purchase) => {
      const matchesStore = purchase.store.toLowerCase().includes(normalizedSearch);
      const matchesProduct = purchase.items.some((item) =>
        item.productName.toLowerCase().includes(normalizedSearch),
      );

      return matchesStore || matchesProduct;
    });
  }, [purchases, searchTerm]);

  const monthlySpend = useMemo(
    () => purchases.reduce((total, purchase) => total + purchase.total, 0),
    [purchases],
  );

  function addPurchase(purchaseInput: PurchaseInput) {
    const purchase = createPurchase(purchaseInput);
    setPurchases(getPurchases());
    return purchase;
  }

  function removePurchase(id: string) {
    const nextPurchases = deletePurchase(id);
    setPurchases(nextPurchases);
    return nextPurchases;
  }

  return {
    purchases,
    filteredPurchases,
    isLoaded,
    searchTerm,
    setSearchTerm,
    monthlySpend,
    calculatePurchaseTotal,
    addPurchase,
    removePurchase,
  };
}
