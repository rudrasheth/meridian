import { Transaction } from "@/types";
import { mockTransactions } from "./mockData";

const STORAGE_KEY = "meridian_transactions";
const THEME_KEY = "meridian_theme";
const ROLE_KEY = "meridian_role";

// Simulate network delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200));

// ─── LocalStorage helpers ───────────────────────────────────────
export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return mockTransactions;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTransactions));
  return [...mockTransactions];
}

export function saveTransactions(transactions: Transaction[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function loadTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
}

export function saveTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
}

export function loadRole(): "Admin" | "Viewer" {
  if (typeof window === "undefined") return "Admin";
  return (localStorage.getItem(ROLE_KEY) as "Admin" | "Viewer") || "Admin";
}

export function saveRole(role: "Admin" | "Viewer") {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
}

// ─── Mock API endpoints ─────────────────────────────────────────
export const mockApi = {
  async fetchTransactions(): Promise<{ data: Transaction[]; total: number }> {
    await delay(400);
    const data = loadTransactions();
    return { data, total: data.length };
  },

  async createTransaction(tx: Transaction): Promise<{ data: Transaction; success: boolean }> {
    await delay(300);
    const transactions = loadTransactions();
    transactions.unshift(tx);
    saveTransactions(transactions);
    return { data: tx, success: true };
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<{ data: Transaction; success: boolean }> {
    await delay(300);
    const transactions = loadTransactions();
    const idx = transactions.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Transaction not found");
    transactions[idx] = { ...transactions[idx], ...updates };
    saveTransactions(transactions);
    return { data: transactions[idx], success: true };
  },

  async deleteTransaction(id: string): Promise<{ success: boolean }> {
    await delay(200);
    const transactions = loadTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    saveTransactions(filtered);
    return { success: true };
  },
};
