"use client"

import { useEffect, useState } from "react"

type WorkspaceSummaryProps = {
  initialProjectCount: number
  role: string
}

type ProjectsResponse = {
  success: boolean
  projects?: Array<{ id: string }>
}

export function WorkspaceSummary({ initialProjectCount, role }: WorkspaceSummaryProps) {
  const [projectCount, setProjectCount] = useState(initialProjectCount)

  useEffect(() => {
    let isActive = true

    const loadProjectCount = async () => {
      try {
        const response = await fetch("/api/interior-design-helper/projects", {
          cache: "no-store",
        })

        const data = (await response.json()) as ProjectsResponse

        if (isActive && data.success && data.projects) {
          setProjectCount(data.projects.length)
        }
      } catch {
        // Keep the server-rendered count if the client refresh fails.
      }
    }

    void loadProjectCount()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-sm border border-stone-200 bg-stone-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Saved Projects</p>
        <p className="mt-2 font-display text-4xl text-stone-900">{projectCount}</p>
      </div>
      <div className="rounded-sm border border-stone-200 bg-stone-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Role</p>
        <p className="mt-2 font-display text-2xl uppercase text-stone-900">{role}</p>
      </div>
    </div>
  )
}