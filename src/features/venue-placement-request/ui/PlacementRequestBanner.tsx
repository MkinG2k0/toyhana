"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { submitVenuePlacementRequest } from "../api/venuePlacementRequestApi"
import type { VenuePlacementRequestDto } from "../model/types"

interface PlacementRequestBannerProps {
  request: VenuePlacementRequestDto | null
}

export const PlacementRequestBanner = ({
  request,
}: PlacementRequestBannerProps) => {
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (description.trim().length < 20) {
      toast.error("Опишите зал подробнее (минимум 20 символов)")
      return
    }

    setIsLoading(true)
    try {
      await submitVenuePlacementRequest(description.trim())
      toast.success("Заявка отправлена! Мы рассмотрим её в ближайшее время.")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка отправки")
    } finally {
      setIsLoading(false)
    }
  }, [description, router])

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value)
    },
    []
  )

  if (request?.status === "APPROVED") return null

  if (request?.status === "PENDING") {
    return (
      <Card className="mb-6 border-brand-200 bg-brand-50">
        <CardContent className="flex items-start gap-3 pt-4">
          <Clock className="mt-0.5 size-5 shrink-0 text-brand-500" />
          <div>
            <p className="font-semibold text-brand-800">
              Заявка на рассмотрении
            </p>
            <p className="mt-0.5 text-sm text-brand-700">
              Мы проверяем вашу заявку. После одобрения вы сможете добавлять
              залы. Обычно это занимает 1–2 рабочих дня.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border-surface-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {request?.status === "REJECTED" ? (
            <>
              <AlertCircle className="size-5 text-destructive" />
              Заявка отклонена
            </>
          ) : (
            <>
              <CheckCircle2 className="size-5 text-brand-500" />
              Подайте заявку на размещение зала
            </>
          )}
        </CardTitle>
        {request?.status === "REJECTED" && request.adminComment && (
          <p className="mt-1 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {request.adminComment}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Расскажите о вашем зале: название, адрес, вместимость, особенности.
          После проверки вы получите доступ к размещению залов.
        </p>
        <Textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Например: банкетный зал «Золотая Империя» в Советском районе Махачкалы, вместимость 400 человек, халяль кухня, парковка, молельная комната..."
          rows={4}
          disabled={isLoading}
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-brand-500 hover:bg-brand-600"
        >
          {isLoading ? "Отправка..." : "Отправить заявку"}
        </Button>
      </CardContent>
    </Card>
  )
}
