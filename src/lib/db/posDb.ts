import { openDB, type DBSchema, type IDBPDatabase } from "idb";

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  hsn?: string;
  costPrice: number;
  salePrice: number;
  gstRate: number; // 0, 5, 12, 18, 28
  stock: number;
  minStock: number;
  category?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  hsn?: string;
  price: number;
  gstRate: number;
  qty: number;
  taxAmount: number;
  total: number;
}

export type PaymentMode = "cash" | "upi" | "card" | "split" | "khata";

export interface Sale {
  id: string;
  billNo: string;
  items: SaleItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  paymentMode: PaymentMode;
  timestamp: number;
  customerId?: string;
  customerPhone?: string;
  customerName?: string;
  loyaltyPointsRedeemed?: number;
  loyaltyDiscount?: number;
  loyaltyPointsAwarded?: number;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  gstin?: string;
  creditBalance: number; // Positive = customer owes money (Udhaar / Outstanding)
  loyaltyPoints: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface LedgerEntry {
  id: string;
  customerId: string;
  type: "sale" | "payment"; // sale = increases debt (+); payment = settles debt (-)
  billNo?: string;
  amount: number;
  paymentMode?: PaymentMode;
  notes?: string;
  timestamp: number;
}

export interface PosDBSchema extends DBSchema {
  products: {
    key: string;
    value: Product;
    indexes: {
      by_barcode: string;
      by_name: string;
      by_category: string;
    };
  };
  sales: {
    key: string;
    value: Sale;
    indexes: {
      by_billNo: string;
      by_timestamp: number;
      by_paymentMode: string;
    };
  };
  customers: {
    key: string;
    value: Customer;
    indexes: {
      by_phone: string;
      by_name: string;
    };
  };
  ledger: {
    key: string;
    value: LedgerEntry;
    indexes: {
      by_customerId: string;
      by_timestamp: number;
    };
  };
}

const DB_NAME = "swiftgst_pos_db";
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<PosDBSchema>> | null = null;

export function getDb(): Promise<IDBPDatabase<PosDBSchema>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is only accessible in browser runtime."));
  }

  if (!dbPromise) {
    dbPromise = openDB<PosDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // 1. Products Store
        if (!db.objectStoreNames.contains("products")) {
          const productStore = db.createObjectStore("products", { keyPath: "id" });
          productStore.createIndex("by_barcode", "barcode");
          productStore.createIndex("by_name", "name");
          productStore.createIndex("by_category", "category");
        }

        // 2. Sales Store
        if (!db.objectStoreNames.contains("sales")) {
          const saleStore = db.createObjectStore("sales", { keyPath: "id" });
          saleStore.createIndex("by_billNo", "billNo");
          saleStore.createIndex("by_timestamp", "timestamp");
          saleStore.createIndex("by_paymentMode", "paymentMode");
        }

        // 3. Customers Store
        if (!db.objectStoreNames.contains("customers")) {
          const customerStore = db.createObjectStore("customers", { keyPath: "id" });
          customerStore.createIndex("by_phone", "phone");
          customerStore.createIndex("by_name", "name");
        }

        // 4. Ledger Store
        if (!db.objectStoreNames.contains("ledger")) {
          const ledgerStore = db.createObjectStore("ledger", { keyPath: "id" });
          ledgerStore.createIndex("by_customerId", "customerId");
          ledgerStore.createIndex("by_timestamp", "timestamp");
        }
      },
    });
  }

  return dbPromise;
}

