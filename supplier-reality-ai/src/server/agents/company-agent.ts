// ==============================================================================
// MODULE 1: COMPANY INTELLIGENCE AGENT
// ==============================================================================

import { CompanyProfile, Finding } from "@/types";
import { crustdataClient } from "@/lib/crustdata/client";

export class CompanyAgent {
  public async investigate(params: {
    companyName: string;
    domain: string;
    cin?: string;
    gstin?: string;
    claimedEmployees?: string;
    claimedFoundedYear?: number;
    investigationId: string;
  }): Promise<{
    profile: CompanyProfile;
    findings: Finding[];
  }> {
    const findings: Finding[] = [];
    const discrepancies: Array<{
      field: string;
      userClaimed: string;
      retrievedData: string;
      reason: string;
    }> = [];

    // 1. Call Crustdata Company Enrichment
    const enrichmentResult = await crustdataClient.enrichCompany({
      domain: params.domain,
      companyName: params.companyName,
    });

    let profile: CompanyProfile;

    if (enrichmentResult.success && enrichmentResult.data && (Array.isArray(enrichmentResult.data) ? enrichmentResult.data[0]?.matches?.length > 0 : !!(enrichmentResult.data.matches?.length || enrichmentResult.data.company_data || enrichmentResult.data.company))) {
      const normalized = crustdataClient.normalizeCompanyData(
        enrichmentResult.data,
        params.companyName,
        params.domain
      );

      profile = {
        companyName: normalized.companyName || params.companyName,
        legalName: normalized.legalName || params.companyName,
        domain: params.domain,
        websiteUrl: normalized.websiteUrl || `https://${params.domain}`,
        linkedinUrl: normalized.linkedinUrl,
        cin: params.cin,
        gstin: params.gstin,
        industry: normalized.industry,
        businessDescription: normalized.businessDescription,
        headquarters: normalized.headquarters,
        foundedYear: normalized.foundedYear,
        employeeCount: normalized.employeeCount,
        employeeRange: normalized.employeeRange,
        funding: normalized.funding,
        operatingStatus: normalized.operatingStatus,
        recentNews: normalized.recentNews || [],
        discrepancies: [],
        unverifiedItems: normalized.unverifiedItems || [],
      };

      findings.push({
        id: `f-comp-${Date.now()}-1`,
        investigationId: params.investigationId,
        title: "Company Firmographics Enriched via Crustdata",
        description: `Third-party company profile returned for ${profile.companyName}; official registration has not been verified.`,
        module: "COMPANY",
        classification: "THIRD_PARTY_REPORTED",
        confidenceLevel: "HIGH",
        verificationStatus: "REQUIRES_REVIEW",
        sourceName: "Crustdata Company Enrichment API",
        sourceUrl: undefined,
        retrievalDate: new Date().toISOString(),
        evidenceExcerpt: `Headcount: ${profile.employeeCount || profile.employeeRange}, Founded: ${profile.foundedYear || "Unlisted"}.`,
        isDiscrepancy: false,
        severity: "INFO",
      });
    } else {
      // Graceful fallback when API key is missing or entity is unindexed
      profile = {
        companyName: params.companyName,
        legalName: params.companyName,
        domain: params.domain,
        websiteUrl: `https://${params.domain}`,
        cin: params.cin,
        gstin: params.gstin,
        industry: undefined,
        businessDescription: undefined,
        foundedYear: params.claimedFoundedYear,
        employeeRange: params.claimedEmployees,
        operatingStatus: undefined,
        discrepancies: [],
        unverifiedItems: [
          "Crustdata API enrichment unavailable or entity unindexed.",
          "Statutory GSTIN and CIN requires direct government API gateway.",
        ],
      };

      findings.push({
        id: `f-comp-${Date.now()}-fallback`,
        investigationId: params.investigationId,
        title: "Company Intake Initialized",
        description: `Registered investigation for ${params.companyName} (${params.domain}).`,
        module: "COMPANY",
        classification: "COMPANY_SELF_REPORTED",
        confidenceLevel: "MEDIUM",
        verificationStatus: "REQUIRES_REVIEW",
        sourceName: "User Intake Form",
        retrievalDate: new Date().toISOString(),
        evidenceExcerpt: `Claimed domain: ${params.domain}, CIN: ${params.cin || "Not specified"}.`,
        isDiscrepancy: false,
        severity: "INFO",
      });
    }

    // 2. Cross-check for Discrepancies
    if (params.claimedEmployees && profile.employeeCount) {
      const claimedNum = parseInt(params.claimedEmployees.replace(/[^0-9]/g, ""), 10);
      if (claimedNum > 0 && Math.abs(claimedNum - profile.employeeCount) > 50) {
        discrepancies.push({
          field: "Employee Headcount",
          userClaimed: params.claimedEmployees,
          retrievedData: `${profile.employeeCount} employees reported by Crustdata`,
          reason: `Substantial divergence between claimed workforce (${params.claimedEmployees}) and a third-party reported headcount (${profile.employeeCount}); definitions and freshness may differ.`,
        });

        findings.push({
          id: `f-comp-${Date.now()}-disc`,
          investigationId: params.investigationId,
          title: "Headcount Scale Divergence",
          description: `Claimed ${params.claimedEmployees} but records track ${profile.employeeCount} professionals.`,
          module: "COMPANY",
          classification: "THIRD_PARTY_REPORTED",
          confidenceLevel: "HIGH",
          verificationStatus: "CONTRADICTED",
          sourceName: "Crustdata Company Dataset",
          retrievalDate: new Date().toISOString(),
          evidenceExcerpt: `Third-party estimated headcount: ${profile.employeeCount} vs Claimed: ${params.claimedEmployees}.`,
          isDiscrepancy: true,
          severity: "HIGH",
        });
      }
    }

    profile.discrepancies = discrepancies;

    return {
      profile,
      findings,
    };
  }
}

export const companyAgent = new CompanyAgent();
