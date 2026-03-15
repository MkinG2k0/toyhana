"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function VenuesError({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="mb-4 size-12 text-destructive" />
      <h2 className="text-lg font-semibold">Не удалось загрузить залы</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Произошла ошибка при загрузке данных. Попробуйте ещё раз.
      </p>
      <Button variant="outline" className="mt-4" onClick={reset}>
        Попробовать снова
      </Button>
    </div>
  )
}
