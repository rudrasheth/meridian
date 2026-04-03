"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/utils";
import { Shield, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export default function AuditPage() {
  const { transactions, role } = useStore();

  // Build audit log from transactions
  const auditLogs = transactions.map((tx, i) => ({
    id: tx.id,
    timestamp: `${tx.date} ${String(9 + (i % 12)).padStart(2, "0")}:${String((i * 17) % 60).padStart(2, "0")}`,
    action: tx.type === "income" ? "CREDIT" : "DEBIT",
    description: tx.description,
    amount: tx.amount,
    user: "admin@meridian.io",
    status: tx.status,
  }));

  const completed = auditLogs.filter((l) => l.status === "completed").length;
  const pending = auditLogs.filter((l) => l.status === "pending").length;
  const failed = auditLogs.filter((l) => l.status === "failed").length;

  return (
    <div className="flex-1 min-h-screen">
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 animate-reveal">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            ◆ Compliance
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Audit Trail
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Complete log of all system actions and transaction events.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-reveal delay-1">
          <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius)', background: 'var(--positive-bg)', color: 'var(--positive)' }}><CheckCircle size={20} /></div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Completed</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text-primary)' }}>{completed}</p>
            </div>
          </div>
          <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius)', background: 'var(--pending-bg)', color: 'var(--pending)' }}><Clock size={20} /></div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pending</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text-primary)' }}>{pending}</p>
            </div>
          </div>
          <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius)', background: 'var(--negative-bg)', color: 'var(--negative)' }}><AlertTriangle size={20} /></div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Failed</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text-primary)' }}>{failed}</p>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="card animate-reveal delay-2" style={{ overflow: 'hidden' }}>
          <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-1)' }}>
            <Shield size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)' }}>Event Log</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>{auditLogs.length} events</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Timestamp</th>
                  <th style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Action</th>
                  <th style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Description</th>
                  <th style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="transition-colors duration-150"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                        padding: '3px 8px', borderRadius: '4px',
                        background: log.action === "CREDIT" ? 'var(--positive-bg)' : 'var(--negative-bg)',
                        color: log.action === "CREDIT" ? 'var(--positive)' : 'var(--negative)',
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)' }}>{log.description}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-primary)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(log.amount)}</td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{log.user}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div className="flex items-center gap-2">
                        <div style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          background: log.status === "completed" ? 'var(--positive)' : log.status === "pending" ? 'var(--pending)' : 'var(--negative)',
                        }} />
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: '13px',
                          color: log.status === "completed" ? 'var(--positive)' : log.status === "pending" ? 'var(--pending)' : 'var(--negative)',
                        }}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </div>
                    </td>
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
