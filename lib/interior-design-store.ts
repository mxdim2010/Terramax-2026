import type { Prisma } from "@prisma/client"

import type { DesignConcept, DesignRequest } from "@/lib/interior-design-engine"
import { prisma } from "@/lib/prisma"

export type StoredDesignProject = {
  id: string
  userId: string
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

type ProjectRecord = {
  id: string
  userId: string
  projectName: string
  request: Prisma.JsonValue
  concept: Prisma.JsonValue
  createdAt: Date
  updatedAt: Date
}

function mapProject(project: ProjectRecord): StoredDesignProject {
  return {
    id: project.id,
    userId: project.userId,
    projectName: project.projectName,
    request: project.request as unknown as DesignRequest,
    concept: project.concept as unknown as DesignConcept,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

export async function listProjects(userId: string) {
  const projects = await prisma.interiorDesignProject.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return projects.map(mapProject)
}

export async function getProjectById(userId: string, id: string) {
  const project = await prisma.interiorDesignProject.findFirst({
    where: {
      id,
      userId,
    },
  })

  return project ? mapProject(project) : null
}

export async function saveProject(project: {
  userId: string
  projectName: string
  request: DesignRequest
  concept: DesignConcept
}) {
  const savedProject = await prisma.interiorDesignProject.create({
    data: {
      userId: project.userId,
      projectName: project.projectName,
      request: project.request as Prisma.InputJsonValue,
      concept: project.concept as Prisma.InputJsonValue,
    },
  })

  return mapProject(savedProject)
}

export async function saveHandoffLead(lead: Omit<DesignerHandoffLead, "id" | "createdAt">) {
  const savedLead = await prisma.designerHandoffLead.create({
    data: {
      projectId: lead.projectId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
    },
  })

  return {
    id: savedLead.id,
    projectId: savedLead.projectId,
    name: savedLead.name,
    email: savedLead.email,
    phone: savedLead.phone ?? undefined,
    message: savedLead.message ?? undefined,
    createdAt: savedLead.createdAt.toISOString(),
  }
}
