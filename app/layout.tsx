import type React from "react";
import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { LanguageProvider } from "@/components/language-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { FirestoreSyncProvider } from "@/components/firestore-sync-provider";
import { SettingsProvider } from "@/context/settings-context";
import { RouteGuard } from "@/components/route-guard";
import { ChunkErrorHandler } from "@/components/chunk-error-handler";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const amiri = Amiri({
    subsets: ["arabic"],
    weight: ["400", "700"],
    variable: "--font-amiri",
});

export const metadata: Metadata = {
    icons: {
        icon: '/fav.ico',
    },
    title: "Kur'an Arapçası Öğren - Ücretsiz Online Eğitim",
    description: "Kelime kartları, gramer dersleri ve interaktif sınavlarla Kur'an Arapçasını öğrenin. Allah'ın kelamını kendi dilinden anlayın.",
    keywords: [
        "Kuran Arapçası",
        "Arapça öğren",
        "Kur'an öğren",
        "İslam eğitimi",
        "Arapça kelimeler",
        "Kur'an gramer",
        "Online Arapça",
        "Kur'an oku",
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <body className={`${inter.variable} ${amiri.variable} font-sans antialiased !overflow-x-hidden`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange={false}
                    storageKey="quran-app-theme"
                >
                    <SettingsProvider>
                    <AuthProvider>
                        <FirestoreSyncProvider>
                            <LanguageProvider>
                                <QueryProvider>
                                    <ChunkErrorHandler />
                                    <RouteGuard>
                                        {children}
                                    </RouteGuard>
                                    <Toaster />
                                </QueryProvider>
                            </LanguageProvider>
                        </FirestoreSyncProvider>
                    </AuthProvider>
                    </SettingsProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
