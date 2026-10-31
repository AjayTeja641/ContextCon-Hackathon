"use client";

import React from "react";
import { FounderProfile } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  GraduationCap,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  ThumbsUp,
} from "lucide-react";

interface FounderTabProps {
  founders: FounderProfile[];
}

export function FounderTab({ founders }: FounderTabProps) {
  if (!founders || founders.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400">
        No founder or executive intelligence records available.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {founders.map((founder) => (
        <div key={founder.id} className="space-y-6">
          {/* Main Founder Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/20">
                  {founder.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-100">{founder.fullName}</h2>
                    <Badge
                      variant={
                        founder.identityConfidence.level === "HIGH"
                          ? "success"
                          : founder.identityConfidence.level === "MEDIUM"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{founder.identityConfidence.level} Identity Confidence</span>
                    </Badge>
                  </div>
                  <div className="text-xs text-indigo-400 font-medium mt-0.5">
                    {founder.currentTitle} • {founder.companyName}
                  </div>
                  {founder.location && (
                    <div className="text-xs text-slate-400 mt-1">{founder.location}</div>
                  )}
                </div>
              </div>

              {founder.linkedinUrl && (
                <a
                  href={founder.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 text-xs transition-colors"
                >
                  <span>Crustdata LinkedIn Dossier</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Identity Guardrail Callout */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-300">Identity Corroboration: </span>
                <span className="text-slate-400">{founder.identityConfidence.reason}</span>
                {founder.identityConfidence.isAmbiguous && (
                  <p className="text-amber-400 font-medium mt-1">
                    Warning: Profile identity is ambiguous. Similar named entities exist in registry.
                  </p>
                )}
              </div>
            </div>

            {/* Summary */}
            {founder.summary && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300 leading-relaxed">
                {founder.summary}
              </div>
            )}
          </div>

          {/* Key Concerns Callout */}
          {founder.keyConcerns && founder.keyConcerns.length > 0 && (
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/50 shadow-xl">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Executive Background Flags ({founder.keyConcerns.length})</span>
              </div>
              <div className="space-y-3">
                {founder.keyConcerns.map((concern, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-900/40 text-xs space-y-1.5"
                  >
                    <div className="font-semibold text-slate-200">{concern.title}</div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{concern.detail}</p>
                    <div className="text-[10px] text-slate-500 pt-1">
                      Source: {concern.sourceName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Timeline & Previous Ventures */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 text-slate-200 text-sm font-semibold mb-4">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Professional Career Timeline</span>
              </div>

              <div className="space-y-4">
                {founder.professionalTimeline.map((item, idx) => (
                  <div key={idx} className="relative pl-6 pb-4 border-l border-slate-800 last:pb-0">
                    <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900"></div>
                    <div className="text-xs font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-indigo-300 font-medium">{item.companyName}</div>
                    <div className="text-[10px] text-slate-500">
                      {item.startDate || "Date unlisted"} — {item.isCurrent ? "Present" : item.endDate || "Past"}
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Previous Ventures & Education */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-2 text-slate-200 text-sm font-semibold mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Prior Directorships &amp; Ventures</span>
                </div>
                {founder.previousVentures.length > 0 ? (
                  <div className="space-y-3">
                    {founder.previousVentures.map((pv, idx) => {
                      const isStruckOff =
                        pv.status?.toLowerCase().includes("struck off") ||
                        pv.status?.toLowerCase().includes("dissolved");
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border text-xs ${
                            isStruckOff
                              ? "bg-rose-950/20 border-rose-900/50"
                              : "bg-slate-950 border-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-200">{pv.companyName}</span>
                            <Badge variant={isStruckOff ? "destructive" : "outline"}>
                              {pv.status || "Prior Venture"}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">Role: {pv.role}</div>
                          {pv.yearsActive && (
                            <div className="text-[10px] text-slate-500">Years: {pv.yearsActive}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No prior ventures identified in registry.</p>
                )}
              </div>

              {/* Education */}
              {founder.education.length > 0 && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                  <div className="flex items-center gap-2 text-slate-200 text-sm font-semibold mb-3">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Education Background</span>
                  </div>
                  <div className="space-y-2.5">
                    {founder.education.map((edu, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        <div className="font-semibold text-slate-200">{edu.institutionName}</div>
                        <div className="text-[11px] text-slate-400">
                          {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                        </div>
                        {edu.startYear && (
                          <div className="text-[10px] text-slate-500">
                            {edu.startYear} - {edu.endYear || "Completed"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Posts (Crustdata Posts API) */}
          {founder.publicPosts && founder.publicPosts.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-200 text-sm font-semibold">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>Public Posts &amp; Social Intelligence (Crustdata Posts API)</span>
                </div>
                <Badge variant="indigo">{founder.publicPosts.length} Retrieved Posts</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {founder.publicPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span className="font-mono text-indigo-400">{post.platform}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px] italic">
                        "{post.text}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-slate-400" />
                          {post.engagement?.likes || 0}
                        </span>
                        <span>{post.engagement?.comments || 0} comments</span>
                      </div>
                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          View Original <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
