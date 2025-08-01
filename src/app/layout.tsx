import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AssignmentGPT AI - AI-Powered Assignment Writing Assistant",
  description: "Generate high-quality, university-level assignments with advanced AI. Get professional essays, research papers, case studies, and more with proper citations and formatting.",
  keywords: "AI assignment writer, homework help, essay generator, research paper, academic writing, plagiarism-free content",
  authors: [{ name: "AssignmentGPT AI Team" }],
  creator: "AssignmentGPT AI",
  publisher: "VEDHAS AI TECHNOLOGIES PVT LTD",
  robots: "index, follow",
  openGraph: {
    title: "AssignmentGPT AI - AI-Powered Assignment Writing Assistant",
    description: "Generate high-quality, university-level assignments with advanced AI. Get professional essays, research papers, case studies, and more.",
    type: "website",
    locale: "en_US",
    siteName: "AssignmentGPT AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AssignmentGPT AI - AI-Powered Assignment Writing Assistant",
    description: "Generate high-quality, university-level assignments with advanced AI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
