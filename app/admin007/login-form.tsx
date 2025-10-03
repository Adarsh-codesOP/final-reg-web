// app/admin007/login-form.tsx
"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<void>
}

export default function LoginForm({ loginAction }: LoginFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await loginAction(formData)
    window.location.reload()
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="u">Username</Label>
          <Input id="u" name="u" />
        </div>
        <div>
          <Label htmlFor="p">Password</Label>
          <Input id="p" name="p" type="password" />
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </main>
  )
}
