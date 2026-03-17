"use client"

import Link from "next/link"
import { Building2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/EmptyState"
import { useVenuesActions } from "../model/use-venues-actions"
import { VenueListItem } from "./VenueListItem"
import { VenueConfirmDialog } from "./VenueConfirmDialog"
import type { VenueItem } from "./VenueListItem"

interface VenuesListProps {
  venues: VenueItem[]
}

export const VenuesList = ({ venues }: VenuesListProps) => {
  const {
    confirmType,
    nextIsActive,
    isSubmitting,
    openVisibilityDialog,
    openDeleteDialog,
    closeDialog,
    handleConfirm,
  } = useVenuesActions()

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            Мои залы
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {venues.length} {venues.length === 1 ? "зал" : "залов"}
          </p>
        </div>
        <Button
          className="bg-brand-500 hover:bg-brand-600"
          render={<Link href="/dashboard/venues/new" />}
        >
          Добавить зал
        </Button>
      </div>

      {venues.length === 0 ? (
        <EmptyState
          icon={<Building2 className="size-12" />}
          title="Нет залов"
          description="Добавьте первый зал, чтобы получать заявки от клиентов"
          action={
            <Button
              className="bg-brand-500 hover:bg-brand-600"
              render={<Link href="/dashboard/venues/new" />}
            >
              Добавить зал
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {venues.map((venue) => (
            <VenueListItem
              key={venue.id}
              venue={venue}
              onVisibilityClick={() => openVisibilityDialog(venue)}
              onDeleteClick={() => openDeleteDialog(venue)}
            />
          ))}
        </div>
      )}

      <VenueConfirmDialog
        confirmType={confirmType}
        nextIsActive={nextIsActive}
        isSubmitting={isSubmitting}
        onClose={closeDialog}
        onConfirm={handleConfirm}
      />
    </>
  )
}
