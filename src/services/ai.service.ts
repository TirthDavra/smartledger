import { GoogleGenAI } from "@google/genai";

import type { FinancialSummary } from "@/lib/financial-summary";

const GEMINI_MODEL = "gemini-2.5-flash";

export type FinancialInsightsResult = {
  insights: string[];
};

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({ apiKey });
}

function buildFinancialInsightsPrompt(summary: FinancialSummary) {
  return `
You are a finance assistant for SmartLedger Lite.

Analyze the business financial data below and generate 4 concise financial insights.

Rules:
- Return ONLY plain text.
- Each insight must be on a new line.
- Do NOT return JSON.
- Do NOT use markdown.
- Do NOT use bullet symbols.
- Keep each insight under 20 words.
- Always use ruppees (₹) as the currency.
- Focus on revenue, expenses, pending invoices, and spending patterns.
- Keep tone professional and business-focused.

Financial data:
${JSON.stringify(summary)}
`;
}

function extractJsonObject(text: string) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function parseInsights(text: string): FinancialInsightsResult {
  const insights = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•\d.]+\s*/, ""))
    .filter((line) => line.length > 10)
    .slice(0, 5);

  return { insights };
}

function parseInsightsFallback(text: string): FinancialInsightsResult {
  const insights = text
    .split("\n")
    .map((line) => line.replace(/^[-*•\d.]+\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

  if (insights.length === 0) {
    throw new Error("Could not parse AI response");
  }

  return { insights };
}

export async function generateFinancialInsights(
  summary: FinancialSummary
): Promise<FinancialInsightsResult> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildFinancialInsightsPrompt(summary),
    config: {
      temperature: 0.3,
      maxOutputTokens: 300,
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Empty AI response");
  }

  return parseInsights(text);
}
