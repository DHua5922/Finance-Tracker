import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@dhua5922/react-kit/style.css";
import { MAIN_CONTENT_ID } from "@/shared/constants/accessibility";
import "./globals.css";
import Footer from "./_components/Footer";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${styles.htmlRoot}`}
    >
      <body className={styles.bodyRoot}>
        <a href={`#${MAIN_CONTENT_ID}`} className={styles.skipLink}>
          Skip to main content
        </a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
