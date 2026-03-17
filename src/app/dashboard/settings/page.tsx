import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSettingsForm } from "@/components/dashboard";

export default async function DashboardSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    // страница дэшборда должна быть защищена layout'ом,
    // здесь просто не рендерим ничего без пользователя
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      telegramChatId: true,
      whatsappPhone: true,
    },
  });

  const initialProfile = {
    name: user?.name ?? session.user.name ?? "",
    telegramChatId: user?.telegramChatId ?? "",
    whatsappPhone: user?.whatsappPhone ?? "",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Настройки
        </h1>
        <p className="mt-1 text-muted-foreground">
          Редактирование профиля и контактов
        </p>
      </div>

      <Card className="max-w-xl border-surface-200">
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardSettingsForm initialProfile={initialProfile} />
        </CardContent>
      </Card>
    </div>
  );
}
