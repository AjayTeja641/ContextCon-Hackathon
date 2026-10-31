import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supplier Reality AI | Business Due Diligence & Supplier Intelligence",
  description: "Enterprise AI Due Diligence: Multi-stage supplier verification, relationship graph analysis, and evidence-backed risk intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased font-sans flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
