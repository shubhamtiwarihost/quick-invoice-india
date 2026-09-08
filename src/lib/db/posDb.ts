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
  unit?: string;
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
  discount?: number;
  discountType?: "percent" | "flat";
  notes?: string;
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
  status?: "completed" | "voided";
  voidReason?: string;
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

export interface Shift {
  id: string;
  startTime: number;
  endTime?: number;
  openingCash: number;
  closingCash?: number;
  expectedCash?: number;
  cashSales: number;
  upiSales: number;
  cardSales: number;
  totalSales: number;
  status: "open" | "closed";
  notes?: string;
}

export interface HeldTicket {
  id: string;
  name: string;
  items: SaleItem[];
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  note?: string;
  createdAt: number;
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
  shifts: {
    key: string;
    value: Shift;
    indexes: {
      by_status: string;
      by_startTime: number;
    };
  };
  held_tickets: {
    key: string;
    value: HeldTicket;
    indexes: {
      by_createdAt: number;
    };
  };
}

const DB_NAME = "swiftgst_pos_db";
const DB_VERSION = 3;

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

        // 5. Shifts Store
        if (!db.objectStoreNames.contains("shifts")) {
          const shiftStore = db.createObjectStore("shifts", { keyPath: "id" });
          shiftStore.createIndex("by_status", "status");
          shiftStore.createIndex("by_startTime", "startTime");
        }

        // 6. Held Tickets Store
        if (!db.objectStoreNames.contains("held_tickets")) {
          const heldStore = db.createObjectStore("held_tickets", { keyPath: "id" });
          heldStore.createIndex("by_createdAt", "createdAt");
        }
      },
    });
  }

  return dbPromise;
}

// ----------------------------------------------------------------------
// Sample Catalog & Customer Seeds (Disabled for Clean Zero-State)
// ----------------------------------------------------------------------
export const DEMO_PRODUCTS: Omit<Product, "id">[] = [];

export const DEMO_CUSTOMERS: Omit<Customer, "id">[] = [];

export async function purgeDemoSeedDataIfPresent(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await getDb();

    // 1. Purge demo sales
    const sales = await db.getAll("sales");
    for (const s of sales) {
      if (s.id && (s.id.startsWith("sal_demo_") || s.billNo === "POS-1001" || s.billNo === "POS-1002" || s.billNo === "POS-1003")) {
        await db.delete("sales", s.id);
      }
    }

    // 2. Purge demo products
    const demoBarcodes = new Set([
      "8901030383321",
      "8906007280012",
      "8901262010057",
      "8901725181223",
      "8901058852441",
      "8901396316209",
      "9002490100070",
    ]);
    const products = await db.getAll("products");
    for (const p of products) {
      if (p.barcode && demoBarcodes.has(p.barcode)) {
        await db.delete("products", p.id);
      }
    }

    // 3. Purge demo customers
    const demoPhones = new Set(["9810012345", "9820067890", "9830045678", "9840098765"]);
    const customers = await db.getAll("customers");
    for (const c of customers) {
      if (demoPhones.has(c.phone)) {
        await db.delete("customers", c.id);
      }
    }

    // 4. Purge demo ledger entries
    const ledger = await db.getAll("ledger");
    for (const l of ledger) {
      if (l.billNo === "BILL-INIT") {
        await db.delete("ledger", l.id);
      }
    }
  } catch (err) {
    console.error("Error purging demo data:", err);
  }
}

export async function seedInitialInventoryIfEmpty(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  await purgeDemoSeedDataIfPresent();
  return false;
}

export async function seedInitialCustomersIfEmpty(): Promise<boolean> {
  return false;
}

