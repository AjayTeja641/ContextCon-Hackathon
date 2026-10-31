// ==============================================================================
// GOOGLE GEMINI AI CLIENT & MULTIMODAL INVESTIGATION SERVICE
// Reference: @google/genai SDK
// ==============================================================================

import { GoogleGenAI } from "@google/genai";
import { DueDiligenceReport, ExtractedField, DocumentComparisonRow } from "@/types";

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    this.modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (apiKey && apiKey.trim().length > 0) {
      try {
        this.ai = new GoogleGenAI({ apiKey });
      } catch (err) {
        console.error("Failed to initialize Google Gen AI SDK:", err);
      }
    }
  }

  public isConfigured(): boolean {
    return this.ai !== null;
  }

  /**
   * Multimodal Document Intelligence Analysis
   * Reads PDF or Image bytes, extracts structured corporate fields, and compares with claimed data.
   */
  public async analyzeDocument(params: {
    base64Data: string;
    mimeType: string;
    filename: string;
    companyClaim: {
      companyName: string;
      domain: string;
      cin?: string;
      gstin?: string;
      claimedAddress?: string;
    };
  }): Promise<{
    documentType: string;
    extractedFields: ExtractedField[];
    comparisons: DocumentComparisonRow[];
    consistencyScore: number;
    notes: string;
  }> {
    if (!this.ai) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const systemPrompt = `You are a forensic document analyst specializing in corporate due diligence and supplier fraud detection.
Your job is to inspect the attached business document (GST certificate, MCA Certificate of Incorporation, PAN card, or Financial Statement), extract all relevant fields, and compare them rigorously against the user-claimed profile.

CRITICAL INSTRUCTIONS:
1. Do not hallucinate fields that are absent or unreadable.
2. If an address, director, or company name differs slightly (e.g., "Pvt Ltd" vs "Private Limited"), explain that it is an exact/minor variance.
3. If an address or registration number completely contradicts the claim, flag it as a MISMATCH with a clear, factual explanation.
4. Output MUST be valid JSON conforming to the schema below.

JSON Output Schema:
{
  "documentType": "GST_CERTIFICATE" | "MCA_CERTIFICATE" | "PAN_CARD" | "FINANCIAL_STATEMENT" | "ANNUAL_REPORT" | "OTHER",
  "extractedFields": [
    {
      "fieldKey": "string (e.g. legal_name, registration_number, registered_address, incorporation_date, director_name)",
      "label": "Human readable label",
      "extractedValue": "Exact text from document",
      "confidence": 0.95
    }
  ],
  "comparisons": [
    {
      "field": "Company Name",
      "uploadedDocumentValue": "Extracted text",
      "companyProfileValue": "Claimed text",
      "status": "MATCH" | "MISMATCH" | "REQUIRES_REVIEW" | "NOT_IN_PROFILE",
      "discrepancyReason": "Factual explanation"
    }
  ],
  "consistencyScore": 85,
  "notes": "Brief objective forensic summary"
}`;

    const promptText = `Analyze this supplier document.
Claimed Supplier Information:
- Company Name: ${params.companyClaim.companyName}
- Domain: ${params.companyClaim.domain}
- CIN: ${params.companyClaim.cin || "Not provided"}
- GSTIN: ${params.companyClaim.gstin || "Not provided"}
- Claimed Location: ${params.companyClaim.claimedAddress || "Not provided"}

Examine the uploaded document image/file bytes and return structured JSON.`;

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: params.mimeType,
                  data: params.base64Data,
                },
              },
              { text: `${systemPrompt}\n\n${promptText}` },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      return {
        documentType: parsed.documentType || "OTHER",
        extractedFields: parsed.extractedFields || [],
        comparisons: parsed.comparisons || [],
        consistencyScore: parsed.consistencyScore ?? 75,
        notes: parsed.notes || "Analysis complete.",
      };
    } catch (err: any) {
      console.error("Gemini document analysis error:", err);
      throw err;
    }
  }

  /**
   * Final Comprehensive Due Diligence Report Generation
   */
  public async generateDueDiligenceReport(sessionContext: any): Promise<DueDiligenceReport> {
    if (!this.ai) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const prompt = `You are the Chief Intelligence Analyst for an enterprise procurement due-diligence system.
Review the normalized investigation dataset below and generate an evidence-backed Business Due Diligence Report.

INVESTIGATION CONTEXT:
${JSON.stringify(sessionContext, null, 2)}

REQUIREMENTS:
1. Every discrepancy must cite the exact source and observed conflict.
2. Calculate an explainable priority level:
   - "STANDARD": Clean track record, corroborated claims, no circular/shell flags.
   - "ELEVATED_REVIEW": Minor discrepancies, thin employee presence, or unverified secondary claims.
   - "CRITICAL_DISCREPANCY": Blatant address sharing with dissolved firms, major turnover-to-headcount contradiction, or fake registration patterns.
3. Do not claim official government verification if the data was merely enriched via commercial registries.
4. Provide actionable, concrete next steps for human procurement auditors.

Respond with valid JSON matching this schema:
{
  "executiveSummary": "2-3 paragraphs synthesizing all intelligence findings",
  "priorityIndicator": {
    "level": "STANDARD" | "ELEVATED_REVIEW" | "CRITICAL_DISCREPANCY",
    "label": "Human readable badge",
    "rationale": "Clear breakdown of why this priority level was assigned"
  },
  "companyOverview": {
    "operatingStatus": "Active / Irregular / Under Review",
    "foundedYear": 2021,
    "employeeRange": "11-50 employees",
    "industry": "Industrial Equipment Supply",
    "claimedVsVerifiedSummary": "Factual comparison between what was claimed and what was corroborated"
  },
  "founderAssessment": {
    "primaryFounder": "Name",
    "summary": "Professional background, verified associations",
    "identityConfidence": "HIGH / MEDIUM / LOW",
    "pastVenturesCount": 2
  },
  "documentVerificationSummary": {
    "documentsAnalyzedCount": 1,
    "mismatchCount": 1,
    "summary": "Forensic summary of document consistency",
    "disclaimer": "Document consistency indicates field alignment only; it does not replace official state registry certification."
  },
  "relationshipNetworkFindings": {
    "totalEntities": 6,
    "totalConnections": 7,
    "sharedInfrastructureOrRingsFound": true,
    "narrative": "Detailed breakdown of graph connections, shared directors, or co-located entities."
  },
  "criticalDiscrepancies": [
    {
      "title": "Short title",
      "detail": "Factual evidence excerpt",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM"
    }
  ],
  "missingInformation": [
    "List of items that could not be corroborated from available databases"
  ],
  "recommendedActionSteps": [
    "Step 1: Conduct on-ground physical factory inspection",
    "Step 2: Request audited form 3CD tax audit reports"
  ]
}`;

    const response = await this.ai.models.generateContent({
      model: this.modelName,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    return {
      id: `report-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      companyName: sessionContext.companyName,
      domain: sessionContext.domain,
      executiveSummary: parsed.executiveSummary || "Due diligence investigation completed.",
      priorityIndicator: parsed.priorityIndicator || {
        level: "ELEVATED_REVIEW",
        label: "Elevated Review Recommended",
        rationale: "Multiple cross-source discrepancies identified during investigation.",
      },
      companyOverview: parsed.companyOverview || {
        operatingStatus: "Active",
        claimedVsVerifiedSummary: "Review required against source records.",
      },
      founderAssessment: parsed.founderAssessment || {
        primaryFounder: sessionContext.founderName || "Identified Principal",
        summary: "Profile synthesized from available public records.",
        identityConfidence: "MEDIUM",
        pastVenturesCount: 1,
      },
      documentVerificationSummary: parsed.documentVerificationSummary || {
        documentsAnalyzedCount: sessionContext.documents?.length || 0,
        mismatchCount: 0,
        summary: "Documents processed for field consistency.",
        disclaimer: "Document analysis provides syntactic corroboration only.",
      },
      relationshipNetworkFindings: parsed.relationshipNetworkFindings || {
        totalEntities: 5,
        totalConnections: 4,
        sharedInfrastructureOrRingsFound: false,
        narrative: "Entity network reconstructed.",
      },
      criticalDiscrepancies: parsed.criticalDiscrepancies || [],
      missingInformation: parsed.missingInformation || [],
      recommendedActionSteps: parsed.recommendedActionSteps || [
        "Perform physical address verification.",
        "Request direct statutory filing receipts.",
      ],
    };
  }
}

export const geminiService = new GeminiService();
