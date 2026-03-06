import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product, Staff, UsageEntry } from "../backend.d";
import { useActor } from "./useActor";

// ─── Products ─────────────────────────────────────────────────────────────────

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      category,
    }: { name: string; category: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addProduct(name, category);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      category,
    }: { id: bigint; name: string; category: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct(id, name, category);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export function useStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<Staff[]>({
    queryKey: ["allStaff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor");
      return actor.addStaff(name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["allStaff"] });
    },
  });
}

export function useUpdateStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: bigint; name: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateStaff(id, name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["allStaff"] });
    },
  });
}

export function useDeleteStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteStaff(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: ["allStaff"] });
    },
  });
}

// ─── Entries ──────────────────────────────────────────────────────────────────

export interface EntriesFilterParams {
  productName: string | null;
  staffName: string | null;
  fromDate: string | null;
  toDate: string | null;
  page: number;
  pageSize: number;
}

export function useEntriesFiltered(params: EntriesFilterParams) {
  const { actor, isFetching } = useActor();
  return useQuery<{ total: bigint; entries: UsageEntry[] }>({
    queryKey: ["entries", params],
    queryFn: async () => {
      if (!actor) return { total: BigInt(0), entries: [] };
      return actor.getEntriesFiltered(
        params.productName,
        params.staffName,
        params.fromDate,
        params.toDate,
        BigInt(params.page),
        BigInt(params.pageSize),
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      date: string;
      productId: bigint;
      productName: string;
      staffId: bigint;
      staffName: string;
      quantity: bigint;
      time: string;
      clientName: string | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addEntry(
        args.date,
        args.productId,
        args.productName,
        args.staffId,
        args.staffName,
        args.quantity,
        args.time,
        args.clientName,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteEntry(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export function useDailyReport(date: string, enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dailyReport", date],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailyReport(date);
    },
    enabled: !!actor && !isFetching && enabled && !!date,
  });
}

export function useMonthlyReport(
  month: string,
  year: string,
  enabled: boolean,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["monthlyReport", month, year],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMonthlyReport(month, year);
    },
    enabled: !!actor && !isFetching && enabled && !!month && !!year,
  });
}
