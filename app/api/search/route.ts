import { NextRequest, NextResponse } from "next/server";
import { getEmbedding } from "@/lib/embeddings";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { query, document_id, match_count = 5 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // 1. Lag embedding av query
    const queryEmbedding = await getEmbedding(query);

    // 2. Kjør similarity-søk i Supabase
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.rpc("match_document_chunks", {
      query_embedding: queryEmbedding,
      match_count,
      filter_document_id: document_id ?? null,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      results: data,
    });
  } catch (err: unknown) {
    console.error(err);

    const message =
      err instanceof Error ? err.message : "Unknown error occurred";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
