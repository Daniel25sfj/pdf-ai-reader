"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // ---- UPLOAD PDF ------------------------------------------
  async function upload() {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    setUploadResult(JSON.stringify(data, null, 2));
  }

  // ---- ASK AI ----------------------------------------------
  async function ask() {
    setLoading(true);

    const res = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setAnswer(data.answer || JSON.stringify(data, null, 2));

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-black/40 shadow-lg backdrop-blur-sm p-6 md:p-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            PDF AI Assistant
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl">
            Last opp en PDF, søk semantisk i innholdet og still spørsmål til
            dokumentet med AI – alt på ett sted.
          </p>
        </header>

        <div className="space-y-8">
          {/* ------------------------ UPLOAD SECTION ------------------------ */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-medium">1. Upload PDF</h2>
              <p className="text-xs text-gray-400">
                Velg en PDF-fil du vil prosessere. Resultatet av opplastingen
                vises under.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Fil (PDF)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-200
                  file:mr-4 file:rounded-md file:border-0
                  file:bg-blue-600 file:px-4 file:py-2
                  file:text-sm file:font-medium file:text-white
                  hover:file:bg-blue-500
                  cursor-pointer"
              />
            </div>

            <button
              onClick={upload}
              disabled={!file}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Upload &amp; Process
            </button>

            {uploadResult && (
              <div className="max-h-48 overflow-auto rounded-md border border-white/10 bg-black/60 p-3">
                <pre className="whitespace-pre-wrap text-xs font-mono text-gray-100">
                  {uploadResult}
                </pre>
              </div>
            )}
          </section>
        </div>

        {/* ------------------------ AI ASK SECTION ------------------------ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">3. Ask the PDF</h2>
            <p className="text-xs text-gray-400">
              Still et mer detaljert spørsmål til dokumentet, så svarer AI
              basert på innholdet.
            </p>
          </div>

          <textarea
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-24"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Spør dokumentet om noe..."
          />

          <button
            onClick={ask}
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-500"
          >
            {loading ? "Henter svar..." : "Still spørsmål"}
          </button>

          {answer && (
            <div className="max-h-72 overflow-auto rounded-md border border-white/10 bg-black/60 p-3">
              <pre className="whitespace-pre-wrap text-sm text-gray-100">
                {answer}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
