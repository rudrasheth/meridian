"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { CategorySpending, BalanceTrend } from "@/components/Dashboard/Charts";

export default function AnalyticsPage() {
  const { transactions } = useStore();

  return (
    <div className="flex-1 min-h-screen">
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 animate-reveal">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            ◆ Insights
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Analytics
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Understand where your money goes and how it grows.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card animate-reveal delay-1" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '20px' }}>
              Balance Trend
            </h3>
            <BalanceTrend data={transactions} />
          </div>
          <div className="card animate-reveal delay-2" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)', marginBottom: '20px' }}>
              Spending Breakdown
            </h3>
            <CategorySpending data={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
