"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { CheckCircle2, Info, XCircle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 min-w-[300px] shadow-lg"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
          >
            {/* Icon based on type */}
            <div className="shrink-0 flex items-center justify-center">
              {toast.type === "success" && <CheckCircle2 size={18} style={{ color: 'var(--positive)' }} />}
              {toast.type === "info" && <Info size={18} style={{ color: 'var(--accent)' }} />}
              {toast.type === "error" && <XCircle size={18} style={{ color: 'var(--negative)' }} />}
            </div>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              flex: 1,
            }}>
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
