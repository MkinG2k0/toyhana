"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RatingStarsInput } from "@/components/reviews/rating-stars"
import { useCreateReview } from "@/hooks/use-reviews"
import { createReviewSchema } from "@/validators/review"
import type { CreateReviewInput } from "@/validators/review"
import type { ReviewFormData } from "@/types/review"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  venueId: string
  className?: string
}

export function ReviewForm({ venueId, className }: ReviewFormProps) {
  const createReview = useCreateReview()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      venueId,
      rating: 0,
      text: "",
      foodRating: undefined,
      serviceRating: undefined,
      ambienceRating: undefined,
    },
  })

  const rating = watch("rating")
  const foodRating = watch("foodRating")
  const serviceRating = watch("serviceRating")
  const ambienceRating = watch("ambienceRating")

  const handleFormSubmit = (data: CreateReviewInput) => {
    if (data.rating < 1) {
      toast.error("Выберите оценку")
      return
    }

    const payload: ReviewFormData = {
      venueId: data.venueId,
      rating: data.rating,
      text: data.text,
    }
    if (data.foodRating != null) payload.foodRating = data.foodRating
    if (data.serviceRating != null) payload.serviceRating = data.serviceRating
    if (data.ambienceRating != null)
      payload.ambienceRating = data.ambienceRating

    createReview.mutate(payload, {
      onSuccess: () => {
        toast.success("Отзыв опубликован")
        reset({
          venueId,
          rating: 0,
          text: "",
          foodRating: undefined,
          serviceRating: undefined,
          ambienceRating: undefined,
        })
      },
      onError: (err: Error) => {
        toast.error(err.message)
      },
    })
  }

  return (
    <form
      className={cn("space-y-4", className)}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <input type="hidden" {...register("venueId")} />

      <div>
        <Label className="mb-2 block">Общая оценка *</Label>
        <RatingStarsInput
          value={rating}
          onChange={(v) => setValue("rating", v, { shouldValidate: true })}
          disabled={createReview.isPending}
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-destructive">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="review-text">Текст отзыва *</Label>
        <Textarea
          id="review-text"
          placeholder="Расскажите о вашем впечатлении от зала..."
          className="mt-2 min-h-24"
          disabled={createReview.isPending}
          {...register("text")}
        />
        {errors.text && (
          <p className="mt-1 text-sm text-destructive">{errors.text.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground">
          Дополнительные оценки (необязательно)
        </Label>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <span className="text-sm text-muted-foreground">Кухня</span>
            <RatingStarsInput
              value={foodRating ?? 0}
              onChange={(v) => setValue("foodRating", v)}
              size="sm"
              disabled={createReview.isPending}
            />
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Сервис</span>
            <RatingStarsInput
              value={serviceRating ?? 0}
              onChange={(v) => setValue("serviceRating", v)}
              size="sm"
              disabled={createReview.isPending}
            />
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Обстановка</span>
            <RatingStarsInput
              value={ambienceRating ?? 0}
              onChange={(v) => setValue("ambienceRating", v)}
              size="sm"
              disabled={createReview.isPending}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={createReview.isPending || rating < 1}
        className="bg-brand-500 hover:bg-brand-600"
      >
        {createReview.isPending ? "Отправка..." : "Опубликовать отзыв"}
      </Button>
    </form>
  )
}
