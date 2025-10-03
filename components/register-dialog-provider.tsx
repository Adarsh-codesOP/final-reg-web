"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Dialog } from "@/components/ui/dialog"
import { RegisterDialog } from "./register-dialog"

type Ctx = { openRegister: () => void }
const RegisterDialogCtx = createContext<Ctx>({ openRegister: () => {} })
export const useRegisterDialog = () => useContext(RegisterDialogCtx)

export function RegisterDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openRegister = () => setOpen(true)

  return (
    <RegisterDialogCtx.Provider value={{ openRegister }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <RegisterDialog onClose={() => setOpen(false)} />
      </Dialog>
    </RegisterDialogCtx.Provider>
  )
}
