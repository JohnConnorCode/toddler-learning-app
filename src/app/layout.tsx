import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { AppShell } from "@/components/AppShell";

const outfit = Outfit({ subsets: ["latin"] });

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5, // Allow zoom for accessibility
    userScalable: true,
    themeColor: "#FFB800",
};

export const metadata: Metadata = {
    title: "Little Learner - Toddler Learning App",
    description: "Interactive phonics and word learning app for toddlers ages 2-5. Designed for children ages 2-5 with accessibility features for all learners.",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Little Learner",
    },
    icons: {
        icon: [
            { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
            { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
        ],
    },
    other: {
        "mobile-web-app-capable": "yes",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={outfit.className}>
                {/* Skip link for keyboard navigation */}
                <a href="#main-content" className="skip-link">
                    Skip to main content
                </a>

                {/* Screen reader announcements */}
                <div
                    id="aria-live-polite"
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                />
                <div
                    id="aria-live-assertive"
                    aria-live="assertive"
                    aria-atomic="true"
                    className="sr-only"
                />

                <AccessibilityProvider>
                    <PWARegister />
                    <AppShell>
                        {children}
                    </AppShell>
                </AccessibilityProvider>
            </body>
        </html>
    );
}
