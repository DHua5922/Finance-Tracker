import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@dhua5922/react-kit/style.css";
import "./globals.css";
import Footer from "./_components/Footer";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50">
        {children}
        <Footer />
      </body>
    </html>
  );
}
