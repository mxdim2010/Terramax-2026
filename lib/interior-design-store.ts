import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import type { DesignConcept, DesignRequest } from "@/lib/interior-design-engine"

export type StoredDesignProject = {
  id: string
  projectName: string
  request: DesignRequest
  concept: DesignConcept
  createdAt: string
  updatedAt: string
}

export type DesignerHandoffLead = {
  id: string
  projectId: string
  name: string
  email: string
  phone?: string
  message?: string
  createdAt: string
}

type StoreShape = {
  projects: StoredDesignProject[]
  handoffLeads: DesignerHandoffLead[]
}

const dataDir = path.join(process.cwd(), ".data")
const dbFile = path.join(dataDir, "interior-design-db.json")

async function ensureStore() {
  await mkdir(dataDir, { recursive: true })

  try {
    await readFile(dbFile, "utf-8")
  } catch {
    const initial: StoreShape = { projects: [], handoffLeads: [] }
    await writeFile(dbFile, JSON.stringify(initial, null, 2), "utf-8")
  }
}

async function readStore(): Promise<StoreShape> {
  await ensureStore()
  const raw = await readFile(dbFile, "utf-8")

  return JSON.parse(raw) as StoreShape
}

async function writeStore(store: StoreShape) {
  await ensureStore()
  await writeFile(dbFile, JSON.stringify(store, null, 2), "utf-8")
}

export async function listProjects() {
  const store = await readStore()

  return store.projects.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getProjectById(id: string) {
  const store = await readStore()

  return store.projects.find((project) => project.id === id) ?? null
}

export async function saveProject(project: StoredDesignProject) {
  const store = await readStore()
  const existingIndex = store.projects.findIndex((item) => item.id === project.id)

  if (existingIndex >= 0) {
    store.projects[existingIndex] = project
  } else {
    store.projects.push(project)
  }

  await writeStore(store)

  return project
}

export async function saveHandoffLead(lead: DesignerHandoffLead) {
  const store = await readStore()
  store.handoffLeads.push(lead)
  await writeStore(store)

  return lead
}
