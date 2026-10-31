// ==============================================================================
// EVIDENCE MANAGER & EXPLAINABLE RISK SYNTHESIZER
// ==============================================================================

import { Finding, PriorityLevel, PriorityLevel as LevelType } from "@/types";
import { FindingValidator } from "./finding-validator";

export class EvidenceManager {
  private findings: Finding[] = [];

  constructor(initialFindings: Finding[] = []) {
    this.findings = [...initialFindings];
  }

  public addFinding(finding: Finding): void {
    const { isValid, errors } = FindingValidator.validate(finding);
    if (!isValid) {
      console.warn("EvidenceManager: Finding validation failed:", errors, finding);
    }
    this.findings.push(finding);
  }

  public getFindings(): Finding[] {
    return this.findings;
  }

  public getDiscrepancies(): Finding[] {
    return this.findings.filter((f) => f.isDiscrepancy);
  }

  /**
   * Explainable priority indicator calculation (NO BLACK-BOX FRAUD SCORES).
   * Generates a clear audit factor breakdown explaining why this supplier is assigned a specific priority.
   */
  public computePriorityIndicator(): {
    level: PriorityLevel;
    label: string;
    summary: string;
    scoreFactors: Array<{
      factor: string;
      impact: "POSITIVE" | "NEUTRAL" | "RISK";
      description: string;
    }>;
  } {
    const discrepancies = this.getDiscrepancies();
    const criticalDiscrepancies = discrepancies.filter((d) => d.severity === "CRITICAL" || d.severity === "HIGH");

    const scoreFactors: Array<{
      factor: string;
      impact: "POSITIVE" | "NEUTRAL" | "RISK";
      description: string;
    }> = [];

    // Factor 1: Verified official registration
    const officialVerified = this.findings.filter((f) => f.classification === "OFFICIALLY_VERIFIED");
    if (officialVerified.length > 0) {
      scoreFactors.push({
        factor: "Official Entity Incorporation",
        impact: "POSITIVE",
        description: "Legal existence corroborated via corporate registry data.",
      });
    }

    // Factor 2: Discrepancies
    if (criticalDiscrepancies.length > 0) {
      criticalDiscrepancies.forEach((d) => {
        scoreFactors.push({
          factor: d.title,
          impact: "RISK",
          description: d.description,
        });
      });
    }

    // Determine level
    let level: PriorityLevel = "STANDARD";
    let label = "Standard Review — Clean Baseline";
    let summary = "No critical discrepancies or shell company motifs flagged across available records.";

    if (criticalDiscrepancies.length >= 2) {
      level = "CRITICAL_DISCREPANCY";
      label = "Critical Discrepancies Flagged — Immediate Audit Required";
      summary = `Identified ${criticalDiscrepancies.length} high-severity contradictions between claimed supplier profile and commercial registry traces.`;
    } else if (discrepancies.length > 0) {
      level = "ELEVATED_REVIEW";
      label = "Elevated Review Recommended";
      summary = `Identified ${discrepancies.length} discrepancy requiring analyst reconciliation before onboarding.`;
    }

    return {
      level,
      label,
      summary,
      scoreFactors,
    };
  }
}
