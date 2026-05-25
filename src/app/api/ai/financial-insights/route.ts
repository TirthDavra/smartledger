import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { buildFinancialSummary } from "@/lib/financial-summary";
import { generateFinancialInsights } from "@/services/ai.service";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const summary = await buildFinancialSummary(session.user.id);
    const result = await generateFinancialInsights(summary);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Financial insights API error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
