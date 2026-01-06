"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";
import Toast, { Toast as ToastType, ToastType as ToastTypeEnum } from "./Toast";

interface ToastContextType {
  showToast: (message: string, type: ToastTypeEnum) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const idCounter = useRef(0);

  const showToast = useCallback((message: string, type: ToastTypeEnum) => {
    const id = `toast-${++idCounter.current}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div 
        className="fixed top-4 right-4 z-50 flex flex-col gap-2"
        suppressHydrationWarning
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

