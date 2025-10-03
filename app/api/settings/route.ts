import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("settings").select("*")
  if (error) {
    return NextResponse.json(
      {
        event_title: "Codeathon 2.0",
        event_description: "",
        event_video_url: "",
        payment_qr_url: "",
        payable_per_member: 60,
      },
      { headers: { "Cache-Control": "no-store" } },
    )
  }
  const settings = (data || []).reduce((acc: any, row: any) => ({ ...acc, [row.key]: row.value }), {})
  return NextResponse.json(
    {
      event_title: settings.event_title || "Codeathon 2.0",
      event_description: settings.event_description || "",
      event_video_url: settings.event_video_url || "",
      payment_qr_url: settings.payment_qr_url || "",
      payable_per_member: Number(settings.payable_per_member ?? 60),
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}

export async function PATCH(req: NextRequest) {
  const c = await cookies()
  if (c.get("admin_session")?.value !== "ok") return new NextResponse("Unauthorized", { status: 401 })

  let body: any = null
  try {
    body = await req.json()
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 })
  }
  if (!body || typeof body !== "object") return new NextResponse("Invalid JSON", { status: 400 })

  const supabase = createAdminClient()

  const rows = Object.entries(body).map(([key, raw]) => {
    const value = key === "payable_per_member" ? Number(raw ?? 60) : (raw ?? "")
    return { key, value }
  })

  const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" })
  if (error) {
    // You can temporarily enable the debug line below if needed.
    // console.log("[v0] /api/settings PATCH upsert error:", error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
}