// ----------------------------------------------------------------------
// Sample Catalog & Customer Seeds
// ----------------------------------------------------------------------
export const DEMO_PRODUCTS: Omit<Product, "id">[] = [
  {
    name: "Tata Salt Vacuum Evaporated (1kg)",
    barcode: "8901030383321",
    hsn: "2501",
    costPrice: 22,
    salePrice: 28,
    gstRate: 0,
    stock: 45,
    minStock: 10,
    category: "Grocery & Staples",
  },
  {
    name: "Fortune Sunlite Refined Sunflower Oil (1L)",
    barcode: "8906007280012",
    hsn: "1512",
    costPrice: 125,
    salePrice: 145,
    gstRate: 5,
    stock: 24,
    minStock: 8,
    category: "Edible Oils",
  },
  {
    name: "Amul Butter Pasteurized (500g)",
    barcode: "8901262010057",
    hsn: "0405",
    costPrice: 245,
    salePrice: 275,
    gstRate: 12,
    stock: 14,
    minStock: 5,
    category: "Dairy",
  },
  {
    name: "Aashirvaad Shudh Chakki Atta (5kg)",
    barcode: "8901725181223",
    hsn: "1101",
    costPrice: 220,
    salePrice: 255,
    gstRate: 0,
    stock: 18,
    minStock: 6,
    category: "Flours & Grains",
  },
  {
    name: "Maggi 2-Minute Noodles Masala (280g)",
    barcode: "8901058852441",
    hsn: "1902",
    costPrice: 50,
    salePrice: 60,
    gstRate: 18,
    stock: 5,
    minStock: 12,
    category: "Packaged Foods",
  },
  {
    name: "Dettol Original Bathing Soap Bar (125g)",
    barcode: "8901396316209",
    hsn: "3401",
    costPrice: 42,
    salePrice: 52,
    gstRate: 18,
    stock: 32,
    minStock: 10,
    category: "Personal Care",
  },
  {
    name: "Red Bull Energy Drink Can (250ml)",
    barcode: "9002490100070",
    hsn: "2202",
    costPrice: 100,
    salePrice: 125,
    gstRate: 28,
    stock: 3,
    minStock: 6,
    category: "Beverages",
  },
];

export const DEMO_CUSTOMERS: Omit<Customer, "id">[] = [
  {
    name: "Ramesh Sharma",
    phone: "9810012345",
    creditBalance: 1450,
    loyaltyPoints: 35,
  },
  {
    name: "Priya Verma",
    phone: "9820067890",
    creditBalance: 0,
    loyaltyPoints: 120,
  },
  {
    name: "Amit Gupta",
    phone: "9830045678",
    creditBalance: 680,
    loyaltyPoints: 15,
  },
  {
    name: "Sunita Patel",
    phone: "9840098765",
    creditBalance: 2100,
    loyaltyPoints: 50,
  },
];

export async function seedInitialInventoryIfEmpty(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDb();
    const count = await db.count("products");
    if (count > 0) return false;

    const tx = db.transaction("products", "readwrite");
    const now = Date.now();
    for (const item of DEMO_PRODUCTS) {
      const id = "prd_" + Math.random().toString(36).substring(2, 9);
      await tx.store.put({
        ...item,
        id,
        createdAt: now,
        updatedAt: now,
      });
    }
    await tx.done;
    return true;
  } catch (err) {
    console.error("Failed to seed demo inventory:", err);
    return false;
  }
}

export async function seedInitialCustomersIfEmpty(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDb();
    const count = await db.count("customers");
    if (count > 0) return false;

    const now = Date.now();
    for (const item of DEMO_CUSTOMERS) {
      const custId = "cst_" + Math.random().toString(36).substring(2, 9);
      await db.put("customers", {
        ...item,
        id: custId,
        createdAt: now,
        updatedAt: now,
      });

      // Also seed an initial ledger entry if they have an outstanding balance
      if (item.creditBalance > 0) {
        await db.put("ledger", {
          id: "ldg_" + Math.random().toString(36).substring(2, 9),
          customerId: custId,
          type: "sale",
          billNo: "BILL-INIT",
          amount: item.creditBalance,
          paymentMode: "khata",
          notes: "Previous Udhaar balance brought forward",
          timestamp: now - 86400000 * 3,
        });
      }
    }
    return true;
  } catch (err) {
    console.error("Failed to seed demo customers:", err);
    return false;
  }
}

