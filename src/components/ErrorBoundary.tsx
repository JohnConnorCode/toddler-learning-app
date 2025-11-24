"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-4 sm:p-6 md:p-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-lg w-full text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring" }}
                            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full mb-4 sm:mb-6"
                        >
                            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                        </motion.div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mb-3 sm:mb-4">
                            Oops! Something went wrong
                        </h2>

                        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                            Don't worry! We can try again.
                        </p>

                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="text-left mb-6 p-4 bg-gray-50 rounded-xl">
                                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                                    Error Details
                                </summary>
                                <pre className="text-xs text-red-600 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={this.handleReset}
                            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base sm:text-lg font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
                        >
                            <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span>Try Again</span>
                        </button>

                        <button
                            onClick={() => window.location.href = "/"}
                            className="mt-4 text-sm sm:text-base text-gray-500 hover:text-gray-700 underline"
                        >
                            Go to Home
                        </button>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
