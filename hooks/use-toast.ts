"use client"

import * as React from "react"

type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
}

type ToastState = {
  toasts: Toast[]
}

const listeners: Array<(state: ToastState) => void> = []
let memoryState: ToastState = { toasts: [] }
let count = 0

function emit() {
  listeners.forEach((listener) => listener(memoryState))
}

function createToast(payload: Omit<Toast, "id">) {
  const id = `${++count}`
  const nextToast: Toast = { id, ...payload }

  memoryState = { toasts: [nextToast, ...memoryState.toasts].slice(0, 3) }
  emit()

  return {
    id,
    dismiss: () => dismiss(id),
    update: (next: Partial<Omit<Toast, "id">>) => update(id, next),
  }
}

function dismiss(toastId?: string) {
  memoryState = {
    toasts: toastId ? memoryState.toasts.filter((toast) => toast.id !== toastId) : [],
  }
  emit()
}

function update(toastId: string, next: Partial<Omit<Toast, "id">>) {
  memoryState = {
    toasts: memoryState.toasts.map((toast) => (toast.id === toastId ? { ...toast, ...next } : toast)),
  }
  emit()
}

export function toast(payload: Omit<Toast, "id">) {
  return createToast(payload)
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)

    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss,
  }
}