export async function seedInitialSalesIfEmpty(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDb();
    const count = await db.count("sales");
    if (count > 0) return false;

    const products = await db.getAll("products");
    if (products.length === 0) return false;

    const customers = await db.getAll("customers");
    const now = Date.now();
    const oneDay = 86400000;

    const demoSales: Sale[] = [
      {
        id: "sal_demo_1",
        billNo: "POS-1001",
        items: [
          {
            productId: products[0]?.id || "",
            name: products[0]?.name || "Tata Salt 1kg",
            price: 28,
            gstRate: 0,
            qty: 2,
            taxAmount: 0,
            total: 56,
          },
          {
            productId: products[1]?.id || "",
            name: products[1]?.name || "Fortune Sunflower Oil 1L",
            price: 145,
            gstRate: 5,
            qty: 1,
            taxAmount: 6.9,
            total: 145,
          },
        ],
        subtotal: 194.1,
        taxTotal: 6.9,
        grandTotal: 201,
        paymentMode: "cash",
        timestamp: now - 3600000 * 2, // 2 hours ago (Today)
        customerName: "Walk-in Cash",
      },
      {
        id: "sal_demo_2",
        billNo: "POS-1002",
        items: [
          {
            productId: products[2]?.id || "",
            name: products[2]?.name || "Amul Butter 500g",
            price: 275,
            gstRate: 12,
            qty: 2,
            taxAmount: 58.9,
            total: 550,
          },
          {
            productId: products[4]?.id || "",
            name: products[4]?.name || "Maggi Noodles 280g",
            price: 60,
            gstRate: 18,
            qty: 3,
            taxAmount: 27.45,
            total: 180,
          },
        ],
        subtotal: 643.65,
        taxTotal: 86.35,
        grandTotal: 730,
        paymentMode: "upi",
        timestamp: now - 3600000 * 4, // 4 hours ago (Today)
        customerName: customers[1]?.name || "Priya Verma",
        customerPhone: customers[1]?.phone || "9820067890",
      },
      {
        id: "sal_demo_3",
        billNo: "POS-1003",
        items: [
          {
            productId: products[3]?.id || "",
            name: products[3]?.name || "Aashirvaad Atta 5kg",
            price: 255,
            gstRate: 0,
            qty: 1,
            taxAmount: 0,
            total: 255,
          },
          {
            productId: products[6]?.id || "",
            name: products[6]?.name || "Red Bull 250ml",
            price: 125,
            gstRate: 28,
            qty: 2,
            taxAmount: 54.68,
            total: 250,
          },
        ],
        subtotal: 450.32,
        taxTotal: 54.68,
        grandTotal: 505,
        paymentMode: "card",
        timestamp: now - oneDay * 1.5, // Yesterday
        customerName: "Card Customer",
      },
      {
        id: "sal_demo_4",
        billNo: "POS-1004",
        items: [
          {
            productId: products[5]?.id || "",
            name: products[5]?.name || "Dettol Soap 125g",
            price: 52,
            gstRate: 18,
            qty: 4,
            taxAmount: 31.73,
            total: 208,
          },
          {
            productId: products[1]?.id || "",
            name: products[1]?.name || "Fortune Sunflower Oil 1L",
            price: 145,
            gstRate: 5,
            qty: 2,
            taxAmount: 13.8,
            total: 290,
          },
        ],
        subtotal: 452.47,
        taxTotal: 45.53,
        grandTotal: 498,
        paymentMode: "khata",
        timestamp: now - oneDay * 3, // 3 days ago
        customerId: customers[0]?.id || "",
        customerName: customers[0]?.name || "Ramesh Sharma",
        customerPhone: customers[0]?.phone || "9810012345",
      },
      {
        id: "sal_demo_5",
        billNo: "POS-1005",
        items: [
          {
            productId: products[4]?.id || "",
            name: products[4]?.name || "Maggi Noodles 280g",
            price: 60,
            gstRate: 18,
            qty: 6,
            taxAmount: 54.9,
            total: 360,
          },
        ],
        subtotal: 305.1,
        taxTotal: 54.9,
        grandTotal: 360,
        paymentMode: "upi",
        timestamp: now - oneDay * 5, // 5 days ago
        customerName: "UPI Customer",
      },
    ];

    const tx = db.transaction("sales", "readwrite");
    for (const sale of demoSales) {
      await tx.store.put(sale);
    }
    await tx.done;
    return true;
  } catch (err) {
    console.error("Failed to seed demo sales:", err);
    return false;
  }
}

