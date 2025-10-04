"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle } from "lucide-react"

type Member = { role: "leader" | "member"; name: string; email: string; phone: string }
type Settings = { payment_qr_url?: string | null; payable_per_member?: number | null }
const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())

export function RegisterDialog({ onClose }: { onClose: () => void }) {
  const { data: settings } = useSWR<Settings>("/api/settings", fetcher)
  const perMember = settings?.payable_per_member ?? 60

  const [teamName, setTeamName] = useState("")
  const [theme, setTheme] = useState<"circuit" | "non-circuit" | "">("")
  const [teamSize, setTeamSize] = useState<number>(2)
  const [members, setMembers] = useState<Member[]>(() => initialMembers(2))
  const [txn, setTxn] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofUrl, setProofUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const total = useMemo(() => teamSize * perMember, [teamSize, perMember])

  function initialMembers(n: number): Member[] {
    return Array.from({ length: n }).map((_, i) => ({
      role: i === 0 ? "leader" : "member",
      name: "",
      email: "",
      phone: "",
    }))
  }

  function handleTeamSize(n: number) {
    setTeamSize(n)
    setMembers((prev) => {
      const next = initialMembers(n)
      for (let i = 0; i < Math.min(prev.length, next.length); i++) {
        next[i] = { ...next[i], ...prev[i], role: i === 0 ? "leader" : "member" }
      }
      return next
    })
  }

  function onPickProof(file: File | null) {
    setProofFile(file)
    if (file) setProofUrl(null)
  }

  async function uploadProof(file: File) {
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/upload-proof", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      try {
        const j = JSON.parse(text)
        console.log("[v0] upload-proof error JSON:", j)
        throw new Error(j?.error || "Upload failed")
      } catch {
        console.log("[v0] upload-proof error TEXT:", text)
        throw new Error(text || "Upload failed")
      }
    }
    const data = await res.json().catch(() => null)
    if (!data?.url) {
      console.log("[v0] upload-proof missing url:", data)
      throw new Error("Upload failed: no URL returned")
    }
    return data.url as string
  }

  async function onSubmit() {
    try {
      setSubmitting(true)
      if (!teamName || !theme || !teamSize) throw new Error("Please complete the form")
      if (members.some((m) => !m.name || !m.email || !m.phone)) throw new Error("Fill all member details")
      if (!txn) throw new Error("Transaction number required")
      if (!proofFile && !proofUrl) throw new Error("Payment proof required")

      let finalProofUrl = proofUrl
      if (proofFile && !finalProofUrl) {
        finalProofUrl = await uploadProof(proofFile)
        setProofUrl(finalProofUrl)
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_name: teamName,
          theme,
          team_size: teamSize,
          members,
          amount: total,
          txn_id: txn,
          payment_proof_url: finalProofUrl,
          event_code: "codeathon-2.0",
        }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || "Registration failed")
      }
      onClose()
      toast({
        className: "border-primary/40 bg-primary/10",
        duration: 7000,
        title: (
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
            Registration submitted for review
          </span>
        ),
        description: (
          <div className="text-sm">
            <p>Your registration has been submitted and is currently under review.</p>
            <p className="mt-1">You will be contacted once your registration is approved.</p>
          </div>
        ),
      })
    } catch (e: any) {
      toast({
        variant: "destructive",
        className: "border-destructive/40",
        duration: 7000,
        title: (
          <span className="inline-flex items-center gap-2">
            <XCircle className="h-4 w-4" aria-hidden="true" />
            Submission failed
          </span>
        ),
        description: e?.message || "Something went wrong. Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card/90 backdrop-blur border border-primary/20 shadow-lg">
      <DialogHeader>
        <DialogTitle className="font-mono tracking-wide text-primary">Register — Codeathon 2.0</DialogTitle>
        <DialogDescription className="sr-only">
          Register your team for Codeathon 2.0. Fill team details, choose theme, set team size, provide transaction
          number, and upload payment proof.
        </DialogDescription>
      </DialogHeader>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="teamName">Team Name</Label>
            <Input id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          </div>
          <div>
            <Label>Theme</Label>
            <Select value={theme} onValueChange={(v: "circuit" | "non-circuit") => setTheme(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circuit">Circuit</SelectItem>
                <SelectItem value="non-circuit">Non-Circuit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Team Members</Label>
            <Select value={String(teamSize)} onValueChange={(v) => handleTeamSize(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Select size (2–4)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border border-primary/30 p-3">
            <p className="text-xs text-muted-foreground">
              Payable amount: ₹{total} ({perMember} per member)
            </p>
            <div className="mt-3">
              {settings?.payment_qr_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.payment_qr_url || "/placeholder.svg"}
                  alt="Payment QR"
                  className="w-full rounded-md border border-border"
                />
              ) : (
                <div className="aspect-square w-full rounded-md bg-muted" />
              )}
            </div>
            <div className="mt-3">
              <Label htmlFor="txn">Transaction Number</Label>
              <Input id="txn" value={txn} onChange={(e) => setTxn(e.target.value)} />
            </div>
            <div className="mt-3">
              <Label htmlFor="proof">Upload Payment Proof</Label>
              <Input
                id="proof"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => onPickProof(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {members.map((m, idx) => (
            <div key={idx} className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground mb-2">{idx === 0 ? "Leader" : `Member ${idx + 1}`}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={m.name}
                    onChange={(e) =>
                      setMembers((cur) => {
                        const n = [...cur]
                        n[idx] = { ...n[idx], name: e.target.value }
                        return n
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={m.email}
                    onChange={(e) =>
                      setMembers((cur) => {
                        const n = [...cur]
                        n[idx] = { ...n[idx], email: e.target.value }
                        return n
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    inputMode="numeric"
                    value={m.phone}
                    onChange={(e) =>
                      setMembers((cur) => {
                        const n = [...cur]
                        n[idx] = { ...n[idx], phone: e.target.value }
                        return n
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={submitting} className="hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]">
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
