"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

const mockMarketData = [
  { symbol: "SPY", name: "S&P 500 ETF", price: 512.34, change: 1.24, volume: "82.3M" },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", price: 438.91, change: -0.67, volume: "45.1M" },
  { symbol: "DIA", name: "Dow Jones ETF", price: 389.12, change: 0.52, volume: "12.7M" },
  { symbol: "IWM", name: "Russell 2000 ETF", price: 201.45, change: -1.13, volume: "28.9M" },
  { symbol: "GLD", name: "Gold ETF", price: 215.80, change: 0.89, volume: "9.4M" },
  { symbol: "TLT", name: "Treasury Bond ETF", price: 92.34, change: -0.31, volume: "18.2M" },
  { symbol: "VTI", name: "Total Market ETF", price: 264.78, change: 0.73, volume: "5.6M" },
  { symbol: "BTC", name: "Bitcoin Trust", price: 68450.00, change: 2.41, volume: "31.2M" },
];

export default function MarketPage() {
  const { transactions } = useStore();
  const [sortField, setSortField] = useState<"symbol" | "price" | "change">("symbol");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const totalPortfolio = transactions
    .reduce((sum, tx) => sum + (tx.type === "income" ? tx.amount : -tx.amount), 0);

  const handleSort = (field: "symbol" | "price" | "change") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sorted = [...mockMarketData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const gainers = mockMarketData.filter((m) => m.change > 0).length;
  const losers = mockMarketData.filter((m) => m.change < 0).length;

  return (
    <div className="flex-1 min-h-screen">
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 animate-reveal">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            ◆ Market Watch
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Capital Markets
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Track market indices and benchmark performance.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-reveal delay-1">
          <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Portfolio Value</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--text-primary)' }}>{formatCurrency(totalPortfolio)}</p>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Gainers</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--positive)' }}>{gainers}</p>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Losers</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--negative)' }}>{losers}</p>
          </div>
        </div>

        {/* Market Table */}
        <div className="card animate-reveal delay-2" style={{ overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  <th onClick={() => handleSort("symbol")} className="cursor-pointer" style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Symbol</th>
                  <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Name</th>
                  <th onClick={() => handleSort("price")} className="cursor-pointer" style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>Price</th>
                  <th onClick={() => handleSort("change")} className="cursor-pointer" style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>Change</th>
                  <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>Volume</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((item) => (
                  <tr
                    key={item.symbol}
                    className="transition-colors duration-150"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>{item.symbol}</td>
                    <td style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-primary)' }}>{item.name}</td>
                    <td style={{ padding: '16px 20px', fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(item.price)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <span className="inline-flex items-center gap-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: item.change >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                        {item.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {item.change >= 0 ? "+" : ""}{item.change}%
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right' }}>{item.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
