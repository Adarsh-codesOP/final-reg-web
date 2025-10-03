// app/admin007/settings-form.tsx
"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SubmitButton from "@/components/submit-button"

interface SettingsFormProps {
  settings: any
  saveSettings: (formData: FormData) => Promise<void>
}

export default function SettingsForm({ settings, saveSettings }: SettingsFormProps) {
  return (
    <form className="grid md:grid-cols-2 gap-4" action={saveSettings}>
      <div className="md:col-span-2">
        <Label htmlFor="event_title">Event Title</Label>
        <Input id="event_title" name="event_title" defaultValue={settings.event_title || ""} />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="event_description">Event Description</Label>
        <Textarea id="event_description" name="event_description" defaultValue={settings.event_description || ""} />
      </div>

      <div>
        <Label htmlFor="event_video_url">Event Video URL</Label>
        <Input id="event_video_url" name="event_video_url" defaultValue={settings.event_video_url || ""} />
      </div>

      <div>
        <Label htmlFor="payment_qr_url">Payment QR Image URL</Label>
        <Input id="payment_qr_url" name="payment_qr_url" defaultValue={settings.payment_qr_url || ""} />
      </div>

      <div>
        <Label htmlFor="payable_per_member">Payable Per Member (₹)</Label>
        <Input id="payable_per_member" name="payable_per_member" type="number" defaultValue={settings.payable_per_member ?? 60} />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <SubmitButton
          
          idleLabel="Save Settings"
          pendingLabel="Saving..."
          successTitle="Saved"
          successDesc="Settings updated successfully."
        />
      </div>
    </form>
  )
}
