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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PhoneInput } from "@/components/shared/phone-input"
import { GoogleSignInButton } from "@/components/shared/google-sign-in-button"
import { toast } from "sonner"

type Step = "info" | "otp"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("info")
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"CLIENT" | "OWNER">("CLIENT")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const normalizedPhone = `+7${phone.replace(/\D/g, "").slice(-10)}`

  const handleSendOtp = async () => {
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Введите корректный номер телефона")
      return
    }
    if (name.trim().length < 2) {
      toast.error("Введите ваше имя")
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

  const handleRegister = async () => {
    if (code.length !== 4) {
      toast.error("Введите 4-значный код")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizedPhone,
          name: name.trim(),
          role,
          code,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Ошибка регистрации")
        return
      }

      const signInResult = await signIn("otp-login", {
        phone: normalizedPhone,
        code,
        redirect: false,
      })

      if (signInResult?.error) {
        toast.success("Регистрация прошла успешно! Войдите с вашим номером.")
        router.push("/login")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      toast.error("Ошибка соединения")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Регистрация</CardTitle>
          <CardDescription>
            Создайте аккаунт для бронирования залов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "info" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ваше имя</Label>
                <Input
                  id="name"
                  placeholder="Магомед"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <PhoneInput
                  id="phone"
                  value={phone}
                  onChange={setPhone}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Вы хотите</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as "CLIENT" | "OWNER")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Найти зал</SelectItem>
                    <SelectItem value="OWNER">Разместить зал</SelectItem>
                  </SelectContent>  
                </Select>
              </div>
              <Button
                className="w-full bg-brand-500 hover:bg-brand-600"
                onClick={handleSendOtp}
                disabled={isLoading}
              >
                {isLoading ? "Отправка..." : "Получить код"}
              </Button>
              <div className="relative">
                <span className="absolute inset-0 flex items-center" aria-hidden>
                  <span className="w-full border-t border-surface-300" />
                </span>
                <span className="relative flex justify-center text-xs uppercase text-muted-foreground">
                  или
                </span>
              </div>
              <GoogleSignInButton disabled={isLoading} />
              <p className="text-center text-sm text-muted-foreground">
                Уже есть аккаунт?{" "}
                <Link href="/login" className="text-brand-500 hover:underline">
                  Войти
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
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("info")
                  setCode("")
                }}
              >
                Назад
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
