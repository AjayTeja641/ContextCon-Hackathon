"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import {
  Building2,
  Globe,
  FileText,
  User,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function NewInvestigationPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [cin, setCin] = useState("");
  const [gstin, setGstin] = useState("");
  const [founderName, setFounderName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [claimedEmployees, setClaimedEmployees] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePreFill = () => {
    router.push("/investigations/demo-session-apex-2026");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !domain.trim()) {
      setErrorMessage("Company name and domain are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/investigations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          domain,
          cin: cin || undefined,
          gstin: gstin || undefined,
          founderName: founderName || undefined,
          linkedinUrl: linkedinUrl || undefined,
          claimedEmployees: claimedEmployees || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to start investigation");
      }

      router.push(`/investigations/${json.investigationId}`);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred starting investigation");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <span>Start New Supplier Due Diligence</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Initiate multi-stage forensic analysis using Crustdata and Gemini where configured. Government-registry checks are not integrated.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePreFill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-indigo-300 font-medium transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore Synthetic Demo</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            {/* Section 1: Company Profile */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>1. Company &amp; Entity Identifiers</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Supplier / Company Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Industrial Tech Solutions Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Website / Domain <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. apexindustrial-tech.in"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    CIN (Corporate Identification Number)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. U29253MH2021PTC368942"
                    value={cin}
                    onChange={(e) => setCin(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    GSTIN (Goods and Services Tax ID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 27AAACA1234B1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Vendor Claimed Headcount / Staffing Scale
                </label>
                <input
                  type="text"
                  placeholder="e.g. 250+ full-time factory and engineering operators"
                  value={claimedEmployees}
                  onChange={(e) => setClaimedEmployees(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Section 2: Founder & Key Executive */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>2. Founder / Key Executive Intelligence</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Founder / Principal Director Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Malhotra"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                You can upload supplier PDFs/invoices on the next screen.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Orchestrating Agents...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Investigate Supplier</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
