// ==============================================================================
// CRUSTDATA API CLIENT & NORMALIZATION LAYER
// Reference: https://crustdata.com / x-api-version: 2025-11-01
// ==============================================================================

import { CompanyProfile, FounderProfile, SocialPostItem } from "@/types";

export interface CrustdataConfig {
  apiKey?: string;
  baseUrl?: string;
  apiVersion?: string;
}

export class CrustdataClient {
  private apiKey: string;
  private baseUrl: string;
  private apiVersion: string;

  constructor(config?: CrustdataConfig) {
    this.apiKey = config?.apiKey || process.env.CRUSTDATA_API_KEY || "";
    this.baseUrl = config?.baseUrl || process.env.CRUSTDATA_API_BASE || "https://api.crustdata.com";
    this.apiVersion = config?.apiVersion || "2025-11-01";
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  private getHeaders(): Record<string, string> {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "x-api-version": this.apiVersion,
      "Content-Type": "application/json",
    };
  }

  /**
   * 1. Company Enrichment API
   * POST https://api.crustdata.com/company/enrich
   */
  public async enrichCompany(params: { domain?: string; companyName?: string }): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    if (!this.isConfigured()) {
      return { success: false, error: "CRUSTDATA_API_KEY is not configured" };
    }

    try {
      const payload: Record<string, unknown> = {
        fields: ["basic_info", "headcount", "funding", "locations"]
      };
      if (params.domain) {
        payload.domains = [params.domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "")];
      } else if (params.companyName) {
        payload.names = [params.companyName];
      } else {
        return { success: false, error: "Either domain or companyName must be provided" };
      }

      const res = await fetch(`${this.baseUrl}/company/enrich`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          error: `Crustdata Company API returned HTTP ${res.status}: ${errorText}`,
        };
      }

      const json = await res.json();
      return { success: true, data: json };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to contact Crustdata Company API" };
    }
  }

  /**
   * 2. People Enrichment API
   * POST https://api.crustdata.com/person/enrich
   */
  public async enrichPerson(params: {
    linkedinUrl?: string;
    fullName?: string;
    companyDomain?: string;
  }): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    if (!this.isConfigured()) {
      return { success: false, error: "CRUSTDATA_API_KEY is not configured" };
    }

    try {
      const body: Record<string, any> = {
        fields: ["basic_profile", "experience", "education"],
      };

      if (params.linkedinUrl) {
        body.professional_network_profile_urls = [params.linkedinUrl];
      } else {
        return {
          success: false,
          error: "LinkedIn profile URL required for Crustdata person enrichment",
        };
      }

      const res = await fetch(`${this.baseUrl}/person/enrich`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          error: `Crustdata People API returned HTTP ${res.status}: ${errorText}`,
        };
      }

      const json = await res.json();
      return { success: true, data: json };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to contact Crustdata People API" };
    }
  }

  /**
   * 3. Professional network social posts search (credit-consuming)
   * POST https://api.crustdata.com/social_post/professional_network/search/live
   */
  public async searchPosts(params: {
    keyword?: string;
    authorName?: string;
    entityId?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    if (!this.isConfigured()) {
      return { success: false, error: "CRUSTDATA_API_KEY is not configured" };
    }

    try {
      const body: Record<string, any> = {
        limit: params.limit || 10,
      };

      if (params.keyword) {
        body.keyword = params.keyword;
      }

      const res = await fetch(`${this.baseUrl}/social_post/professional_network/search/live`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          error: `Crustdata Social Posts API returned HTTP ${res.status}: ${errorText}`,
        };
      }

      const json = await res.json();
      return { success: true, data: Array.isArray(json) ? json : json.posts || [] };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to contact Crustdata Posts API" };
    }
  }

  /**
   * NORMALIZATION: Convert raw Crustdata company payload to standard CompanyProfile
   */
  public normalizeCompanyData(raw: any, userClaimedName: string, domain: string): Partial<CompanyProfile> {
    // Enrich returns an array of resolution objects, each containing ranked matches.
    const resolution = Array.isArray(raw) ? raw[0] : raw;
    const match = resolution?.matches?.[0];
    const profile = match?.company_data || resolution?.company_data || resolution?.company;
    if (!profile?.basic_info && !profile?.name) return {};
    const basic = profile.basic_info || profile;
    const hq = profile.locations?.headquarters;
    return {
      companyName: basic.name,
      legalName: basic.legal_name || basic.name,
      domain,
      websiteUrl: basic.website || (domain ? `https://${domain}` : undefined),
      linkedinUrl: basic.professional_network_url,
      industry: basic.industries?.[0] || basic.industry,
      businessDescription: basic.description || basic.short_description,
      headquarters: hq ? (typeof hq === "string" ? { fullAddress: hq } : { fullAddress: hq.address || hq.raw, city: hq.city, state: hq.state, country: hq.country }) : undefined,
      foundedYear: basic.year_founded,
      employeeCount: profile.headcount?.total,
      employeeRange: profile.headcount?.range,
      funding: {
        totalFundingUsd: profile.funding?.total_investment_usd,
        lastRoundType: profile.funding?.last_round_type,
        investors: profile.funding?.investors || []
      },
      operatingStatus: undefined,
      discrepancies: [],
      unverifiedItems: ["CIN/GSTIN not checked against government registries", "Physical operations and inventory not inspected"]
    };
  }

  /**
   * NORMALIZATION: Convert raw Crustdata person payload to standard FounderProfile
   */
  public normalizePersonData(raw: any, founderName: string, companyName: string): Partial<FounderProfile> {
    if (!raw) return {};

    const resolution = Array.isArray(raw) ? raw[0] : raw;
    const person = resolution?.matches?.[0]?.person_data || resolution?.person_data || resolution?.person || {};
    const basic = person.basic_profile || person;

    const jobs = person.experience?.employment_details;
    const experience = (Array.isArray(person.experience) ? person.experience : [...(jobs?.current || []), ...(jobs?.past || [])]).map((exp: any) => ({
      companyName: exp.company_name || exp.company || "Previous Company",
      title: exp.title || exp.position || "Executive",
      startDate: exp.start_date,
      endDate: exp.end_date,
      isCurrent: exp.is_current ?? !exp.end_date,
      description: exp.description,
      location: exp.location,
    }));

    const education = (person.education || []).map((edu: any) => ({
      institutionName: edu.school || edu.institution_name || "University",
      degree: edu.degree_name || edu.degree,
      fieldOfStudy: edu.field_of_study,
      startYear: edu.start_year,
      endYear: edu.end_year,
    }));

    return {
      fullName: basic.name || basic.full_name || founderName,
      currentTitle: basic.current_title || basic.title,
      companyName: companyName,
      linkedinUrl: person.linkedin_profile_url || person.linkedin_url,
      headline: basic.headline,
      summary: person.summary || person.about,
      location: typeof basic.location === "string" ? basic.location : basic.location?.raw,
      identityConfidence: {
        level: basic.name ? "MEDIUM" : "LOW",
        reason: basic.name
          ? "Professional profile returned; current company association requires independent matching."
          : "No confidently matched professional identity.",
        isAmbiguous: true,
      },
      professionalTimeline: experience,
      education: education,
      previousVentures: experience
        .filter((e: any) => e.title.toLowerCase().includes("founder") || e.title.toLowerCase().includes("director"))
        .map((e: any) => ({
          companyName: e.companyName,
          role: e.title,
          status: "Historical Record",
          yearsActive: e.startDate ? `${e.startDate} - ${e.endDate || "Present"}` : undefined,
        })),
      keyConcerns: [],
    };
  }
}

export const crustdataClient = new CrustdataClient();
