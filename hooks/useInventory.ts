"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createInventoryProduct,
  deleteInventoryProduct,
  getInventoryProducts,
  markProductAsOpened,
  saveInventoryProducts,
  updateInventoryProduct,
  type InventoryProductDraft,
  type InventoryProductUpdate,
} from "@/lib/services/inventory-service";
import type { InventoryProduct, ProductStatus } from "@/types/domain";

type StatusFilter = ProductStatus | "todos";

function matchesQueryFilter(product: InventoryProduct, activeFilter: string) {
  if (activeFilter === "criticos") return product.status !== "ok";
  if (activeFilter === "despensa") return product.category.toLowerCase() === "despensa";
  if (activeFilter === "lacteos") return product.category.toLowerCase() === "lácteos";
  if (activeFilter === "limpieza") return product.category.toLowerCase() === "limpieza";
  return true;
}

export function useInventory(activeFilter: string) {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

  useEffect(() => {
    queueMicrotask(() => {
      setProducts(getInventoryProducts());
      setIsLoaded(true);
    });
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean)),
    );
    return uniqueCategories.sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      if (!matchesQueryFilter(product, activeFilter)) return false;
      if (categoryFilter !== "todas" && product.category !== categoryFilter) return false;
      if (statusFilter !== "todos" && product.status !== statusFilter) return false;
      if (normalizedSearch && !product.name.toLowerCase().includes(normalizedSearch)) {
        return false;
      }

      return true;
    });
  }, [activeFilter, categoryFilter, products, searchTerm, statusFilter]);

  function syncProducts(nextProducts: InventoryProduct[]) {
    const savedProducts = saveInventoryProducts(nextProducts);
    setProducts(savedProducts);
    return savedProducts;
  }

  function createProduct(product: InventoryProductDraft) {
    const newProduct = createInventoryProduct(product);
    setProducts(getInventoryProducts());
    return newProduct;
  }

  function updateProduct(id: string, updates: InventoryProductUpdate) {
    const updatedProduct = updateInventoryProduct(id, updates);
    setProducts(getInventoryProducts());
    return updatedProduct;
  }

  function deleteProduct(id: string) {
    const nextProducts = deleteInventoryProduct(id);
    setProducts(nextProducts);
    return nextProducts;
  }

  function markAsOpened(id: string, openedAt: string) {
    const updatedProduct = markProductAsOpened(id, openedAt);
    setProducts(getInventoryProducts());
    return updatedProduct;
  }

  return {
    products,
    filteredProducts,
    categories,
    isLoaded,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    createProduct,
    updateProduct,
    deleteProduct,
    markAsOpened,
    syncProducts,
  };
}
