"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { TransactionsTable } from "@/components/Dashboard/TransactionsTable";

export default function LedgerPage() {
  const { transactions, role } = useStore();

  return (
    <div className="flex-1 min-h-screen">
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 animate-reveal">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            ◆ Complete Record
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Master Ledger
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Complete history of all your transactions in one place.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 animate-reveal delay-1">
        <div className="card" style={{ overflow: 'hidden' }}>
          <TransactionsTable data={transactions} role={role} />
        </div>
      </div>
    </div>
  );
}
