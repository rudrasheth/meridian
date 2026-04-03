import React from "react";

const Skeleton = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <div className={className} style={{ ...style, background: 'var(--surface-2)', borderRadius: 'var(--radius)', animation: 'pulse 2s ease-in-out infinite' }} />
);

export default function Loading() {
  return (
    <div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }`}</style>
      <div style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', padding: '32px 40px' }}>
        <Skeleton style={{ height: '14px', width: '100px', marginBottom: '12px' }} />
        <Skeleton style={{ height: '40px', width: '260px', marginBottom: '8px' }} />
        <Skeleton style={{ height: '18px', width: '320px' }} />
      </div>
      <div style={{ padding: '32px 40px', maxWidth: '1440px', margin: '0 auto' }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Skeleton style={{ height: '130px' }} />
          <Skeleton style={{ height: '130px' }} />
          <Skeleton style={{ height: '130px' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <Skeleton className="lg:col-span-8" style={{ height: '400px' }} />
          <div className="lg:col-span-4 space-y-5">
            <Skeleton style={{ height: '190px' }} />
            <Skeleton style={{ height: '190px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
