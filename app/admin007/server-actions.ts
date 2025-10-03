// app/admin007/server-actions.ts
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

export async function login(formData: FormData) {
  "use server"
  const u = String(formData.get("u") || "")
  const p = String(formData.get("p") || "")

  if (u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS) {
    const c = await cookies()
    c.set("admin_session", "ok", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600,
    })
  }
  revalidatePath("/admin007")
}

export async function logout() {
  "use server"
  const c = await cookies()
  c.set("admin_session", "", {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  })
  revalidatePath("/admin007")
}

export async function saveSettings(formData: FormData) {
  "use server"
  const c = await cookies()
  if (c.get("admin_session")?.value !== "ok") return

  const supabase = createAdminClient()
  const rows = [
    { key: "event_title", value: String(formData.get("event_title") || "") },
    { key: "event_description", value: String(formData.get("event_description") || "") },
    { key: "event_video_url", value: String(formData.get("event_video_url") || "") },
    { key: "payment_qr_url", value: String(formData.get("payment_qr_url") || "") },
    { key: "payable_per_member", value: Number(formData.get("payable_per_member") || 60) },
  ]
  await supabase.from("settings").upsert(rows, { onConflict: "key" })
  revalidatePath("/admin007")
}

export async function approveRegistration(formData: FormData) {
  "use server"
  const c = await cookies()
  if (c.get("admin_session")?.value !== "ok") return

  const id = String(formData.get("id") || "")
  if (!id) return

  const supabase = createAdminClient()
  const { data: row } = await supabase.from("registrations").select("*").eq("id", id).single()
  if (!row) return

  await supabase.from("approved_members").insert({
    team_name: row.team_name,
    theme: row.theme,
    team_size: row.team_size,
    members: row.members,
    amount: row.amount,
    txn_id: row.txn_id,
    payment_proof_url: row.payment_proof_url,
    event_code: row.event_code,
  })

  await supabase.from("registrations").delete().eq("id", id)
  revalidatePath("/admin007")
}
