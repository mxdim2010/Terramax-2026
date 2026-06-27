const services = [
  {
    title: "Site Development",
    text: "Fast, responsive websites built for conversion and maintainability.",
  },
  {
    title: "Growth Systems",
    text: "SEO, analytics, and automation setup to help your traffic compound.",
  },
  {
    title: "Launch Operations",
    text: "From staging to production with dependable deploy and rollback flows.",
  },
]

const highlights = ["Next.js", "TypeScript", "Vercel", "Tailwind CSS"]

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="hero-shell">
        <div className="hero-grid" />
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-8 sm:px-10">
          <header className="fade-up flex items-center justify-between">
            <div className="text-sm tracking-[0.18em] text-slate-600">TERRAMAX.DEV</div>
            <button className="rounded-full border border-slate-400/40 bg-white/70 px-4 py-2 text-sm text-slate-700 transition hover:bg-white">
              Start a Project
            </button>
          </header>

          <div className="mt-20 grid gap-10 lg:mt-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="fade-up delay-1">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-500">Digital Engineering Studio</p>
              <h1 className="text-balance text-5xl font-semibold leading-[0.95] text-slate-900 sm:text-6xl md:text-7xl">
                Build bold
                <br />
                products that
                <br />
                <span className="text-[#0e7490]">ship clean.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base text-slate-700 sm:text-lg">
                Terramax helps founders and teams design, build, and launch high-performance web platforms with clear architecture and modern delivery practices.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white transition hover:bg-black">
                  Book Discovery Call
                </button>
                <button className="rounded-full border border-slate-400/40 bg-white/70 px-5 py-2.5 text-sm text-slate-800 transition hover:bg-white">
                  View Services
                </button>
              </div>
            </div>

            <aside className="fade-up delay-2 rounded-3xl border border-slate-300/50 bg-white/70 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.14em] text-slate-500">Current Stack</p>
              <ul className="mt-4 grid gap-2">
                {highlights.map((item) => (
                  <li key={item} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-slate-100">
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <div className="fade-up mb-8 flex items-end justify-between gap-8">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">What Terramax Delivers</h2>
          <p className="max-w-md text-sm text-slate-600 sm:text-base">A practical blend of product thinking, design clarity, and engineering discipline.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service, idx) => (
            <article
              key={service.title}
              className="fade-up rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
            >
              <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
