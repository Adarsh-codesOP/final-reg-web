import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return new NextResponse("Invalid JSON", { status: 400 })

  const { team_name, theme, team_size, members, amount, txn_id, payment_proof_url, event_code } = body as {
    team_name: string
    theme: "circuit" | "non-circuit"
    team_size: number
    members: Array<{ role: string; name: string; email: string; phone: string }>
    amount: number
    txn_id: string
    payment_proof_url?: string | null
    event_code?: string
  }

  if (!team_name || !theme || !team_size || !members || members.length !== team_size) {
    return new NextResponse("Missing or invalid fields", { status: 400 })
  }

  const supabase = await createServerClient()
  const { error } = await supabase.from("registrations").insert({
    team_name,
    theme,
    team_size,
    members,
    amount,
    txn_id,
    payment_proof_url,
    status: "unapproved",
    event_code: event_code || "codeathon-2.0",
  })
  if (error) {
    const msg = /schema cache|relation .* does not exist|Could not find the table/i.test(error.message)
      ? "Database not initialized. Please run scripts/01_create_tables.sql from the Scripts panel."
      : error.message
    return new NextResponse(msg, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
