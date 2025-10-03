"use client"

import { useEffect } from "react"

export default function AdminSessionOnce() {
  useEffect(() => {
    let consumed = false
    const consume = async () => {
      if (consumed) return
      consumed = true
      try {
        await fetch("/api/admin-session/consume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          // keepalive lets the request continue even when navigating away/refreshing
          // Supported in modern browsers; harmless elsewhere.
          keepalive: true,
        })
      } catch {
        // best-effort; safe to ignore
      }
    }

    // If returning from bfcache, force a true reload (cookie was deleted on pagehide)
    const onPageShow = (e: PageTransitionEvent) => {
      if ((e as any).persisted) {
        window.location.reload()
      }
    }

    const onPageHide = () => consume()
    const onVisibility = () => {
      if (document.visibilityState === "hidden") consume()
    }
    const onBeforeUnload = () => consume()

    window.addEventListener("pageshow", onPageShow)
    window.addEventListener("pagehide", onPageHide)
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("beforeunload", onBeforeUnload)

    return () => {
      window.removeEventListener("pageshow", onPageShow)
      window.removeEventListener("pagehide", onPageHide)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("beforeunload", onBeforeUnload)
      consume()
    }
  }, [])

  return null
}
