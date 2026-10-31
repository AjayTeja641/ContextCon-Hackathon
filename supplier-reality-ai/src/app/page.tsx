"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { InvestigationSession } from "@/types";
import {
  ShieldCheck,
  Plus,
  AlertTriangle,
  Building2,
  Clock,
  ExternalLink,
  Search,
  CheckCircle2,
  FileCheck2,
  Database,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function DashboardPage() {
  const [investigations, setInvestigations] = useState<InvestigationSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/investigations")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.investigations) {
          setInvestigations(json.investigations);
        }
      })
      .catch((err) => console.error("Failed to load investigations:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalInvestigations = investigations.length;
  const reviewRequired = investigations.filter(
    (i) => i.status === "REVIEW_REQUIRED" || i.priorityIndicator.level === "CRITICAL_DISCREPANCY"
  ).length;

  const allFindings = investigations.flatMap((i) => i.findings || []);
  const totalDiscrepancies = allFindings.filter((f) => f.isDiscrepancy).length;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner with Clear Purpose */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>ContextCon 03 · IIT Bombay · Trust &amp; Compliance Theme</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight sm:text-4xl">
              AI-Powered Supplier Due Diligence &amp; Reality Verification
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Companies lose millions to phantom vendors, shell companies with genuine papers, and inflated procurement claims. Supplier Reality AI deploys autonomous multi-agent forensics across Crustdata APIs, corporate registries, and Gemini multimodal document inspection to separate genuine operations from paper facades.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/investigations/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Investigation</span>
              </Link>

              <Link
                href="/investigations/demo-session-apex-2026"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Explore Evaluated Demo Case</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Operational Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>Total Investigations</span>
              <Building2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">{totalInvestigations}</div>
            <div className="text-[11px] text-slate-500">Active and archived supplier sessions</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>Reviews Required</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">{reviewRequired}</div>
            <div className="text-[11px] text-slate-500">Contradictions needing human auditor signoff</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>Critical Discrepancies Flagged</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400">{totalDiscrepancies}</div>
            <div className="text-[11px] text-slate-500">Direct cross-source contradictions caught</div>
          </div>
        </div>

        {/* Recently Investigated Suppliers Table */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Investigated Suppliers &amp; Due Diligence Sessions</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any session to open the full 4-module forensic investigation workspace.
              </p>
            </div>

            <Link
              href="/investigations/new"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              <span>+ Create Investigation</span>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Company Name</th>
                  <th className="py-3 px-4 font-medium">Domain</th>
                  <th className="py-3 px-4 font-medium">Pipeline Stage</th>
                  <th className="py-3 px-4 font-medium">Priority Indicator</th>
                  <th className="py-3 px-4 font-medium">Findings</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/20">
                {investigations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      <div className="flex items-center gap-2">
                        <span>{inv.companyName}</span>
                        {inv.isDemo && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                            DEMO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{inv.domain}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {inv.currentStage.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          inv.priorityIndicator.level === "CRITICAL_DISCREPANCY"
                            ? "destructive"
                            : inv.priorityIndicator.level === "ELEVATED_REVIEW"
                            ? "warning"
                            : "success"
                        }
                      >
                        {inv.priorityIndicator.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {inv.findings?.length || 0} facts
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/investigations/${inv.id}`}
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        <span>Workspace</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit Findings Live Ledger */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Recent Cross-Verification Findings</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Live audit ledger tracking recent citations across active investigations.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {allFindings.slice(0, 5).map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-slate-200">{f.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{f.description}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Source: {f.sourceName} • {f.classification}
                  </div>
                </div>

                <Badge variant={f.isDiscrepancy ? "destructive" : "indigo"}>
                  {f.module}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
