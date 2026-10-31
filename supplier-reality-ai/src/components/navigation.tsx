"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Plus, Database, Sparkles } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-100 tracking-tight text-base">
                  SUPPLIER REALITY AI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ContextCon 03 · Autonomous Due Diligence &amp; Forensics
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                pathname === "/"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/investigations/demo-session-apex-2026"
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                pathname.includes("demo-session-apex")
                  ? "bg-indigo-950/70 text-indigo-300 border border-indigo-800/50"
                  : "text-indigo-400/90 hover:text-indigo-300 hover:bg-indigo-950/40"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Demo Case (Apex Tech)
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Crustdata + Gemini (configuration dependent)
          </div>

          <Link
            href="/investigations/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Investigation</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
