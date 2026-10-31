"use client";

import React, { useState, useMemo } from "react";
import { Finding, FindingClassification, IntelligenceModule } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
} from "lucide-react";

interface FindingsTabProps {
  findings: Finding[];
}

export function FindingsTab({ findings }: FindingsTabProps) {
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedClassification, setSelectedClassification] = useState<string>("ALL");
  const [onlyDiscrepancies, setOnlyDiscrepancies] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      if (selectedModule !== "ALL" && f.module !== selectedModule) return false;
      if (selectedClassification !== "ALL" && f.classification !== selectedClassification)
        return false;
      if (onlyDiscrepancies && !f.isDiscrepancy) return false;
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        return (
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.sourceName.toLowerCase().includes(q) ||
          f.evidenceExcerpt.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [findings, selectedModule, selectedClassification, onlyDiscrepancies, searchQuery]);

  const getClassificationBadge = (c: FindingClassification) => {
    switch (c) {
      case "OFFICIALLY_VERIFIED":
        return <Badge variant="success">Officially Verified</Badge>;
      case "THIRD_PARTY_REPORTED":
        return <Badge variant="indigo">Third-Party Reported</Badge>;
      case "COMPANY_SELF_REPORTED":
        return <Badge variant="outline">Self-Reported Claim</Badge>;
      case "PUBLIC_SOCIAL_MEDIA":
        return <Badge variant="purple">Social Media Statement</Badge>;
      case "UPLOADED_DOCUMENT":
        return <Badge variant="default">Uploaded Document</Badge>;
      case "AI_GENERATED_INFERENCE":
        return <Badge variant="warning">AI Forensic Inference</Badge>;
      case "UNVERIFIED_CLAIM":
        return <Badge variant="destructive">Unverified Claim</Badge>;
      default:
        return <Badge variant="default">{c}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case "CONTRADICTED":
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      case "REQUIRES_REVIEW":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search findings, citations, evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
          >
            <option value="ALL">All Modules</option>
            <option value="COMPANY">Company Intelligence</option>
            <option value="FOUNDER">Founder Intelligence</option>
            <option value="DOCUMENT">Document Forensics</option>
            <option value="RELATIONSHIP">Relationship Graph</option>
            <option value="CROSS_VERIFICATION">Cross-Verification</option>
          </select>

          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
          >
            <option value="ALL">All Classifications</option>
            <option value="OFFICIALLY_VERIFIED">Officially Verified</option>
            <option value="THIRD_PARTY_REPORTED">Third-Party Reported</option>
            <option value="COMPANY_SELF_REPORTED">Self-Reported Claim</option>
            <option value="PUBLIC_SOCIAL_MEDIA">Public Social Statement</option>
            <option value="UPLOADED_DOCUMENT">Uploaded Document</option>
            <option value="AI_GENERATED_INFERENCE">AI Inference</option>
            <option value="UNVERIFIED_CLAIM">Unverified Claim</option>
          </select>

          <button
            onClick={() => setOnlyDiscrepancies(!onlyDiscrepancies)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              onlyDiscrepancies
                ? "bg-rose-950/80 border-rose-800 text-rose-300"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Discrepancies Only
          </button>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing {filteredFindings.length} Evidence Records</span>
          <span>Standardized Forensic Finding Structure</span>
        </div>

        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className={`p-4 rounded-xl bg-slate-900 border text-xs space-y-3 transition-colors ${
              finding.isDiscrepancy ? "border-rose-900/60 bg-rose-950/10" : "border-slate-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(finding.verificationStatus)}
                  <span className="font-semibold text-slate-100 text-sm">{finding.title}</span>
                  {finding.isDiscrepancy && (
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{finding.severity} Severity</span>
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{finding.description}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getClassificationBadge(finding.classification)}
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400">
                  {finding.module}
                </span>
              </div>
            </div>

            {/* Evidence Excerpt Box */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Verifiable Evidence Excerpt
              </div>
              <p className="font-mono text-[11px] text-slate-300 leading-relaxed">
                "{finding.evidenceExcerpt}"
              </p>
            </div>

            {/* Source & Provenance Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>Source:</span>
                <span className="text-slate-300 font-medium">{finding.sourceName}</span>
                {finding.sourceUrl && (
                  <a
                    href={finding.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    View <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(finding.retrievalDate).toLocaleString()}
                </span>
                <span>Confidence: {finding.confidenceLevel}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredFindings.length === 0 && (
          <div className="p-12 text-center bg-slate-900/30 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No findings match the current filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
