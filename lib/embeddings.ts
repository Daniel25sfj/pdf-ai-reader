import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getEmbedding(text: string): Promise<number[]> {
  const clean = text.replace(/\s+/g, " ").trim();
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: clean,
  });

  return res.data[0].embedding as number[];
}
