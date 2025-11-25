"use client";

import { useState, useEffect, useCallback } from "react";
import { create } from "zustand";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

/**
 * Main authentication hook
 */
export function useAuth() {
  const { user, session, isLoading, isAuthenticated, setUser, setSession, setIsLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Capture for TypeScript narrowing
    const client = supabase;

    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await client.auth.getSession();
        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsLoading]);

  /**
   * Sign in with email and password
   */
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      setError("Authentication not configured");
      return { error: "Authentication not configured" };
    }

    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const message = err instanceof AuthError ? err.message : "Failed to sign in";
      setError(message);
      return { data: null, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  /**
   * Sign up with email and password
   */
  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      setError("Authentication not configured");
      return { error: "Authentication not configured" };
    }

    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const message = err instanceof AuthError ? err.message : "Failed to sign up";
      setError(message);
      return { data: null, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  /**
   * Sign in with magic link (passwordless)
   */
  const signInWithMagicLink = useCallback(async (email: string) => {
    if (!supabase) {
      setError("Authentication not configured");
      return { error: "Authentication not configured" };
    }

    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      return { data, error: null, sent: true };
    } catch (err) {
      const message = err instanceof AuthError ? err.message : "Failed to send magic link";
      setError(message);
      return { data: null, error: message, sent: false };
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    if (!supabase) return;

    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setSession, setIsLoading]);

  /**
   * Reset password (send reset email)
   */
  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) {
      return { error: "Authentication not configured" };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { error: null, sent: true };
    } catch (err) {
      const message = err instanceof AuthError ? err.message : "Failed to send reset email";
      return { error: message, sent: false };
    }
  }, []);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    error,
    isEnabled: !!supabase,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    signOut,
    resetPassword,
  };
}

/**
 * Get current user ID (for use in other hooks)
 */
export function getCurrentUserId(): string | null {
  const { user } = useAuthStore.getState();
  return user?.id ?? null;
}

/**
 * Check if user is authenticated (for use outside React)
 */
export async function checkAuth(): Promise<User | null> {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
