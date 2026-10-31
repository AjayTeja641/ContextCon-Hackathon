"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { InvestigationSession, InvestigationStage } from "@/types";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { CompanyTab } from "@/components/company/company-tab";
import { FounderTab } from "@/components/founders/founder-tab";
import { DocumentTab } from "@/components/documents/document-tab";
import { RelationshipGraph } from "@/components/relationships/relationship-graph";
import { ReportTab } from "@/components/reports/report-tab";
import { FindingsTab } from "@/components/findings/findings-tab";
import {
  Building2,
  User,
  FileText,
  Network,
  ClipboardList,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const STAGES: Array<{ id: InvestigationStage; label: string }> = [
  { id: "INPUT_VALIDATION", label: "Intake" },
  { id: "COMPANY_INVESTIGATION", label: "Company" },
  { id: "FOUNDER_INVESTIGATION", label: "Founder" },
  { id: "PUBLIC_INTELLIGENCE", label: "Public Intelligence" },
  { id: "DOCUMENT_INVESTIGATION", label: "Documents" },
  { id: "CROSS_VERIFICATION", label: "Reconciliation" },
  { id: "RELATIONSHIP_ANALYSIS", label: "Graph" },
  { id: "GEMINI_INTELLIGENCE_ANALYSIS", label: "Gemini AI" },
  { id: "FINAL_REPORT", label: "Report" },
];

export default function InvestigationWorkspacePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [session, setSession] = useState<InvestigationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isReRunning, setIsReRunning] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch(`/api/investigations/${id}`);
      const json = await res.json();
      if (json.success && json.session) {
        setSession(json.session);
      }
    } catch (err) {
      console.error("Failed to load investigation:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    const interval = setInterval(() => {
      fetchSession();
    }, 4000);
    return () => clearInterval(interval);
  }, [id]);

  const handleReRun = async () => {
    setIsReRunning(true);
    try {
      const res = await fetch(`/api/investigations/${id}/run`, { method: "POST" });
      const json = await res.json();
      if (json.success && json.session) {
        setSession(json.session);
      }
    } catch (err) {
      console.error("Failed to re-run investigation:", err);
    } finally {
      setIsReRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading investigation workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-200">Investigation not found</p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-200"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const discrepanciesCount = session.findings.filter((f) => f.isDiscrepancy).length;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navigation />

      {/* Demo Case Banner */}
      {session.isDemo && (
        <div className="bg-indigo-950/60 border-b border-indigo-800/60 px-4 py-2 text-center text-xs text-indigo-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>
            <strong className="font-semibold">DEMO DATA MODE:</strong> This pre-configured synthetic case models an actual industrial supplier with realistic red flags (co-located shell firms, headcount contradictions, and document discrepancies).
          </span>
        </div>
      )}

      {/* Top Workspace Header */}
      <div className="border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-100">{session.companyName}</h1>
                <Badge
                  variant={
                    session.priorityIndicator.level === "CRITICAL_DISCREPANCY"
                      ? "destructive"
                      : session.priorityIndicator.level === "ELEVATED_REVIEW"
                      ? "warning"
                      : "success"
                  }
                >
                  {session.priorityIndicator.label}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                <span className="font-mono text-slate-300">{session.domain}</span>
                {session.cin && (
                  <>
                    <span>•</span>
                    <span className="font-mono">CIN: {session.cin}</span>
                  </>
                )}
                {session.gstin && (
                  <>
                    <span>•</span>
                    <span className="font-mono">GSTIN: {session.gstin}</span>
                  </>
                )}
                <span>•</span>
                <span>Created {new Date(session.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReRun}
                disabled={isReRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium transition-colors"
              >
                {isReRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Re-Run Investigation</span>
              </button>
            </div>
          </div>

          {/* 9-Stage Progress Tracker */}
          <div className="mt-6 pt-6 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">
                Investigation Pipeline: {session.currentStage.replace(/_/g, " ")}
              </span>
              <span className="font-mono">{session.stageProgress}% Completed</span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-1.5 mb-4 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 to-sky-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${session.stageProgress}%` }}
              ></div>
            </div>

            <div className="hidden lg:grid grid-cols-9 gap-1 text-center">
              {STAGES.map((st, i) => {
                const isPassed =
                  STAGES.findIndex((s) => s.id === session.currentStage) >= i ||
                  session.stageProgress === 100;
                const isCurrent = session.currentStage === st.id;

                return (
                  <div
                    key={st.id}
                    className={`py-1 px-1 rounded text-[10px] truncate border ${
                      isCurrent
                        ? "bg-indigo-950/80 text-indigo-300 border-indigo-700/60 font-semibold"
                        : isPassed
                        ? "bg-slate-900/80 text-slate-300 border-slate-800"
                        : "text-slate-600 border-transparent"
                    }`}
                  >
                    {st.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Tabs Navigation */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Overview &amp; Priority</span>
            {discrepanciesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {discrepanciesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("company")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "company"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Module 1: Company Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab("founders")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "founders"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Module 2: Founder Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "documents"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Module 3: Document Forensics ({session.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("relationships")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "relationships"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Module 4: Relationship Graph</span>
          </button>

          <button
            onClick={() => setActiveTab("findings")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "findings"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Evidence Audit Ledger ({session.findings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("report")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "report"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Due Diligence Report</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Priority Assessment Box */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <span>Explainable Priority Assessment</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    No black-box scores. Calculated from verifiable cross-source facts and observed contradictions.
                  </p>
                </div>
                <Badge
                  variant={
                    session.priorityIndicator.level === "CRITICAL_DISCREPANCY"
                      ? "destructive"
                      : session.priorityIndicator.level === "ELEVATED_REVIEW"
                      ? "warning"
                      : "success"
                  }
                >
                  {session.priorityIndicator.label}
                </Badge>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {session.priorityIndicator.summary}
              </p>

              {/* Score Factors */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Underlying Forensic Evidence Factors
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {session.priorityIndicator.scoreFactors.map((factor, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{factor.factor}</span>
                        <Badge
                          variant={
                            factor.impact === "RISK"
                              ? "destructive"
                              : factor.impact === "POSITIVE"
                              ? "success"
                              : "outline"
                          }
                        >
                          {factor.impact}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {factor.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab("company")}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-300">
                    Company Intelligence
                  </span>
                  <Building2 className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-lg font-bold text-slate-100">
                  {session.company?.employeeCount || session.company?.employeeRange || "Verified"}
                </div>
                <p className="text-[11px] text-slate-400">
                  {session.company?.industry || "Industrial Equipment & Tooling"}
                </p>
              </div>

              <div
                onClick={() => setActiveTab("founders")}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-300">
                    Founder Intelligence
                  </span>
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-lg font-bold text-slate-100">
                  {session.founders?.[0]?.fullName || session.founderName || "Unassigned"}
                </div>
                <p className="text-[11px] text-slate-400">
                  {session.founders?.[0]?.currentTitle || "Executive Directorship"}
                </p>
              </div>

              <div
                onClick={() => setActiveTab("relationships")}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-300">
                    Relationship Network
                  </span>
                  <Network className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-slate-100">
                  {session.relationshipGraph.nodes.length} Connected Entities
                </div>
                <p className="text-[11px] text-slate-400">
                  {session.relationshipGraph.edges.length} Cross-Entity Associations
                </p>
              </div>
            </div>

            {/* Embedded Mini Graph */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">Interactive Entity Graph</h3>
                <button
                  onClick={() => setActiveTab("relationships")}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  View Fullscreen
                </button>
              </div>
              <RelationshipGraph graphData={session.relationshipGraph} />
            </div>
          </div>
        )}

        {activeTab === "company" && <CompanyTab company={session.company} />}

        {activeTab === "founders" && <FounderTab founders={session.founders} />}

        {activeTab === "documents" && (
          <DocumentTab
            documents={session.documents}
            investigationId={session.id}
            onDocumentUploaded={fetchSession}
          />
        )}

        {activeTab === "relationships" && (
          <RelationshipGraph graphData={session.relationshipGraph} />
        )}

        {activeTab === "findings" && <FindingsTab findings={session.findings} />}

        {activeTab === "report" && (
          <ReportTab report={session.report} companyName={session.companyName} />
        )}
      </main>
    </div>
  );
}
