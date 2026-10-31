// ==============================================================================
// API ROUTE: /api/investigations
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { investigationStore } from "@/server/store";
import { investigationOrchestrator } from "@/server/agents/investigation-orchestrator";
import { z } from "zod";

const createInvestigationSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  domain: z.string().min(3, "Domain is required"),
  cin: z.string().optional(),
  gstin: z.string().optional(),
  founderName: z.string().optional(),
  linkedinUrl: z.string().optional(),
  isDemo: z.boolean().optional(),
  claimedEmployees: z.string().optional(),
  claimedFoundedYear: z.number().optional(),
});

export async function GET() {
  try {
    const list = investigationStore.getAll();
    return NextResponse.json({ success: true, count: list.length, investigations: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createInvestigationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      companyName,
      domain,
      cin,
      gstin,
      founderName,
      linkedinUrl,
      isDemo,
    } = parsed.data;

    // The synthetic demo is a separate, fixed record. Never run real APIs on a fake supplier.
    if (isDemo) return NextResponse.json({ success: false, error: "Open /investigations/demo-session-apex-2026 for the synthetic demo." }, { status: 400 });

    // Create session in store
    const session = investigationStore.create({
      companyName,
      domain,
      cin,
      gstin,
      founderName,
      linkedinUrl,
      isDemo,
    });

    // Run investigation asynchronously or synchronously
    // In hackathon mode, we execute the orchestrator to populate first stages
    const completedSession = await investigationOrchestrator.runInvestigation(session);

    return NextResponse.json({
      success: true,
      investigationId: session.id,
      session: completedSession,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
