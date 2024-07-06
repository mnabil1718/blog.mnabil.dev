import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "blog.mnabil.dev - Software Engineering's Blog",
  description: "Talks about anything computer & software related",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-mono antialiased",
          mono.variable
        )}
      >
        <Header />
        <main className="flex min-h-screen flex-col items-center justify-between py-7 px-4 border">
          {/* Taking the space of navbar */}
          <div className="h-[70px]"></div>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
