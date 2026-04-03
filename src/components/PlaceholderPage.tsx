"use client";

import React from "react";
import { Activity } from "lucide-react";

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md animate-reveal" style={{ padding: '40px' }}>
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          <Activity size={28} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {title}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {description}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '40px' }}>
          Coming Soon
        </p>
      </div>
    </div>
  );
}
