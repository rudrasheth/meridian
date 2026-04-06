"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ToastContainer } from "@/components/ToastContainer";
import { useStore } from "@/store/useStore";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const hydrate = useStore((s) => s.hydrate);
  const hydrated = useStore((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen warm-bg" style={{ color: 'var(--text-primary)' }}>
      <Navbar />
      <main className="flex-1">
        {hydrated ? children : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1.5">
                <div className="loading-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                <div className="loading-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animationDelay: '0.2s' }} />
                <div className="loading-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animationDelay: '0.4s' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Loading...
              </span>
            </div>
          </div>
        )}
      </main>
      <ToastContainer />
    </div>
  );
}
