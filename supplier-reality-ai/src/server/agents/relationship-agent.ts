// ==============================================================================
// MODULE 4: RELATIONSHIP INTELLIGENCE AGENT
// Entity Relationship Graph Construction & Anomaly Mapping
// ==============================================================================

import {
  RelationshipGraphData,
  GraphEntityNode,
  GraphRelationshipEdge,
  CompanyProfile,
  FounderProfile,
  UploadedDocument,
  Finding,
} from "@/types";

export class RelationshipAgent {
  public buildGraph(params: {
    investigationId: string;
    company: CompanyProfile;
    founders: FounderProfile[];
    documents: UploadedDocument[];
  }): {
    graph: RelationshipGraphData;
    findings: Finding[];
  } {
    const nodes: GraphEntityNode[] = [];
    const edges: GraphRelationshipEdge[] = [];
    const findings: Finding[] = [];

    // 1. Primary Company Node
    const companyNodeId = `node-comp-${params.company.domain.replace(/[^a-zA-Z0-9]/g, "-")}`;
    nodes.push({
      id: companyNodeId,
      entityType: "COMPANY",
      label: params.company.companyName,
      subLabel: params.company.industry || "Supplier Entity",
      isPrimary: true,
      hasDiscrepancy: (params.company.discrepancies?.length || 0) > 0,
      metadata: {
        domain: params.company.domain,
        cin: params.company.cin,
        gstin: params.company.gstin,
        employees: params.company.employeeCount || params.company.employeeRange,
      },
    });

    // 2. Founder Nodes and Relationships
    params.founders.forEach((f, idx) => {
      const founderNodeId = `node-fnd-${idx}-${f.fullName.replace(/[^a-zA-Z0-9]/g, "-")}`;
      nodes.push({
        id: founderNodeId,
        entityType: "FOUNDER",
        label: f.fullName,
        subLabel: f.currentTitle,
        isPrimary: false,
        hasDiscrepancy: f.identityConfidence?.isAmbiguous || (f.keyConcerns?.length || 0) > 0,
        metadata: {
          linkedinUrl: f.linkedinUrl,
          experienceCount: f.professionalTimeline.length,
        },
      });

      // Intake association alone does not establish a legal founder/director relationship.
      edges.push({
        id: `edge-fnd-${idx}`,
        source: founderNodeId,
        target: companyNodeId,
        relationshipType: "ASSOCIATED_WITH",
        label: "Claimed affiliation",
        confidence: f.identityConfidence?.isAmbiguous ? 0.2 : 0.65,
        isSuspicious: false,
        evidenceText: `Company affiliation supplied in intake; independently confirm current role and legal status.`,
        sourceReference: f.linkedinUrl || "User intake (unverified)",
      });

      // Previous ventures
      f.previousVentures.forEach((pv, pIdx) => {
        const pvNodeId = `node-pv-${idx}-${pIdx}`;
        const isStruckOff = pv.status?.toLowerCase().includes("struck off") || pv.status?.toLowerCase().includes("dissolved");

        nodes.push({
          id: pvNodeId,
          entityType: "PREVIOUS_VENTURE",
          label: pv.companyName,
          subLabel: pv.status || "Prior Entity",
          isPrimary: false,
          hasDiscrepancy: isStruckOff,
          metadata: { role: pv.role, years: pv.yearsActive },
        });

        edges.push({
          id: `edge-pv-${idx}-${pIdx}`,
          source: founderNodeId,
          target: pvNodeId,
          relationshipType: "ASSOCIATED_WITH",
          label: pv.role || "Prior affiliation",
          confidence: 0.5,
          isSuspicious: Boolean(isStruckOff),
          evidenceText: `Historical work or venture association reported in professional data; no directorship registry verification.`,
          sourceReference: f.linkedinUrl || "Crustdata professional enrichment",
        });

        if (isStruckOff) {
          findings.push({
            id: `f-rel-${Date.now()}-struckoff`,
            investigationId: params.investigationId,
            title: "Founder Historical Directorship in Non-Compliant/Struck-Off Firm",
            description: `${f.fullName} held leadership in ${pv.companyName}, which was dissolved/struck off.`,
            module: "RELATIONSHIP",
            classification: "AI_GENERATED_INFERENCE",
            confidenceLevel: "LOW",
            verificationStatus: "REQUIRES_REVIEW",
            sourceName: "Reported professional history (not registry verified)",
            retrievalDate: new Date().toISOString(),
            evidenceExcerpt: `Entity: ${pv.companyName}, Status: ${pv.status}.`,
            isDiscrepancy: true,
            severity: "HIGH",
          });
        }
      });
    });

    // 3. Address Nodes
    if (params.company.headquarters?.fullAddress) {
      const addressNodeId = "node-addr-hq";
      nodes.push({
        id: addressNodeId,
        entityType: "ADDRESS",
        label: params.company.headquarters.city
          ? `${params.company.headquarters.city} HQ`
          : "Registered Office",
        subLabel: params.company.headquarters.fullAddress.substring(0, 40) + "...",
        isPrimary: false,
        hasDiscrepancy: false,
        metadata: { fullAddress: params.company.headquarters.fullAddress },
      });

      edges.push({
        id: "edge-addr-hq",
        source: companyNodeId,
        target: addressNodeId,
        relationshipType: "SHARES_ADDRESS_WITH",
        label: "Registered Seat",
        confidence: 0.6,
        isSuspicious: false,
        evidenceText: `Location attributed to supplier by the available company profile, not government-registry verified.`,
        sourceReference: "Crustdata company enrichment / intake",
      });
    }

    return {
      graph: { nodes, edges },
      findings,
    };
  }
}

export const relationshipAgent = new RelationshipAgent();
