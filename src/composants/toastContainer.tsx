// Toast.tsx
import React, { useEffect } from "react";
import { useToast } from "@/context/toastContext";
import Toast from "./toast";

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    toasts.map((toast) => {
      return setTimeout(() => {
        removeToast(toast.id);
      }, 4000); // Supprime le toast après 4 secondes
    });
  }, [toasts, removeToast]);

  return (
    <div className="toastContainer">
      {toasts.map((toast) => (
        <Toast
          message={toast.message}
          type={toast.type}
          id={`${toast.id}`}
          key={toast.id}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
