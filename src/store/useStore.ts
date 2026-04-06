import { create } from "zustand";
import { UserRole, Transaction } from "@/types";
import { mockApi, loadTransactions, saveTransactions, loadTheme, saveTheme, loadRole, saveRole } from "@/lib/mockApi";

export interface Toast {
  id: string;
  message: string;
  type?: "success" | "info" | "error";
}

interface DashboardStore {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  initTheme: () => void;

  // Role
  role: UserRole;
  setRole: (role: UserRole) => void;

  // Filters
  searchQuery: string;
  categoryFilter: string;
  typeFilter: "All" | "income" | "expense";
  statusFilter: "All" | "completed" | "pending" | "failed";
  dateRange: { from: string; to: string };
  groupBy: "none" | "category" | "type" | "status" | "date";

  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setTypeFilter: (type: "All" | "income" | "expense") => void;
  setStatusFilter: (status: "All" | "completed" | "pending" | "failed") => void;
  setDateRange: (from: string, to: string) => void;
  setGroupBy: (groupBy: "none" | "category" | "type" | "status" | "date") => void;

  // Data
  transactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;

  // Hydration
  hydrated: boolean;
  hydrate: () => void;
}

export const useStore = create<DashboardStore>((set, get) => ({
  // Theme
  theme: "light",
  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    saveTheme(next);
    set({ theme: next });
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
    get().addToast(`Switched to ${next} mode`, "info");
  },
  initTheme: () => {
    const stored = loadTheme();
    set({ theme: stored });
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  },

  // Role
  role: "Viewer",
  setRole: (role) => {
    saveRole(role);
    set({ role });
    get().addToast(`Access Level changed to ${role}`, "success");
  },

  // Filters
  searchQuery: "",
  categoryFilter: "All",
  typeFilter: "All",
  statusFilter: "All",
  dateRange: { from: "", to: "" },
  groupBy: "none",

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setDateRange: (from, to) => set({ dateRange: { from, to } }),
  setGroupBy: (groupBy) => set({ groupBy }),

  // Data
  transactions: [],
  isLoading: false,
  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const { data } = await mockApi.fetchTransactions();
      set({ transactions: data });
    } finally {
      set({ isLoading: false });
    }
  },
  setTransactions: (transactions) => {
    saveTransactions(transactions);
    set({ transactions });
  },
  addTransaction: async (tx) => {
    await mockApi.createTransaction(tx);
    set((state) => {
      const updated = [tx, ...state.transactions];
      saveTransactions(updated);
      return { transactions: updated };
    });
  },
  deleteTransaction: async (id) => {
    await mockApi.deleteTransaction(id);
    set((state) => {
      const updated = state.transactions.filter((tx) => tx.id !== id);
      saveTransactions(updated);
      return { transactions: updated };
    });
  },
  updateTransaction: async (id, updates) => {
    await mockApi.updateTransaction(id, updates);
    set((state) => {
      const updated = state.transactions.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx));
      saveTransactions(updated);
      return { transactions: updated };
    });
  },

  // Toasts
  toasts: [],
  addToast: (message, type = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    // Auto remove after 3s
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Hydration
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    const transactions = loadTransactions();
    const theme = loadTheme();
    const role = loadRole();
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    set({ transactions, theme, role, hydrated: true });
  },
}));
