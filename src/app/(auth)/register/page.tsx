import { Suspense } from "react"
import { RegisterForm } from "@/features/auth-sms"
import { Skeleton } from "@/shared/ui/skeleton"

const registerFormFallbackClassName =
  "w-full max-w-md rounded-2xl border border-surface-300 bg-surface-100 p-6"

const RegisterFormFallback = () => (
  <div className={registerFormFallbackClassName}>
    <Skeleton className="mx-auto h-8 w-48" />
    <Skeleton className="mx-auto mt-2 h-4 w-64" />
    <div className="mt-6 space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
)

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFormFallback />}>
      <RegisterForm />
    </Suspense>
  )
}
