"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface PostRegisterRoleSyncProps {
  fromRegister?: string | string[]
}

export const PostRegisterRoleSync = ({
  fromRegister,
}: PostRegisterRoleSyncProps) => {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const doneRef = useRef(false)

  useEffect(() => {
    if (status !== "authenticated" || !session?.user || doneRef.current) return

    const value = Array.isArray(fromRegister) ? fromRegister[0] : fromRegister
    if (value !== "OWNER") return

    if (session.user.role === "OWNER") {
      router.replace("/", { scroll: false })
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
          router.replace("/", { scroll: false })
        }
      })
      .catch(() => router.replace("/", { scroll: false }))
  }, [status, session?.user?.role, fromRegister, router, update])

  return null
}
