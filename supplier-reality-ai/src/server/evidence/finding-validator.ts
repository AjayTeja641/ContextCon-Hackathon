// ==============================================================================
// FINDING VALIDATOR & EVIDENCE AUDITING
// ==============================================================================

import { Finding, FindingClassification } from "@/types";

const VALID_CLASSIFICATIONS: FindingClassification[] = [
  "OFFICIALLY_VERIFIED",
  "THIRD_PARTY_REPORTED",
  "COMPANY_SELF_REPORTED",
  "PUBLIC_SOCIAL_MEDIA",
  "UPLOADED_DOCUMENT",
  "AI_GENERATED_INFERENCE",
  "UNVERIFIED_CLAIM",
];

export class FindingValidator {
  public static validate(finding: Partial<Finding>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!finding.title || finding.title.trim().length === 0) {
      errors.push("Finding must have a non-empty title.");
    }

    if (!finding.description || finding.description.trim().length === 0) {
      errors.push("Finding must have a non-empty description.");
    }

    if (!finding.classification || !VALID_CLASSIFICATIONS.includes(finding.classification)) {
      errors.push(
        `Invalid classification: ${finding.classification}. Must be one of: ${VALID_CLASSIFICATIONS.join(", ")}`
      );
    }

    if (!finding.sourceName || finding.sourceName.trim().length === 0) {
      errors.push("Finding must clearly cite a sourceName.");
    }

    if (!finding.evidenceExcerpt || finding.evidenceExcerpt.trim().length === 0) {
      errors.push("Finding must contain a verifiable evidenceExcerpt.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
