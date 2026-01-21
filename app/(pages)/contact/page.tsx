export default function Contact(props: Record<string, unknown>) {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/9aa2608f-0fed-41bd-8f28-52f5913ce42c", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "app/(pages)/contact/page.tsx:1",
      message: "Contact page entry",
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
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-200">
            Contact
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Vi er her for å hjelpe
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Har du spørsmål eller innspill? Vi vil gjerne høre fra deg og hjelpe
            deg videre med PDF AI Assistant.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Support",
              text: "Få hjelp til opplasting, søk og AI-svar i dokumentene dine.",
            },
            {
              title: "Feedback",
              text: "Del forslag til forbedringer eller ønskede funksjoner.",
            },
            {
              title: "Samarbeid",
              text: "Utforsk muligheter for team og organisasjoner.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/30 p-6 md:p-8 text-center shadow-xl">
          <h2 className="text-lg font-semibold text-white">
            Klar til å komme i gang?
          </h2>
          <p className="mt-3 text-sm text-gray-300">
            Logg inn og send oss gjerne innspill mens du jobber med PDF-ene dine.
          </p>
        </section>
      </div>
    </div>
  );
}
