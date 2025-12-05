import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf, chunkText } from "@/lib/pdf";
import { getEmbedding } from "@/lib/embeddings";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1) Extract text from PDF
    const fullText = await extractTextFromPdf(buffer);

    // 2) Chunk text
    const chunks = chunkText(fullText);

    // 3) Create document entry
    const { data: doc, error: docErr } = await supabaseServer
      .from("documents")
      .insert({ name: file.name })
      .select()
      .single();

    if (docErr) {
      console.error(docErr);
      return NextResponse.json({ error: docErr.message }, { status: 500 });
    }

    // 4) Generate embedding + insert chunk rows
    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];
      const embedding = await getEmbedding(content);

      await supabaseServer.from("document_chunks").insert({
        document_id: doc.id,
        chunk_index: i,
        content,
        embedding,
      });
    }

    return NextResponse.json({
      ok: true,
      document_id: doc.id,
      chunks: chunks.length,
    });
  } catch (error: unknown) {
    console.error(error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
