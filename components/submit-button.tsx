"use client"

import { useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { CheckCircle2, Loader2 } from "lucide-react"

type Props = {
  idleLabel: string
  pendingLabel?: string
  successTitle?: string
  successDesc?: string
  className?: string
}

export default function SubmitButton({
  idleLabel,
  pendingLabel = "Submitting...",
  successTitle = "Done",
  successDesc = "Your changes were saved.",
  className,
}: Props) {
  const { pending } = useFormStatus()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      toast({
        title: (
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
            {successTitle}
          </span>
        ),
        description: successDesc,
        className: "border-primary/40 bg-primary/10",
        duration: 4000,
      })
    }
    wasPending.current = pending
  }, [pending, successDesc, successTitle])

  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </span>
      ) : (
        idleLabel
      )}
    </Button>
  )
}
