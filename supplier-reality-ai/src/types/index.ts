// ==============================================================================
// SUPPLIER REALITY AI — CORE TYPE SYSTEM & SCHEMA DEFINITIONS
// ContextCon 03 · IIT Bombay
// ==============================================================================

// --- 1. EVIDENCE & TRUST ARCHITECTURE TYPES ---

export type FindingClassification =
  | "OFFICIALLY_VERIFIED"
  | "THIRD_PARTY_REPORTED"
  | "COMPANY_SELF_REPORTED"
  | "PUBLIC_SOCIAL_MEDIA"
  | "UPLOADED_DOCUMENT"
  | "AI_GENERATED_INFERENCE"
  | "UNVERIFIED_CLAIM";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW" | "UNCERTAIN";

export type VerificationStatus =
  | "VERIFIED"
  | "CONTRADICTED"
  | "REQUIRES_REVIEW"
  | "UNVERIFIED";

export type IntelligenceModule =
  | "COMPANY"
  | "FOUNDER"
  | "DOCUMENT"
  | "RELATIONSHIP"
  | "CROSS_VERIFICATION";

export type PriorityLevel =
  | "STANDARD" // Green: No material concern identified
  | "ELEVATED_REVIEW" // Yellow: Discrepancies or ambiguities needing analyst review
  | "CRITICAL_DISCREPANCY"; // Amber/Red: Direct contradictions or severe red flags

export interface EvidenceSource {
  id: string;
  title: string;
  sourceType:
    | "CRUSTDATA_COMPANY"
    | "CRUSTDATA_PEOPLE"
    | "CRUSTDATA_POSTS"
    | "DOCUMENT_UPLOAD"
    | "PUBLIC_REGISTRY"
    | "WEB_GROUNDING";
  url?: string;
  publicationDate?: string;
  retrievalDate: string;
  rawPayload?: any;
}

