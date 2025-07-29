import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/navigation/MainNav";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AcademiaAI Pro - AI-Powered Academic Assistant",
  description: "Generate, refine, and export university assignments in minutes with AI assistance.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <MainNav />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
