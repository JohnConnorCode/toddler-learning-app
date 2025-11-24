import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Little Learner - Toddler Learning App",
    description: "Interactive phonics and word learning app for toddlers ages 2-5",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0", // Prevent zoom on mobile
    manifest: "/manifest.json",
    themeColor: "#FFB800",
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
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={outfit.className}>{children}</body>
        </html>
    );
}
