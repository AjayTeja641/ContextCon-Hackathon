// ==============================================================================
// API ROUTE: /api/investigations/[id]/upload
// Document Upload & Multimodal Extraction Pipeline
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { investigationStore } from "@/server/store";
import { documentAgent } from "@/server/agents/document-agent";
import { EvidenceManager } from "@/server/evidence/evidence-manager";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = investigationStore.getById(id);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Investigation session not found" },
        { status: 404 }
      );
    }

    // No persistent private storage / per-user authentication is wired yet.
    // Do not accept sensitive uploads while those protections are unavailable.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: false, error: "Document uploads are disabled in local demo mode. Configure private storage and authentication before using real supplier documents." }, { status: 503 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in form-data payload" },
        { status: 400 }
      );
    }

    // Validate size (max 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 15MB size limit" },
        { status: 400 }
      );
    }

    // Validate MIME type
    const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported file format. Please upload a PDF, PNG, or JPEG.",
        },
        { status: 400 }
      );
    }

    // Convert to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");

    // Execute Document Intelligence Agent
    const { document, findings } = await documentAgent.analyzeDocument({
      investigationId: session.id,
      filename: file.name,
      mimeType: file.type,
      fileSizeBytes: file.size,
      base64Data,
      companyProfile: session.company || { companyName: session.companyName, domain: session.domain },
    });

    // Append document to session
    session.documents.push(document);

    // Update evidence manager
    const evidenceManager = new EvidenceManager(session.findings);
    findings.forEach((f) => evidenceManager.addFinding(f));
    session.findings = evidenceManager.getFindings();
    session.priorityIndicator = evidenceManager.computePriorityIndicator();

    investigationStore.save(session);

    return NextResponse.json({
      success: true,
      document,
      newFindingsCount: findings.length,
      session,
    });
  } catch (err: any) {
    console.error("Document upload API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
