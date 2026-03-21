"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface PostLoginIntentSyncProps {
  intent?: string
}

export const PostLoginIntentSync = ({
  intent,
}: PostLoginIntentSyncProps) => {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const doneRef = useRef(false)

  useEffect(() => {
    if (status !== "authenticated" || !session?.user || doneRef.current) return
    if (intent !== "place-venue") return

    if (session.user.role === "OWNER" || session.user.role === "ADMIN") {
      router.replace("/dashboard", { scroll: false })
      doneRef.current = true
      return
    }

    doneRef.current = true
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "OWNER" }),
    })
      .then(async (res) => {
        if (res.ok) {
          await update()
          router.replace("/dashboard", { scroll: false })
        } else {
          router.replace("/dashboard", { scroll: false })
        }
      })
      .catch(() => router.replace("/dashboard", { scroll: false }))
  }, [status, session?.user?.role, intent, router, update])

  return null
}
