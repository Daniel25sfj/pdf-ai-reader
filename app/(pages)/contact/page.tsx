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
    <div className="h-[calc(100vh-140px)] bg-background text-foreground flex items-start justify-center px-1 md:px-2 py-1">
      <div className="w-full max-w-[98vw] h-full rounded-2xl border border-white/10 bg-black/40 shadow-lg backdrop-blur-sm p-3 md:p-4 lg:p-6 flex flex-col overflow-hidden">
        <header className="space-y-1 mb-2 flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Contact Us
          </h1>
          <p className="text-xs text-gray-400 max-w-2xl">
            Get in touch with us if you have any questions or feedback.
          </p>
        </header>
        <div className="flex-1 flex flex-col gap-3 md:gap-4 overflow-hidden">
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              We&apos;d love to hear from you! Please reach out if you need any
              assistance or have suggestions for improving the PDF AI Assistant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
