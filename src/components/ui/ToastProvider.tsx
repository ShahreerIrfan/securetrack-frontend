"use client";

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toast, ToastVariant } from "./Toast";

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** ms before auto-dismiss; 0 disables auto-dismiss */
  duration?: number;
}

interface ToastItem {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  success: (title: ReactNode, options?: Omit<ToastOptions, "variant" | "title">) => void;
  error: (title: ReactNode, options?: Omit<ToastOptions, "variant" | "title">) => void;
  info: (title: ReactNode, options?: Omit<ToastOptions, "variant" | "title">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // createPortal needs `document`, which doesn't exist during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (options: ToastOptions) => {
      const id = crypto.randomUUID();
      const duration = options.duration ?? DEFAULT_DURATION;
      setToasts((current) => [
        ...current,
        {
          id,
          title: options.title,
          description: options.description,
          variant: options.variant ?? "info",
          duration,
        },
      ]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss],
  );

  const success = useCallback(
    (title: ReactNode, options?: Omit<ToastOptions, "variant" | "title">) =>
      show({ ...options, title, variant: "success" }),
    [show],
  );
  const error = useCallback(
    (title: ReactNode, options?: Omit<ToastOptions, "variant" | "title">) =>
      show({ ...options, title, variant: "error" }),
    [show],
  );
  const info = useCallback(
    (title: ReactNode, options?: Omit<ToastOptions, "variant" | "title">) =>
      show({ ...options, title, variant: "info" }),
    [show],
  );

  return (
    <ToastContext.Provider value={{ show, success, error, info, dismiss }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2">
            {toasts.map((t) => (
              <Toast
                key={t.id}
                variant={t.variant}
                title={t.title}
                description={t.description}
                onDismiss={() => dismiss(t.id)}
              />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
