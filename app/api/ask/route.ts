import { NextRequest, NextResponse } from "next/server";
import { getEmbedding } from "@/lib/embeddings";
import { getSupabaseServer } from "@/lib/supabaseServer";
import OpenAI from "openai";

type MatchChunk = {
  content: string;
};

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { query, document_id, match_count = 5 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // 1. Query → embedding
    const queryEmbedding = await getEmbedding(query);

    // 2. Finn relevante chunks
    const supabase = getSupabaseServer();
    const { data: matches, error } = await (supabase as any).rpc(
      "match_document_chunks",
      {
        query_embedding: queryEmbedding,
        match_count,
        filter_document_id: document_id ?? null,
      }
    );

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // 3. Lag context
    const contextText = (matches ?? [])
      .map((m: MatchChunk) => m.content)
      .join("\n\n");

    const prompt = `
Bruk utelukkende informasjon fra dokumentet under. 
Svar så presist som mulig.

QUERY:
${query}

DOKUMENT-KONTEXT:
${contextText}
`;

    // 4. Kall GPT for et svar
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini", // eller "gpt-5-nano" når den støtter chat-completions
      messages: [
        {
          role: "system",
          content:
            "Du er en hjelpsom assistent. Svar kun basert på dokumentet.",
        },
        { role: "user", content: prompt },
      ],
    });

    const answer = aiRes.choices[0].message.content;

    return NextResponse.json(
      {
        ok: true,
        answer,
        chunks_used: matches,
      },
      { headers: corsHeaders }
    );
  } catch (err: unknown) {
    console.error("Ask API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
