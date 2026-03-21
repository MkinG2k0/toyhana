"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"
import { Label } from "@/shared/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"

interface RejectDialogProps {
  open: boolean
  onClose: () => void
  onReject: (adminComment: string) => Promise<void>
}

export const RejectDialog = ({ open, onClose, onReject }: RejectDialogProps) => {
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleReject = useCallback(async () => {
    if (comment.trim().length < 5) {
      toast.error("Укажите причину отклонения")
      return
    }

    setIsLoading(true)
    try {
      await onReject(comment.trim())
      setComment("")
      onClose()
    } catch {
      toast.error("Ошибка при отклонении заявки")
    } finally {
      setIsLoading(false)
    }
  }, [comment, onReject, onClose])

  const handleClose = useCallback(() => {
    setComment("")
    onClose()
  }, [onClose])

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value)
    },
    []
  )

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отклонить заявку</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reject-comment">
            Причина отклонения <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="reject-comment"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Укажите причину, чтобы пользователь мог исправить заявку..."
            rows={4}
            disabled={isLoading}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
          >
            {isLoading ? "Отклонение..." : "Отклонить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
