import { Controller, type Control } from "react-hook-form"
import { CalendarIcon } from "lucide-react"
import { ru } from "date-fns/locale"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import { Label } from "@/shared/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { formatDate } from "@/shared/lib/utils"
import type { CreateBookingFormValues } from "../model/schema"

const TODAY_START = new Date(new Date().toDateString())

const toIsoDate = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

interface BookingDateFieldProps {
  control: Control<CreateBookingFormValues>
  error?: string
}

export const BookingDateField = ({ control, error }: BookingDateFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="eventDate">Дата мероприятия</Label>
    <Controller
      control={control}
      name="eventDate"
      render={({ field }) => (
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id="eventDate"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              />
            }
          >
            <CalendarIcon className="mr-2 size-4" />
            {field.value ? formatDate(field.value) : "Выберите дату"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                field.value ? new Date(field.value + "T12:00:00") : undefined
              }
              onSelect={(date) => field.onChange(date ? toIsoDate(date) : "")}
              disabled={(date) => date < TODAY_START}
              locale={ru}
            />
          </PopoverContent>
        </Popover>
      )}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
)
