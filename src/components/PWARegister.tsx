"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X, Wifi, WifiOff } from "lucide-react";

export function PWARegister() {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  // Handle SW update
  const handleUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setShowUpdateBanner(false);
      window.location.reload();
    }
  }, [waitingWorker]);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Track online/offline status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowOfflineToast(false), 5000);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("Service Worker registered:", registration);

        // Check for updates on page load
        registration.update();

        // Handle updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New version available
                setWaitingWorker(newWorker);
                setShowUpdateBanner(true);
              }
            });
          }
        });

        // Check for updates periodically (every 30 minutes)
        const updateInterval = setInterval(() => {
          registration.update();
        }, 30 * 60 * 1000);

        return () => clearInterval(updateInterval);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "SW_UPDATED") {
        console.log("SW updated to version:", event.data.version);
      }
    });

    // Handle page visibility for update checks
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* Update Banner */}
      <AnimatePresence>
        {showUpdateBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 p-4 bg-blue-600 text-white shadow-lg"
            role="alert"
            aria-live="polite"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                <p className="font-medium">
                  A new version is available!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUpdate}
                  className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors touch-target"
                  aria-label="Update the app now"
                >
                  Update Now
                </button>
                <button
                  onClick={() => setShowUpdateBanner(false)}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors touch-target"
                  aria-label="Dismiss update notification"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Toast */}
      <AnimatePresence>
        {showOfflineToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
            role="status"
            aria-live="polite"
          >
            <div className="bg-gray-800 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-orange-400" aria-hidden="true" />
              <p className="flex-1">
                You're offline. Some features may be limited.
              </p>
              <button
                onClick={() => setShowOfflineToast(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                aria-label="Dismiss offline notification"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online indicator (shows briefly when coming back online) */}
      <AnimatePresence>
        {isOnline && !showOfflineToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="sr-only"
            aria-live="polite"
          >
            You are online
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
