// File: src/hooks/use-toast.ts

import * as React from "react"
import { ToasterToast, toast } from "@/components/ui/toaster"

type Toast = Omit<ToasterToast, "id">

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback(
    (toast: Toast) => {
      setToasts((prev) => [...prev, toast])
    },
    []
  )

  const removeToast = React.useCallback(
    (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    },
    []
  )

  const toastHandler = React.useCallback(
    ({ ...props }: Toast) => {
      return toast({
        ...props,
      })
    },
    []
  )

  return {
    toasts,
    toast: toastHandler,
    addToast,
    removeToast,
  }
}

// Re-export the primary toast function for immediate use across the app
export { toast }