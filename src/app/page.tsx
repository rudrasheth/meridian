"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { StatCard } from "@/components/Dashboard/StatCard";
import { BalanceTrend, CategorySpending } from "@/components/Dashboard/Charts";
import { TransactionsTable } from "@/components/Dashboard/TransactionsTable";
import { Transaction } from "@/types";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  AlertCircle,
  Search,
  Download,
  Plus,
  Filter,
  FileText,
  FileJson,
  ChevronDown,
  Calendar,
  Layers,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const {
    role, searchQuery, setSearchQuery,
    categoryFilter, setCategoryFilter,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    dateRange, setDateRange,
    groupBy, setGroupBy,
    transactions: storeTransactions,
    addTransaction,
  } = useStore();

  const [chartInterval, setChartInterval] = useState("Monthly");
  const [exportOpen, setExportOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close export dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const transactions = useMemo(() => {
    return storeTransactions.filter((tx) => {
      const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || tx.category === categoryFilter;
      const matchesType = typeFilter === "All" || tx.type === typeFilter;
      const matchesStatus = statusFilter === "All" || tx.status === statusFilter;
      const matchesDateFrom = !dateRange.from || tx.date >= dateRange.from;
      const matchesDateTo = !dateRange.to || tx.date <= dateRange.to;
      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [searchQuery, categoryFilter, typeFilter, statusFilter, dateRange, storeTransactions]);

  // Group transactions
  const groupedTransactions = useMemo(() => {
    if (groupBy === "none") return null;
    const groups: Record<string, Transaction[]> = {};
    transactions.forEach((tx) => {
      let key = "";
      switch (groupBy) {
        case "category": key = tx.category; break;
        case "type": key = tx.type === "income" ? "Income" : "Expense"; break;
        case "status": key = tx.status.charAt(0).toUpperCase() + tx.status.slice(1); break;
        case "date": key = tx.date; break;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [transactions, groupBy]);

  const stats = useMemo(() => {
    const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = transactions.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
    return { balance: totalIncome - totalExpenses, income: totalIncome, expenses: totalExpenses };
  }, [transactions]);

  const insights = useMemo(() => {
    const spendingByCategory = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc: Record<string, number>, tx) => { acc[tx.category] = (acc[tx.category] || 0) + tx.amount; return acc; }, {});
    const highestCategory = Object.entries(spendingByCategory).reduce(
      (max: { cat: string; val: number }, [cat, val]) => (val > max.val ? { cat, val } : max), { cat: "N/A", val: 0 }
    );
    const budgetGoal = 3200;
    const utilization = (stats.expenses / budgetGoal) * 100;
    return { highestCategory, utilization };
  }, [transactions, stats]);

  const categories = ["All", ...Array.from(new Set(storeTransactions.map((tx) => tx.category)))];

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (typeFilter !== "All") count++;
    if (statusFilter !== "All") count++;
    if (dateRange.from) count++;
    if (dateRange.to) count++;
    if (groupBy !== "none") count++;
    return count;
  }, [typeFilter, statusFilter, dateRange, groupBy]);

  const handleNewEntry = () => {
    const description = prompt("Enter transaction description:");
    if (!description) return;
    const amount = parseFloat(prompt("Enter amount:") || "0");
    const category = prompt("Enter category (e.g. Food & Dining, Rent, Income):") || "General";
    addTransaction({
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      description, amount, category,
      type: amount > 0 ? "income" : "expense",
      status: "completed"
    });
  };

  const handleExportCSV = useCallback(() => {
    const header = "Date,Description,Category,Type,Amount,Status\n";
    const body = transactions.map(tx => `${tx.date},"${tx.description}",${tx.category},${tx.type},${tx.amount},${tx.status}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meridian_ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  }, [transactions]);

  const handleExportJSON = useCallback(() => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalTransactions: transactions.length,
      summary: {
        totalIncome: stats.income,
        totalExpenses: stats.expenses,
        netBalance: stats.balance,
      },
      filters: {
        search: searchQuery || null,
        category: categoryFilter !== "All" ? categoryFilter : null,
        type: typeFilter !== "All" ? typeFilter : null,
        status: statusFilter !== "All" ? statusFilter : null,
        dateRange: dateRange.from || dateRange.to ? dateRange : null,
      },
      transactions,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meridian_ledger_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  }, [transactions, stats, searchQuery, categoryFilter, typeFilter, statusFilter, dateRange]);

  return (
    <div className="flex-1 min-h-screen">
      {/* Hero Section */}
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-reveal">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
                ◆ Fiscal Year 2024
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                Your Portfolio
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                A clear view of your financial health and capital efficiency.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Export Dropdown */}
              <div ref={exportRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setExportOpen(!exportOpen)}
                  className="flex items-center gap-2 transition-all rounded-lg"
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
                    padding: '10px 18px', color: exportOpen ? 'var(--accent)' : 'var(--text-secondary)',
                    border: `1px solid ${exportOpen ? 'var(--accent)' : 'var(--border)'}`,
                    background: 'var(--surface-1)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={(e) => { if (!exportOpen) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                >
                  <Download size={16} /> Export <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: exportOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                {exportOpen && (
                  <div className="export-dropdown">
                    <button onClick={handleExportCSV}>
                      <FileText size={16} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>Export CSV</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Spreadsheet format</div>
                      </div>
                    </button>
                    <button onClick={handleExportJSON}>
                      <FileJson size={16} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>Export JSON</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Structured data</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {role === "Admin" && (
                <button
                  onClick={handleNewEntry}
                  className="flex items-center gap-2 transition-all active:scale-95 rounded-lg"
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                    padding: '10px 18px', background: 'var(--accent)', color: '#fff', border: 'none',
                  }}
                >
                  <Plus size={16} /> New Entry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard title="Net Position" value={stats.balance} change={12.4} icon={<Wallet size={20} />} delay={0.06} />
          <StatCard title="Total Income" value={stats.income} change={4.2} icon={<ArrowUpRight size={20} />} delay={0.12} />
          <StatCard title="Total Expenses" value={stats.expenses} change={-1.8} icon={<ArrowDownRight size={20} />} delay={0.18} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-reveal delay-3">
          {/* Main Chart */}
          <div className="lg:col-span-8 card" style={{ padding: '28px' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-primary)' }}>
                  Balance Trend
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Net worth over the current quarter
                </p>
              </div>
              <div className="flex gap-0 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {["Daily", "Weekly", "Monthly"].map(t => (
                  <button
                    key={t}
                    onClick={() => setChartInterval(t)}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      padding: '8px 14px',
                      background: chartInterval === t ? 'var(--accent)' : 'var(--surface-1)',
                      color: chartInterval === t ? '#fff' : 'var(--text-muted)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <BalanceTrend data={transactions} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Budget Insight */}
            <div className="card" style={{ padding: '24px', flex: 1 }}>
              <div className="flex items-center gap-2 mb-5">
                <div style={{ padding: '8px', borderRadius: 'var(--radius)', background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  <PiggyBank size={18} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Budget Status
                </span>
              </div>

              <div className="mb-5">
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '44px', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {(100 - insights.utilization).toFixed(0)}%
                </span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  of your budget remains available this month
                </p>
              </div>

              <div className="space-y-3">
                <div style={{ height: '8px', width: '100%', background: 'var(--surface-2)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%', width: `${Math.min(insights.utilization, 100)}%`,
                      background: insights.utilization > 90 ? 'var(--negative)' : 'var(--accent)',
                      borderRadius: '99px', transition: 'width 1s ease',
                    }}
                  />
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  You&apos;ve spent <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(stats.expenses)}</strong> of your <strong style={{ color: 'var(--text-primary)' }}>$3,200</strong> monthly budget.
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="card" style={{ padding: '24px' }}>
              <div className="flex items-center justify-between mb-5" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Spending by Category
                </span>
                <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
              <CategorySpending data={transactions} />
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="animate-reveal delay-4">
          <div className="card" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: '15px', width: '100%',
                    paddingLeft: '40px', paddingRight: '14px', paddingTop: '11px', paddingBottom: '11px',
                    background: 'var(--surface-0)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', color: 'var(--text-primary)', outline: 'none',
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginRight: '4px' }}>
                  Filter:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className="rounded-full transition-all"
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: categoryFilter === cat ? 600 : 400,
                      padding: '6px 14px', whiteSpace: 'nowrap',
                      background: categoryFilter === cat ? 'var(--accent)' : 'var(--surface-0)',
                      color: categoryFilter === cat ? '#fff' : 'var(--text-secondary)',
                      border: `1px solid ${categoryFilter === cat ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <div className="flex items-center gap-2">
                <Filter size={14} style={{ color: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Advanced Filters & Grouping
                </span>
                {activeFilterCount > 0 && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                    padding: '2px 8px', borderRadius: '20px',
                    background: 'var(--accent)', color: '#fff',
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: showAdvancedFilters ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="px-5 py-4 space-y-4" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
                <div className="flex flex-wrap gap-6">
                  {/* Type Filter */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Type
                    </label>
                    <div className="filter-group">
                      {(["All", "income", "expense"] as const).map((t) => (
                        <button key={t} onClick={() => setTypeFilter(t)} className={`filter-pill ${typeFilter === t ? 'filter-pill--active' : 'filter-pill--inactive'}`}>
                          {t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Status
                    </label>
                    <div className="filter-group">
                      {(["All", "completed", "pending", "failed"] as const).map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)} className={`filter-pill ${statusFilter === s ? 'filter-pill--active' : 'filter-pill--inactive'}`}>
                          {s === "All" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group By */}
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      <Layers size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      Group By
                    </label>
                    <div className="filter-group">
                      {(["none", "category", "type", "status", "date"] as const).map((g) => (
                        <button key={g} onClick={() => setGroupBy(g)} className={`filter-pill ${groupBy === g ? 'filter-pill--active' : 'filter-pill--inactive'}`}>
                          {g === "none" ? "None" : g.charAt(0).toUpperCase() + g.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      <Calendar size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      From
                    </label>
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(e.target.value, dateRange.to)}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '12px',
                        padding: '8px 12px', borderRadius: '6px',
                        border: '1px solid var(--border)', background: 'var(--surface-0)',
                        color: 'var(--text-primary)', outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      To
                    </label>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(dateRange.from, e.target.value)}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '12px',
                        padding: '8px 12px', borderRadius: '6px',
                        border: '1px solid var(--border)', background: 'var(--surface-0)',
                        color: 'var(--text-primary)', outline: 'none',
                      }}
                    />
                  </div>
                  {(dateRange.from || dateRange.to || typeFilter !== "All" || statusFilter !== "All" || groupBy !== "none") && (
                    <button
                      onClick={() => {
                        setTypeFilter("All");
                        setStatusFilter("All");
                        setDateRange("", "");
                        setGroupBy("none");
                      }}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                        padding: '8px 14px', borderRadius: '6px',
                        color: 'var(--negative)', background: 'var(--negative-bg)',
                        border: 'none', cursor: 'pointer',
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Table Header */}
            <div className="flex items-center justify-between px-5 py-3.5" style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-primary)' }}>
                Recent Transactions
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                  {transactions.length} records
                </span>
              </h3>
              {role === "Viewer" && (
                <div className="flex items-center gap-2 rounded-full" style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                  color: 'var(--pending)', background: 'var(--pending-bg)',
                  padding: '5px 12px', border: '1px solid rgba(146, 64, 14, 0.2)',
                }}>
                  <AlertCircle size={14} /> Read-Only Mode
                </div>
              )}
            </div>

            {/* Grouped or flat table */}
            {groupedTransactions ? (
              <div>
                {groupedTransactions.map(([groupName, items]) => (
                  <div key={groupName}>
                    <div className="group-header">
                      <span>{groupName}</span>
                      <span className="count">{items.length}</span>
                    </div>
                    <TransactionsTable data={items} role={role} />
                  </div>
                ))}
              </div>
            ) : (
              <TransactionsTable data={transactions} role={role} />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', marginTop: '32px' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-6 text-center">
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
            Meridian Capital Intelligence · © 2024 · All Rights Reserved
          </span>
        </div>
      </footer>
    </div>
  );
}
