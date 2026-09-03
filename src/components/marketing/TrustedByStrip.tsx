const companies = ["NimbusCloud", "Vertex Labs", "Ironclad Sys", "Northpoint", "Fortify.io"];

export function TrustedByStrip() {
  return (
    <section className="bg-surface py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-[13px] tracking-wide text-muted">
          TRUSTED BY SECURITY TEAMS AT
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-16 gap-y-4">
          {companies.map((name) => (
            <span key={name} className="font-mono text-xl font-bold text-muted/70">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
