import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

const BUCKET_NAME = "payment-proofs"
let bucketEnsurePromise: Promise<void> | null = null

async function ensureBucketPublic() {
  if (bucketEnsurePromise) return bucketEnsurePromise
  const supabase = createAdminClient()

  bucketEnsurePromise = (async () => {
    try {
      // Try to fetch the bucket; some drivers return error for not-found
      const { data: bucket, error: getErr } = await supabase.storage.getBucket(BUCKET_NAME)
      if (getErr) {
        // If clearly a not-found, attempt creation
        const notFound =
          /not\s*found|404/i.test(String(getErr.message || "")) || String((getErr as any).status) === "404"
        if (!notFound) {
          console.log("[v0] getBucket unexpected error:", getErr)
        }
      }
      if (!bucket) {
        const { error: createErr } = await supabase.storage.createBucket(BUCKET_NAME, { public: true })
        if (createErr) {
          // Swallow only duplicate/exists conflicts
          const isDuplicate =
            /exists|duplicate/i.test(String(createErr.message || "")) ||
            String((createErr as any).statusCode) === "409" ||
            String((createErr as any).status) === "409"
          if (!isDuplicate) {
            console.log("[v0] createBucket error:", createErr)
            throw createErr
          }
        }
        return
      }

      // Ensure public if it's private
      if (bucket.public === false) {
        const { error: updErr } = await supabase.storage.updateBucket(BUCKET_NAME, { public: true })
        if (updErr) {
          console.log("[v0] updateBucket error (non-fatal):", updErr)
        }
      }
    } catch (e) {
      console.log("[v0] ensureBucketPublic fatal:", (e as Error)?.message)
      throw e
    }
  })()

  return bucketEnsurePromise
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData().catch(() => null)
    if (!form) {
      return NextResponse.json({ error: "Invalid multipart form data" }, { status: 400 })
    }
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const maxBytes = 8 * 1024 * 1024 // 8MB
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 413 })
    }
    const allowed = ["image/", "application/pdf"]
    const isAllowed = allowed.some((prefix) => (file.type || "").startsWith(prefix))
    if (!isAllowed) {
      return NextResponse.json({ error: "Unsupported file type. Use image/* or PDF." }, { status: 415 })
    }

    const supabase = createAdminClient()

    // Ensure bucket exists/public once per runtime
    await ensureBucketPublic()

    const safeName = (file.name || "upload").replace(/\s+/g, "_").replace(/[^\w.-]/g, "")
    const unique = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).slice(
      0,
      12,
    )
    const path = `${unique}-${safeName}`

    const { error: upErr } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "3600",
      upsert: false,
    })
    if (upErr) {
      console.log("[v0] upload error:", upErr)
      return NextResponse.json({ error: upErr.message || "Upload failed" }, { status: 500 })
    }

    const { data: pub } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
    const url = pub?.publicUrl
    if (!url) {
      return NextResponse.json({ error: "Failed to resolve public URL" }, { status: 500 })
    }

    return NextResponse.json({ url })
  } catch (e: any) {
    console.log("[v0] upload-proof fatal:", e?.message)
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 })
  }
}
