// lib/pdf.ts

// Bruker pdf-parse-fixed (patchet for Node/Next.js)
import pdf from "pdf-parse-fixed";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

export function chunkText(text: string, chunkSize = 1000): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const part of text.split("\n")) {
    const p = part.trim();
    if (!p) continue;

    if ((current + " " + p).length > chunkSize) {
      chunks.push(current);
      current = p;
    } else {
      current = current ? current + " " + p : p;
    }
  }

  if (current.length > 0) chunks.push(current);

  return chunks;
}
