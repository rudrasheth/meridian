"use client";

import React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, className, delay = 0 }) => {
  const isPositive = change >= 0;

  return (
    <div
      className={cn("card animate-reveal", className)}
      style={{
        padding: '24px',
        animationDelay: `${delay}s`,
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius)',
            background: 'var(--surface-2)',
            color: 'var(--text-secondary)',
          }}
        >
          {icon}
        </div>
        <div
          className="flex items-center gap-1"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '20px',
            color: isPositive ? 'var(--positive)' : 'var(--negative)',
            background: isPositive ? 'var(--positive-bg)' : 'var(--negative-bg)',
          }}
        >
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(change)}%
        </div>
      </div>

      <div>
        <h3 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '34px',
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>
          {formatCurrency(value)}
        </p>
      </div>
    </div>
  );
};
