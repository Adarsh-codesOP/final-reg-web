"use client"

import { Button } from "@/components/ui/button"
import { useRegisterDialog } from "./register-dialog-provider"

export function RegisterSection() {
  const { openRegister } = useRegisterDialog()
  return (
    <div className="rounded-lg border border-primary/30 p-6 bg-card/70 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-primary">{"Register for Codeathon 2.0"}</h3>
          <p className="text-muted-foreground text-sm">
            {"Team of 2–4. Theme: Circuit or Non-Circuit. Fee ₹60 per member."}
          </p>
        </div>
        <Button onClick={openRegister} className="hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]">
          Register Now
        </Button>
      </div>
    </div>
  )
}
