"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getBudgetUsage,
  getConsumptionAlerts,
  getCriticalProducts,
  getMonthlySpend,
  getSpendByCategory,
  getSpendByStore,
  getTopPurchasedProducts,
  getWeeklySpendTrend,
} from "@/lib/services/consumption-service";
import { getInventoryProducts } from "@/lib/services/inventory-service";
import { getPurchases } from "@/lib/services/purchase-service";
import type { InventoryProduct, Purchase } from "@/types/domain";

export function useConsumption(monthlyBudget: number, budgetAlertThreshold = 80) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [inventoryProducts, setInventoryProducts] = useState<InventoryProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setPurchases(getPurchases());
      setInventoryProducts(getInventoryProducts());
      setIsLoaded(true);
    });
  }, []);

  return useMemo(() => {
    const monthlySpend = getMonthlySpend(purchases);
    const spendByCategory = getSpendByCategory(purchases, inventoryProducts);
    const spendByStore = getSpendByStore(purchases);
    const topPurchasedProducts = getTopPurchasedProducts(purchases);
    const weeklyTrend = getWeeklySpendTrend(purchases);
    const budgetUsage = getBudgetUsage(monthlySpend, monthlyBudget);
    const alerts = getConsumptionAlerts(
      purchases,
      inventoryProducts,
      monthlyBudget,
      budgetAlertThreshold,
    );
    const criticalProducts = getCriticalProducts(inventoryProducts);

    return {
      isLoaded,
      purchases,
      inventoryProducts,
      monthlySpend,
      spendByCategory,
      spendByStore,
      topPurchasedProducts,
      weeklyTrend,
      budgetUsage,
      alerts,
      criticalProducts,
    };
  }, [budgetAlertThreshold, inventoryProducts, isLoaded, monthlyBudget, purchases]);
}
