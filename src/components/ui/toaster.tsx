// File: src/components/ui/toaster.tsx
import * as React from "react"
// Components exported from the file you just created (toast.tsx)
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
} from "@/components/ui/toast"

import { create } from "zustand" // Package added in Step 1
import { nanoid } from "nanoid" // Package added in Step 1

// 1. Define Toast Types and Store State
type ToasterToast = Omit<ToastProps, "id"> & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

type State = {
  toasts: ToasterToast[]
  addToast: (toast: ToasterToast) => void
  removeToast: (id: string) => void
}

const useToastStore = create<State>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    set({ toasts: [...get().toasts, { id: nanoid(), ...toast }] })
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) })
  },
}))

// 2. The Toaster Component (The Visual Container)
export function Toaster() {
  const { toasts, removeToast } = useToastStore()

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} onOpenChange={(open) => !open && removeToast(toast.id)} {...toast}>
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>
          {toast.action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

// 3. The Utility Function (The CRUCIAL Export that fixes the error)
export function toast({ ...props }: ToasterToast) {
  useToastStore.getState().addToast(props)
}

export type { ToasterToast }