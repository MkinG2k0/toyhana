"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createBookingSchema,
  type CreateBookingInput,
} from "@/validators/booking";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/shared/phone-input";
import { EVENT_TYPE_LABELS, type EventType } from "@/types/booking";
import { formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { ru } from "date-fns/locale";

import { cn } from "@/lib/utils";

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "WEDDING", label: EVENT_TYPE_LABELS.WEDDING },
  { value: "ENGAGEMENT", label: EVENT_TYPE_LABELS.ENGAGEMENT },
  { value: "BIRTHDAY", label: EVENT_TYPE_LABELS.BIRTHDAY },
  { value: "CORPORATE", label: EVENT_TYPE_LABELS.CORPORATE },
  { value: "FUNERAL", label: EVENT_TYPE_LABELS.FUNERAL },
  { value: "OTHER", label: EVENT_TYPE_LABELS.OTHER },
];

interface BookingFormProps {
  venueId: string;
  venueName: string;
  capacityMin: number;
  capacityMax: number;
  onSuccess?: () => void;
  className?: string;
}

export const BookingForm = ({
  venueId,
  venueName,
  capacityMin,
  capacityMax,
  onSuccess,
  className,
}: BookingFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useCreateBooking();

  const form = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema(capacityMin, capacityMax)),
    defaultValues: {
      venueId,
      eventType: "WEDDING",
      eventDate: "",
      guestCount: capacityMin,
      contactName: "",
      contactPhone: "",
      message: "",
    },
  });

  useEffect(() => {
    const savedName = localStorage.getItem("booking_contactName");
    const savedPhone = localStorage.getItem("booking_contactPhone");
    const savedEventDate = localStorage.getItem("booking_eventDate");

    if (!savedName && !savedPhone) {
      return;
    }

    const currentValues = form.getValues();

    form.reset({
      ...currentValues,
      contactName: savedName ?? currentValues.contactName,
      contactPhone: savedPhone ?? currentValues.contactPhone,
      eventDate: savedEventDate ?? currentValues.eventDate,
    });
  }, [form]);

  const contactName = form.watch("contactName");
  const contactPhone = form.watch("contactPhone");

  useEffect(() => {
    if (contactName) {
      localStorage.setItem("booking_contactName", contactName);
    }

    if (contactPhone) {
      localStorage.setItem("booking_contactPhone", contactPhone);
    }
  }, [contactName, contactPhone]);

  const handleSubmit = (values: CreateBookingInput) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Заявка отправлена!", {
          description: `Владелец зала «${venueName}» получит уведомление и свяжется с вами.`,
        });
        form.reset();
        onSuccess?.();
        router.push("/");
      },
      onError: (error) => {
        toast.error("Ошибка", {
          description: error.message,
        });
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn("space-y-4", className)}
    >
      <div className="space-y-2">
        <Label htmlFor="eventDate">Дата мероприятия</Label>
        <Controller
          control={form.control}
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
                    field.value
                      ? new Date(field.value + "T12:00:00")
                      : undefined
                  }
                  onSelect={(date) => {
                    if (!date) {
                      field.onChange("");
                      return;
                    }

                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    field.onChange(`${year}-${month}-${day}`);
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().toDateString())
                  }
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {form.formState.errors.eventDate && (
          <p className="text-sm text-destructive">
            {form.formState.errors.eventDate.message}
          </p>
        )}
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="eventType">Тип мероприятия</Label>
        <Controller
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(v: string | null) =>
                field.onChange(v ?? "WEDDING")
              }
            >
              <SelectTrigger id="eventType" className="w-full">
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.eventType && (
          <p className="text-sm text-destructive">
            {form.formState.errors.eventType.message}
          </p>
        )}
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="guestCount">Количество гостей</Label>
        <p className="text-xs text-muted-foreground">
          Зал вмещает от {capacityMin} до {capacityMax} гостей
        </p>
        <Input
          id="guestCount"
          type="number"
          placeholder={String(capacityMin)}
          {...form.register("guestCount", { valueAsNumber: true })}
          className={cn(
            form.formState.errors.guestCount && "border-destructive",
          )}
        />
        {form.formState.errors.guestCount && (
          <p className="text-sm text-destructive">
            {form.formState.errors.guestCount.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactName">Ваше имя</Label>
        <Input
          id="contactName"
          placeholder="Магомед"
          {...form.register("contactName")}
          className={cn(
            form.formState.errors.contactName && "border-destructive",
          )}
        />
        {form.formState.errors.contactName && (
          <p className="text-sm text-destructive">
            {form.formState.errors.contactName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPhone">Телефон</Label>
        <Controller
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <PhoneInput
              id="contactPhone"
              value={field.value ? field.value.replace(/^\+7/, "") : ""}
              onChange={(v) => field.onChange(v ? `+7${v}` : "")}
              disabled={isPending}
            />
          )}
        />
        {form.formState.errors.contactPhone && (
          <p className="text-sm text-destructive">
            {form.formState.errors.contactPhone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Пожелания (необязательно)</Label>
        <Textarea
          id="message"
          placeholder="Нужна сцена, хотим обсудить меню..."
          rows={3}
          {...form.register("message")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-brand-500 hover:bg-brand-600"
        disabled={isPending}
      >
        {isPending ? "Отправляем..." : "Отправить заявку"}
      </Button>
    </form>
  );
};
