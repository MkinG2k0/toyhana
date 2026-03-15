"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RatingStars } from "@/components/reviews/rating-stars"
import { formatDate } from "@/lib/utils"
import type { ReviewCard as ReviewCardType } from "@/types/review"
import { cn } from "@/lib/utils"

interface ReviewCardProps {
  review: ReviewCardType
  className?: string
}

const SUB_RATING_LABELS: Record<string, string> = {
  foodRating: "Кухня",
  serviceRating: "Сервис",
  ambienceRating: "Обстановка",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const subRatings = [
    review.foodRating && { key: "foodRating", value: review.foodRating },
    review.serviceRating && { key: "serviceRating", value: review.serviceRating },
    review.ambienceRating && {
      key: "ambienceRating",
      value: review.ambienceRating,
    },
  ].filter(Boolean) as { key: string; value: number }[]

  return (
    <article
      className={cn(
        "rounded-2xl border border-surface-300 bg-surface-100 p-4",
        className
      )}
    >
      <div className="flex gap-3">
        <Avatar size="sm">
          {review.author.avatar ? (
            <AvatarImage src={review.author.avatar} alt={review.author.name} />
          ) : null}
          <AvatarFallback className="bg-surface-200 text-muted-foreground text-xs">
            {getInitials(review.author.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">
              {review.author.name}
            </span>
            <RatingStars rating={review.rating} size="sm" />
            <span className="text-sm text-muted-foreground">
              {formatDate(review.createdAt)}
            </span>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
            {review.text}
          </p>

          {subRatings.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-4">
              {subRatings.map(({ key, value }) => (
                <div
                  key={key}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <span>{SUB_RATING_LABELS[key] ?? key}:</span>
                  <RatingStars rating={value} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
