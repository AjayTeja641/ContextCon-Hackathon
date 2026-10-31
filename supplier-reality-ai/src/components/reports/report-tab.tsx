"use client";

import React from "react";
import { DueDiligenceReport } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  ShieldCheck,
  AlertTriangle,
  Building2,
  User,
  FileText,
  Network,
  CheckCircle2,
  ArrowRight,
  Download,
} from "lucide-react";

interface ReportTabProps {
  report?: DueDiligenceReport;
  companyName: string;
}

export function ReportTab({ report, companyName }: ReportTabProps) {
  if (!report) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
        Report is generating or awaiting completion of previous investigation stages.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getPriorityBadge = (level: string) => {
    switch (level) {
      case "CRITICAL_DISCREPANCY":
        return <Badge variant="destructive">CRITICAL DISCREPANCY — IMMEDIATE AUDIT</Badge>;
      case "ELEVATED_REVIEW":
        return <Badge variant="warning">ELEVATED REVIEW RECOMMENDED</Badge>;
      default:
        return <Badge variant="success">STANDARD REVIEW — LOW ANOMALY</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <div className="text-xs text-slate-400">
          Generated: {new Date(report.generatedAt).toLocaleString()} • Forensic Audit Dossier
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Report Container */}
      <div className="p-8 sm:p-12 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-800 print:border-black/20 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>SUPPLIER REALITY AI · DUE DILIGENCE REPORT</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 print:text-black">
              {report.companyName}
            </h1>
            <div className="text-xs text-slate-400 print:text-slate-600 mt-1">
              Domain: {report.domain} • Report ID: {report.id}
            </div>
          </div>

          <div>{getPriorityBadge(report.priorityIndicator.level)}</div>
        </div>

        {/* Priority Evaluation Box */}
        <div
          className={`p-5 rounded-xl border ${
            report.priorityIndicator.level === "CRITICAL_DISCREPANCY"
              ? "bg-rose-950/20 border-rose-900/50 print:bg-rose-50 print:border-rose-300"
              : report.priorityIndicator.level === "ELEVATED_REVIEW"
              ? "bg-amber-950/20 border-amber-900/50 print:bg-amber-50 print:border-amber-300"
              : "bg-emerald-950/20 border-emerald-900/50 print:bg-emerald-50 print:border-emerald-300"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold text-xs text-slate-200 print:text-black mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400 print:text-amber-600" />
            <span>Forensic Assessment Verdict: {report.priorityIndicator.label}</span>
          </div>
          <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
            {report.priorityIndicator.rationale}
          </p>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-2">
            1. Executive Summary
          </h3>
          <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed bg-slate-950/40 print:bg-slate-50 p-4 rounded-xl border border-slate-800/80 print:border-slate-200">
            {report.executiveSummary}
          </p>
        </div>

        {/* Section 2: Company Overview */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>2. Company Reality vs Claimed Profile</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/40 print:bg-slate-50 border border-slate-800/80 print:border-slate-200 text-xs space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-400 pb-3 border-b border-slate-800 print:border-slate-300">
              <div>
                <span className="block text-[10px] text-slate-500">Operating Status</span>
                <span className="font-semibold text-slate-200 print:text-black">
                  {report.companyOverview.operatingStatus}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">Incorporation</span>
                <span className="font-semibold text-slate-200 print:text-black">
                  {report.companyOverview.foundedYear || "2021"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">Employee Range</span>
                <span className="font-semibold text-slate-200 print:text-black">
                  {report.companyOverview.employeeRange}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">Industry</span>
                <span className="font-semibold text-slate-200 print:text-black truncate">
                  {report.companyOverview.industry || "Industrial Supply"}
                </span>
              </div>
            </div>
            <p className="text-slate-300 print:text-slate-800 leading-relaxed pt-2">
              <span className="font-semibold text-slate-400">Synthesis: </span>
              {report.companyOverview.claimedVsVerifiedSummary}
            </p>
          </div>
        </div>

        {/* Section 3: Founder Assessment */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>3. Founder &amp; Executive Assessment</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/40 print:bg-slate-50 border border-slate-800/80 print:border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 print:border-slate-300">
              <span className="font-bold text-slate-200 print:text-black text-sm">
                {report.founderAssessment.primaryFounder}
              </span>
              <Badge variant="indigo">
                {report.founderAssessment.identityConfidence} Confidence
              </Badge>
            </div>
            <p className="text-slate-300 print:text-slate-800 leading-relaxed">
              {report.founderAssessment.summary}
            </p>
          </div>
        </div>

        {/* Section 4: Document Verification */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>4. Document Forensic Verification</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/40 print:bg-slate-50 border border-slate-800/80 print:border-slate-200 text-xs space-y-2">
            <div className="text-slate-300 print:text-slate-800 leading-relaxed">
              {report.documentVerificationSummary.summary}
            </div>
            <p className="text-[10px] text-slate-500 italic pt-1">
              Notice: {report.documentVerificationSummary.disclaimer}
            </p>
          </div>
        </div>

        {/* Section 5: Relationship Network */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3 flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-400" />
            <span>5. Entity Relationship Network &amp; Shell Motifs</span>
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/40 print:bg-slate-50 border border-slate-800/80 print:border-slate-200 text-xs space-y-2">
            <p className="text-slate-300 print:text-slate-800 leading-relaxed">
              {report.relationshipNetworkFindings.narrative}
            </p>
          </div>
        </div>

        {/* Section 6: Critical Discrepancies */}
        {report.criticalDiscrepancies && report.criticalDiscrepancies.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400 print:text-rose-700 mb-3">
              6. Critical Discrepancies Logged
            </h3>
            <div className="space-y-2">
              {report.criticalDiscrepancies.map((disc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-rose-950/20 print:bg-rose-50 border border-rose-900/40 print:border-rose-200 text-xs"
                >
                  <div className="font-semibold text-rose-300 print:text-rose-900">{disc.title}</div>
                  <p className="text-slate-300 print:text-slate-800 text-[11px] mt-0.5">{disc.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 7: Recommended Action Steps */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3">
            7. Recommended Human Auditor Action Steps
          </h3>
          <div className="space-y-2">
            {report.recommendedActionSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs flex items-start gap-2.5"
              >
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400 print:text-indigo-600 shrink-0 mt-0.5" />
                <span className="text-slate-200 print:text-slate-900">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 8: Missing Information */}
        {report.missingInformation && report.missingInformation.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-2">
              8. Missing Information &amp; Data Gaps
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400 print:text-slate-700 text-xs">
              {report.missingInformation.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Audit Signoff Footer */}
        <div className="pt-8 border-t border-slate-800 print:border-slate-300 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between gap-4">
          <div>Supplier Reality AI · ContextCon 03 · Autonomous Corporate Forensics</div>
          <div>Human Analyst Review Required Prior to Contract Disbursement</div>
        </div>
      </div>
    </div>
  );
}
