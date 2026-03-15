"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PhoneInput } from "@/components/shared/phone-input"
import { toast } from "sonner"

type Step = "phone" | "otp"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const normalizedPhone = `+7${phone.replace(/\D/g, "").slice(-10)}`

  const handleSendOtp = async () => {
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Введите корректный номер телефона")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Ошибка отправки SMS")
        return
      }

      setStep("otp")
      toast.success("Код отправлен на ваш номер")
    } catch {
      toast.error("Ошибка соединения")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (code.length !== 4) {
      toast.error("Введите 4-значный код")
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn("otp-login", {
        phone: normalizedPhone,
        code,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Неверный код или номер не зарегистрирован")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      toast.error("Ошибка входа")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Вход</CardTitle>
          <CardDescription>
            Введите номер телефона для получения кода
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <PhoneInput
                  id="phone"
                  value={phone}
                  onChange={setPhone}
                  disabled={isLoading}
                />
              </div>
              <Button
                className="w-full bg-brand-500 hover:bg-brand-600"
                onClick={handleSendOtp}
                disabled={isLoading}
              >
                {isLoading ? "Отправка..." : "Получить код"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Нет аккаунта?{" "}
                <Link href="/register" className="text-brand-500 hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Код из SMS</Label>
                <Input
                  id="code"
                  placeholder="0000"
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  disabled={isLoading}
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground">
                  Код отправлен на {normalizedPhone}
                </p>
              </div>
              <Button
                className="w-full bg-brand-500 hover:bg-brand-600"
                onClick={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? "Проверка..." : "Войти"}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("phone")
                  setCode("")
                }}
              >
                Изменить номер
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
