// app/admin007/page.tsx
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "./login-form"
import SettingsForm from "./settings-form"
import { approveRegistration, logout, saveSettings, login } from "./server-actions"
import SubmitButton from "@/components/submit-button"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default async function AdminPage() {
  const isAuthed = await getIsAuthed()
  if (!isAuthed) return <LoginForm loginAction={login} />

  const { pending, approved, settings } = await getData()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin — XL Pro</h1>
        <form action={logout}>
          <Button variant="outline">Logout</Button>
        </form>
      </div>

      {/* Pending Registrations */}
      <Card className="bg-card border border-border/60">
        <CardHeader><CardTitle>Pending Registrations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {pending.length === 0 && <p className="text-sm text-muted-foreground">No pending registrations.</p>}
          {pending.map((r: any) => (
            <div key={r.id} className="rounded-md border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{r.team_name} <span className="text-muted-foreground">({r.theme}, {r.team_size})</span></p>
                  <p className="text-xs text-muted-foreground">Amount ₹{r.amount} · TXN {r.txn_id}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Members: {r.members?.map((m: any, i: number) => `${i === 0 ? "Leader" : "Member"}: ${m.name}`).join(", ")}
                  </p>
                  {r.payment_proof_url && <img src={r.payment_proof_url} alt="Payment proof" className="mt-2 h-40 w-auto rounded border border-border" />}
                </div>
                <form action={approveRegistration}>
                  <input type="hidden" name="id" value={r.id} />
                  <SubmitButton idleLabel="Approve" pendingLabel="Approving..." successTitle="Approved" successDesc="The registration has been approved." />
                </form>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Approved Members */}
      <Card className="bg-card border border-border/60">
        <CardHeader><CardTitle>Approved Members</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {approved.length === 0 && <p className="text-sm text-muted-foreground">No approved entries yet.</p>}
          {approved.map((r: any) => (
            <div key={r.id} className="rounded-md border border-border p-4">
              <p className="font-medium">{r.team_name} <span className="text-muted-foreground">({r.theme})</span></p>
              <p className="text-xs text-muted-foreground">Approved at: {new Date(r.approved_at).toLocaleString()}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Event & Payment Settings */}
      <Card className="bg-card border border-border/60">
        <CardHeader><CardTitle>Event & Payment Settings</CardTitle></CardHeader>
        <CardContent>
          <SettingsForm settings={settings} saveSettings={saveSettings} />
        </CardContent>
      </Card>
    </main>
  )
}

/* ---------------- Server Helpers ---------------- */

async function getIsAuthed() {
  const c = await cookies()
  return c.get("admin_session")?.value === "ok"
}

async function getData() {
  const supabase = createAdminClient()
  const { data: settingsRows } = await supabase.from("settings").select("*")
  const settings = (settingsRows || []).reduce((acc: any, row: any) => {
    acc[row.key] = row.value
    return acc
  }, {})

  const { data: pending } = await supabase.from("registrations").select("*").eq("status", "unapproved").order("created_at", { ascending: true })
  const { data: approved } = await supabase.from("approved_members").select("*").order("approved_at", { ascending: false })

  return { settings, pending: pending || [], approved: approved || [] }
}
