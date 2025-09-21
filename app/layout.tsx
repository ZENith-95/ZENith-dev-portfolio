import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";
import GlowingLettersBackground from "@/components/ui/GlowingLettersBackground";

const inter = Inter({ subsets: ["latin"] });
const kanit = Kanit({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZENith's Portfolio",
  description: "Modern & Minimalist Next.js Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={kanit.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/zen_ith.png" sizes="any" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          <div className="relative min-h-screen">
            <GlowingLettersBackground />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
