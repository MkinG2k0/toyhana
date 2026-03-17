import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"

type ConfirmType = "visibility" | "delete"

interface VenueConfirmDialogProps {
  confirmType: ConfirmType | null
  nextIsActive: boolean | null
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

const DIALOG_TITLE: Record<string, string> = {
  delete: "Скрыть зал?",
  visibility_show: "Показать зал в каталоге?",
  visibility_hide: "Скрыть зал?",
}

const DIALOG_DESCRIPTION: Record<string, string> = {
  delete:
    "Зал будет скрыт из каталога и не будет доступен для новых заявок. Существующие данные сохранятся.",
  visibility_show: "Зал снова станет виден в каталоге и доступен для заявок.",
  visibility_hide:
    "Зал перестанет отображаться в каталоге, но данные сохранятся, и вы сможете включить его позже.",
}

const getDialogKey = (
  confirmType: ConfirmType | null,
  nextIsActive: boolean | null,
): string => {
  if (confirmType === "delete") return "delete"
  return nextIsActive ? "visibility_show" : "visibility_hide"
}

export const VenueConfirmDialog = ({
  confirmType,
  nextIsActive,
  isSubmitting,
  onClose,
  onConfirm,
}: VenueConfirmDialogProps) => {
  const dialogKey = getDialogKey(confirmType, nextIsActive)
  const isDeleteAction = confirmType === "delete"

  const confirmLabel = isSubmitting
    ? "Подтверждение..."
    : isDeleteAction
      ? "Скрыть"
      : nextIsActive
        ? "Показать"
        : "Скрыть"

  return (
    <Dialog open={!!confirmType} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{DIALOG_TITLE[dialogKey]}</DialogTitle>
          <DialogDescription>{DIALOG_DESCRIPTION[dialogKey]}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button
            type="button"
            className={
              isDeleteAction
                ? "bg-destructive text-white hover:bg-destructive/90"
                : "bg-brand-500 text-white hover:bg-brand-600"
            }
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
