export default function About(props: Record<string, unknown>) {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/9aa2608f-0fed-41bd-8f28-52f5913ce42c", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "app/(pages)/about/page.tsx:1",
      message: "About page entry",
      data: {
        hasParams: "params" in props,
        propsKeys: Object.keys(props),
        paramsType: props.params?.constructor?.name,
      },
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion
  return (
    <div className="h-[calc(100vh-140px)] px-4 py-8 md:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto h-full w-full max-w-5xl space-y-10 overflow-y-auto">
        <header className="space-y-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            About
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Built for confident PDF exploration
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
            PDF AI Assistant hjelper deg å gjøre store dokumenter om til raske,
            tydelige svar. Last opp, søk og spør på sekunder.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white">Hva vi gjør</h2>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed">
              Vi kombinerer semantisk søk og AI for å hente frem svarene som
              betyr mest, uten at du må lete gjennom hele PDF-en selv.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white">
              Hvordan det fungerer
            </h2>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed">
              Dokumentet indekseres, innholdet analyseres, og du kan stille
              spørsmål i naturlig språk. Svarene kommer med kontekst, slik at du
              enkelt kan gå videre i arbeidet ditt.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/30 p-6 md:p-8 shadow-xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: "Semantisk søk", text: "Finn riktig avsnitt, raskt." },
              { title: "AI-svar", text: "Spør med egne ord og få klare svar." },
              { title: "Effektivitet", text: "Mindre tid brukt på lesing." },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
