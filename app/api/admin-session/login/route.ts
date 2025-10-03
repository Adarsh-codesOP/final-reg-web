import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function login(formData: FormData) {
  "use server"
  const u = String(formData.get("u") || "")
  const p = String(formData.get("p") || "")

  const c = await cookies()
  if (u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS) {
    c.set("admin_session", "ok", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600, // 10 minutes
    })
    return NextResponse.redirect(new URL("/admin007", "http://localhost:3000"))
  }

  return NextResponse.redirect(new URL("/admin007", "http://localhost:3000"))
}
