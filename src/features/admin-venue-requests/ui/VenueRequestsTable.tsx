"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Card, CardContent } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/EmptyState"
import { ClipboardList } from "lucide-react"
import { RejectDialog } from "./RejectDialog"
import {
  approveVenuePlacementRequest,
  rejectVenuePlacementRequest,
} from "../api/adminVenueRequestApi"
import type { VenuePlacementRequestWithUser } from "../model/types"

const STATUS_LABELS = {
  PENDING: "На рассмотрении",
  APPROVED: "Одобрена",
  REJECTED: "Отклонена",
} as const

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  APPROVED: "default",
  REJECTED: "destructive",
}

const STATUS_CLASSES = {
  PENDING: "border-brand-400 text-brand-700",
  APPROVED: "bg-green-600 hover:bg-green-600",
  REJECTED: "",
} as const

interface VenueRequestsTableProps {
  requests: VenuePlacementRequestWithUser[]
}

interface RequestCardProps {
  request: VenuePlacementRequestWithUser
  onApprove: (id: string) => Promise<void>
  onRejectClick: (id: string) => void
  isProcessing: boolean
}

const RequestCard = ({
  request,
  onApprove,
  onRejectClick,
  isProcessing,
}: RequestCardProps) => {
  const handleApprove = useCallback(
    () => onApprove(request.id),
    [onApprove, request.id]
  )

  const handleRejectClick = useCallback(
    () => onRejectClick(request.id),
    [onRejectClick, request.id]
  )

  return (
    <Card className="border-surface-200">
      <CardContent className="space-y-3 pt-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{request.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {request.user.phone ?? "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={STATUS_VARIANTS[request.status]}
              className={STATUS_CLASSES[request.status]}
            >
              {STATUS_LABELS[request.status]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(request.createdAt), {
                addSuffix: true,
                locale: ru,
              })}
            </span>
          </div>
        </div>

        <p className="rounded-md bg-surface-50 px-3 py-2 text-sm text-foreground">
          {request.description}
        </p>

        {request.adminComment && (
          <p className="text-sm text-destructive">
            Комментарий: {request.adminComment}
          </p>
        )}

        {request.status === "PENDING" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              Одобрить
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRejectClick}
              disabled={isProcessing}
            >
              Отклонить
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const VenueRequestsTable = ({
  requests,
}: VenueRequestsTableProps) => {
  const router = useRouter()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  const handleApprove = useCallback(
    async (id: string) => {
      setProcessingId(id)
      try {
        await approveVenuePlacementRequest(id)
        toast.success("Заявка одобрена")
        router.refresh()
      } catch {
        toast.error("Ошибка при одобрении заявки")
      } finally {
        setProcessingId(null)
      }
    },
    [router]
  )

  const handleRejectClick = useCallback((id: string) => {
    setRejectingId(id)
  }, [])

  const handleRejectClose = useCallback(() => {
    setRejectingId(null)
  }, [])

  const handleReject = useCallback(
    async (adminComment: string) => {
      if (!rejectingId) return
      setProcessingId(rejectingId)
      try {
        await rejectVenuePlacementRequest(rejectingId, adminComment)
        toast.success("Заявка отклонена")
        router.refresh()
      } finally {
        setProcessingId(null)
      }
    },
    [rejectingId, router]
  )

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="size-12" />}
        title="Нет заявок"
        description="Заявки на размещение залов появятся здесь"
      />
    )
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onApprove={handleApprove}
            onRejectClick={handleRejectClick}
            isProcessing={processingId === request.id}
          />
        ))}
      </div>

      <RejectDialog
        open={!!rejectingId}
        onClose={handleRejectClose}
        onReject={handleReject}
      />
    </>
  )
}