// ----------------------------------------------------------------------
// Product CRUD & Inventory Transactions
// ----------------------------------------------------------------------
export async function getAllProducts(): Promise<Product[]> {
  if (typeof window === "undefined") return [];
  const db = await getDb();
  return db.getAll("products");
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (typeof window === "undefined") return undefined;
  const db = await getDb();
  return db.get("products", id);
}

export async function getProductByBarcode(barcode: string): Promise<Product | undefined> {
  if (typeof window === "undefined" || !barcode.trim()) return undefined;
  const db = await getDb();
  return db.getFromIndex("products", "by_barcode", barcode.trim());
}

export async function saveProduct(product: Product): Promise<string> {
  const db = await getDb();
  const now = Date.now();
  const id = product.id || "prd_" + Math.random().toString(36).substring(2, 9);
  const toSave: Product = {
    ...product,
    id,
    costPrice: Number(product.costPrice) || 0,
    salePrice: Number(product.salePrice) || 0,
    gstRate: Number(product.gstRate) || 0,
    stock: Number(product.stock) || 0,
    minStock: Number(product.minStock) || 0,
    createdAt: product.createdAt || now,
    updatedAt: now,
  };
  await db.put("products", toSave);
  return id;
}

export async function saveProductsBulk(products: Product[]): Promise<number> {
  const db = await getDb();
  const tx = db.transaction("products", "readwrite");
  const now = Date.now();
  let count = 0;

  for (const item of products) {
    const id = item.id || "prd_" + Math.random().toString(36).substring(2, 9);
    await tx.store.put({
      ...item,
      id,
      costPrice: Number(item.costPrice) || 0,
      salePrice: Number(item.salePrice) || 0,
      gstRate: Number(item.gstRate) || 0,
      stock: Number(item.stock) || 0,
      minStock: Number(item.minStock) || 0,
      createdAt: item.createdAt || now,
      updatedAt: now,
    });
    count++;
  }
  await tx.done;
  return count;
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("products", id);
}

export async function adjustStock(id: string, delta: number): Promise<number> {
  const db = await getDb();
  const tx = db.transaction("products", "readwrite");
  const product = await tx.store.get(id);
  if (!product) {
    throw new Error(`Product with ID "${id}" not found.`);
  }

  const updatedStock = Math.max(0, (product.stock || 0) + delta);
  product.stock = updatedStock;
  product.updatedAt = Date.now();
  await tx.store.put(product);
  await tx.done;
  return updatedStock;
}

export async function getLowStockProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.stock <= p.minStock);
}

