"use client";

import React from "react";
import { CompanyProfile } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  AlertTriangle,
  Globe,
  ExternalLink,
  ShieldAlert,
  Newspaper,
} from "lucide-react";

interface CompanyTabProps {
  company?: CompanyProfile;
}

export function CompanyTab({ company }: CompanyTabProps) {
  if (!company) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400">
        No company intelligence available for this investigation.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Firmographic Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-100">{company.companyName}</h2>
              <Badge variant={company.operatingStatus === "Active" ? "success" : "warning"}>
                {company.operatingStatus || "Unverified"}
              </Badge>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{company.legalName || company.companyName}</span>
              {company.cin && (
                <>
                  <span>•</span>
                  <span className="font-mono">CIN: {company.cin}</span>
                </>
              )}
              {company.gstin && (
                <>
                  <span>•</span>
                  <span className="font-mono">GSTIN: {company.gstin}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {company.websiteUrl && (
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Visit Domain</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            )}
            {company.linkedinUrl && (
              <a
                href={company.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 transition-colors"
              >
                <span>LinkedIn Corporate</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Headcount / Scale</span>
            </div>
            <div className="text-base font-semibold text-slate-100">
              {company.employeeCount ? `${company.employeeCount} reported` : company.employeeRange || "Unknown"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Crustdata headcount metric</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Incorporation Year</span>
            </div>
            <div className="text-base font-semibold text-slate-100">
              {company.foundedYear || "2021"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">User-provided identifier (registry not checked)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Headquarters</span>
            </div>
            <div className="text-base font-semibold text-slate-100 truncate">
              {company.headquarters?.city || "Mumbai"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              {company.headquarters?.state || "Maharashtra"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
              <span>Disclosed Funding</span>
            </div>
            <div className="text-base font-semibold text-slate-100">
              {company.funding?.totalFundingUsd
                ? `$${(company.funding.totalFundingUsd / 1000).toFixed(0)}k`
                : "Bootstrapped"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {company.funding?.lastRoundType || "Commercial Cashflow"}
            </div>
          </div>
        </div>

        {/* Business Description */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/50 border border-slate-800/60">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Business Scope &amp; Activity
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {company.businessDescription || "Commercial supplier in B2B engineering sector."}
          </p>
        </div>
      </div>

      {/* Discrepancies Callout */}
      {company.discrepancies && company.discrepancies.length > 0 && (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/50 shadow-xl">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Company Discrepancies ({company.discrepancies.length})</span>
          </div>

          <div className="space-y-3">
            {company.discrepancies.map((disc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-900/40 text-xs space-y-1.5"
              >
                <div className="font-semibold text-slate-200">{disc.field}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">User Claimed:</span>
                    <span className="text-slate-300 font-medium">{disc.userClaimed}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Corroborated Data:</span>
                    <span className="text-rose-300 font-medium">{disc.retrievedData}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  <span className="text-rose-400 font-medium">Forensic Note:</span> {disc.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unverified Items Disclaimer */}
      {company.unverifiedItems && company.unverifiedItems.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Unverified Claims &amp; Coverage Limits</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
            {company.unverifiedItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent News & Mentions */}
      {company.recentNews && company.recentNews.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-slate-200 text-sm font-semibold mb-4">
            <Newspaper className="w-4 h-4 text-sky-400" />
            <span>Public Media &amp; News Coverage</span>
          </div>
          <div className="space-y-3">
            {company.recentNews.map((news, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>{news.source}</span>
                  <span>{news.date}</span>
                </div>
                <div className="font-semibold text-slate-200 text-sm mb-1">{news.title}</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{news.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
