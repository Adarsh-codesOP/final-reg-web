import { cookies } from "next/headers"
import { NextResponse } from "next/server"

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
  return NextResponse.redirect(new URL("/admin007", "http://localhost:3000"))
}
