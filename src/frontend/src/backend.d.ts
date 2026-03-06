import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MonthlyReport {
    month: string;
    staffTotals: Array<{
        staffName: string;
        entryCount: bigint;
        totalQuantity: bigint;
    }>;
    year: string;
    productTotals: Array<{
        productName: string;
        category: string;
        totalQuantity: bigint;
    }>;
}
export interface DailyReport {
    date: string;
    grandTotal: bigint;
    staffGroups: Array<{
        staffName: string;
        entries: Array<UsageEntry>;
        totalQuantity: bigint;
    }>;
}
export interface UsageEntry {
    id: bigint;
    staffName: string;
    staffId: bigint;
    clientName?: string;
    date: string;
    time: string;
    productId: bigint;
    productName: string;
    quantity: bigint;
}
export interface Product {
    id: bigint;
    active: boolean;
    name: string;
    category: string;
}
export interface Staff {
    id: bigint;
    active: boolean;
    name: string;
}
export interface backendInterface {
    addEntry(date: string, productId: bigint, productName: string, staffId: bigint, staffName: string, quantity: bigint, time: string, clientName: string | null): Promise<UsageEntry>;
    addProduct(name: string, category: string): Promise<Product>;
    addStaff(name: string): Promise<Staff>;
    deleteEntry(id: bigint): Promise<boolean>;
    deleteProduct(id: bigint): Promise<boolean>;
    deleteStaff(id: bigint): Promise<boolean>;
    getAllProducts(): Promise<Array<Product>>;
    getAllStaff(): Promise<Array<Staff>>;
    getDailyReport(_date: string): Promise<DailyReport>;
    getEntries(page: bigint, pageSize: bigint): Promise<{
        total: bigint;
        entries: Array<UsageEntry>;
    }>;
    getEntriesFiltered(productName: string | null, staffName: string | null, fromDate: string | null, toDate: string | null, page: bigint, pageSize: bigint): Promise<{
        total: bigint;
        entries: Array<UsageEntry>;
    }>;
    getMonthlyReport(_month: string, _year: string): Promise<MonthlyReport>;
    getProducts(): Promise<Array<Product>>;
    getStaff(): Promise<Array<Staff>>;
    updateProduct(id: bigint, name: string, category: string): Promise<Product | null>;
    updateStaff(id: bigint, name: string): Promise<Staff | null>;
}
