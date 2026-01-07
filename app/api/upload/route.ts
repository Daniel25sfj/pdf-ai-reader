import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdf, chunkText } from "@/lib/pdf";
import { getEmbedding } from "@/lib/embeddings";
import { getSupabaseServer } from "@/lib/supabaseServer";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Upload failed: No file provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1) Extract text from PDF
    let fullText: string;
    try {
      fullText = await extractTextFromPdf(buffer);
    } catch (error) {
      console.error("PDF extraction error:", error);
      return NextResponse.json(
        { error: "Upload failed: Could not extract text from PDF" },
        { status: 500, headers: corsHeaders }
      );
    }

    // 2) Chunk text
    let chunks: string[];
    try {
      chunks = chunkText(fullText);
    } catch (error) {
      console.error("Chunking error:", error);
      return NextResponse.json(
        { error: "Upload failed: Could not process PDF content" },
        { status: 500, headers: corsHeaders }
      );
    }

    // 3) Create document entry
    const supabase = getSupabaseServer();
    const { data: doc, error: docErr } = await supabase
      .from("documents")
      .insert({ name: file.name })
      .select()
      .single();

    if (docErr) {
      console.error("Database error (documents):", docErr);
      return NextResponse.json(
        { error: "Upload failed: Could not save document to database" },
        { status: 500, headers: corsHeaders }
      );
    }

    // 4) Generate embedding + insert chunk rows
    try {
      for (let i = 0; i < chunks.length; i++) {
        const content = chunks[i];
        const embedding = await getEmbedding(content);

        const { error: chunkErr } = await supabase
          .from("document_chunks")
          .insert({
            document_id: doc.id,
            chunk_index: i,
            content,
            embedding,
          });

        if (chunkErr) {
          console.error("Database error (chunks):", chunkErr);
          return NextResponse.json(
            { error: "Upload failed: Could not save document chunks" },
            { status: 500, headers: corsHeaders }
          );
        }
      }
    } catch (error) {
      console.error("Embedding/chunk insertion error:", error);
      return NextResponse.json(
        { error: "Upload failed: Could not process document embeddings" },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        document_id: doc.id,
        chunks: chunks.length,
      },
      { headers: corsHeaders }
    );
  } catch (error: unknown) {
    console.error("Upload error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500, headers: corsHeaders }
    );
  }
}
