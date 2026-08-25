import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "@dhua5922/react-kit/style.css";
import { MAIN_CONTENT_ID } from "@/shared/constants/accessibility.constants";
import "./globals.css";
import Footer from "./_components/Footer";
import ThemeToggle from "./_components/ThemeToggle";
import styles from "./layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinanceFlow | Smart Money Management",
  description: "Simple financial planning for modern life.",
};

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a href={`#${MAIN_CONTENT_ID}`} className={styles.skipLink}>
          Skip to main content
        </a>

        {children}

        <Footer />
        <ThemeToggle />
      </body>
    </html>
  );
}
