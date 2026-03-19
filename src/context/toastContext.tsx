"use client";

// ToastContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

export interface ToastInterface {
  id: string;
  message: string;
  type: string;
}

interface ToastContextType {
  toasts: ToastInterface[];
  addToast: (message: string, type: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInterface[]>([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const lastToastId = toasts[toasts.length - 1].id;
      const newToastEl = document.querySelector(`#toast-${lastToastId}`);
      setTimeout(() => newToastEl?.classList.add("in"), 20);
    }
  }, [toasts]);

  const addToast = (message: string, type: string) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    const targetToast = document.querySelector(`#toast-${id}`);
    targetToast?.classList.remove("in");
    // Faire l'animation du toast avant de le supprimer
    setTimeout(() => setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id)), 200);
  };

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
