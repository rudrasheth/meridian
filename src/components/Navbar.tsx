"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Layers,
  BarChart3,
  LineChart,
  Activity,
  Settings,
  Zap,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role, setRole, theme, toggleTheme } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/" },
    { icon: <Layers size={18} />, label: "Ledger", href: "/ledger" },
    { icon: <BarChart3 size={18} />, label: "Analytics", href: "/analytics" },
    { icon: <LineChart size={18} />, label: "Markets", href: "/market" },
    { icon: <Activity size={18} />, label: "Audit Trail", href: "/audit" },
    { icon: <Settings size={18} />, label: "Settings", href: "/system" },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Top bar */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--accent)',
                borderRadius: 'var(--radius)',
                color: '#fff',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', lineHeight: 1 }}>M</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)', lineHeight: 1 }}>
                Meridian
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Capital Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" style={{ position: 'relative' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200")}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-glow)' : 'transparent',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-lg transition-all"
              style={{
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                background: 'var(--surface-2)',
              }}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Role badge */}
            <button
              onClick={() => setRole(role === "Admin" ? "Viewer" : "Admin")}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                color: role === "Admin" ? 'var(--accent)' : 'var(--text-muted)',
                background: role === "Admin" ? 'var(--accent-glow)' : 'var(--surface-2)',
                border: `1px solid ${role === "Admin" ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: role === "Admin" ? 'var(--positive)' : 'var(--text-muted)',
                }}
              />
              {role}
              <Zap size={12} />
            </button>

            {/* User avatar */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--surface-2)',
                border: '2px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                color: 'var(--text-secondary)',
              }}
            >
              JD
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--surface-1)',
            padding: '8px 16px 16px',
          }}
        >
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-glow)' : 'transparent',
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
            <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'var(--text-secondary)',
              }}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <button
              onClick={() => setRole(role === "Admin" ? "Viewer" : "Admin")}
              className="flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'var(--text-secondary)',
              }}
            >
              <Zap size={18} />
              Switch to {role === "Admin" ? "Viewer" : "Admin"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
