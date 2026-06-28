"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Hammer,
  Mail,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FormStatus = {
  type: "success" | "error" | null
  message: string
}

const highlights = [
  {
    title: "Cash Offer in 24 Hours",
    copy: "Fast valuation and clear pricing with no hidden deductions.",
    icon: Clock3,
  },
  {
    title: "No Repairs Needed",
    copy: "Sell your property as-is. We handle every stage of renovation.",
    icon: Hammer,
  },
  {
    title: "Close in 7 Days",
    copy: "Accelerated legal coordination and reliable completion windows.",
    icon: ShieldCheck,
  },
]

const serviceCards = [
  {
    title: "Property Acquisition",
    description:
      "We purchase distressed and underperforming homes with transparent cash offers and rapid exchange.",
    icon: Building2,
  },
  {
    title: "Structural Renovation",
    description:
      "Full-scope refurbishment from roofing and systems to premium kitchens, bathrooms, and finishes.",
    icon: Sparkles,
  },
  {
    title: "Sale and Rental Strategy",
    description:
      "Data-led marketing, staging, and pricing to maximize resale value or long-term rental performance.",
    icon: TrendingUp,
  },
]

const trustStats = [
  { label: "Average Review Score", value: "4.9/5" },
  { label: "Typical Offer Window", value: "Within 24h" },
  { label: "Fastest Completion", value: "As little as 7 days" },
  { label: "Years in Market", value: "15+" },
]

const propertyTypes = [
  "Probate Properties",
  "Tenanted Properties",
  "Short-Lease Flats",
  "Homes Needing Full Refurbishment",
  "Inherited Houses",
  "Fire or Subsidence Cases",
]

const comparisonRows = [
  { metric: "Time to complete", direct: "7-21 days", market: "4-9 months" },
  { metric: "Estate agent fees", direct: "GBP 0", market: "1%-3% + VAT" },
  { metric: "Repairs before sale", direct: "Not required", market: "Usually expected" },
  { metric: "Viewing disruption", direct: "None", market: "Multiple viewings" },
  { metric: "Certainty", direct: "Cash-backed process", market: "Chain + mortgage risk" },
]

const testimonials = [
  {
    quote:
      "Fast, direct, and clear from day one. We avoided months of uncertainty and completed on our timeline.",
    author: "Seller in Greater London",
  },
  {
    quote:
      "No repairs, no endless viewings, no hidden charges. Exactly what we needed for a stress-free sale.",
    author: "Landlord in Birmingham",
  },
  {
    quote:
      "Professional team and excellent communication throughout. The process was simple and reliable.",
    author: "Family Seller in Manchester",
  },
]

const faqs = [
  {
    question: "How quickly can TerraMax make an offer?",
    answer:
      "After reviewing your property details, we typically provide a no-obligation cash offer within 24 hours.",
  },
  {
    question: "Do I need to repair or clean the property first?",
    answer:
      "No. We purchase properties in their current condition, including homes that require major renovation work.",
  },
  {
    question: "Are there any agency or legal fees to pay?",
    answer:
      "We do not charge estate agency fees. We keep costs transparent and walk you through everything before you proceed.",
  },
  {
    question: "What kinds of properties do you buy?",
    answer:
      "We buy houses, flats, inherited homes, tenanted properties, and complex cases such as short leases or structural issues.",
  },
]

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "TerraMax Developments",
  description:
    "TerraMax Developments buys residential properties quickly, renovates them, and offers transparent direct-sale options.",
  telephone: "+44 7576039659",
  email: "contact@terramaxdev.com",
  areaServed: "United Kingdom",
  url: "https://terramaxdev.com",
  sameAs: ["https://github.com/mxdim2010/Terramax-2026"],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

const process = [
  {
    step: "01",
    title: "Evaluation",
    text: "We assess condition, location, and renovation scope to provide a fair, market-aware offer.",
  },
  {
    step: "02",
    title: "Acquisition",
    text: "Simple legal process, reliable timelines, and fast completion without financing uncertainty.",
  },
  {
    step: "03",
    title: "Transformation",
    text: "Our crew executes a high-spec refurbishment plan aligned with modern buyer and tenant demand.",
  },
  {
    step: "04",
    title: "Launch",
    text: "We list for sale or rent with professional visuals, market positioning, and deal management.",
  },
]

