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
        <div className="h-[calc(100vh-140px)] px-4 py-6 md:px-6 lg:px-8 overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-8 overflow-y-auto">
            <header className="space-y-4 text-center">
              <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                Powered by AI
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                PDF AI Assistant
              </h1>
              <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Last opp en PDF, søk semantisk i innholdet og still spørsmål til
                dokumentet med AI – alt på ett sted.
              </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <section className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl">
                <div className="space-y-3">
                  <span className="inline-flex w-fit items-center rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">
                    Step 1
                  </span>
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Upload PDF
                  </h2>
                  <p className="text-sm md:text-base text-gray-300">
                    Velg en PDF-fil du vil prosessere. Resultatet av opplastingen
                    vises under.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="block text-sm md:text-base font-medium text-gray-200">
                    Fil (PDF)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-200
                      file:mr-4 file:rounded-full file:border-0
                      file:bg-blue-600 file:px-5 file:py-2.5
                      file:text-sm file:font-semibold file:text-white
                      hover:file:bg-blue-500
                      cursor-pointer"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={upload}
                      disabled={!file || uploading}
                      className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm md:text-base font-semibold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
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
                    <span className="text-xs text-gray-400">
                      PDF inntil 25 MB, tekst og skannede filer.
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl flex flex-col min-h-[420px]">
                <div className="space-y-3">
                  <span className="inline-flex w-fit items-center rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-200">
                    Step 2
                  </span>
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    Ask the PDF
                  </h2>
                  <p className="text-sm md:text-base text-gray-300">
                    Still et mer detaljert spørsmål, så svarer AI basert på
                    innholdet i dokumentet.
                  </p>
                </div>

                <div className="mt-6 flex flex-1 flex-col gap-4 min-h-0">
                  <div className="flex flex-col gap-3">
                    <textarea
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm md:text-base text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none min-h-[140px]"
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

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={ask}
                        disabled={loading || !query.trim()}
                        className="inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-2.5 text-sm md:text-base font-semibold text-white shadow-lg transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? "Henter svar..." : "Still spørsmål"}
                      </button>
                      <span className="text-xs text-gray-400">
                        Enter for å sende, Shift+Enter for ny linje.
                      </span>
                    </div>
                  </div>

                  {answer && (
                    <div className="flex-1 w-full overflow-y-auto rounded-xl border border-white/15 bg-black/50 p-4 md:p-6 min-h-[120px]">
                      <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-100 font-sans leading-relaxed wrap-break-word">
                        {answer}
                      </pre>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <section className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Instant insights",
                  text: "Få raske, presise svar fra store dokumenter uten å bla manuelt.",
                },
                {
                  title: "Secure workflow",
                  text: "Filene behandles sikkert, med tilgang kun for deg som er innlogget.",
                },
                {
                  title: "Smart summaries",
                  text: "Bruk naturlig språk for å oppsummere, sammenligne og finne detaljer.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-lg"
                >
                  <h3 className="text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">{item.text}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="h-[calc(100vh-140px)] px-4 py-8 md:px-6 overflow-hidden">
          <div className="mx-auto h-full max-w-5xl text-center space-y-8 overflow-y-auto">
            <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              Velkommen
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Velkommen til PDF AI Assistant
            </h1>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Du må logge inn for å bruke denne tjenesten. Klikk på &quot;Sign
              In&quot; i navigasjonsmenyen for å fortsette.
            </p>
            <div className="grid gap-4 md:grid-cols-3 text-left">
              {[
                {
                  title: "Upload",
                  text: "Dra inn PDF-er og gjør dem klare for AI-svar på sekunder.",
                },
                {
                  title: "Ask",
                  text: "Still spørsmål i naturlig språk og få sitatnære svar.",
                },
                {
                  title: "Explore",
                  text: "Oppdag mønstre, nøkkeltall og innsikter i dokumentene.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              Logg inn for å komme i gang med PDF-arbeidsflyten.
            </p>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
