"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Pages that don't require authentication
const PUBLIC_PATHS = ["/login", "/signup", "/reset-password"];

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isEnabled } = useAuth();

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname?.startsWith(path));

  useEffect(() => {
    // Skip if auth is not enabled (no Supabase configured)
    if (!isEnabled) return;

    // Skip if still loading
    if (isLoading) return;

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicPath) {
      router.push("/login");
    }

    // If authenticated and on login page, redirect to home
    if (isAuthenticated && isPublicPath) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, isEnabled, isPublicPath, pathname, router]);

  // If auth is not enabled, show app without auth
  if (!isEnabled) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <Loader2 className="w-8 h-8 mx-auto text-purple-500 animate-spin" />
          <p className="mt-4 text-gray-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // If on public path, show the page
  if (isPublicPath) {
    return <>{children}</>;
  }

  // If not authenticated, don't render (redirect will happen)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Authenticated, show children
  return <>{children}</>;
}
