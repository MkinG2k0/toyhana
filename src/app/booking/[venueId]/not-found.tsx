import Link from "next/link";
import { Button } from "@/shared/ui/button";

export default function BookingNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="font-display text-2xl font-semibold mb-4">
        Зал не найден
      </h2>
      <p className="text-muted-foreground mb-6">
        Невозможно оставить заявку: зал удалён или ссылка неверна.
      </p>
      <Button>
        <Link href="/venues">Перейти в каталог</Link>
      </Button>
    </div>
  );
}
