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

const dataDir = process.env.VERCEL ? path.join("/tmp", ".data") : path.join(process.cwd(), ".data")
const dbFile = path.join(dataDir, "interior-design-db.json")
let memoryStore: StoreShape = { projects: [], handoffLeads: [] }
let memoryMode = false

async function ensureStore() {
  if (memoryMode) {
    return
  }

  try {
    await mkdir(dataDir, { recursive: true })
  } catch {
    memoryMode = true
    return
  }

  try {
    await readFile(dbFile, "utf-8")
  } catch {
    try {
      await writeFile(dbFile, JSON.stringify(memoryStore, null, 2), "utf-8")
    } catch {
      memoryMode = true
    }
  }
}

async function readStore(): Promise<StoreShape> {
  await ensureStore()

  if (memoryMode) {
    return memoryStore
  }

  const raw = await readFile(dbFile, "utf-8")

  try {
    return JSON.parse(raw) as StoreShape
  } catch {
    return memoryStore
  }
}

async function writeStore(store: StoreShape) {
  memoryStore = store

  await ensureStore()

  if (memoryMode) {
    return
  }

  try {
    await writeFile(dbFile, JSON.stringify(store, null, 2), "utf-8")
  } catch {
    memoryMode = true
  }
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
