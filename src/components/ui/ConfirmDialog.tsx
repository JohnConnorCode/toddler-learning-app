"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useCallback } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "warning" | "danger" | "info";
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Continue",
  cancelText = "Cancel",
  variant = "warning",
  icon,
}: ConfirmDialogProps) {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling when dialog is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  const variantStyles = {
    warning: {
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      confirmBg: "bg-yellow-500 hover:bg-yellow-600",
    },
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      confirmBg: "bg-red-500 hover:bg-red-600",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      confirmBg: "bg-blue-500 hover:bg-blue-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div
                  className={`w-16 h-16 rounded-full ${styles.iconBg} flex items-center justify-center`}
                >
                  {icon || (
                    <AlertTriangle className={`w-8 h-8 ${styles.iconColor}`} />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h2
                  id="confirm-dialog-title"
                  className="text-xl font-bold text-gray-800 mb-2"
                >
                  {title}
                </h2>
                <p className="text-gray-600">{message}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors touch-target"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-3 rounded-xl ${styles.confirmBg} text-white font-bold transition-colors touch-target`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for using confirmation before navigation
export function useConfirmNavigation(shouldConfirm: boolean) {
  useEffect(() => {
    if (!shouldConfirm) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldConfirm]);
}
