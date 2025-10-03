"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRef, useEffect, useState } from "react"
import { useRegisterDialog } from "./register-dialog-provider"

export function EventCard() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { openRegister } = useRegisterDialog()
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [title, setTitle] = useState("Codeathon 2.0")
  const [desc, setDesc] = useState("48 hours of building. Circuits or software—ship something bold.")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          setVideoUrl(data.event_video_url || null)
          setTitle(data.event_title || "Codeathon 2.0")
          setDesc(data.event_description || "48 hours of building. Circuits or software—ship something bold.")
        }
      } catch {}
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState !== "visible") return
      try {
        const res = await fetch("/api/settings", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          setVideoUrl(data.event_video_url || null)
          setTitle(data.event_title || "Codeathon 2.0")
          setDesc(data.event_description || "48 hours of building. Circuits or software—ship something bold.")
        }
      } catch {}
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.controls = false
    v.playsInline = true
  }, [videoUrl])

  return (
    <Card className="relative group bg-card/70 border border-primary/30 transition-colors">
      <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl bg-primary/10 transition" />
      <CardHeader>
        <CardTitle className="text-lg font-mono tracking-wide text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-md border border-border/50">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              playsInline
              muted
              preload="metadata"
              className="w-full h-auto"
            />
          ) : (
            <div className="aspect-video w-full bg-muted" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{desc}</p>
        <div className="flex justify-end">
          <Button variant="default" onClick={openRegister} className="hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]">
            Register
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