export interface Finding {
  id: string;
  investigationId: string;
  title: string;
  description: string;
  module: IntelligenceModule;
  classification: FindingClassification;
  confidenceLevel: ConfidenceLevel;
  verificationStatus: VerificationStatus;
  sourceName: string;
  sourceUrl?: string;
  publicationDate?: string;
  retrievalDate: string;
  evidenceExcerpt: string;
  isDiscrepancy: boolean;
  severity: "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

// --- 2. MODULE 1: COMPANY INTELLIGENCE TYPES ---

export interface CompanyFunding {
  totalFundingUsd?: number;
  lastRoundType?: string;
  lastRoundDate?: string;
  investors?: string[];
}

export interface CompanyProfile {
  companyName: string;
  legalName?: string;
  domain: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  cin?: string;
  gstin?: string;
  industry?: string;
  businessDescription?: string;
  headquarters?: {
    city?: string;
    state?: string;
    country?: string;
    fullAddress?: string;
  };
  foundedYear?: number;
  employeeCount?: number;
  employeeRange?: string;
  funding?: CompanyFunding;
  companyType?: string; // Private Limited, LLP, Public, etc.
  operatingStatus?: string; // Active, Dormant, Struck Off
  recentNews?: Array<{
    title: string;
    source: string;
    date: string;
    snippet: string;
    url?: string;
  }>;
  discrepancies: Array<{
    field: string;
    userClaimed: string;
    retrievedData: string;
    reason: string;
  }>;
  unverifiedItems: string[];
}

// --- 3. MODULE 2: FOUNDER INTELLIGENCE TYPES ---

export interface ExperienceItem {
  companyName: string;
  title: string;
  startDate?: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
}

export interface EducationItem {
  institutionName: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
}

export interface SocialPostItem {
  id: string;
  platform: "LINKEDIN" | "TWITTER" | "OTHER";
  authorName: string;
  publishedAt: string;
  text: string;
  url?: string;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  sentiment?: "POSITIVE" | "NEUTRAL" | "CONCERN";
}

export interface FounderProfile {
  id: string;
  fullName: string;
  currentTitle: string;
  companyName: string;
  linkedinUrl?: string;
  photoUrl?: string;
  headline?: string;
  summary?: string;
  location?: string;
  identityConfidence: {
    level: ConfidenceLevel;
    reason: string;
    isAmbiguous: boolean;
  };
  professionalTimeline: ExperienceItem[];
  previousVentures: Array<{
    companyName: string;
    role: string;
    status?: string; // Active, Closed, Merged
    yearsActive?: string;
  }>;
  education: EducationItem[];
  publicPosts: SocialPostItem[];
  mediaCoverage: Array<{
    title: string;
    outlet: string;
    date: string;
    url?: string;
    sentiment?: string;
  }>;
  keyConcerns: Array<{
    title: string;
    detail: string;
    sourceName: string;
  }>;
}

// --- 4. MODULE 3: DOCUMENT INTELLIGENCE TYPES ---

export interface ExtractedField {
  fieldKey: string;
  label: string;
  extractedValue: string;
  confidence: number; // 0 to 1
  pageNumber?: number;
}

export interface DocumentComparisonRow {
  field: string;
  uploadedDocumentValue: string;
  companyProfileValue: string;
  status: "MATCH" | "MISMATCH" | "REQUIRES_REVIEW" | "NOT_IN_PROFILE";
  discrepancyReason?: string;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedAt: string;
  documentType:
    | "GST_CERTIFICATE"
    | "MCA_CERTIFICATE"
    | "PAN_CARD"
    | "FINANCIAL_STATEMENT"
    | "ANNUAL_REPORT"
    | "OTHER";
  extractedFields: ExtractedField[];
  comparisons: DocumentComparisonRow[];
  consistencyScore: number; // 0 to 100
  authenticityDisclaimer: string; // Explaining that syntactic consistency != legal verification
}

// --- 5. MODULE 4: RELATIONSHIP INTELLIGENCE TYPES ---

export type EntityType =
  | "COMPANY"
  | "FOUNDER"
  | "DIRECTOR"
  | "ADDRESS"
  | "PREVIOUS_VENTURE"
  | "SUPPLIER"
  | "ASSOCIATED_ENTITY";

export type RelationshipType =
  | "FOUNDED"
  | "WORKED_AT"
  | "DIRECTOR_OF"
  | "SHARES_ADDRESS_WITH"
  | "SUB_CONTRACTOR_OF"
  | "ASSOCIATED_WITH"
  | "INVOICE_FLOW";

export interface GraphEntityNode {
  [key: string]: any;
  id: string;
  entityType: EntityType;
  label: string;
  subLabel?: string;
  isPrimary?: boolean;
  hasDiscrepancy?: boolean;
  metadata?: Record<string, any>;
}

export interface GraphRelationshipEdge {
  [key: string]: any;
  id: string;
  source: string;
  target: string;
  relationshipType: RelationshipType;
  label: string;
  confidence: number;
  isSuspicious: boolean;
  evidenceText: string;
  sourceReference: string;
}

export interface RelationshipGraphData {
  nodes: GraphEntityNode[];
  edges: GraphRelationshipEdge[];
}

// --- 6. INVESTIGATION ENGINE & FINAL REPORT ---

export type InvestigationStage =
  | "INPUT_VALIDATION"
  | "COMPANY_INVESTIGATION"
  | "FOUNDER_INVESTIGATION"
  | "PUBLIC_INTELLIGENCE"
  | "DOCUMENT_INVESTIGATION"
  | "CROSS_VERIFICATION"
  | "RELATIONSHIP_ANALYSIS"
  | "GEMINI_INTELLIGENCE_ANALYSIS"
  | "FINAL_REPORT";

export interface InvestigationSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  domain: string;
  cin?: string;
  gstin?: string;
  founderName?: string;
  linkedinUrl?: string;
  status: "DRAFT" | "RUNNING" | "COMPLETED" | "FAILED" | "REVIEW_REQUIRED";
  currentStage: InvestigationStage;
  stageProgress: number; // 0 to 100
  isDemo: boolean;
  priorityIndicator: {
    level: PriorityLevel;
    label: string;
    summary: string;
    scoreFactors: Array<{
      factor: string;
      impact: "POSITIVE" | "NEUTRAL" | "RISK";
      description: string;
    }>;
  };
  company?: CompanyProfile;
  founders: FounderProfile[];
  documents: UploadedDocument[];
  relationshipGraph: RelationshipGraphData;
  findings: Finding[];
  report?: DueDiligenceReport;
}

export interface DueDiligenceReport {
  id: string;
  generatedAt: string;
  companyName: string;
  domain: string;
  executiveSummary: string;
  priorityIndicator: {
    level: PriorityLevel;
    label: string;
    rationale: string;
  };
  companyOverview: {
    operatingStatus: string;
    foundedYear?: number;
    employeeRange?: string;
    industry?: string;
    claimedVsVerifiedSummary: string;
  };
  founderAssessment: {
    primaryFounder: string;
    summary: string;
    identityConfidence: string;
    pastVenturesCount: number;
  };
  documentVerificationSummary: {
    documentsAnalyzedCount: number;
    mismatchCount: number;
    summary: string;
    disclaimer: string;
  };
  relationshipNetworkFindings: {
    totalEntities: number;
    totalConnections: number;
    sharedInfrastructureOrRingsFound: boolean;
    narrative: string;
  };
  criticalDiscrepancies: Array<{
    title: string;
    detail: string;
    severity: string;
  }>;
  missingInformation: string[];
  recommendedActionSteps: string[];
}
