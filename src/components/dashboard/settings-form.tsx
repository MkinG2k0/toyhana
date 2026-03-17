"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DashboardSettingsFormProps {
  initialProfile: {
    name: string;
    telegramChatId: string;
    whatsappPhone: string;
  };
}

export const DashboardSettingsForm = ({
  initialProfile,
}: DashboardSettingsFormProps) => {
  const { update } = useSession();

  const form = useForm<{
    name: string;
    telegramChatId: string;
    whatsappPhone: string;
  }>({
    defaultValues: initialProfile,
  });

  const handleSubmit = async (values: {
    name: string;
    telegramChatId: string;
    whatsappPhone: string;
  }) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim() || undefined,
          telegramChatId: values.telegramChatId.trim() || null,
          whatsappPhone: values.whatsappPhone.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Ошибка сохранения");
        return;
      }
      await update({ name: json.data.name });
      toast.success("Профиль сохранён");
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="Ваше имя"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="telegramChatId">Telegram Chat ID</Label>
        <Input
          id="telegramChatId"
          {...form.register("telegramChatId")}
          placeholder="Для уведомлений о заявках"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="whatsappPhone">WhatsApp</Label>
        <Input
          id="whatsappPhone"
          {...form.register("whatsappPhone")}
          placeholder="+7 (928) 000-00-00"
          className="mt-1.5"
        />
      </div>
      <Button
        type="submit"
        className="bg-brand-500 hover:bg-brand-600"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Сохранение..." : "Сохранить"}
      </Button>
    </form>
  );
};
