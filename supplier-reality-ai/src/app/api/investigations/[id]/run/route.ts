// ==============================================================================
// API ROUTE: /api/investigations/[id]/run
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { investigationStore } from "@/server/store";
import { investigationOrchestrator } from "@/server/agents/investigation-orchestrator";

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

    const updated = await investigationOrchestrator.runInvestigation(session);

    return NextResponse.json({ success: true, session: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
