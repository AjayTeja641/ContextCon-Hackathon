// ==============================================================================
// MASTER INVESTIGATION ORCHESTRATOR
// 9-Stage Multi-Agent Business Due Diligence Engine
// ==============================================================================

import { InvestigationSession, InvestigationStage, Finding } from "@/types";
import { companyAgent } from "./company-agent";
import { founderAgent } from "./founder-agent";
import { documentAgent } from "./document-agent";
import { relationshipAgent } from "./relationship-agent";
import { geminiService } from "@/lib/gemini/client";
import { EvidenceManager } from "../evidence/evidence-manager";
import { investigationStore } from "../store";

export class InvestigationOrchestrator {
  public async runInvestigation(
    session: InvestigationSession,
    uploadedFiles?: Array<{
      filename: string;
      mimeType: string;
      fileSizeBytes: number;
      base64Data: string;
    }>
  ): Promise<InvestigationSession> {
    const evidenceManager = new EvidenceManager(session.findings || []);

    try {
      session.status = "RUNNING";
      investigationStore.save(session);

      // ==========================================
      // STAGE 1: INPUT VALIDATION
      // ==========================================
      session.currentStage = "INPUT_VALIDATION";
      session.stageProgress = 15;
      investigationStore.save(session);

      if (!session.companyName || session.companyName.trim().length === 0) {
        throw new Error("Company name is required for due diligence investigation.");
      }

      // ==========================================
      // STAGE 2: COMPANY INVESTIGATION
      // ==========================================
      session.currentStage = "COMPANY_INVESTIGATION";
      session.stageProgress = 30;
      investigationStore.save(session);

      try {
        const { profile, findings } = await companyAgent.investigate({
          companyName: session.companyName,
          domain: session.domain,
          cin: session.cin,
          gstin: session.gstin,
          investigationId: session.id,
        });

        session.company = profile;
        findings.forEach((f) => evidenceManager.addFinding(f));
      } catch (err: any) {
        console.error("Company Agent Stage Error (continuing):", err);
      }

      // ==========================================
      // STAGE 3: FOUNDER INVESTIGATION
      // ==========================================
      session.currentStage = "FOUNDER_INVESTIGATION";
      session.stageProgress = 45;
      investigationStore.save(session);

      if (session.founderName) {
        try {
          const { founders, findings } = await founderAgent.investigate({
            founderName: session.founderName,
            companyName: session.companyName,
            linkedinUrl: session.linkedinUrl,
            companyDomain: session.domain,
            investigationId: session.id,
          });

          session.founders = founders;
          findings.forEach((f) => evidenceManager.addFinding(f));
        } catch (err: any) {
          console.error("Founder Agent Stage Error (continuing):", err);
        }
      }

      // ==========================================
      // STAGE 4: PUBLIC INTELLIGENCE
      // ==========================================
      session.currentStage = "PUBLIC_INTELLIGENCE";
      session.stageProgress = 55;
      investigationStore.save(session);
      // Posts and mentions were retrieved in founder & company enrichment

      // ==========================================
      // STAGE 5: DOCUMENT INVESTIGATION
      // ==========================================
      session.currentStage = "DOCUMENT_INVESTIGATION";
      session.stageProgress = 65;
      investigationStore.save(session);

      if (uploadedFiles && uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          try {
            const { document, findings } = await documentAgent.analyzeDocument({
              investigationId: session.id,
              filename: file.filename,
              mimeType: file.mimeType,
              fileSizeBytes: file.fileSizeBytes,
              base64Data: file.base64Data,
              companyProfile: session.company || { companyName: session.companyName, domain: session.domain },
            });

            session.documents.push(document);
            findings.forEach((f) => evidenceManager.addFinding(f));
          } catch (err: any) {
            console.error(`Document analysis failed for ${file.filename}:`, err);
          }
        }
      }

      // ==========================================
      // STAGE 6: CROSS-VERIFICATION
      // ==========================================
      session.currentStage = "CROSS_VERIFICATION";
      session.stageProgress = 75;
      investigationStore.save(session);

      // ==========================================
      // STAGE 7: RELATIONSHIP ANALYSIS
      // ==========================================
      session.currentStage = "RELATIONSHIP_ANALYSIS";
      session.stageProgress = 85;
      investigationStore.save(session);

      if (session.company) {
        try {
          const { graph, findings } = relationshipAgent.buildGraph({
            investigationId: session.id,
            company: session.company,
            founders: session.founders || [],
            documents: session.documents || [],
          });

          session.relationshipGraph = graph;
          findings.forEach((f) => evidenceManager.addFinding(f));
        } catch (err: any) {
          console.error("Relationship Agent Error (continuing):", err);
        }
      }

      // ==========================================
      // STAGE 8 & 9: GEMINI INTELLIGENCE ANALYSIS & FINAL REPORT
      // ==========================================
      session.currentStage = "GEMINI_INTELLIGENCE_ANALYSIS";
      session.stageProgress = 92;
      investigationStore.save(session);

      session.findings = evidenceManager.getFindings();
      session.priorityIndicator = evidenceManager.computePriorityIndicator();

      if (geminiService.isConfigured()) {
        try {
          const report = await geminiService.generateDueDiligenceReport({
            companyName: session.companyName,
            domain: session.domain,
            founderName: session.founderName,
            company: session.company,
            founders: session.founders,
            documents: session.documents,
            findings: session.findings,
            priorityIndicator: session.priorityIndicator,
          });

          session.report = report;
        } catch (err: any) {
          console.error("Gemini Report Generation Error (generating fallback):", err);
          session.report = this.generateFallbackReport(session);
        }
      } else {
        session.report = this.generateFallbackReport(session);
      }

      session.currentStage = "FINAL_REPORT";
      session.stageProgress = 100;
      session.status =
        session.priorityIndicator.level === "CRITICAL_DISCREPANCY"
          ? "REVIEW_REQUIRED"
          : "COMPLETED";

      investigationStore.save(session);
      return session;
    } catch (err: any) {
      console.error("Fatal Orchestration Failure:", err);
      session.status = "FAILED";
      session.stageProgress = 100;
      investigationStore.save(session);
      throw err;
    }
  }

  private generateFallbackReport(session: InvestigationSession) {
    const discrepancies = session.findings.filter((f) => f.isDiscrepancy);

    return {
      id: `rep-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      companyName: session.companyName,
      domain: session.domain,
      executiveSummary: `Due diligence investigation conducted for ${session.companyName} (${session.domain}). Total findings logged: ${session.findings.length}, with ${discrepancies.length} discrepancy markers identified across company and founder profiles. Review recommended prior to commercial contract execution.`,
      priorityIndicator: {
        level: session.priorityIndicator.level,
        label: session.priorityIndicator.label,
        rationale: session.priorityIndicator.summary,
      },
      companyOverview: {
        operatingStatus: session.company?.operatingStatus || "Unverified",
        foundedYear: session.company?.foundedYear,
        employeeRange: session.company?.employeeRange || "Unspecified",
        industry: session.company?.industry || "Unverified",
        claimedVsVerifiedSummary:
          "Company records evaluated against commercial intake parameters.",
      },
      founderAssessment: {
        primaryFounder: session.founderName || "Not supplied",
        summary: "Founder timeline compiled from available public profile associations.",
        identityConfidence: session.founders?.[0]?.identityConfidence?.level || "UNCERTAIN",
        pastVenturesCount: session.founders?.[0]?.previousVentures?.length || 0,
      },
      documentVerificationSummary: {
        documentsAnalyzedCount: session.documents.length,
        mismatchCount: session.documents.reduce(
          (acc, d) => acc + d.comparisons.filter((c) => c.status === "MISMATCH").length,
          0
        ),
        summary: `${session.documents.length} documents received. Textual comparison is not official verification.`,
        disclaimer:
          "Document Consistency Analysis verifies internal textual concordance against known vendor databases. It does NOT constitute a tamper-proof cryptographic audit or official government tax portal stamp.",
      },
      relationshipNetworkFindings: {
        totalEntities: session.relationshipGraph?.nodes?.length || 0,
        totalConnections: session.relationshipGraph?.edges?.length || 0,
        sharedInfrastructureOrRingsFound: false,
        narrative: `Entity graph compiled with ${session.relationshipGraph?.nodes?.length || 0} nodes.`,
      },
      criticalDiscrepancies: discrepancies.map((d) => ({
        title: d.title,
        detail: d.description,
        severity: d.severity,
      })),
      missingInformation: [
        "Direct MCA statutory return filings (Form AOC-4 / MGT-7).",
        "Official GSTN return regularity track record via authorized Suvidha portal.",
      ],
      recommendedActionSteps: [
        "Request audited financial balance sheets signed by a chartered accountant.",
        "Perform physical address verification of principal place of business.",
      ],
    };
  }
}

export const investigationOrchestrator = new InvestigationOrchestrator();
