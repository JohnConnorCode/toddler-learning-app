"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, Loader2, CheckCircle2, ArrowRight, Wand2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type LoginMode = "signin" | "signup" | "magic";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithMagicLink, isLoading, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<LoginMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (mode === "magic") {
      // Magic link login
      const result = await signInWithMagicLink(email);
      if (result.error) {
        setError(result.error);
      } else {
        setMagicLinkSent(true);
      }
    } else if (mode === "signin") {
      // Email/password sign in
      if (!password) {
        setError("Please enter your password");
        return;
      }
      const result = await signInWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } else if (mode === "signup") {
      // Email/password sign up
      if (!password) {
        setError("Please enter a password");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      const result = await signUpWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSignupSuccess(true);
      }
    }
  };

  // Magic link sent success screen
  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-black text-gray-800 mb-4">Check Your Email!</h1>
          <p className="text-gray-600 mb-6">
            We sent a magic link to <span className="font-bold text-purple-600">{email}</span>
          </p>
          <p className="text-sm text-gray-500">
            Click the link in your email to sign in. It may take a minute to arrive.
          </p>

          <button
            onClick={() => setMagicLinkSent(false)}
            className="mt-8 text-purple-600 hover:text-purple-700 font-bold"
          >
            Try a different email
          </button>
        </motion.div>
      </div>
    );
  }

  // Signup success screen
  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-black text-gray-800 mb-4">Account Created!</h1>
          <p className="text-gray-600 mb-6">
            Check your email at <span className="font-bold text-purple-600">{email}</span> to confirm your account.
          </p>

          <button
            onClick={() => {
              setSignupSuccess(false);
              setMode("signin");
            }}
            className="mt-4 px-8 py-3 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-600 transition-colors"
          >
            Back to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">
            Little Learner
          </h1>
          <p className="text-gray-600">
            {mode === "signin" && "Sign in to continue learning"}
            {mode === "signup" && "Create your account"}
            {mode === "magic" && "Sign in with magic link"}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setMode("signin")}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all",
              mode === "signin"
                ? "bg-white text-purple-600 shadow"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all",
              mode === "signup"
                ? "bg-white text-purple-600 shadow"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode("magic")}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1",
              mode === "magic"
                ? "bg-white text-purple-600 shadow"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Wand2 className="w-3 h-3" />
            Magic
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@email.com"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Input (only for signin/signup) */}
          {mode !== "magic" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
              {mode === "signup" && (
                <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2",
              isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                {mode === "signin" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "magic" && "Send Magic Link"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Magic Link Hint */}
        {mode !== "magic" && (
          <p className="text-center text-sm text-gray-500 mt-6">
            No password?{" "}
            <button
              onClick={() => setMode("magic")}
              className="text-purple-600 hover:text-purple-700 font-bold"
            >
              Use a magic link
            </button>
          </p>
        )}
      </motion.div>
    </div>
  );
}
