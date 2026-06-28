import Image from "next/image"

const services = [
  {
    title: "Property Acquisition",
    text: "We purchase houses in any condition and close quickly with transparent, fair offers.",
  },
  {
    title: "Full Renovation",
    text: "Licensed teams modernize structure, interiors, and systems to a high construction standard.",
  },
  {
    title: "Sale & Rental",
    text: "Completed properties are prepared for resale or long-term rental management.",
  },
]

const projects = [
  { src: "/images/sold-victorian-home.jpg", title: "Sold Victorian Home" },
  { src: "/images/rented-modern-family-home.jpg", title: "Rented Family Property" },
  { src: "/images/in-progress-craftsman-bungalow.jpg", title: "Craftsman Bungalow In Progress" },
]

export default function Home() {
  return (
    <main className="relative overflow-hidden text-slate-900">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-16 pt-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="fade-up">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-orange-700">TerraMax Developments</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            Building better homes
            <br />
            for modern families.
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-700 sm:text-lg">
            We buy, renovate, and deliver quality residential properties across the UK with a focus on craftsmanship, safety, and long-term value.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="rounded-full bg-orange-700 px-5 py-2.5 text-sm text-white transition hover:bg-orange-800">
              Get a Free Consultation
            </a>
            <a href="#services" className="rounded-full border border-slate-400/50 bg-white/80 px-5 py-2.5 text-sm text-slate-800 transition hover:bg-white">
              View Services
            </a>
          </div>
        </div>

        <div className="fade-up delay-1">
          <Image
            src="/images/hero-house.jpg"
            alt="TerraMax renovated residential house"
            width={960}
            height={700}
            className="h-auto w-full rounded-2xl border border-orange-200/60 object-cover shadow-[0_18px_60px_rgba(15,23,42,0.18)]"
            priority
          />
        </div>
      </section>

      <section id="services" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
        <div className="fade-up mb-8 flex items-end justify-between gap-8">
          <h2 className="text-3xl font-semibold sm:text-4xl">Our Construction Workflow</h2>
          <p className="max-w-md text-sm text-slate-600 sm:text-base">From acquisition to final handover, every stage is managed by experienced professionals.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="fade-up rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
        <div className="fade-up mb-8">
          <h2 className="text-3xl font-semibold sm:text-4xl">Recent Property Projects</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <figure key={project.title} className="fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <Image src={project.src} alt={project.title} width={900} height={620} className="h-56 w-full object-cover" />
              <figcaption className="px-4 py-3 text-sm font-medium text-slate-700">{project.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-10">
        <div className="fade-up grid gap-8 rounded-2xl border border-orange-300/40 bg-white/90 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Talk To TerraMax</h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Selling a house, planning a renovation, or searching for a quality finished home? Let&apos;s discuss your project.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              <li>Phone: +44 7576039659</li>
              <li>Email: contact@terramaxdev.com</li>
              <li>Hours: Monday to Saturday, 8:00-18:00</li>
            </ul>
          </div>
          <Image
            src="/images/terramax-team.jpg"
            alt="TerraMax construction team"
            width={700}
            height={560}
            className="h-full w-full rounded-xl object-cover"
          />
        </div>
      </section>
    </main>
  )
}
