"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Transaction } from "@/types";
import { useStore } from "@/store/useStore";

interface ChartProps {
  data: Transaction[];
  className?: string;
}

const useChartColors = () => {
  const theme = useStore((s) => s.theme);
  return {
    grid: theme === "dark" ? "#2e2e2e" : "#e8e3d9",
    tooltipBg: theme === "dark" ? "#1e1e1e" : "#ffffff",
    tooltipBorder: theme === "dark" ? "#2e2e2e" : "#d6d0c4",
    tooltipText: theme === "dark" ? "#f0ece4" : "#1c1917",
    tickColor: theme === "dark" ? "#6b6560" : "#a8a29e",
    accent: theme === "dark" ? "#2dd4bf" : "#0f766e",
    accentGlow: theme === "dark" ? "rgba(45, 212, 191, 0.12)" : "rgba(15, 118, 110, 0.12)",
    textPrimary: theme === "dark" ? "#f0ece4" : "#1c1917",
    textSecondary: theme === "dark" ? "#a8a29e" : "#57534e",
    pieStroke: theme === "dark" ? "#171717" : "#ffffff",
    surface2: theme === "dark" ? "#1e1e1e" : "#f0ece4",
  };
};

export const BalanceTrend: React.FC<ChartProps> = ({ data }) => {
  const c = useChartColors();

  const processedData = data
    .slice()
    .reverse()
    .reduce((acc: { date: string; balance: number }[], current: Transaction) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const change = current.type === "income" ? current.amount : -current.amount;
      acc.push({
        date: current.date,
        balance: lastBalance + change,
      });
      return acc;
    }, []);

  return (
    <div className="h-[320px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c.accent} stopOpacity={0.15} />
              <stop offset="95%" stopColor={c.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={c.grid}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: c.tickColor, fontSize: 12, fontFamily: 'IBM Plex Mono' }}
            tickFormatter={(val) => new Date(val).toLocaleDateString([], { month: "short", day: "numeric" })}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: c.tickColor, fontSize: 12, fontFamily: 'IBM Plex Mono' }}
            tickFormatter={(val) => `$${val > 999 ? (val / 1000).toFixed(1) + 'k' : val}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: c.tooltipBg,
              borderRadius: "10px",
              border: `1px solid ${c.tooltipBorder}`,
              color: c.tooltipText,
              fontSize: "13px",
              fontFamily: "IBM Plex Mono",
              fontWeight: 500,
              padding: "10px 14px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            }}
            cursor={{ stroke: c.accent, strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke={c.accent}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorBalance)"
            animationDuration={1500}
            dot={false}
            activeDot={{ r: 5, fill: c.accent, stroke: c.tooltipBg, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategorySpending: React.FC<ChartProps> = ({ data }) => {
  const c = useChartColors();

  const spendingByCategory = data
    .filter((tx) => tx.type === "expense")
    .reduce((acc: Record<string, number>, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

  const pieData = Object.entries(spendingByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ["#0f766e", "#166534", "#991b1b", "#57534e", "#a8a29e", "#d6d0c4", "#92400e", "#1e3a5f"];
  const DARK_COLORS = ["#2dd4bf", "#4ade80", "#f87171", "#a8a29e", "#6b6560", "#404040", "#fbbf24", "#60a5fa"];
  const theme = useStore((s) => s.theme);
  const colors = theme === "dark" ? DARK_COLORS : COLORS;
  const total = pieData.reduce((sum, d) => sum + (d.value as number), 0);

  return (
    <div className="w-full">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={3} dataKey="value" stroke={c.pieStroke} strokeWidth={2}>
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: "10px",
                color: c.tooltipText, fontSize: "13px", fontFamily: "IBM Plex Mono", fontWeight: 500, padding: "8px 12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2.5 mt-4">
        {pieData.map((entry, idx) => (
          <div key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: colors[idx % colors.length] }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)' }}>
                {entry.name}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
              {((entry.value as number / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
