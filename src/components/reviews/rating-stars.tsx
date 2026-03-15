"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const STARS_COUNT = 5

interface RatingStarsProps {
  rating: number
  size?: "sm" | "default" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-5 w-5",
} as const

export function RatingStars({
  rating,
  size = "default",
  className,
}: RatingStarsProps) {
  const iconClass = sizeClasses[size]

  return (
    <div
      className={cn("flex gap-0.5", className)}
      role="img"
      aria-label={`Рейтинг: ${rating} из 5`}
    >
      {Array.from({ length: STARS_COUNT }).map((_, i) => {
        const filled = i < Math.round(rating)
        return (
          <Star
            key={i}
            className={cn(
              iconClass,
              filled
                ? "fill-brand-400 text-brand-400"
                : "fill-transparent text-surface-300"
            )}
          />
        )
      })}
    </div>
  )
}

interface RatingStarsInputProps {
  value: number
  onChange: (rating: number) => void
  size?: "sm" | "default" | "lg"
  className?: string
  disabled?: boolean
}

export function RatingStarsInput({
  value,
  onChange,
  size = "default",
  className,
  disabled = false,
}: RatingStarsInputProps) {
  const iconClass = sizeClasses[size]
  const [hovered, setHovered] = React.useState<number | null>(null)
  const displayRating = hovered ?? value

  const handleClick = (rating: number) => {
    if (!disabled) onChange(rating)
  }

  return (
    <div
      className={cn("flex gap-0.5", className)}
      role="slider"
      aria-valuemin={1}
      aria-valuemax={STARS_COUNT}
      aria-valuenow={value}
      aria-label="Оценка"
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: STARS_COUNT }).map((_, i) => {
        const starValue = i + 1
        const filled = starValue <= displayRating

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            className="p-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
            onMouseEnter={() => !disabled && setHovered(starValue)}
            onClick={() => handleClick(starValue)}
            aria-label={`${starValue} звёзд`}
          >
            <Star
              className={cn(
                iconClass,
                filled
                  ? "fill-brand-400 text-brand-400"
                  : "fill-transparent text-surface-300"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
