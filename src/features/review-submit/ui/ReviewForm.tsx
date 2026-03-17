"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import { cn } from "@/shared/lib/utils"
import { createReviewSchema, type CreateReviewFormValues } from "../model/schema"
import { useReviewMutation } from "../model/use-review-mutation"
import { RatingStarsInput } from "./RatingStars"

interface ReviewFormProps {
  venueId: string
  className?: string
}

export const ReviewForm = ({ venueId, className }: ReviewFormProps) => {
  const reviewMutation = useReviewMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateReviewFormValues>({
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

  const handleFormSubmit = (data: CreateReviewFormValues) => {
    if (data.rating < 1) {
      toast.error("Выберите оценку")
      return
    }

    reviewMutation.mutate(data, {
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
          disabled={reviewMutation.isPending}
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
          disabled={reviewMutation.isPending}
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
              disabled={reviewMutation.isPending}
            />
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Сервис</span>
            <RatingStarsInput
              value={serviceRating ?? 0}
              onChange={(v) => setValue("serviceRating", v)}
              size="sm"
              disabled={reviewMutation.isPending}
            />
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Обстановка</span>
            <RatingStarsInput
              value={ambienceRating ?? 0}
              onChange={(v) => setValue("ambienceRating", v)}
              size="sm"
              disabled={reviewMutation.isPending}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={reviewMutation.isPending || rating < 1}
        className="bg-brand-500 hover:bg-brand-600"
      >
        {reviewMutation.isPending ? "Отправка..." : "Опубликовать отзыв"}
      </Button>
    </form>
  )
}
