"use client"

import { useState } from "react"
import { toast } from "sonner"

export interface VenueActionItem {
  id: string
  name: string
  isActive: boolean
}

type ConfirmType = "visibility" | "delete"

export interface UseVenuesActionsReturn {
  confirmType: ConfirmType | null
  targetVenue: VenueActionItem | null
  nextIsActive: boolean | null
  isSubmitting: boolean
  openVisibilityDialog: (venue: VenueActionItem) => void
  openDeleteDialog: (venue: VenueActionItem) => void
  closeDialog: () => void
  handleConfirm: () => Promise<void>
}

const toggleVenueVisibility = async (
  id: string,
  isActive: boolean,
): Promise<{ error?: string }> => {
  const res = await fetch(`/api/venues/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  })
  return res.json() as Promise<{ error?: string }>
}

const deleteVenue = async (
  id: string,
): Promise<{
  error?: string
  data?: { deleted: boolean; archived: boolean }
}> => {
  const res = await fetch(`/api/venues/${id}`, { method: "DELETE" })
  return res.json() as Promise<{
    error?: string
    data?: { deleted: boolean; archived: boolean }
  }>
}

export const useVenuesActions = (): UseVenuesActionsReturn => {
  const [confirmType, setConfirmType] = useState<ConfirmType | null>(null)
  const [targetVenue, setTargetVenue] = useState<VenueActionItem | null>(null)
  const [nextIsActive, setNextIsActive] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openVisibilityDialog = (venue: VenueActionItem): void => {
    setTargetVenue(venue)
    setNextIsActive(!venue.isActive)
    setConfirmType("visibility")
  }

  const openDeleteDialog = (venue: VenueActionItem): void => {
    setTargetVenue(venue)
    setConfirmType("delete")
  }

  const closeDialog = (): void => {
    if (isSubmitting) return
    setConfirmType(null)
    setTargetVenue(null)
    setNextIsActive(null)
  }

  const handleConfirm = async (): Promise<void> => {
    if (!targetVenue || !confirmType) return
    setIsSubmitting(true)
    try {
      if (confirmType === "visibility") {
        if (nextIsActive === null) return
        const json = await toggleVenueVisibility(targetVenue.id, nextIsActive)
        if (json.error) {
          toast.error(json.error)
          return
        }
        toast.success(
          nextIsActive
            ? "Зал снова отображается в каталоге"
            : "Зал скрыт",
        )
      } else {
        const json = await deleteVenue(targetVenue.id)
        if (json.error) {
          toast.error(json.error)
          return
        }
        toast.success(
          json.data?.archived
            ? "Зал скрыт и больше не отображается в каталоге."
            : "Зал удалён.",
        )
      }
      window.location.reload()
    } catch {
      toast.error("Что-то пошло не так. Попробуйте ещё раз.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    confirmType,
    targetVenue,
    nextIsActive,
    isSubmitting,
    openVisibilityDialog,
    openDeleteDialog,
    closeDialog,
    handleConfirm,
  }
}