const projects = [
  {
    title: "Victorian Home Restoration",
    image: "/images/sold-victorian-home.jpg",
    status: "Sold",
    statusClass: "bg-emerald-600",
    detailLeft: "Purchase: GBP 180K",
    detailRight: "Sold: GBP 320K",
  },
  {
    title: "Modern Family Home",
    image: "/images/rented-modern-family-home.jpg",
    status: "Rented",
    statusClass: "bg-sky-600",
    detailLeft: "Purchase: GBP 220K",
    detailRight: "Rent: GBP 2,800/mo",
  },
  {
    title: "Craftsman Bungalow",
    image: "/images/in-progress-craftsman-bungalow.jpg",
    status: "In Progress",
    statusClass: "bg-amber-600",
    detailLeft: "Purchase: GBP 165K",
    detailRight: "Est. Value: GBP 285K",
  },
]

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quickPostcode, setQuickPostcode] = useState("")
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: null, message: "" })

  const handleQuickValuation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const contactSection = document.getElementById("contact")
    contactSection?.scrollIntoView({ behavior: "smooth", block: "start" })

    const propertyAddressInput = document.getElementById("propertyAddress") as HTMLInputElement | null
    if (propertyAddressInput && quickPostcode.trim()) {
      propertyAddressInput.value = quickPostcode.trim()
      propertyAddressInput.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ type: null, message: "" })

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setFormStatus({ type: "success", message: result.message })
        e.currentTarget.reset()
      } else {
        setFormStatus({ type: "error", message: result.message })
      }
    } catch {
      setFormStatus({
        type: "error",
        message: "Sorry, there was an error sending your message. Please call us directly at +44 7576039659.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative isolate min-h-screen bg-stone-100 pb-24 text-stone-900 md:pb-0">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/images/hero-house.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.26]"
        />
        <div className="absolute inset-0 bg-stone-100/72" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="sticky top-0 z-50 border-b border-stone-300/70 bg-stone-100/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#" className="group flex items-center">
            <Image
              src="/images/terramax-logo.png"
              alt="TerraMax Developments logo"
              width={420}
              height={120}
              priority
              className="h-12 w-auto object-contain sm:h-14"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.14em] md:flex">
            <Link className="hover:text-amber-700" href="#services">
              Services
            </Link>
            <Link className="hover:text-amber-700" href="#process">
              Process
            </Link>
            <Link className="hover:text-amber-700" href="#projects">
              Projects
            </Link>
            <Link className="hover:text-amber-700" href="#contact">
              Contact
            </Link>
          </nav>

          <div className="hidden md:block">
            <Button asChild className="rounded-none bg-stone-900 px-6 uppercase tracking-[0.1em] hover:bg-stone-800">
              <a href="tel:+447576039659">Call +44 7576039659</a>
            </Button>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-sm border border-stone-400 p-2 md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-stone-300 bg-stone-100 md:hidden">
            <div className="space-y-1 px-4 py-4 text-sm uppercase tracking-[0.14em]">
              <Link className="block py-2" href="#services" onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
              <Link className="block py-2" href="#process" onClick={() => setIsMenuOpen(false)}>
                Process
              </Link>
              <Link className="block py-2" href="#projects" onClick={() => setIsMenuOpen(false)}>
                Projects
              </Link>
              <Link className="block py-2" href="#contact" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-stone-300 bg-[radial-gradient(circle_at_15%_20%,rgba(245,158,11,0.22),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(15,23,42,0.22),transparent_40%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:py-24">
            <div>
              <Badge className="rounded-none border border-stone-700 bg-transparent px-3 py-1 text-xs uppercase tracking-[0.18em] text-stone-800">
                Residential Rebuild Specialists
              </Badge>
              <h1 className="mt-6 font-display text-5xl uppercase leading-[0.92] tracking-[0.04em] text-stone-950 sm:text-6xl lg:text-7xl">
                We Turn Distressed Houses Into Prime Homes.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-stone-700">
                TerraMax acquires properties quickly, renovates to a high standard, and delivers measurable value for
                owners, buyers, and neighborhoods.
              </p>

              <form onSubmit={handleQuickValuation} className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
                <Input
                  value={quickPostcode}
                  onChange={(e) => setQuickPostcode(e.target.value)}
                  placeholder="Enter your postcode for a fast cash offer"
                  aria-label="Postcode"
                  className="h-12 rounded-none border-stone-500 bg-white/90 text-stone-900 placeholder:text-stone-500"
                />
                <Button type="submit" className="h-12 rounded-none bg-stone-900 px-6 uppercase tracking-[0.1em] hover:bg-stone-800">
                  Get Cash Offer
                </Button>
              </form>

              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-stone-600">
                No obligation. Typical response within 24 hours.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="rounded-none bg-amber-500 px-7 py-6 text-sm uppercase tracking-[0.14em] text-stone-950 hover:bg-amber-400">
                  <Link href="#contact">
                    Request Offer <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none border-stone-900 bg-transparent px-7 py-6 text-sm uppercase tracking-[0.14em]"
                >
                  <Link href="#projects">See Projects</Link>
                </Button>
              </div>
            </div>

            <div className="relative isolate">
              <div className="absolute -left-5 -top-5 h-24 w-24 border-l-4 border-t-4 border-amber-500" />
              <div className="absolute -bottom-5 -right-5 h-24 w-24 border-b-4 border-r-4 border-stone-900" />
              <div className="relative overflow-hidden border border-stone-900 bg-stone-200 p-2 shadow-[10px_10px_0px_0px_rgba(24,24,24,0.9)]">
                <Image
                  src="/images/hero-house.jpg"
                  alt="Renovated house exterior"
                  width={860}
                  height={600}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-3 lg:px-8">
            {highlights.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="rounded-none border-stone-300 bg-white/90 shadow-none">
                  <CardContent className="flex items-start gap-4 p-6">
                    <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-stone-900 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl uppercase tracking-[0.06em]">{item.title}</h3>
                      <p className="mt-2 text-sm text-stone-600">{item.copy}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="border-b border-stone-300 bg-white/85 py-10 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {trustStats.map((item) => (
                <div key={item.label} className="border border-stone-300 bg-white/90 p-5">
                  <p className="font-display text-3xl uppercase tracking-[0.05em] text-stone-900">{item.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-600">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge className="rounded-none border border-stone-800 bg-transparent text-stone-800">Property Ombudsman Aligned</Badge>
              <Badge className="rounded-none border border-stone-800 bg-transparent text-stone-800">Transparent Fee Policy</Badge>
              <Badge className="rounded-none border border-stone-800 bg-transparent text-stone-800">Direct Cash Buyer Model</Badge>
              <Badge className="rounded-none border border-stone-800 bg-transparent text-stone-800">No Obligation Offers</Badge>
            </div>
          </div>
        </section>

        <section id="services" className="border-b border-stone-300 bg-stone-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-stone-500">What We Deliver</p>
                <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.05em] sm:text-5xl">Construction-Grade Execution</h2>
              </div>
              <p className="max-w-xl text-stone-600">
                From acquisition through sale or rental, our integrated team controls quality, timelines, and financial
                outcomes at every phase.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {serviceCards.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="group rounded-none border-stone-300 bg-white transition hover:-translate-y-1 hover:border-stone-900">
                    <CardContent className="p-7">
                      <Icon className="h-8 w-8 text-amber-600" />
                      <h3 className="mt-5 font-display text-2xl uppercase tracking-[0.05em]">{item.title}</h3>
                      <p className="mt-3 text-stone-600">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="mt-10">
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Property Types We Buy</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {propertyTypes.map((type) => (
                  <span key={type} className="border border-stone-400 bg-white px-3 py-2 text-xs uppercase tracking-[0.12em] text-stone-700">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="border-b border-stone-300 bg-stone-900 py-20 text-stone-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-400">How It Works</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl uppercase tracking-[0.05em] sm:text-5xl">
              A Proven 4-Stage Delivery Model
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {process.map((item) => (
                <div key={item.step} className="border border-stone-700 bg-stone-800/70 p-6">
                  <p className="font-display text-4xl leading-none text-amber-400">{item.step}</p>
                  <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.05em]">{item.title}</h3>
                  <p className="mt-3 text-sm text-stone-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="border-b border-stone-300 bg-stone-100 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-stone-500">Portfolio</p>
                <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.05em] sm:text-5xl">Recent Transformations</h2>
              </div>
              <p className="max-w-xl text-stone-600">
                Real projects, measurable uplift, and design-led renovation work tailored to each neighborhood.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.title} className="overflow-hidden rounded-none border-stone-300 bg-white">
                  <div className="relative h-56">
                    <Image src={project.image} alt={project.title} fill className="object-cover" />
                    <Badge className={`absolute left-3 top-3 rounded-none ${project.statusClass}`}>{project.status}</Badge>
                  </div>
                  <CardContent className="space-y-4 p-5">
                    <h3 className="font-display text-2xl uppercase tracking-[0.05em]">{project.title}</h3>
                    <div className="flex items-center justify-between gap-4 text-sm text-stone-600">
                      <span>{project.detailLeft}</span>
                      <span className="font-semibold text-stone-900">{project.detailRight}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.22em] text-stone-500">Transparent Comparison</p>
              <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.05em] sm:text-5xl">
                Direct Sale vs Traditional Listing
              </h2>
            </div>

            <div className="overflow-x-auto border border-stone-300 bg-white">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="bg-stone-900 text-stone-100">
                  <tr>
                    <th className="px-5 py-4 text-xs uppercase tracking-[0.16em]">Metric</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-[0.16em]">TerraMax Direct</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-[0.16em]">Open Market Route</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.metric} className="border-t border-stone-200">
                      <td className="px-5 py-4 font-semibold text-stone-900">{row.metric}</td>
                      <td className="px-5 py-4 text-emerald-700">{row.direct}</td>
                      <td className="px-5 py-4 text-stone-600">{row.market}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-amber-500 py-14 text-stone-950">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8">
            <div>
              <p className="font-display text-5xl leading-none">150+</p>
              <p className="mt-2 text-sm uppercase tracking-[0.15em]">Properties Renovated</p>
            </div>
            <div>
              <p className="font-display text-5xl leading-none">GBP 12M+</p>
              <p className="mt-2 text-sm uppercase tracking-[0.15em]">Total Investment</p>
            </div>
            <div>
              <p className="font-display text-5xl leading-none">98%</p>
              <p className="mt-2 text-sm uppercase tracking-[0.15em]">Client Satisfaction</p>
            </div>
            <div>
              <p className="font-display text-5xl leading-none">15</p>
              <p className="mt-2 text-sm uppercase tracking-[0.15em]">Years Experience</p>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-stone-50 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">About TerraMax</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.05em] sm:text-5xl">Built on Craft and Reliability</h2>
              <p className="mt-6 text-lg text-stone-700">
                Since 2009, TerraMax Developments has upgraded neighborhoods by converting neglected properties into
                high-quality homes for sale and rent.
              </p>
              <p className="mt-4 text-stone-600">
                Our contractors, designers, and acquisition team work as one unit to protect margins while elevating
                quality in every project.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" />
                  <p>Licensed and insured construction operations.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-1 h-5 w-5 text-emerald-600" />
                  <p>Skilled multidisciplinary team with deep renovation expertise.</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border border-stone-900 bg-white p-2 shadow-[10px_10px_0px_0px_rgba(24,24,24,0.9)]">
              <Image
                src="/images/terramax-team.jpg"
                alt="TerraMax team on site"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-stone-900 py-20 text-stone-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-400">Social Proof</p>
              <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.05em] sm:text-5xl">Recent Seller Feedback</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <Card key={item.author} className="rounded-none border-stone-700 bg-stone-800 text-stone-100">
                  <CardContent className="p-6">
                    <p className="text-stone-200">&ldquo;{item.quote}&rdquo;</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.14em] text-amber-400">{item.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-stone-300 bg-white py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">FAQs</p>
              <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.05em] sm:text-5xl">Common Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((item) => (
                <details key={item.question} className="border border-stone-300 bg-stone-50 p-5">
                  <summary className="cursor-pointer font-display text-xl uppercase tracking-[0.05em] text-stone-900">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-stone-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-stone-100 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Contact</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.05em] sm:text-5xl">Request Your Free Consultation</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="rounded-none border-stone-300 bg-white">
                <CardContent className="p-7 sm:p-9">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="mb-2 block text-sm uppercase tracking-[0.12em] text-stone-600">
                          First Name *
                        </label>
                        <Input id="firstName" name="firstName" placeholder="John" required className="rounded-none" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="mb-2 block text-sm uppercase tracking-[0.12em] text-stone-600">
                          Last Name *
                        </label>
                        <Input id="lastName" name="lastName" placeholder="Doe" required className="rounded-none" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm uppercase tracking-[0.12em] text-stone-600">
                        Email *
                      </label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" required className="rounded-none" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm uppercase tracking-[0.12em] text-stone-600">
                        Phone
                      </label>
                      <Input id="phone" name="phone" type="tel" placeholder="07123456789" className="rounded-none" />
                    </div>

                    <div>
                      <label
                        htmlFor="propertyAddress"
                        className="mb-2 block text-sm uppercase tracking-[0.12em] text-stone-600"
                      >
                        Property Address
                      </label>
                      <Input
                        id="propertyAddress"
                        name="propertyAddress"
                        placeholder="123 Main St, City, Postcode"
                        className="rounded-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm uppercase tracking-[0.12em] text-stone-600">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className="rounded-none"
                        placeholder="Tell us about your property and timeline."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-none bg-stone-900 py-6 text-sm uppercase tracking-[0.14em] hover:bg-stone-800"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>

                  {formStatus.type && (
                    <div
                      className={`mt-5 border p-4 text-sm ${
                        formStatus.type === "success"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-red-300 bg-red-50 text-red-800"
                      }`}
                    >
                      {formStatus.message}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-5">
                <Card className="rounded-none border-stone-300 bg-white">
                  <CardContent className="space-y-5 p-7">
                    <h3 className="font-display text-2xl uppercase tracking-[0.05em]">Direct Contact</h3>
                    <div className="space-y-4">
                      <a href="tel:+447576039659" className="flex items-center gap-3 hover:text-amber-700">
                        <Phone className="h-5 w-5" />
                        <span>+44 7576039659</span>
                      </a>
                      <a href="mailto:contact@terramaxdev.com" className="flex items-center gap-3 hover:text-amber-700">
                        <Mail className="h-5 w-5" />
                        <span>contact@terramaxdev.com</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-stone-300 bg-stone-900 text-stone-100">
                  <CardContent className="space-y-4 p-7">
                    <h3 className="font-display text-2xl uppercase tracking-[0.05em]">Why Owners Choose TerraMax</h3>
                    <ul className="space-y-3 text-sm text-stone-200">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Cash offers within 24 hours
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" /> No repairs, cleaning, or staging
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Fast and predictable completion
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" /> No agency commissions or hidden fees
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-300 bg-stone-950 py-10 text-stone-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <Image
              src="/images/terramax-logo.png"
              alt="TerraMax Developments logo"
              width={420}
              height={120}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-2 text-sm text-stone-400">Transforming properties and communities through disciplined renovation.</p>
          </div>
          <div className="space-y-1 text-sm md:text-right">
            <p>
              <a href="tel:+447576039659" className="hover:text-white">
                +44 7576039659
              </a>
            </p>
            <p>
              <a href="mailto:contact@terramaxdev.com" className="hover:text-white">
                contact@terramaxdev.com
              </a>
            </p>
            <p className="text-stone-500">Copyright 2026 TerraMax Developments. Licensed and insured.</p>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-700 bg-stone-950/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <Button asChild className="h-11 flex-1 rounded-none border border-amber-500 bg-amber-500 text-xs uppercase tracking-[0.12em] text-stone-950 hover:bg-amber-400">
            <a href="tel:+447576039659">Call Now</a>
          </Button>
          <Button asChild className="h-11 flex-1 rounded-none bg-stone-100 text-xs uppercase tracking-[0.12em] text-stone-950 hover:bg-stone-200">
            <Link href="#contact">Get Offer</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
