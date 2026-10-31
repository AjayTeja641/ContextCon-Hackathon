// ==============================================================================
// MODULE 3: DOCUMENT INTELLIGENCE AGENT
// Multimodal Forensic Verification via Google Gemini
// ==============================================================================

import { UploadedDocument, Finding, CompanyProfile } from "@/types";
import { geminiService } from "@/lib/gemini/client";

export class DocumentAgent {
  public async analyzeDocument(params: {
    investigationId: string;
    filename: string;
    mimeType: string;
    fileSizeBytes: number;
    base64Data: string;
    companyProfile: Partial<CompanyProfile>;
  }): Promise<{
    document: UploadedDocument;
    findings: Finding[];
  }> {
    const findings: Finding[] = [];
    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Default authenticity disclaimer required by specification
    const authenticityDisclaimer =
      "AI document comparison checks textual consistency only; it does not authenticate legal documents or verify government records.";

    if (!geminiService.isConfigured()) {
      // Fallback extraction when GEMINI_API_KEY is not supplied
      const doc: UploadedDocument = {
        id: docId,
        filename: params.filename,
        fileType: params.mimeType,
        fileSizeBytes: params.fileSizeBytes,
        uploadedAt: new Date().toISOString(),
        documentType: "OTHER",
        extractedFields: [
          {
            fieldKey: "file_status",
            label: "Document Ingestion Status",
            extractedValue: "Extraction unavailable: Gemini API not configured.",
            confidence: 0.9,
          },
        ],
        comparisons: [],
        consistencyScore: 0,
        authenticityDisclaimer,
      };

      findings.push({
        id: `f-doc-${Date.now()}-mock`,
        investigationId: params.investigationId,
        title: "Document Ingested into Pipeline",
        description: `Uploaded file ${params.filename} (${(params.fileSizeBytes / 1024).toFixed(1)} KB) received.`,
        module: "DOCUMENT",
        classification: "UPLOADED_DOCUMENT",
        confidenceLevel: "MEDIUM",
        verificationStatus: "REQUIRES_REVIEW",
        sourceName: `Uploaded Document: ${params.filename}`,
        retrievalDate: new Date().toISOString(),
        evidenceExcerpt: `MIME: ${params.mimeType}, Size: ${params.fileSizeBytes} bytes.`,
        isDiscrepancy: false,
        severity: "INFO",
      });

      return { document: doc, findings };
    }

    try {
      // 1. Call Gemini Multimodal Document Analysis
      const analysis = await geminiService.analyzeDocument({
        base64Data: params.base64Data,
        mimeType: params.mimeType,
        filename: params.filename,
        companyClaim: {
          companyName: params.companyProfile.companyName || "Unknown Company",
          domain: params.companyProfile.domain || "",
          cin: params.companyProfile.cin,
          gstin: params.companyProfile.gstin,
          claimedAddress: params.companyProfile.headquarters?.fullAddress,
        },
      });

      const doc: UploadedDocument = {
        id: docId,
        filename: params.filename,
        fileType: params.mimeType,
        fileSizeBytes: params.fileSizeBytes,
        uploadedAt: new Date().toISOString(),
        documentType: analysis.documentType as any,
        extractedFields: analysis.extractedFields,
        comparisons: analysis.comparisons,
        consistencyScore: analysis.consistencyScore,
        authenticityDisclaimer,
      };

      // 2. Map discrepancies into global Findings
      const mismatches = analysis.comparisons.filter(
        (c) => c.status === "MISMATCH" || c.status === "REQUIRES_REVIEW"
      );

      if (mismatches.length > 0) {
        mismatches.forEach((m) => {
          findings.push({
            id: `f-doc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            investigationId: params.investigationId,
            title: `Document Discrepancy: ${m.field}`,
            description: m.discrepancyReason || `Value in ${params.filename} diverges from profile.`,
            module: "DOCUMENT",
            classification: "UPLOADED_DOCUMENT",
            confidenceLevel: "HIGH",
            verificationStatus: m.status === "MISMATCH" ? "CONTRADICTED" : "REQUIRES_REVIEW",
            sourceName: `Uploaded Document: ${params.filename}`,
            retrievalDate: new Date().toISOString(),
            evidenceExcerpt: `Document value: "${m.uploadedDocumentValue}" vs Claimed profile: "${m.companyProfileValue}".`,
            isDiscrepancy: true,
            severity: m.status === "MISMATCH" ? "HIGH" : "MEDIUM",
          });
        });
      } else {
        findings.push({
          id: `f-doc-${Date.now()}-match`,
          investigationId: params.investigationId,
          title: "Document Fields Consistent with Company Intake",
          description: `Extracted fields from ${params.filename} align with claimed identity.`,
          module: "DOCUMENT",
          classification: "UPLOADED_DOCUMENT",
          confidenceLevel: "HIGH",
          verificationStatus: "VERIFIED",
          sourceName: `Uploaded Document: ${params.filename}`,
          retrievalDate: new Date().toISOString(),
          evidenceExcerpt: `Consistency Score: ${analysis.consistencyScore}%.`,
          isDiscrepancy: false,
          severity: "INFO",
        });
      }

      return { document: doc, findings };
    } catch (err: any) {
      console.error("Document agent analysis error:", err);
      throw err;
    }
  }
}

export const documentAgent = new DocumentAgent();
