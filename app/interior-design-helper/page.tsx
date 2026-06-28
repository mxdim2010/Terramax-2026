"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { DesignConcept, DesignRequest } from "@/lib/interior-design-engine"

type DesignResponse =
  | ({ success: true } & DesignConcept)
  | { success: false; message: string }

type StoredProject = {
  id: string
  projectName: string
  request: DesignRequest
  concept: DesignConcept
  createdAt: string
  updatedAt: string
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
  const [projectName, setProjectName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [result, setResult] = useState<DesignResponse | null>(null)
  const [lastRequest, setLastRequest] = useState<DesignRequest | null>(null)
  const [projects, setProjects] = useState<StoredProject[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>("")

  const [handoffName, setHandoffName] = useState("")
  const [handoffEmail, setHandoffEmail] = useState("")
  const [handoffPhone, setHandoffPhone] = useState("")
  const [handoffMessage, setHandoffMessage] = useState("")
  const [handoffSubmitting, setHandoffSubmitting] = useState(false)

  const areaPreview = useMemo(() => {
    const w = Number.parseFloat(width)
    const l = Number.parseFloat(length)

    if (!Number.isFinite(w) || !Number.isFinite(l) || w <= 0 || l <= 0) {
      return null
    }

    return (w * l).toFixed(1)
  }, [width, length])

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/interior-design-helper/projects")
      const data = (await response.json()) as {
        success: boolean
        projects?: StoredProject[]
      }

      if (data.success && data.projects) {
        setProjects(data.projects)
      }
    } catch {
      setStatusMessage("Could not load saved projects.")
    }
  }

  useEffect(() => {
    void loadProjects()
  }, [])

  const currentRequest: DesignRequest = {
    roomType,
    style,
    budget,
    width,
    length,
    ceilingHeight,
    household,
    priorities,
    floorPlanFileName,
    photoFileNames,
  }

  const applyProjectToForm = (project: StoredProject) => {
    setRoomType(project.request.roomType)
    setStyle(project.request.style)
    setBudget(project.request.budget)
    setWidth(project.request.width)
    setLength(project.request.length)
    setCeilingHeight(project.request.ceilingHeight ?? "")
    setHousehold(project.request.household ?? "")
    setPriorities(project.request.priorities ?? "")
    setFloorPlanFileName(project.request.floorPlanFileName ?? "")
    setPhotoFileNames(project.request.photoFileNames ?? [])
    setProjectName(project.projectName)

    setResult({
      success: true,
      ...project.concept,
    })

    setLastRequest(project.request)
    setActiveProjectId(project.id)
    setStatusMessage(`Loaded project: ${project.projectName}`)
  }

  const handleGenerate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)
    setStatusMessage("")

    try {
      const response = await fetch("/api/interior-design-helper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentRequest),
      })

      const data = (await response.json()) as DesignResponse
      setResult(data)
      if (data.success) {
        setLastRequest(currentRequest)
        setStatusMessage("Concept generated. Save it to keep this version.")
      }
    } catch {
      setResult({
        success: false,
        message: "Could not generate recommendations. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveProject = async () => {
    if (!result?.success || !lastRequest) {
      setStatusMessage("Generate a concept first, then save the project.")
      return
    }

    setIsSaving(true)
    setStatusMessage("")

    try {
      const response = await fetch("/api/interior-design-helper/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: projectName.trim() || `${roomType} concept`,
          request: lastRequest,
          concept: result,
        }),
      })

      const data = (await response.json()) as {
        success: boolean
        message?: string
        project?: StoredProject
      }

      if (!data.success || !data.project) {
        setStatusMessage(data.message ?? "Could not save project.")
        return
      }

      setActiveProjectId(data.project.id)
      setProjectName(data.project.projectName)
      setStatusMessage("Project saved.")
      await loadProjects()
    } catch {
      setStatusMessage("Could not save project.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadBrief = () => {
    if (!activeProjectId) {
      setStatusMessage("Save a project first to download a PDF brief.")
      return
    }

    window.open(`/api/interior-design-helper/projects/${activeProjectId}/brief`, "_blank", "noopener,noreferrer")
  }

  const handleDesignerHandoff = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!activeProjectId) {
      setStatusMessage("Save a project before requesting designer handoff.")
      return
    }

    setHandoffSubmitting(true)

    try {
      const response = await fetch("/api/interior-design-helper/handoff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: activeProjectId,
          name: handoffName,
          email: handoffEmail,
          phone: handoffPhone,
          message: handoffMessage,
        }),
      })

      const data = (await response.json()) as {
        success: boolean
        message?: string
      }

      if (!data.success) {
        setStatusMessage(data.message ?? "Handoff request failed.")
        return
      }

      setStatusMessage("Designer handoff request submitted.")
      setHandoffName("")
      setHandoffEmail("")
      setHandoffPhone("")
      setHandoffMessage("")
    } catch {
      setStatusMessage("Handoff request failed.")
    } finally {
      setHandoffSubmitting(false)
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
            Save room concepts, run fit checks, generate a downloadable brief, and hand your project to a TerraMax designer.
          </p>

          <form onSubmit={handleGenerate} className="mt-8 space-y-5 border border-stone-300 bg-white p-6 sm:p-7">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-stone-600">Project Name</label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Open Plan Family Living Refresh"
                className="rounded-none"
              />
            </div>

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

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                onClick={handleSaveProject}
                disabled={isSaving || !result?.success}
                className="rounded-none border border-stone-300 bg-white text-stone-900 hover:bg-stone-100"
              >
                {isSaving ? "Saving..." : "Save Project"}
              </Button>
              <Button
                type="button"
                onClick={handleDownloadBrief}
                disabled={!activeProjectId}
                className="rounded-none border border-stone-300 bg-white text-stone-900 hover:bg-stone-100"
              >
                Download PDF Brief
              </Button>
            </div>

            {statusMessage && <p className="text-sm text-stone-700">{statusMessage}</p>}
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
                      {result.layoutPlan.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.05em]">Furniture Direction</h3>
                    <ul className="mt-2 space-y-2 text-sm text-stone-700">
                      {result.furniturePlan.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.05em]">Fit Validator</h3>
                    {result.fitWarnings.length === 0 ? (
                      <p className="mt-2 text-sm text-stone-700">No major fit risks detected for current dimensions.</p>
                    ) : (
                      <ul className="mt-2 space-y-2 text-sm text-stone-700">
                        {result.fitWarnings.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.05em]">Image Analysis Notes</h3>
                    <ul className="mt-2 space-y-2 text-sm text-stone-700">
                      {result.imageInsights.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.05em]">Decoration Notes</h3>
                    <ul className="mt-2 space-y-2 text-sm text-stone-700">
                      {result.decorationPlan.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.05em]">Next Steps</h3>
                    <ul className="mt-2 space-y-2 text-sm text-stone-700">
                      {result.nextSteps.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-5 rounded-none border-stone-300 bg-white">
            <CardContent className="space-y-4 p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Saved Projects</p>
              {projects.length === 0 && <p className="text-sm text-stone-600">No saved projects yet.</p>}
              <div className="space-y-3">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => applyProjectToForm(project)}
                    className="w-full border border-stone-300 px-3 py-3 text-left text-sm hover:bg-stone-100"
                  >
                    <p className="font-semibold text-stone-900">{project.projectName}</p>
                    <p className="text-xs text-stone-500">
                      {project.request.roomType} | {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-5 rounded-none border-stone-300 bg-stone-900 text-stone-100">
            <CardContent className="space-y-4 p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-amber-400">Designer Handoff</p>
              <p className="text-sm text-stone-200">
                Move from AI concept to execution with a TerraMax interior designer.
              </p>

              <form onSubmit={handleDesignerHandoff} className="space-y-3">
                <Input
                  value={handoffName}
                  onChange={(e) => setHandoffName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-none border-stone-600 bg-stone-800 text-stone-100"
                  required
                />
                <Input
                  type="email"
                  value={handoffEmail}
                  onChange={(e) => setHandoffEmail(e.target.value)}
                  placeholder="Email"
                  className="rounded-none border-stone-600 bg-stone-800 text-stone-100"
                  required
                />
                <Input
                  value={handoffPhone}
                  onChange={(e) => setHandoffPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="rounded-none border-stone-600 bg-stone-800 text-stone-100"
                />
                <Textarea
                  value={handoffMessage}
                  onChange={(e) => setHandoffMessage(e.target.value)}
                  placeholder="Anything your designer should know"
                  rows={3}
                  className="rounded-none border-stone-600 bg-stone-800 text-stone-100"
                />
                <Button
                  type="submit"
                  disabled={handoffSubmitting || !activeProjectId}
                  className="w-full rounded-none bg-amber-500 text-stone-900 hover:bg-amber-400"
                >
                  {handoffSubmitting ? "Submitting..." : "Request Designer Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
