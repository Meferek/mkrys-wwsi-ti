import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from "@/lib/theme";
import "@/styles/globals.css";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
});

export const metadata: Metadata = {
    title: "MKRYS - WWSI TI",
    description: "Aplikacja webowa stworzona na potrzeby przedmiotu Techniki Internetowe w WWSI. (Mateusz Krysiak)",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="pl">
            <body className={`${ poppins.variable } antialiased`}>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider theme={ theme }>
                        <CssBaseline />
                        { children }
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