export async function seedInitialSalesIfEmpty(): Promise<boolean> {
  return false;
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

export async function voidSale(saleId: string, reason = "Customer return / void"): Promise<Sale> {
  const db = await getDb();
  const tx = db.transaction(["sales", "products", "customers", "ledger"], "readwrite");
  const saleStore = tx.objectStore("sales");
  const productStore = tx.objectStore("products");
  const customerStore = tx.objectStore("customers");
  const ledgerStore = tx.objectStore("ledger");

  const sale = await saleStore.get(saleId);
  if (!sale) {
    throw new Error(`Sale ${saleId} not found.`);
  }
  if (sale.status === "voided") {
    throw new Error(`Sale #${sale.billNo} is already voided.`);
  }

  const now = Date.now();

  // 1. Restore product inventory stock atomically
  if (sale.items && sale.items.length > 0) {
    for (const item of sale.items) {
      if (!item.productId) continue;
      const product = await productStore.get(item.productId);
      if (product) {
        product.stock = (product.stock || 0) + (item.qty || 1);
        product.updatedAt = now;
        await productStore.put(product);
      }
    }
  }

  // 2. Reverse Khata debt if paymentMode was khata
  if (sale.customerId) {
    const customer = await customerStore.get(sale.customerId);
    if (customer) {
      if (sale.paymentMode === "khata") {
        customer.creditBalance = Math.max(0, (customer.creditBalance || 0) - sale.grandTotal);
        await ledgerStore.put({
          id: "ldg_" + Math.random().toString(36).substring(2, 9),
          customerId: customer.id,
          type: "payment",
          billNo: sale.billNo,
          amount: sale.grandTotal,
          paymentMode: "khata",
          notes: `Void Bill #${sale.billNo}: ${reason}`,
          timestamp: now,
        });
      }

      // Reverse loyalty points awarded
      if (sale.loyaltyPointsAwarded && sale.loyaltyPointsAwarded > 0) {
        customer.loyaltyPoints = Math.max(0, (customer.loyaltyPoints || 0) - sale.loyaltyPointsAwarded);
      }

      // Restore loyalty points redeemed
      if (sale.loyaltyPointsRedeemed && sale.loyaltyPointsRedeemed > 0) {
        customer.loyaltyPoints = (customer.loyaltyPoints || 0) + sale.loyaltyPointsRedeemed;
      }

      customer.updatedAt = now;
      await customerStore.put(customer);
    }
  }

  // 3. Mark sale as voided
  const voidedSale: Sale = {
    ...sale,
    status: "voided",
    voidReason: reason,
  };
  await saleStore.put(voidedSale);

  await tx.done;
  return voidedSale;
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

// ----------------------------------------------------------------------
// Shift Management & Cash Drawer Functions
// ----------------------------------------------------------------------
export async function getActiveShift(): Promise<Shift | null> {
  if (typeof window === "undefined") return null;
  const db = await getDb();
  const openShifts = await db.getAllFromIndex("shifts", "by_status", "open");
  if (!openShifts || openShifts.length === 0) return null;
  // Sort descending by startTime to get latest
  openShifts.sort((a, b) => b.startTime - a.startTime);
  return openShifts[0];
}

export async function startShift(openingCash: number, notes?: string): Promise<Shift> {
  const db = await getDb();
  const existing = await getActiveShift();
  if (existing) {
    return existing;
  }

  const newShift: Shift = {
    id: "sft_" + Math.random().toString(36).substring(2, 9),
    startTime: Date.now(),
    openingCash: Number(openingCash) || 0,
    cashSales: 0,
    upiSales: 0,
    cardSales: 0,
    totalSales: 0,
    status: "open",
    notes,
  };

  await db.put("shifts", newShift);
  return newShift;
}

export async function getShiftSalesSummary(shiftStartTime: number): Promise<{
  cashSales: number;
  upiSales: number;
  cardSales: number;
  splitSales: number;
  totalSales: number;
  transactionCount: number;
}> {
  if (typeof window === "undefined") {
    return { cashSales: 0, upiSales: 0, cardSales: 0, splitSales: 0, totalSales: 0, transactionCount: 0 };
  }
  const db = await getDb();
  // Fetch all sales and filter by shiftStartTime
  const allSales = await db.getAll("sales");
  const sales = allSales.filter((s) => s.timestamp >= shiftStartTime && s.status !== "voided");

  let cashSales = 0;
  let upiSales = 0;
  let cardSales = 0;
  let splitSales = 0;
  let totalSales = 0;

  for (const s of sales) {
    totalSales += s.grandTotal || 0;
    if (s.paymentMode === "cash") {
      cashSales += s.grandTotal || 0;
    } else if (s.paymentMode === "upi") {
      upiSales += s.grandTotal || 0;
    } else if (s.paymentMode === "card") {
      cardSales += s.grandTotal || 0;
    } else if (s.paymentMode === "split") {
      // split: half cash, half online
      cashSales += (s.grandTotal || 0) / 2;
      upiSales += (s.grandTotal || 0) / 2;
      splitSales += s.grandTotal || 0;
    }
  }

  return {
    cashSales,
    upiSales,
    cardSales,
    splitSales,
    totalSales,
    transactionCount: sales.length,
  };
}

export async function closeShift(
  shiftId: string,
  closingPhysicalCash: number,
  notes?: string
): Promise<Shift> {
  const db = await getDb();
  const shift = await db.get("shifts", shiftId);
  if (!shift) {
    throw new Error(`Shift ${shiftId} not found.`);
  }

  const now = Date.now();
  const salesSummary = await getShiftSalesSummary(shift.startTime);
  const expectedCash = (shift.openingCash || 0) + salesSummary.cashSales;

  const closedShift: Shift = {
    ...shift,
    endTime: now,
    closingCash: Number(closingPhysicalCash) || 0,
    expectedCash,
    cashSales: salesSummary.cashSales,
    upiSales: salesSummary.upiSales,
    cardSales: salesSummary.cardSales,
    totalSales: salesSummary.totalSales,
    status: "closed",
    notes: notes || shift.notes,
  };

  await db.put("shifts", closedShift);
  return closedShift;
}

export async function getAllShifts(): Promise<Shift[]> {
  if (typeof window === "undefined") return [];
  const db = await getDb();
  const shifts = await db.getAll("shifts");
  return shifts.sort((a, b) => b.startTime - a.startTime);
}

// ----------------------------------------------------------------------
// Held Tickets / Open Bills Functions
// ----------------------------------------------------------------------
export async function getHeldTickets(): Promise<HeldTicket[]> {
  if (typeof window === "undefined") return [];
  const db = await getDb();
  const tickets = await db.getAll("held_tickets");
  return tickets.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveHeldTicket(
  ticket: Omit<HeldTicket, "id" | "createdAt"> & { id?: string }
): Promise<string> {
  const db = await getDb();
  const id = ticket.id || "tkt_" + Math.random().toString(36).substring(2, 9);
  const now = Date.now();
  const toSave: HeldTicket = {
    ...ticket,
    id,
    createdAt: now,
  };
  await db.put("held_tickets", toSave);
  return id;
}

export async function deleteHeldTicket(ticketId: string): Promise<void> {
  const db = await getDb();
  await db.delete("held_tickets", ticketId);
}
