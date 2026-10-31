// ==============================================================================
// API ROUTE: /api/investigations/[id]
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { investigationStore } from "@/server/store";

export async function GET(
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

    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
