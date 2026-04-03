"use client";

import React, { useState } from "react";
import { Transaction, UserRole } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Edit2, Trash2, ArrowUpDown, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";

interface TableProps {
  data: Transaction[];
  role: UserRole;
}

export const TransactionsTable: React.FC<TableProps> = ({ data, role }) => {
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full overflow-hidden card" style={{ borderRadius: 'var(--radius)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              <th
                className="cursor-pointer group"
                style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-2">
                  Date <ArrowUpDown size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </th>
              <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Description
              </th>
              <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Category
              </th>
              <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>
                Amount
              </th>
              <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Status
              </th>
              {role === "Admin" && (
                <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((tx) => (
              <tr
                key={tx.id}
                className="group transition-colors duration-150"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div className="flex flex-col gap-0.5">
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {tx.description}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                      {tx.id.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: '6px',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                  }}>
                    {tx.category}
                  </span>
                </td>
                <td style={{
                  padding: '16px 20px', fontFamily: 'var(--font-display)', fontSize: '17px',
                  textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                  color: tx.type === "income" ? 'var(--positive)' : 'var(--text-primary)',
                  fontWeight: tx.type === "income" ? 600 : 400,
                }}>
                  {tx.type === "income" ? "+" : "–"}{formatCurrency(tx.amount)}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: tx.status === "completed" ? 'var(--positive)' : tx.status === "pending" ? 'var(--pending)' : 'var(--negative)',
                      }}
                    />
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
                      color: tx.status === "completed" ? 'var(--positive)' : tx.status === "pending" ? 'var(--pending)' : 'var(--negative)',
                    }}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </td>
                {role === "Admin" && (
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div className="flex justify-end gap-1">
                      <button
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        title="Edit"
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Remove this transaction?")) {
                            useStore.getState().deleteTransaction(tx.id);
                          }
                        }}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        title="Delete"
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--negative)'; e.currentTarget.style.borderColor = 'var(--negative)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedData.length === 0 && (
        <div className="py-16 text-center">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
            style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
          >
            <ChevronRight className="w-6 h-6 rotate-90" />
          </div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)' }}>
            No Records Found
          </h4>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Adjust your search or filters to see results.
          </p>
        </div>
      )}
    </div>
  );
};
