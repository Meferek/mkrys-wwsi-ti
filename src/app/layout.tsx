import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MKRYS - WWSI TI",
    description: "Aplikacja webowa stworzona na potrzeby przedmiotu Techniki Internetowe w WWSI. (Mateusz Krysiak)",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="pl">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                { children }
            </body>
        </html>
    );
}
