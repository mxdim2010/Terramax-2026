"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type DesignResponse = {
  success: boolean
  summary?: string
  layoutPlan?: string[]
  furniturePlan?: string[]
  decorationPlan?: string[]
  nextSteps?: string[]
  message?: string
}

const roomTypes = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Home Office", "Dining Room"]
const styles = ["Modern", "Scandinavian", "Industrial", "Contemporary", "Classic", "Minimalist"]
const budgets = ["Under GBP 3,000", "GBP 3,000-7,000", "GBP 7,000-12,000", "GBP 12,000+"]

export default function InteriorDesignHelperPage() {
  const [roomType, setRoomType] = useState(roomTypes[0])
  const [style, setStyle] = useState(styles[0])
  const [budget, setBudget] = useState(budgets[1])
  const [width, setWidth] = useState("")
  const [length, setLength] = useState("")
  const [ceilingHeight, setCeilingHeight] = useState("")
  const [household, setHousehold] = useState("")
  const [priorities, setPriorities] = useState("")
  const [floorPlanFileName, setFloorPlanFileName] = useState("")
  const [photoFileNames, setPhotoFileNames] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<DesignResponse | null>(null)

  const areaPreview = useMemo(() => {
    const w = Number.parseFloat(width)
    const l = Number.parseFloat(length)

    if (!Number.isFinite(w) || !Number.isFinite(l) || w <= 0 || l <= 0) {
      return null
    }

    return (w * l).toFixed(1)
  }, [width, length])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    try {
      const response = await fetch("/api/interior-design-helper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomType,
          style,
          budget,
          width,
          length,
          ceilingHeight,
          household,
          priorities,
        }),
      })

      const data = (await response.json()) as DesignResponse
      setResult(data)
    } catch {
      setResult({
        success: false,
        message: "Could not generate recommendations. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="border-b border-stone-300 bg-stone-100/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-2xl uppercase tracking-[0.08em]">
            TerraMax
          </Link>
          <Badge className="rounded-none border border-stone-700 bg-transparent text-stone-800">Interior Design Helper</Badge>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section>
          <h1 className="font-display text-4xl uppercase tracking-[0.06em] sm:text-5xl">Interior Design Helper</h1>
          <p className="mt-4 max-w-2xl text-stone-700">
            Upload your floor plan, add room measurements, and share photos. This MVP skeleton returns a practical layout,
            furniture, and styling direction you can iterate with a designer.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Card className="rounded-none border-stone-300 bg-white">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Step 1</p>
                <p className="mt-2 text-sm text-stone-700">Upload plan + photos</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-stone-300 bg-white">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Step 2</p>
                <p className="mt-2 text-sm text-stone-700">Set style + budget</p>
              </CardContent>
            </Card>
            <Card className="rounded-none border-stone-300 bg-white">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Step 3</p>
                <p className="mt-2 text-sm text-stone-700">Get actionable concept</p>
              </CardContent>
            </Card>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 border border-stone-300 bg-white p-6 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="h-11 w-full rounded-none border border-stone-300 bg-white px-3 text-sm"
                >
                  {roomTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Style Direction</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="h-11 w-full rounded-none border border-stone-300 bg-white px-3 text-sm"
                >
                  {styles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="h-11 w-full rounded-none border border-stone-300 bg-white px-3 text-sm"
              >
                {budgets.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Width (m)</label>
                <Input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 4.2" className="rounded-none" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Length (m)</label>
                <Input value={length} onChange={(e) => setLength(e.target.value)} placeholder="e.g. 5.8" className="rounded-none" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Ceiling (m)</label>
                <Input
                  value={ceilingHeight}
                  onChange={(e) => setCeilingHeight(e.target.value)}
                  placeholder="optional"
                  className="rounded-none"
                />
              </div>
            </div>

            {areaPreview && <p className="text-sm text-stone-600">Estimated floor area: {areaPreview} m2</p>}

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Floor Plan Upload</label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFloorPlanFileName(e.target.files?.[0]?.name ?? "")}
                className="block w-full rounded-none border border-stone-300 bg-white p-2 text-sm"
              />
              {floorPlanFileName && <p className="mt-2 text-xs text-stone-500">Selected: {floorPlanFileName}</p>}
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Property Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPhotoFileNames(Array.from(e.target.files ?? []).map((f) => f.name))}
                className="block w-full rounded-none border border-stone-300 bg-white p-2 text-sm"
              />
              {photoFileNames.length > 0 && (
                <p className="mt-2 text-xs text-stone-500">Selected: {photoFileNames.join(", ")}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Household Notes</label>
                <Textarea
                  value={household}
                  onChange={(e) => setHousehold(e.target.value)}
                  rows={4}
                  className="rounded-none"
                  placeholder="e.g. young family, pet-friendly materials"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Priorities</label>
                <Textarea
                  value={priorities}
                  onChange={(e) => setPriorities(e.target.value)}
                  rows={4}
                  className="rounded-none"
                  placeholder="e.g. more storage, better flow, low-maintenance"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full rounded-none bg-stone-900 py-6 text-sm uppercase tracking-[0.14em] hover:bg-stone-800">
              {isSubmitting ? "Generating Concept..." : "Generate Design Concept"}
            </Button>
          </form>
        </section>

        <section>
          <Card className="rounded-none border-stone-300 bg-white">
            <CardContent className="space-y-5 p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Design Output</p>

              {!result && (
                <p className="text-stone-600">
                  Submit your room details to generate a first-pass layout and furniture plan.
                </p>
              )}

              {result && !result.success && <p className="text-red-700">{result.message}</p>}

              {result?.success && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-[0.05em]">Project Summary</h2>
                    <p className="mt-2 text-stone-700">{result.summary}</p>
                  </div>

                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.05em]">Layout Plan</h3>
                    <ul className="mt-2 space-y-2 text-sm text-stone-700">
                      {result.layoutPlan?.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.05em]">Furniture Direction</h3>
                    <ul className="mt-2 space-y-2 text-sm text-stone-700">
                      {result.furniturePlan?.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.05em]">Decoration Notes</h3>
                    <ul className="mt-2 space-y-2 text-sm text-stone-700">
                      {result.decorationPlan?.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.05em]">Next Steps</h3>
                    <ul className="mt-2 space-y-2 text-sm text-stone-700">
                      {result.nextSteps?.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-5 rounded-none border-stone-300 bg-stone-900 text-stone-100">
            <CardContent className="space-y-3 p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-amber-400">What We Learned from Top Tools</p>
              <ul className="space-y-2 text-sm text-stone-200">
                <li>- Keep onboarding in simple steps: Upload, Define style, Generate.</li>
                <li>- Show practical output, not only inspiration imagery.</li>
                <li>- Let users iterate quickly with budget and layout constraints.</li>
                <li>- Combine AI concepting with optional human designer handoff.</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