// ----------------------------------------------------------------------
// Sales Transaction Engine
// ----------------------------------------------------------------------
export async function getAllSales(): Promise<Sale[]> {
  if (typeof window === "undefined") return [];
  const db = await getDb();
  const sales = await db.getAll("sales");
  return sales.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getSaleById(id: string): Promise<Sale | undefined> {
  if (typeof window === "undefined") return undefined;
  const db = await getDb();
  return db.get("sales", id);
}

export async function getNextBillNo(): Promise<string> {
  if (typeof window === "undefined") return "POS-1001";
  try {
    const db = await getDb();
    const count = await db.count("sales");
    const num = 1001 + count;
    return `POS-${num}`;
  } catch {
    return `POS-${Date.now().toString().slice(-4)}`;
  }
}

export async function recordSale(sale: Sale, deductStock = true): Promise<string> {
  const db = await getDb();
  const tx = db.transaction(["sales", "products", "customers", "ledger"], "readwrite");
  const saleStore = tx.objectStore("sales");
  const productStore = tx.objectStore("products");
  const customerStore = tx.objectStore("customers");
  const ledgerStore = tx.objectStore("ledger");

  const saleId = sale.id || "sal_" + Math.random().toString(36).substring(2, 9);
  const now = sale.timestamp || Date.now();

  const saleRecord: Sale = {
    ...sale,
    id: saleId,
    timestamp: now,
  };

  await saleStore.put(saleRecord);

  // 1. Automatically decrement inventory stock
  if (deductStock && sale.items && sale.items.length > 0) {
    for (const lineItem of sale.items) {
      if (!lineItem.productId) continue;
      const product = await productStore.get(lineItem.productId);
      if (product) {
        product.stock = Math.max(0, (product.stock || 0) - (lineItem.qty || 1));
        product.updatedAt = now;
        await productStore.put(product);
      }
    }
  }

  // 2. Customer Khata & Loyalty Points Updates
  if (sale.customerId) {
    const customer = await customerStore.get(sale.customerId);
    if (customer) {
      // If Khata (Udhaar) mode, add to customer's outstanding balance
      if (sale.paymentMode === "khata") {
        customer.creditBalance = (customer.creditBalance || 0) + sale.grandTotal;

        // Record a ledger debit entry
        await ledgerStore.put({
          id: "ldg_" + Math.random().toString(36).substring(2, 9),
          customerId: customer.id,
          type: "sale",
          billNo: sale.billNo,
          amount: sale.grandTotal,
          paymentMode: "khata",
          notes: `POS Bill #${sale.billNo}`,
          timestamp: now,
        });
      }

      // If loyalty points were redeemed
      if (sale.loyaltyPointsRedeemed && sale.loyaltyPointsRedeemed > 0) {
        customer.loyaltyPoints = Math.max(0, (customer.loyaltyPoints || 0) - sale.loyaltyPointsRedeemed);
      }

      // If loyalty points were awarded on this sale
      if (sale.loyaltyPointsAwarded && sale.loyaltyPointsAwarded > 0) {
        customer.loyaltyPoints = (customer.loyaltyPoints || 0) + sale.loyaltyPointsAwarded;
      }

      customer.updatedAt = now;
      await customerStore.put(customer);
    }
  }

  await tx.done;
  return saleId;
}

// ----------------------------------------------------------------------
// Customer Operations & Khata Ledger
// ----------------------------------------------------------------------
export async function getAllCustomers(): Promise<Customer[]> {
  if (typeof window === "undefined") return [];
  const db = await getDb();
  return db.getAll("customers");
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  if (typeof window === "undefined") return undefined;
  const db = await getDb();
  return db.get("customers", id);
}

export async function getCustomerByPhone(phone: string): Promise<Customer | undefined> {
  if (typeof window === "undefined" || !phone.trim()) return undefined;
  const db = await getDb();
  return db.getFromIndex("customers", "by_phone", phone.trim());
}

export async function saveCustomer(customer: Customer): Promise<string> {
  const db = await getDb();
  const now = Date.now();
  const id = customer.id || "cst_" + Math.random().toString(36).substring(2, 9);
  const toSave: Customer = {
    ...customer,
    id,
    creditBalance: Number(customer.creditBalance) || 0,
    loyaltyPoints: Number(customer.loyaltyPoints) || 0,
    createdAt: customer.createdAt || now,
    updatedAt: now,
  };
  await db.put("customers", toSave);
  return id;
}

export async function deleteCustomer(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("customers", id);
}

export async function getLedgerByCustomerId(customerId: string): Promise<LedgerEntry[]> {
  if (typeof window === "undefined") return [];
  const db = await getDb();
  const entries = await db.getAllFromIndex("ledger", "by_customerId", customerId);
  return entries.sort((a, b) => b.timestamp - a.timestamp);
}

export async function recordCustomerPayment(
  customerId: string,
  amount: number,
  paymentMode: PaymentMode = "cash",
  notes = "Payment received"
): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(["customers", "ledger"], "readwrite");
  const customerStore = tx.objectStore("customers");
  const ledgerStore = tx.objectStore("ledger");

  const customer = await customerStore.get(customerId);
  if (!customer) {
    throw new Error(`Customer ${customerId} not found.`);
  }

  const now = Date.now();
  customer.creditBalance = Math.max(0, (customer.creditBalance || 0) - amount);
  customer.updatedAt = now;
  await customerStore.put(customer);

  await ledgerStore.put({
    id: "ldg_" + Math.random().toString(36).substring(2, 9),
    customerId,
    type: "payment",
    amount,
    paymentMode,
    notes,
    timestamp: now,
  });

  await tx.done;
}
