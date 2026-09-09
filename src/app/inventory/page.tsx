"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Upload,
  Download,
  AlertTriangle,
  Edit2,
  Trash2,
  Minus,
  CheckCircle2,
  X,
  Store,
  RefreshCw,
  Barcode,
} from "lucide-react";
import {
  getAllProducts,
  saveProduct,
  deleteProduct,
  adjustStock,
  saveProductsBulk,
  seedInitialInventoryIfEmpty,
  type Product,
} from "@/lib/db/posDb";
import { InventoryComplianceGuide } from "@/components/inventory/InventoryComplianceGuide";

const GST_SLABS = [0, 5, 12, 18, 28];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    barcode: "",
    hsn: "",
    costPrice: "",
    salePrice: "",
    gstRate: 5,
    stock: "0",
    minStock: "5",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }

  // Load Inventory from IndexedDB
  async function loadData() {
    setLoading(true);
    try {
      await seedInitialInventoryIfEmpty();
      const list = await getAllProducts();
      setProducts(list);
    } catch (err) {
      console.error("Failed to load inventory:", err);
      showToast("Unable to load inventory from local storage.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filter products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return products.filter((item) => {
      if (showLowStockOnly && item.stock > item.minStock) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (!query) return true;

      return (
        item.name.toLowerCase().includes(query) ||
        (item.barcode && item.barcode.toLowerCase().includes(query)) ||
        (item.hsn && item.hsn.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query))
      );
    });
  }, [products, searchQuery, selectedCategory, showLowStockOnly]);

  // Inventory KPIs
  const kpis = useMemo(() => {
    const totalItems = products.length;
    const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
    const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalValue = products.reduce(
      (sum, p) => sum + (p.salePrice || 0) * (p.stock || 0),
      0
    );
    return { totalItems, lowStockCount, totalUnits, totalValue };
  }, [products]);

  // Quick In-Line Stock Adjust
  async function handleQuickStock(id: string, delta: number) {
    try {
      const newStock = await adjustStock(id, delta);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
      );
    } catch (err) {
      console.error("Failed to adjust stock:", err);
      showToast("Could not update stock.");
    }
  }

  // Delete product
  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`Deleted "${name}" from inventory.`);
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Error deleting item.");
    }
  }

  // Open Modal
  function openAddModal() {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      barcode: "",
      hsn: "",
      costPrice: "",
      salePrice: "",
      gstRate: 5,
      stock: "0",
      minStock: "5",
    });
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category || "",
      barcode: product.barcode || "",
      hsn: product.hsn || "",
      costPrice: product.costPrice ? String(product.costPrice) : "",
      salePrice: product.salePrice ? String(product.salePrice) : "",
      gstRate: product.gstRate || 0,
      stock: String(product.stock ?? 0),
      minStock: String(product.minStock ?? 5),
    });
    setIsModalOpen(true);
  }

  // Save Modal Form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Product name is required.");
      return;
    }

    const salePriceNum = parseFloat(formData.salePrice) || 0;
    const costPriceNum = parseFloat(formData.costPrice) || 0;
    const stockNum = parseInt(formData.stock, 10) || 0;
    const minStockNum = parseInt(formData.minStock, 10) || 0;

    const toSave: Product = {
      id: editingProduct ? editingProduct.id : "",
      name: formData.name.trim(),
      category: formData.category.trim() || undefined,
      barcode: formData.barcode.trim() || undefined,
      hsn: formData.hsn.trim() || undefined,
      costPrice: costPriceNum,
      salePrice: salePriceNum,
      gstRate: Number(formData.gstRate) || 0,
      stock: stockNum,
      minStock: minStockNum,
    };

    try {
      await saveProduct(toSave);
      await loadData();
      setIsModalOpen(false);
      showToast(
        editingProduct
          ? `Updated "${toSave.name}" successfully.`
          : `Added "${toSave.name}" to inventory.`
      );
    } catch (err) {
      console.error("Save product error:", err);
      showToast("Failed to save product.");
    }
  }

  // CSV Export
  function handleExportCsv() {
    if (products.length === 0) {
      showToast("No products to export.");
      return;
    }

    const headers = [
      "Name",
      "Barcode",
      "HSN",
      "Category",
      "CostPrice",
      "SalePrice",
      "GSTRate",
      "Stock",
      "MinStock",
    ];

    const rows = products.map((p) => [
      `"${(p.name || "").replace(/"/g, '""')}"`,
      `"${p.barcode || ""}"`,
      `"${p.hsn || ""}"`,
      `"${(p.category || "").replace(/"/g, '""')}"`,
      p.costPrice || 0,
      p.salePrice || 0,
      p.gstRate || 0,
      p.stock || 0,
      p.minStock || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `swiftgst_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${products.length} products to CSV.`);
  }

  // CSV Import
  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        if (!text) return;

        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        if (lines.length < 2) {
          showToast("CSV file is empty or missing data rows.");
          return;
        }

        const headerLine = lines[0].toLowerCase();
        const headers = headerLine.split(",").map((h) => h.replace(/["\s]/g, ""));

        const nameIdx = headers.findIndex((h) => h.includes("name") || h.includes("item"));
        const barcodeIdx = headers.findIndex((h) => h.includes("barcode") || h.includes("sku") || h.includes("code"));
        const hsnIdx = headers.findIndex((h) => h.includes("hsn") || h.includes("sac"));
        const catIdx = headers.findIndex((h) => h.includes("cat"));
        const costIdx = headers.findIndex((h) => h.includes("cost"));
        const saleIdx = headers.findIndex((h) => h.includes("sale") || h.includes("price") || h.includes("rate") || h.includes("mrp"));
        const gstIdx = headers.findIndex((h) => h.includes("gst") || h.includes("tax"));
        const stockIdx = headers.findIndex((h) => h.includes("stock") || h.includes("qty") || h.includes("quantity"));
        const minStockIdx = headers.findIndex((h) => h.includes("min") || h.includes("alert") || h.includes("reorder"));

        if (nameIdx === -1) {
          showToast("CSV must contain a 'Name' or 'Item' column.");
          return;
        }

        const importedItems: Product[] = [];
        for (let i = 1; i < lines.length; i++) {
          // simple CSV column split handling quotes
          const rawValues = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(",");
          const cleanVals = rawValues.map((v) => v.replace(/^"|"$/g, "").trim());

          const name = cleanVals[nameIdx];
          if (!name) continue;

          const barcode = barcodeIdx !== -1 ? cleanVals[barcodeIdx] : undefined;
          const hsn = hsnIdx !== -1 ? cleanVals[hsnIdx] : undefined;
          const category = catIdx !== -1 ? cleanVals[catIdx] : undefined;
          const costPrice = costIdx !== -1 ? parseFloat(cleanVals[costIdx]) || 0 : 0;
          const salePrice = saleIdx !== -1 ? parseFloat(cleanVals[saleIdx]) || 0 : 0;
          const gstRate = gstIdx !== -1 ? parseFloat(cleanVals[gstIdx]) || 0 : 5;
          const stock = stockIdx !== -1 ? parseInt(cleanVals[stockIdx], 10) || 0 : 0;
          const minStock = minStockIdx !== -1 ? parseInt(cleanVals[minStockIdx], 10) || 5 : 5;

          importedItems.push({
            id: "",
            name,
            barcode,
            hsn,
            category,
            costPrice,
            salePrice,
            gstRate,
            stock,
            minStock,
          });
        }

        if (importedItems.length === 0) {
          showToast("No valid products found in CSV.");
          return;
        }

        const count = await saveProductsBulk(importedItems);
        await loadData();
        showToast(`Successfully imported ${count} items from CSV!`);
      } catch (err) {
        console.error("CSV import parse error:", err);
        showToast("Failed to parse CSV file. Ensure valid comma format.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Toast Notification */}
      {toastMessage ? (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      ) : null}

      {/* Top Banner & Header */}
      <header className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto max-w-[1850px] 2xl:max-w-[2100px] w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
                  <Package className="h-4.5 w-4.5" />
                </span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Inventory &amp; Stock Master
                </h1>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  Free POS Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                100% private in-browser stock manager with barcode lookups, low-stock alerts, and instant POS sync.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleCsvUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-2xs"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Import CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>

              <Link
                href="/pos"
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 active:scale-95 transition shadow-2xs"
              >
                <Store className="h-3.5 w-3.5" />
                <span>Open POS Counter</span>
              </Link>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Quick KPI Stat Cards */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Products
              </span>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 tabular-nums font-sans">
                {kpis.totalItems}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Low Stock Alert
                </span>
                {kpis.lowStockCount > 0 ? (
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                ) : null}
              </div>
              <p
                className={`mt-1 text-2xl font-bold tracking-tight tabular-nums font-sans ${
                  kpis.lowStockCount > 0 ? "text-amber-600" : "text-slate-900"
                }`}
              >
                {kpis.lowStockCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Units on Shelf
              </span>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 tabular-nums font-sans">
                {kpis.totalUnits.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                Inventory Retail Value
              </span>
              <p className="mt-1 text-2xl font-bold tracking-tight text-teal-900 tabular-nums font-sans">
                ₹{kpis.totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-[1850px] 2xl:max-w-[2100px] w-full px-4 sm:px-6 lg:px-8 pt-6">
        {/* Search, Filter & Quick Toggles */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, barcode, HSN, or category..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-2xs"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            {categories.length > 0 ? (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Category"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none shadow-2xs"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ) : null}

            {/* Low Stock Toggle */}
            <button
              type="button"
              onClick={() => setShowLowStockOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition active:scale-95 shadow-2xs ${
                showLowStockOnly
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>Low Stock Only</span>
              {kpis.lowStockCount > 0 ? (
                <span className="rounded-full bg-amber-200/70 px-1.5 py-0.2 text-[10px] font-bold text-amber-900">
                  {kpis.lowStockCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {/* Product Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 text-xs">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              <span>Loading inventory from IndexedDB...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center px-4 max-w-md mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl shadow-sm border border-teal-100/60 mb-3">
                📦
              </div>
              <h3 className="text-base font-bold text-slate-800">Your inventory is empty</h3>
              <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Add your store catalog or import via Excel/CSV.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-800 transition active:scale-95"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>+ Add First Product</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
                >
                  <Upload className="h-4 w-4 text-slate-500" />
                  <span>Import Excel / CSV</span>
                </button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center px-4">
              <Package className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">No items found</h3>
              <p className="mt-1 text-xs text-slate-500">
                Try resetting your search filter or category selection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setShowLowStockOnly(false);
                }}
                className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Product / Item</th>
                    <th className="px-3 py-3">Barcode / HSN</th>
                    <th className="px-3 py-3 text-right">Cost (₹)</th>
                    <th className="px-3 py-3 text-right">Sale Price (₹)</th>
                    <th className="px-3 py-3 text-center">GST Slab</th>
                    <th className="px-4 py-3 text-center">In Stock</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isLow = p.stock <= p.minStock;
                    const margin =
                      p.salePrice > 0 && p.costPrice > 0
                        ? (((p.salePrice - p.costPrice) / p.salePrice) * 100).toFixed(0)
                        : null;

                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-slate-50/80 transition ${
                          isLow ? "bg-amber-50/20" : ""
                        }`}
                      >
                        {/* Name & Category */}
                        <td className="px-4 py-3 min-w-[220px]">
                          <div className="font-semibold text-slate-900">{p.name}</div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                            {p.category ? (
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                                {p.category}
                              </span>
                            ) : null}
                          </div>
                        </td>

                        {/* Barcode & HSN */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          {p.barcode ? (
                            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700">
                              <Barcode className="h-3 w-3 text-slate-400" />
                              <span>{p.barcode}</span>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-mono text-[11px]">—</span>
                          )}
                          {p.hsn ? (
                            <div className="text-[10px] text-slate-400 font-mono">
                              HSN: {p.hsn}
                            </div>
                          ) : null}
                        </td>

                        {/* Cost Price */}
                        <td className="px-3 py-3 text-right tabular-nums font-mono text-slate-500">
                          {p.costPrice ? `₹${p.costPrice.toFixed(2)}` : "—"}
                        </td>

                        {/* Sale Price & Margin */}
                        <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                          <span className="font-bold text-slate-900 font-mono">
                            ₹{p.salePrice.toFixed(2)}
                          </span>
                          {margin ? (
                            <span className="block text-[10px] text-emerald-600 font-medium">
                              +{margin}% margin
                            </span>
                          ) : null}
                        </td>

                        {/* GST Slab */}
                        <td className="px-3 py-3 text-center">
                          <span className="inline-flex items-center rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                            {p.gstRate}%
                          </span>
                        </td>

                        {/* In-Line Stock Adjustments & Low-Stock Badge */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleQuickStock(p.id, -1)}
                              disabled={p.stock <= 0}
                              title="Decrease Stock by 1"
                              className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 active:scale-95 transition"
                            >
                              <Minus className="h-3 w-3" />
                            </button>

                            <span
                              className={`min-w-[2.5rem] text-center font-bold tabular-nums font-mono text-sm ${
                                isLow ? "text-amber-600" : "text-slate-900"
                              }`}
                            >
                              {p.stock}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleQuickStock(p.id, 1)}
                              title="Increase Stock by 1"
                              className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 active:scale-95 transition"
                            >
                              <Plus className="h-3 w-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleQuickStock(p.id, 10)}
                              title="Add +10 Units"
                              className="flex h-6 px-1.5 items-center justify-center rounded-lg border border-teal-200 bg-teal-50 text-[10px] font-bold text-teal-800 hover:bg-teal-100 active:scale-95 transition ml-1"
                            >
                              +10
                            </button>
                          </div>

                          {isLow ? (
                            <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-semibold text-amber-600">
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                              <span>Low Stock (Min: {p.minStock})</span>
                            </div>
                          ) : null}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              title="Edit product"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id, p.name)}
                              title="Delete product"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="h-4.5 w-4.5 text-teal-700" />
                <span>{editingProduct ? "Edit Product" : "Add New Product"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product / Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tata Salt (1kg) or Cotton Kurti"
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-medium text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              {/* Category & Barcode Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Staples, Dairy, Apparel"
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-medium text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Barcode / SKU</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="e.g. 8901030383321"
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* HSN & GST Slab Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">HSN / SAC Code</label>
                  <input
                    type="text"
                    value={formData.hsn}
                    onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                    placeholder="e.g. 2501 or 998822"
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GST Tax Slab</label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) =>
                      setFormData({ ...formData, gstRate: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold text-slate-900 focus:border-teal-600 focus:outline-none bg-white"
                  >
                    {GST_SLABS.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}% GST {rate === 0 ? "(Exempt / Nil)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Row: Cost vs Sale Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-mono font-medium text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sale Price / MRP (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-mono font-bold text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Stock & Min Stock Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Min Stock (Low Alert)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-slate-900 focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 font-semibold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-700 hover:bg-teal-800 px-5 py-2 font-bold text-white shadow-xs transition"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Educational & E-E-A-T Compliance Guide */}
      <InventoryComplianceGuide />
    </div>
  );
}
