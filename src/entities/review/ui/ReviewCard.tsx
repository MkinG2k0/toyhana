import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Star } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import type { ReviewItem } from "../model/types"

interface ReviewCardProps {
  review: ReviewItem
  className?: string
}

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={cn(
        "size-4",
        i < rating ? "fill-brand-400 text-brand-400" : "text-surface-300"
      )}
    />
  ))

export const ReviewCard = ({ review, className }: ReviewCardProps) => {
  const initials = review.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={cn("space-y-2 rounded-lg border border-surface-200 p-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={review.user.image ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{review.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString("ru-RU")}
            </p>
          </div>
        </div>
        <div className="flex">{renderStars(review.rating)}</div>
      </div>
      <p className="text-sm text-foreground/80">{review.comment}</p>
    </div>
  )
}
