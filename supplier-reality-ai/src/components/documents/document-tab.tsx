"use client";

import React, { useState } from "react";
import { UploadedDocument } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  Loader2,
} from "lucide-react";

interface DocumentTabProps {
  documents: UploadedDocument[];
  investigationId: string;
  onDocumentUploaded?: () => void;
}

export function DocumentTab({ documents, investigationId, onDocumentUploaded }: DocumentTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/investigations/${investigationId}/upload`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to process document");
      }

      setUploadSuccess(`Successfully analyzed "${file.name}" with Gemini Multimodal AI.`);
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Forensic Document Ingestion &amp; Gemini Multimodal Analysis</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload GST certificates, MCA incorporation papers, PAN cards, or financial statements (PDF, PNG, JPG).
            </p>
          </div>

          <label className="relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] shrink-0">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Fields...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Upload Document</span>
              </>
            )}
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg,image/jpg"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {uploadError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs">
            {uploadError}
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      {documents.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 text-slate-400">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium">No documents uploaded for this investigation yet.</p>
          <p className="text-xs text-slate-500 mt-1">
            Upload vendor tax certificates or incorporation documents above to run cross-verification.
          </p>
        </div>
      ) : (
        documents.map((doc) => (
          <div key={doc.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            {/* Doc Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{doc.filename}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span className="font-mono">{doc.documentType}</span>
                    <span>•</span>
                    <span>{(doc.fileSizeBytes / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-200">
                    {doc.consistencyScore}% Concordance
                  </div>
                  <div className="text-[10px] text-slate-500">Gemini Consistency Index</div>
                </div>
              </div>
            </div>

            {/* Extracted Fields Table */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Extracted Forensic Fields
              </h5>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3.5 font-medium">Field Identifier</th>
                      <th className="py-2.5 px-3.5 font-medium">Extracted Value</th>
                      <th className="py-2.5 px-3.5 font-medium">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                    {doc.extractedFields.map((f, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3.5 font-medium text-slate-300">{f.label}</td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-200">{f.extractedValue}</td>
                        <td className="py-2.5 px-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                            {(f.confidence * 100).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison Cross-Check Table */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Cross-Verification Against Claimed Supplier Profile
              </h5>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3.5 font-medium">Field</th>
                      <th className="py-2.5 px-3.5 font-medium">Document Value</th>
                      <th className="py-2.5 px-3.5 font-medium">Claimed / Enriched Value</th>
                      <th className="py-2.5 px-3.5 font-medium">Result</th>
                      <th className="py-2.5 px-3.5 font-medium">Forensic Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
                    {doc.comparisons.map((comp, idx) => {
                      const getStatusBadge = () => {
                        switch (comp.status) {
                          case "MATCH":
                            return (
                              <Badge variant="success">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Match</span>
                              </Badge>
                            );
                          case "MISMATCH":
                            return (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3" />
                                <span>Mismatch</span>
                              </Badge>
                            );
                          case "REQUIRES_REVIEW":
                            return (
                              <Badge variant="warning">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Review</span>
                              </Badge>
                            );
                          default:
                            return (
                              <Badge variant="outline">
                                <HelpCircle className="w-3 h-3" />
                                <span>Unlisted</span>
                              </Badge>
                            );
                        }
                      };

                      return (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3.5 font-medium text-slate-300">{comp.field}</td>
                          <td className="py-2.5 px-3.5 text-slate-200 font-mono text-[11px]">
                            {comp.uploadedDocumentValue}
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-400 text-[11px]">
                            {comp.companyProfileValue}
                          </td>
                          <td className="py-2.5 px-3.5">{getStatusBadge()}</td>
                          <td className="py-2.5 px-3.5 text-[11px] text-slate-400 leading-relaxed max-w-xs">
                            {comp.discrepancyReason || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mandatory Authenticity Disclaimer */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300">Statutory Notice: </span>
                {doc.authenticityDisclaimer}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
