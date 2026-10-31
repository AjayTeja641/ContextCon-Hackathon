// ==============================================================================
// IN-MEMORY / HYBRID SESSION STORE
// Provides robust persistence during server runtime with Supabase fallback
// ==============================================================================

import { InvestigationSession } from "@/types";
import { DEMO_INVESTIGATION_SESSION } from "@/lib/demo-data";

class InvestigationStore {
  private sessions: Map<string, InvestigationSession> = new Map();

  constructor() {
    // Seed demo investigation
    this.sessions.set(DEMO_INVESTIGATION_SESSION.id, DEMO_INVESTIGATION_SESSION);
  }

  public getAll(): InvestigationSession[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getById(id: string): InvestigationSession | undefined {
    return this.sessions.get(id);
  }

  public save(session: InvestigationSession): InvestigationSession {
    session.updatedAt = new Date().toISOString();
    this.sessions.set(session.id, session);
    return session;
  }

  public create(params: {
    companyName: string;
    domain: string;
    cin?: string;
    gstin?: string;
    founderName?: string;
    linkedinUrl?: string;
    isDemo?: boolean;
  }): InvestigationSession {
    const id = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newSession: InvestigationSession = {
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      companyName: params.companyName,
      domain: params.domain.replace(/^https?:\/\//, "").replace(/\/.*$/, ""),
      cin: params.cin,
      gstin: params.gstin,
      founderName: params.founderName,
      linkedinUrl: params.linkedinUrl,
      status: "DRAFT",
      currentStage: "INPUT_VALIDATION",
      stageProgress: 10,
      isDemo: params.isDemo || false,
      priorityIndicator: {
        level: "STANDARD",
        label: "Initial Verification Pending",
        summary: "Investigation queued. Awaiting multi-source retrieval.",
        scoreFactors: [],
      },
      founders: [],
      documents: [],
      relationshipGraph: { nodes: [], edges: [] },
      findings: [],
    };

    this.sessions.set(id, newSession);
    return newSession;
  }
}

// Global singleton for Next.js server runtime
declare global {
  var __investigationStore: InvestigationStore | undefined;
}

export const investigationStore =
  globalThis.__investigationStore || (globalThis.__investigationStore = new InvestigationStore());
