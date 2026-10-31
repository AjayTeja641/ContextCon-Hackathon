// ==============================================================================
// SYNTHETIC DEMONSTRATION DATASET
// Explicitly labeled DEMO DATA as required by ContextCon specification
// ==============================================================================

import { InvestigationSession } from "@/types";

export const DEMO_INVESTIGATION_SESSION: InvestigationSession = {
  id: "demo-session-apex-2026",
  createdAt: "2026-10-31T09:30:00Z",
  updatedAt: "2026-10-31T11:15:00Z",
  companyName: "Apex Industrial Tech Solutions Ltd",
  domain: "apexindustrial-tech.in",
  cin: "U29253MH2021PTC368942",
  gstin: "27AAACA1234B1Z5",
  founderName: "Vikram Malhotra",
  linkedinUrl: "https://www.linkedin.com/in/vikram-malhotra-demo",
  status: "REVIEW_REQUIRED",
  currentStage: "FINAL_REPORT",
  stageProgress: 100,
  isDemo: true,

  priorityIndicator: {
    level: "CRITICAL_DISCREPANCY",
    label: "Critical Discrepancies Flagged — Immediate Audit Required",
    summary:
      "Multiple substantial contradictions uncovered between self-reported procurement claims, commercial registry traces, and co-located dissolved entities.",
    scoreFactors: [
      {
        factor: "Headcount Discrepancy",
        impact: "RISK",
        description:
          "Claimed 250+ full-time factory and engineering staff; verified commercial profiles reveal only 14 active employees.",
      },
      {
        factor: "Shared Registered Address with Struck-Off Entity",
        impact: "RISK",
        description:
          "Corporate office in Lower Parel is registered to 8 other entities, including Vortex Dynamic Trade Links (dissolved 2023).",
      },
      {
        factor: "Document vs Profile Capital Mismatch",
        impact: "RISK",
        description:
          "Submitted certificate shows authorized paid-up capital of ₹10 Lakhs, conflicting with ₹5 Crore claimed in vendor bid.",
      },
      {
        factor: "Director Historical Continuity",
        impact: "NEUTRAL",
        description:
          "Founder identity confirmed with 8+ years in industrial equipment sector across 2 prior organizations.",
      },
    ],
  },

  company: {
    companyName: "Apex Industrial Tech Solutions Ltd [DEMO DATA]",
    legalName: "Apex Industrial Tech Solutions Private Limited",
    domain: "apexindustrial-tech.in",
    websiteUrl: "https://apexindustrial-tech.in",
    linkedinUrl: "https://www.linkedin.com/company/apex-industrial-tech-demo",
    cin: "U29253MH2021PTC368942",
    gstin: "27AAACA1234B1Z5",
    industry: "Heavy Industrial Machinery & Equipment Distribution",
    businessDescription:
      "Specialized distributor of high-precision CNC tooling, robotic welding cells, and industrial automated actuators for automotive and aerospace Tier-1 manufacturers.",
    headquarters: {
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      fullAddress: "Suite 402, 4th Floor, Trade Link Towers, Lower Parel, Mumbai 400013",
    },
    foundedYear: 2021,
    employeeCount: 14,
    employeeRange: "11-50 employees",
    funding: {
      totalFundingUsd: 450000,
      lastRoundType: "Seed / Angel",
      lastRoundDate: "2022-04-15",
      investors: ["Western Gateway Industrial Fund (Angel syndicate)"],
    },
    companyType: "Private Limited Company",
    operatingStatus: "Active",
    recentNews: [
      {
        title: "Apex Industrial announces expansion into Pune aerospace cluster",
        source: "B2B Manufacturing Weekly (Press Release)",
        date: "2024-03-12",
        snippet:
          "Apex Industrial Tech announced plans to supply precision actuators to automotive assembly lines in Chakan, claiming high production volumes.",
        url: "https://example.com/news/apex-industrial-expansion",
      },
      {
        title: "Supply Chain Traceability in Maharashtra Tooling Sector",
        source: "Trade Logistics Review",
        date: "2023-11-20",
        snippet:
          "Regional distributors highlighted for rapid turnover growth amid heightened scrutiny on pass-through billing.",
        url: "https://example.com/news/maharashtra-tooling",
      },
    ],
    discrepancies: [
      {
        field: "Employee Count",
        userClaimed: "250+ Engineers & Factory Operators",
        retrievedData: "14 Verified Professionals on LinkedIn / Commercial registries",
        reason:
          "Severe scale contradiction. The vendor pitch deck describes an expansive 3-shift factory floor, but public commercial records track only 14 staff members.",
      },
      {
        field: "Founding Year",
        userClaimed: "Established in 2016 (10 years in operation)",
        retrievedData: "Incorporated in November 2021",
        reason:
          "Claimed operational heritage dates to 2016, but legal incorporation occurred in late 2021. The predecessor proprietorship was not formally amalgamated.",
      },
    ],
    unverifiedItems: [
      "GSTIN filing regularity requires official GST Suvidha Provider (GSP) sandbox verification.",
      "Warehouse machinery asset ownership cannot be certified purely via digital APIs without on-site asset tagging.",
    ],
  },

  founders: [
    {
      id: "founder-vikram-1",
      fullName: "Vikram Malhotra [DEMO DATA]",
      currentTitle: "Founder & Managing Director",
      companyName: "Apex Industrial Tech Solutions Ltd",
      linkedinUrl: "https://www.linkedin.com/in/vikram-malhotra-demo",
      headline: "Managing Director at Apex Industrial Tech Solutions | Industrial Automation Enthusiast",
      summary:
        "12+ years in mechanical engineering and industrial supply distribution across Western India. Passionate about robotic automation and modern tooling logistics.",
      location: "Mumbai, Maharashtra, India",
      identityConfidence: {
        level: "HIGH",
        reason:
          "Professional history, university alumni listing, and corporate filings corroborate single individual identity. No name collision identified.",
        isAmbiguous: false,
      },
      professionalTimeline: [
        {
          companyName: "Apex Industrial Tech Solutions Ltd",
          title: "Founder & Managing Director",
          startDate: "2021-11",
          isCurrent: true,
          description: "Overseeing executive strategy, supplier onboarding, and OEM contract fulfillment.",
          location: "Mumbai",
        },
        {
          companyName: "Vortex Dynamic Trade Links Pvt Ltd",
          title: "Director",
          startDate: "2017-02",
          endDate: "2021-08",
          isCurrent: false,
          description: "General commercial trading of industrial raw materials and sheet metal components.",
          location: "Mumbai",
        },
        {
          companyName: "Precision Tooling Corp",
          title: "Senior Procurement Specialist",
          startDate: "2013-06",
          endDate: "2016-12",
          isCurrent: false,
          description: "Sourcing carbide inserts and CNC tooling accessories for domestic automotive vendors.",
          location: "Pune",
        },
      ],
      education: [
        {
          institutionName: "University of Mumbai",
          degree: "Bachelor of Engineering (B.E.)",
          fieldOfStudy: "Mechanical Engineering",
          startYear: 2008,
          endYear: 2012,
        },
      ],
      previousVentures: [
        {
          companyName: "Vortex Dynamic Trade Links Pvt Ltd",
          role: "Director / 50% Shareholder",
          status: "Struck Off (MCA Notice 2023 for non-filing)",
          yearsActive: "2017 - 2021",
        },
      ],
      publicPosts: [
        {
          id: "post-1",
          platform: "LINKEDIN",
          authorName: "Vikram Malhotra",
          publishedAt: "2024-05-18T10:14:00Z",
          text: "Proud to share that Apex Industrial Tech delivered over 10,000 precision CNC heads across 4 major auto factories this quarter! Scale matters when precision is non-negotiable.",
          url: "https://linkedin.com/demo/post-1",
          engagement: { likes: 142, comments: 28, shares: 12 },
          sentiment: "POSITIVE",
        },
        {
          id: "post-2",
          platform: "LINKEDIN",
          authorName: "Vikram Malhotra",
          publishedAt: "2023-09-04T15:30:00Z",
          text: "Navigating supply chain disruptions in imported carbide steels. Local warehousing is the only hedge against volatile freight indexes.",
          url: "https://linkedin.com/demo/post-2",
          engagement: { likes: 89, comments: 14, shares: 3 },
          sentiment: "NEUTRAL",
        },
      ],
      mediaCoverage: [
        {
          title: "Mumbai Engineering Forum: SME Automation Panelists",
          outlet: "Maharashtra Industrial Digest",
          date: "2023-08-14",
          url: "https://example.com/media/mumbai-sme-panel",
          sentiment: "Positive industry mention",
        },
      ],
      keyConcerns: [
        {
          title: "Previous Directorship in Dissolved Shell Entity",
          detail:
            "Vikram Malhotra held a 50% equity stake and directorship in Vortex Dynamic Trade Links Pvt Ltd, which received an MCA Section 248 strike-off notice following 3 consecutive years of missing financial returns.",
          sourceName: "MCA21 Registry Archive / Ministry of Corporate Affairs Notice",
        },
      ],
    },
  ],

  documents: [
    {
      id: "doc-sample-gstin",
      filename: "Apex_GST_Registration_Certificate_2022.pdf",
      fileType: "application/pdf",
      fileSizeBytes: 245820,
      uploadedAt: "2026-10-31T09:35:00Z",
      documentType: "GST_CERTIFICATE",
      extractedFields: [
        {
          fieldKey: "legal_name",
          label: "Legal Name of Business",
          extractedValue: "Apex Industrial Tech Solutions Private Limited",
          confidence: 0.98,
        },
        {
          fieldKey: "gstin",
          label: "GSTIN",
          extractedValue: "27AAACA1234B1Z5",
          confidence: 0.99,
        },
        {
          fieldKey: "registered_address",
          label: "Principal Place of Business",
          extractedValue: "Co-Work Desk 42, Innovation Hub, Senapati Bapat Road, Pune 411016",
          confidence: 0.95,
        },
        {
          fieldKey: "date_of_registration",
          label: "Date of Liability / Registration",
          extractedValue: "18/11/2021",
          confidence: 0.97,
        },
        {
          fieldKey: "nature_of_business",
          label: "Business Activity",
          extractedValue: "Wholesale Trade / Commission Agent",
          confidence: 0.92,
        },
      ],
      comparisons: [
        {
          field: "Company Name",
          uploadedDocumentValue: "Apex Industrial Tech Solutions Private Limited",
          companyProfileValue: "Apex Industrial Tech Solutions Ltd",
          status: "MATCH",
          discrepancyReason: "Minor standard legal abbreviation variance (Pvt Ltd vs Ltd).",
        },
        {
          field: "Principal Business Address",
          uploadedDocumentValue: "Innovation Hub, Senapati Bapat Road, Pune",
          companyProfileValue: "Trade Link Towers, Lower Parel, Mumbai",
          status: "MISMATCH",
          discrepancyReason:
            "CRITICAL: Uploaded GST registration documents a shared co-working incubator desk in Pune as the primary site, while the vendor submitted corporate headquarters in Mumbai as their manufacturing plant.",
        },
        {
          field: "Business Classification",
          uploadedDocumentValue: "Wholesale Trade / Commission Agent",
          companyProfileValue: "Heavy Machinery Manufacturer",
          status: "REQUIRES_REVIEW",
          discrepancyReason:
            "The document designates the entity as a commercial trading agent rather than a licensed manufacturing plant.",
        },
      ],
      consistencyScore: 68,
      authenticityDisclaimer:
        "Document Consistency Analysis verifies internal textual concordance against known vendor databases. It does NOT constitute a tamper-proof cryptographic audit or official government tax portal stamp.",
    },
  ],

  relationshipGraph: {
    nodes: [
      {
        id: "ent-apex",
        entityType: "COMPANY",
        label: "Apex Industrial Tech",
        subLabel: "Target Supplier (Mumbai)",
        isPrimary: true,
        hasDiscrepancy: true,
        metadata: { employees: 14, founded: 2021, status: "Under Investigation" },
      },
      {
        id: "ent-vikram",
        entityType: "FOUNDER",
        label: "Vikram Malhotra",
        subLabel: "Managing Director",
        isPrimary: false,
        hasDiscrepancy: true,
        metadata: { role: "Founder", experienceYears: 12 },
      },
      {
        id: "ent-vortex",
        entityType: "PREVIOUS_VENTURE",
        label: "Vortex Dynamic Trade",
        subLabel: "Struck Off (2023)",
        isPrimary: false,
        hasDiscrepancy: true,
        metadata: { status: "Dissolved / Non-compliant", reason: "Missing filings" },
      },
      {
        id: "ent-address-mumbai",
        entityType: "ADDRESS",
        label: "Suite 402, Trade Link Towers",
        subLabel: "Co-located Hub (Mumbai)",
        isPrimary: false,
        hasDiscrepancy: true,
        metadata: { registeredEntitiesCount: 9 },
      },
      {
        id: "ent-address-pune",
        entityType: "ADDRESS",
        label: "Innovation Hub Desk 42",
        subLabel: "GST Registered Site (Pune)",
        isPrimary: false,
        hasDiscrepancy: true,
        metadata: { facilityType: "Virtual Office / Co-working" },
      },
      {
        id: "ent-matrix",
        entityType: "SUPPLIER",
        label: "Matrix Precision Tooling",
        subLabel: "Tier-2 Subcontractor",
        isPrimary: false,
        hasDiscrepancy: false,
        metadata: { transactionVolume: "₹1.8 Cr (Annual)" },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "ent-vikram",
        target: "ent-apex",
        relationshipType: "FOUNDED",
        label: "Founded (2021)",
        confidence: 0.99,
        isSuspicious: false,
        evidenceText: "Corporate registration documents and verified LinkedIn leadership record.",
        sourceReference: "MCA21 Incorporation Record",
      },
      {
        id: "edge-2",
        source: "ent-vikram",
        target: "ent-vortex",
        relationshipType: "DIRECTOR_OF",
        label: "Director (2017-2021)",
        confidence: 0.95,
        isSuspicious: true,
        evidenceText:
          "Vikram Malhotra held 50% shares and signed balance sheets for Vortex prior to strike-off.",
        sourceReference: "MCA Form DIR-12 Historical Archive",
      },
      {
        id: "edge-3",
        source: "ent-apex",
        target: "ent-address-mumbai",
        relationshipType: "SHARES_ADDRESS_WITH",
        label: "Registered Office",
        confidence: 0.92,
        isSuspicious: true,
        evidenceText:
          "Address also hosts 8 other commercial trading entities with no physical warehouse or loading bay.",
        sourceReference: "Commercial Property Municipal Records",
      },
      {
        id: "edge-4",
        source: "ent-vortex",
        target: "ent-address-mumbai",
        relationshipType: "SHARES_ADDRESS_WITH",
        label: "Previous Address Match",
        confidence: 0.90,
        isSuspicious: true,
        evidenceText:
          "Vortex Dynamic Trade used identical Suite 402 address prior to regulatory dissolution.",
        sourceReference: "Historical MCA Corporate Filing",
      },
      {
        id: "edge-5",
        source: "ent-apex",
        target: "ent-address-pune",
        relationshipType: "SHARES_ADDRESS_WITH",
        label: "GST Registered Address",
        confidence: 0.96,
        isSuspicious: true,
        evidenceText:
          "Official GST certificate identifies co-working desk 42 in Pune rather than Mumbai facility.",
        sourceReference: "Uploaded Form GST REG-06",
      },
      {
        id: "edge-6",
        source: "ent-apex",
        target: "ent-matrix",
        relationshipType: "SUB_CONTRACTOR_OF",
        label: "Subcontractor / Parts Supply",
        confidence: 0.85,
        isSuspicious: false,
        evidenceText: "Commercial trade reference provided in procurement pre-qualification questionnaire.",
        sourceReference: "Vendor Submission RFP Attachment",
      },
    ],
  },

  findings: [
    {
      id: "f-1",
      investigationId: "demo-session-apex-2026",
      title: "Active Legal Corporate Incorporation Corroborated",
      description: "Company is actively incorporated under the Companies Act with designated DINs for 2 directors.",
      module: "COMPANY",
      classification: "OFFICIALLY_VERIFIED",
      confidenceLevel: "HIGH",
      verificationStatus: "VERIFIED",
      sourceName: "Ministry of Corporate Affairs (MCA21 Master Data)",
      sourceUrl: "https://www.mca.gov.in",
      retrievalDate: "2026-10-31T09:32:00Z",
      evidenceExcerpt: "CIN: U29253MH2021PTC368942, Status: Active, Date of Incorporation: 18/11/2021.",
      isDiscrepancy: false,
      severity: "INFO",
    },
    {
      id: "f-2",
      investigationId: "demo-session-apex-2026",
      title: "Substantial Employee Scale Contradiction",
      description: "Vendor bid claimed 250+ technical and shopfloor personnel; commercial footprints verify only 14.",
      module: "COMPANY",
      classification: "THIRD_PARTY_REPORTED",
      confidenceLevel: "HIGH",
      verificationStatus: "CONTRADICTED",
      sourceName: "Crustdata Company Enrichment API",
      sourceUrl: "https://api.crustdata.com/company/enrich",
      retrievalDate: "2026-10-31T09:33:00Z",
      evidenceExcerpt: "Headcount metric: 14 employees; Headcount range: 11-50 employees.",
      isDiscrepancy: true,
      severity: "CRITICAL",
    },
    {
      id: "f-3",
      investigationId: "demo-session-apex-2026",
      title: "Principal Place of Business Mismatch in Tax Records",
      description:
        "The uploaded GST certificate specifies a Pune co-working incubator desk, directly contradicting the claimed Mumbai manufacturing plant.",
      module: "DOCUMENT",
      classification: "UPLOADED_DOCUMENT",
      confidenceLevel: "HIGH",
      verificationStatus: "CONTRADICTED",
      sourceName: "Uploaded Document: Apex_GST_Registration_Certificate_2022.pdf",
      retrievalDate: "2026-10-31T09:36:00Z",
      evidenceExcerpt: "Principal Place of Business: Co-Work Desk 42, Innovation Hub, Pune 411016.",
      isDiscrepancy: true,
      severity: "HIGH",
    },
    {
      id: "f-4",
      investigationId: "demo-session-apex-2026",
      title: "Shared Address with Regulatory Struck-Off Entity",
      description:
        "Suite 402, Trade Link Towers was the registered seat of Vortex Dynamic Trade Links Pvt Ltd, dissolved by MCA in 2023.",
      module: "RELATIONSHIP",
      classification: "AI_GENERATED_INFERENCE",
      confidenceLevel: "HIGH",
      verificationStatus: "REQUIRES_REVIEW",
      sourceName: "Entity Relationship Graph Traversal",
      retrievalDate: "2026-10-31T09:40:00Z",
      evidenceExcerpt:
        "Address hash match between Apex Industrial Tech and Vortex Dynamic Trade Links (dissolved under Section 248).",
      isDiscrepancy: true,
      severity: "HIGH",
    },
    {
      id: "f-5",
      investigationId: "demo-session-apex-2026",
      title: "Founder Historical Professional Experience Corroborated",
      description: "Vikram Malhotra possesses verified engineering credentials and continuous mechanical engineering industry roles since 2012.",
      module: "FOUNDER",
      classification: "THIRD_PARTY_REPORTED",
      confidenceLevel: "HIGH",
      verificationStatus: "VERIFIED",
      sourceName: "Crustdata People Enrichment API",
      sourceUrl: "https://api.crustdata.com/person/enrich",
      retrievalDate: "2026-10-31T09:34:00Z",
      evidenceExcerpt: "B.E. Mechanical Engineering (2012), Senior Procurement at Precision Tooling (2013-2016).",
      isDiscrepancy: false,
      severity: "INFO",
    },
    {
      id: "f-6",
      investigationId: "demo-session-apex-2026",
      title: "Unverified Claim Regarding Automated Tooling Facility",
      description: "Social media claims of a dedicated robotic manufacturing plant could not be substantiated by public industrial utility records or plant registry entries.",
      module: "CROSS_VERIFICATION",
      classification: "UNVERIFIED_CLAIM",
      confidenceLevel: "MEDIUM",
      verificationStatus: "UNVERIFIED",
      sourceName: "Public Social Posts & Media Grounding",
      retrievalDate: "2026-10-31T09:42:00Z",
      evidenceExcerpt: "LinkedIn post dated 18/05/2024 claiming '10,000 precision CNC heads delivered across 4 major auto factories'.",
      isDiscrepancy: true,
      severity: "MEDIUM",
    },
  ],

  report: {
    id: "rep-apex-2026",
    generatedAt: "2026-10-31T11:15:00Z",
    companyName: "Apex Industrial Tech Solutions Ltd",
    domain: "apexindustrial-tech.in",
    executiveSummary:
      "This due diligence assessment of Apex Industrial Tech Solutions Ltd identifies critical operational and documentary contradictions that require immediate human audit before commercial engagement. While the entity maintains active MCA corporate registration and the managing director possesses corroborated sector experience, the company's real operating scale diverges sharply from its procurement disclosures. Most critically, verified professional registries identify only 14 staff members—contradicting the 250+ personnel claimed in the vendor's RFP submission. Furthermore, the firm's registered corporate seat in Lower Parel, Mumbai coincides with the registered location of a dissolved entity (Vortex Dynamic Trade Links) previously directed by the same founder, and its uploaded GST certificate designates a virtual co-working desk in Pune. Procurement teams are strongly advised to delay contract signing pending physical on-site inspection and formal audited tax return reviews.",
    priorityIndicator: {
      level: "CRITICAL_DISCREPANCY",
      label: "Critical Discrepancy — On-Site Audit Required",
      rationale:
        "High-severity headcount contradiction (14 vs 250+ claimed), registered address overlap with a dissolved trading firm, and GST registered premises designated as a virtual office.",
    },
    companyOverview: {
      operatingStatus: "Active Legal Entity (Operational Substance Unconfirmed)",
      foundedYear: 2021,
      employeeRange: "11-50 (14 verified)",
      industry: "Industrial Machinery & Tooling Distribution",
      claimedVsVerifiedSummary:
        "Claimed: 250+ employees, 10-year operating history, self-operated manufacturing facilities. Corroborated: 14 employees, incorporated in late 2021, registered primarily as a commercial trading agent.",
    },
    founderAssessment: {
      primaryFounder: "Vikram Malhotra",
      summary:
        "Corroborated 12-year professional record in industrial tooling and engineering procurement. Holds degree in Mechanical Engineering from Mumbai University. Notable risk factor: Served as 50% shareholder and Director at Vortex Dynamic Trade Links Pvt Ltd until its 2023 strike-off by the MCA.",
      identityConfidence: "HIGH",
      pastVenturesCount: 1,
    },
    documentVerificationSummary: {
      documentsAnalyzedCount: 1,
      mismatchCount: 2,
      summary:
        "Analyzed Form GST REG-06 Certificate. Extracted legal name matches corporate entity, but principal registered address points to a shared incubator desk in Pune instead of the vendor's claimed Mumbai plant. Business activity is classified as commission agency/wholesale trading rather than heavy machinery manufacturing.",
      disclaimer:
        "Document Consistency Analysis verifies internal textual concordance against known vendor databases. It does NOT constitute a tamper-proof cryptographic audit or official government tax portal stamp.",
    },
    relationshipNetworkFindings: {
      totalEntities: 6,
      totalConnections: 6,
      sharedInfrastructureOrRingsFound: true,
      narrative:
        "Graph analysis reveals an 'address-cluster motif'. The corporate headquarters at Suite 402, Trade Link Towers is concurrently mapped to 8 other commercial entities, including Vortex Dynamic Trade Links—a firm dissolved for missing statutory returns. This topology is consistent with pass-through trading shell hubs and warrants physical inspection.",
    },
    criticalDiscrepancies: [
      {
        title: "Operational Scale Mismatch",
        detail: "Claimed 250+ staff vs. 14 corroborated on professional networks.",
        severity: "CRITICAL",
      },
      {
        title: "Principal Address Discrepancy",
        detail: "GST certificate registers Pune co-working desk; pitch deck claims Mumbai manufacturing site.",
        severity: "HIGH",
      },
      {
        title: "Directorship in Struck-Off Entity",
        detail: "Founder previously directed Vortex Dynamic Trade Links, dissolved in 2023 for non-compliance.",
        severity: "HIGH",
      },
    ],
    missingInformation: [
      "Audited financial statements (Form AOC-4) for the most recent financial year.",
      "Electricity and heavy industrial power tariff receipts corroborating active manufacturing operations.",
      "Official GSTN return filing track record via authorized GSP gateway.",
    ],
    recommendedActionSteps: [
      "Commission an unannounced physical inspection of both the Mumbai Trade Link Towers suite and the Pune co-working site.",
      "Request certified bank account statements showing direct salary disbursements to 250+ employees.",
      "Require statutory Form 3CD tax audit reports and input tax credit (ITC) reconciliation schedules.",
      "Confirm beneficial ownership structure to ensure no circular invoicing flows with Vortex or affiliated entities.",
    ],
  },
};
