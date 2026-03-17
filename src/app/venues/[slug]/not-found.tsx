import Link from "next/link";
import { Button } from "@/shared/ui/button";

export default function VenueNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="font-display text-2xl font-semibold mb-4">
        Зал не найден
      </h2>
      <p className="text-muted-foreground mb-6">
        Возможно, он был удалён или ссылка неверна.
      </p>
      <Button render={<Link href="/venues" />}>
        Перейти в каталог
      </Button>
    </div>
  );
}
