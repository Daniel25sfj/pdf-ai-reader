"use client";
import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home(props: Record<string, unknown>) {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/9aa2608f-0fed-41bd-8f28-52f5913ce42c", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "app/page.tsx:4",
      message: "Home page entry",
      data: {
        hasParams: "params" in props,
        propsKeys: Object.keys(props),
        paramsType: props.params?.constructor?.name,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---- UPLOAD PDF ------------------------------------------
  async function upload() {
    if (!file) return;

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = {
            error: text || `Upload failed: HTTP ${res.status}`,
          };
        }
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  }

  // ---- ASK AI ----------------------------------------------
  async function ask() {
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = {
            error: text || `HTTP ${res.status}: ${res.statusText}`,
          };
        }
        throw new Error(errorData.error || `Spørsmål feilet: ${res.status}`);
      }

      const data = await res.json();
      setAnswer(data.answer || JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Ask error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Det oppstod en feil. Prøv igjen.";
      setAnswer(`Feil: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SignedIn>
        <div className="h-[calc(100vh-140px)] bg-background text-foreground flex items-center justify-center px-2 md:px-4 py-4">
          <div className="w-full max-w-6xl h-full max-h-[90vh] rounded-2xl border border-white/10 bg-black/40 shadow-lg backdrop-blur-sm p-6 md:p-8 lg:p-10 flex flex-col overflow-hidden">
            <header className="space-y-3 mb-6 shrink-0 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                PDF AI Assistant
              </h1>
              <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Last opp en PDF, søk semantisk i innholdet og still spørsmål til
                dokumentet med AI – alt på ett sted.
              </p>
            </header>

            <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-hidden">
              {/* ------------------------ UPLOAD SECTION ------------------------ */}
              <section className="space-y-4 shrink-0 max-w-4xl mx-auto w-full">
                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    1. Upload PDF
                  </h2>
                  <p className="text-sm md:text-base text-gray-300 mt-2">
                    Velg en PDF-fil du vil prosessere. Resultatet av
                    opplastingen vises under.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-base md:text-lg font-medium text-gray-200">
                    Fil (PDF)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-base text-gray-200
                      file:mr-4 file:rounded-md file:border-0
                      file:bg-blue-600 file:px-6 file:py-3
                      file:text-base file:font-medium file:text-white
                      hover:file:bg-blue-500
                      cursor-pointer"
                  />
                </div>

                <button
                  onClick={upload}
                  disabled={!file || uploading}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base md:text-lg font-medium text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading && (
                    <svg
                      className="mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )}
                  {uploading ? "Laster opp..." : "Upload & Process"}
                </button>
              </section>

              {/* ------------------------ AI ASK SECTION ------------------------ */}
              <section className="flex-[0.4] flex flex-col space-y-3 min-h-0 max-w-4xl mx-auto w-full">
                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    3. Ask the PDF
                  </h2>
                  <p className="text-sm md:text-base text-gray-300 mt-2">
                    Still et mer detaljert spørsmål til dokumentet, så svarer AI
                    basert på innholdet.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Question input area */}
                  <div className="flex flex-col space-y-3">
                    <textarea
                      className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 text-sm md:text-base text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none min-h-[120px]"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          !loading &&
                          query.trim()
                        ) {
                          e.preventDefault();
                          ask();
                        }
                      }}
                      placeholder="Spør dokumentet om noe..."
                    />

                    <button
                      onClick={ask}
                      disabled={loading || !query.trim()}
                      className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2.5 text-base font-medium text-white shadow-sm transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60 w-fit"
                    >
                      {loading ? "Henter svar..." : "Still spørsmål"}
                    </button>
                  </div>

                  {/* Answer area */}
                  {answer && (
                    <div className="w-full overflow-auto rounded-md border-2 border-white/30 bg-black/60 p-4 md:p-6 min-h-[100px]">
                      <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-100 font-sans leading-relaxed">
                        {answer}
                      </pre>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="h-[calc(100vh-140px)] bg-background text-foreground flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Velkommen til PDF AI Assistant
            </h1>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Du må logge inn for å bruke denne tjenesten. Klikk på &quot;Sign
              In&quot; i navigasjonsmenyen for å fortsette.
            </p>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
