"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardSettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState("")
  const [telegramChatId, setTelegramChatId] = useState("")
  const [whatsappPhone, setWhatsappPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "")
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          telegramChatId: telegramChatId.trim() || null,
          whatsappPhone: whatsappPhone.trim() || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? "Ошибка сохранения")
        return
      }
      await update({ name: json.data.name })
      toast.success("Профиль сохранён")
    } catch {
      toast.error("Ошибка сохранения")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Настройки
        </h1>
        <p className="mt-1 text-muted-foreground">
          Редактирование профиля и контактов
        </p>
      </div>

      <Card className="max-w-xl border-surface-200">
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="telegramChatId">Telegram Chat ID</Label>
              <Input
                id="telegramChatId"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="Для уведомлений о заявках"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="whatsappPhone">WhatsApp</Label>
              <Input
                id="whatsappPhone"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="+7 (928) 000-00-00"
                className="mt-1.5"
              />
            </div>
            <Button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Сохранение..." : "Сохранить"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
