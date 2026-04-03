"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { Sun, Moon, User, Shield, Database } from "lucide-react";

export default function SystemPage() {
  const { theme, toggleTheme, role, setRole } = useStore();

  return (
    <div className="flex-1 min-h-screen">
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 animate-reveal">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            ◆ Configuration
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Settings
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Manage your preferences and application settings.
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 lg:px-10 py-8 space-y-5">
        {/* Appearance */}
        <div className="card animate-reveal delay-1" style={{ padding: '24px' }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ padding: '8px', borderRadius: 'var(--radius)', background: 'var(--accent-light)', color: 'var(--accent)' }}>
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)' }}>Appearance</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>Toggle between light and dark mode</p>
            </div>
          </div>
          <div className="flex items-center justify-between" style={{ padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-primary)' }}>
              Theme: <strong>{theme === "light" ? "Light" : "Dark"}</strong>
            </span>
            <button
              onClick={toggleTheme}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
                padding: '8px 16px', borderRadius: '6px',
                background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
              }}
            >
              Switch to {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        {/* Role */}
        <div className="card animate-reveal delay-2" style={{ padding: '24px' }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ padding: '8px', borderRadius: 'var(--radius)', background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Shield size={18} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)' }}>Access Role</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>Switch between Admin and Viewer mode</p>
            </div>
          </div>
          <div className="flex items-center justify-between" style={{ padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-primary)' }}>
              Current role: <strong>{role}</strong>
            </span>
            <button
              onClick={() => setRole(role === "Admin" ? "Viewer" : "Admin")}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
                padding: '8px 16px', borderRadius: '6px',
                background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
              }}
            >
              Switch to {role === "Admin" ? "Viewer" : "Admin"}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="card animate-reveal delay-3" style={{ padding: '24px' }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ padding: '8px', borderRadius: 'var(--radius)', background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)' }}>Data Storage</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>Data is persisted in your browser&apos;s local storage</p>
            </div>
          </div>
          <div className="flex items-center justify-between" style={{ padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-primary)' }}>
              Storage: <strong>localStorage</strong>
            </span>
            <button
              onClick={() => {
                if (window.confirm("Clear all stored data and reset to defaults?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
                padding: '8px 16px', borderRadius: '6px',
                background: 'var(--negative-bg)', color: 'var(--negative)', border: 'none', cursor: 'pointer',
              }}
            >
              Reset All Data
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="card animate-reveal delay-4" style={{ padding: '24px' }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ padding: '8px', borderRadius: 'var(--radius)', background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <User size={18} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)' }}>Profile</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>Account information</p>
            </div>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>Name</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>Email</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>admin@meridian.io</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>Plan</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', fontWeight: 600, padding: '2px 8px', background: 'var(--accent-glow)', borderRadius: '4px' }}>PRO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
