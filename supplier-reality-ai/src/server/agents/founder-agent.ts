// ==============================================================================
// MODULE 2: FOUNDER & EXECUTIVE INTELLIGENCE AGENT
// ==============================================================================

import { FounderProfile, Finding, SocialPostItem } from "@/types";
import { crustdataClient } from "@/lib/crustdata/client";

export class FounderAgent {
  public async investigate(params: {
    founderName: string;
    companyName: string;
    linkedinUrl?: string;
    companyDomain?: string;
    investigationId: string;
  }): Promise<{
    founders: FounderProfile[];
    findings: Finding[];
  }> {
    const findings: Finding[] = [];
    const founders: FounderProfile[] = [];

    if (!params.founderName || params.founderName.trim().length === 0) {
      return { founders, findings };
    }

    // 1. Query Crustdata People Enrichment
    let enrichedData: any = null;
    if (params.linkedinUrl) {
      const result = await crustdataClient.enrichPerson({
        linkedinUrl: params.linkedinUrl,
        fullName: params.founderName,
        companyDomain: params.companyDomain,
      });
      if (result.success) {
        enrichedData = result.data;
      }
    }

    // 2. Query Crustdata Posts API
    let publicPosts: SocialPostItem[] = [];
    const postsResult = await crustdataClient.searchPosts({
      keyword: params.founderName,
      limit: 5,
    });

    if (postsResult.success && Array.isArray(postsResult.data)) {
      publicPosts = postsResult.data.map((post: any, idx: number) => ({
        id: `post-${idx}`,
        platform: "LINKEDIN",
        authorName: params.founderName,
        publishedAt: post.created_at || post.date || "",
        text: post.text || post.content || "",
        url: post.share_url || post.url,
        engagement: {
          likes: post.total_reactions || 0,
          comments: post.total_comments || 0,
        },
        sentiment: "NEUTRAL",
      }));
    }

    // 3. Assemble Founder Profile
    if (enrichedData) {
      const normalized = crustdataClient.normalizePersonData(
        enrichedData,
        params.founderName,
        params.companyName
      );

      const founderProfile: FounderProfile = {
        id: `fnd-${Date.now()}`,
        fullName: normalized.fullName || params.founderName,
        currentTitle: normalized.currentTitle || "Role unverified",
        companyName: params.companyName,
        linkedinUrl: params.linkedinUrl,
        headline: normalized.headline,
        summary: normalized.summary,
        location: normalized.location,
        identityConfidence: normalized.identityConfidence || {
          level: "LOW",
          reason: "Match and employer association still require independent review.",
          isAmbiguous: true,
        },
        professionalTimeline: normalized.professionalTimeline || [],
        education: normalized.education || [],
        previousVentures: normalized.previousVentures || [],
        publicPosts: publicPosts,
        mediaCoverage: [],
        keyConcerns: normalized.keyConcerns || [],
      };

      founders.push(founderProfile);

      findings.push({
        id: `f-fnd-${Date.now()}-1`,
        investigationId: params.investigationId,
        title: "Founder Professional Career Track Corroborated",
        description: `Professional profile returned for ${founderProfile.fullName}; confirm identity and employer association before relying on the timeline.`,
        module: "FOUNDER",
        classification: "THIRD_PARTY_REPORTED",
        confidenceLevel: "HIGH",
        verificationStatus: "REQUIRES_REVIEW",
        sourceName: "Crustdata People Enrichment API",
        sourceUrl: params.linkedinUrl,
        retrievalDate: new Date().toISOString(),
        evidenceExcerpt: `Current role: ${founderProfile.currentTitle} at ${params.companyName}.`,
        isDiscrepancy: false,
        severity: "INFO",
      });
    } else {
      // Fallback profile when unindexed or without LinkedIn URL
      const fallbackProfile: FounderProfile = {
        id: `fnd-${Date.now()}`,
        fullName: params.founderName,
        currentTitle: "Role not independently verified",
        companyName: params.companyName,
        linkedinUrl: params.linkedinUrl,
        location: undefined,
        identityConfidence: {
          level: "LOW",
          reason:
            "No corroborated professional identity; this name is supplied by the user only.",
          isAmbiguous: true,
        },
        professionalTimeline: [],
        education: [],
        previousVentures: [],
        publicPosts: publicPosts,
        mediaCoverage: [],
        keyConcerns: [],
      };

      founders.push(fallbackProfile);

      findings.push({
        id: `f-fnd-${Date.now()}-fallback`,
        investigationId: params.investigationId,
        title: "Founder Identity Subject to Ambiguity Review",
        description: `The identity and claimed company association of ${params.founderName} have not been corroborated.`,
        module: "FOUNDER",
        classification: "UNVERIFIED_CLAIM",
        confidenceLevel: "LOW",
        verificationStatus: "REQUIRES_REVIEW",
        sourceName: "Intake Form",
        retrievalDate: new Date().toISOString(),
        evidenceExcerpt: `User claimed founder name: ${params.founderName}.`,
        isDiscrepancy: false,
        severity: "LOW",
      });
    }

    return {
      founders,
      findings,
    };
  }
}

export const founderAgent = new FounderAgent();
