export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  status: "completed" | "pending" | "failed";
}

export type UserRole = "Admin" | "Viewer";

export interface DashboardState {
  role: UserRole;
  searchQuery: string;
  categoryFilter: string;
  dateRange: {
    from: string;
    to: string;
  };
}
