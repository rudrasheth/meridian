"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Layers, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  LineChart,
  Activity,
  Zap,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { role, setRole } = useStore();
  const pathname = usePathname();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { icon: <LayoutDashboard size={16} />, label: "Overview", href: "/" },
    { icon: <Layers size={16} />, label: "Ledger", href: "/ledger" },
    { icon: <BarChart3 size={16} />, label: "Analytics", href: "/analytics" },
    { icon: <LineChart size={16} />, label: "Markets", href: "/market" },
    { icon: <Activity size={16} />, label: "Audit Trail", href: "/audit" },
    { icon: <Settings size={16} />, label: "Settings", href: "/system" },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '4.5rem' : '16rem',
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className="h-screen sticky top-0 z-50 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className={cn("flex items-center pt-8 pb-8", isCollapsed ? "justify-center px-2" : "px-5 gap-3")}>
        <div 
          className="w-9 h-9 flex items-center justify-center shrink-0"
          style={{
            borderRadius: '50%',
            background: 'var(--text-primary)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 20H2L12 2Z" fill="var(--surface-1)" />
          </svg>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)', lineHeight: 1 }}>Meridian</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>CAPITAL · EST. 2024</span>
          </div>
        )}
      </div>

      {/* Separator */}
      <div style={{ height: '1px', background: 'var(--border)', margin: isCollapsed ? '0 8px' : '0 20px' }} />

      {/* Navigation */}
      <nav className="flex-1 py-6" style={{ padding: isCollapsed ? '24px 8px' : '24px 12px' }}>
        <div className="space-y-0.5">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={idx}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 w-full relative transition-all duration-200",
                  isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
                )}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'var(--surface-2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: isCollapsed ? '16px 8px' : '16px 16px' }} className="space-y-3">
        {!isCollapsed && (
          <div 
            className="relative p-4 deco-corner"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Access Level
              </span>
              <button
                onClick={() => setRole(role === "Admin" ? "Viewer" : "Admin")}
                className="p-1 transition-all hover:scale-110"
                style={{
                  color: role === "Admin" ? 'var(--accent)' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-1)',
                }}
              >
                <Zap size={10} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: role === "Admin" ? 'var(--positive)' : 'var(--text-muted)',
                  boxShadow: role === "Admin" ? '0 0 8px var(--positive)' : 'none',
                }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>
                {role}
              </span>
            </div>
          </div>
        )}
        
        {!isCollapsed && (
          <button 
            className="flex items-center justify-center gap-2 w-full py-2 transition-all"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--negative)',
              background: 'rgba(196, 92, 74, 0.06)',
              border: '1px solid rgba(196, 92, 74, 0.15)',
            }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-10 w-6 h-6 flex items-center justify-center z-50 transition-all hover:scale-110"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};
