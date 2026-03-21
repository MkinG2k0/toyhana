import Link from "next/link"
import { SITE_NAME } from "@/shared/lib/site"

export const Footer = () => {
  return (
    <footer className="border-t border-surface-200 bg-surface-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <span className="font-display text-lg font-bold text-brand-600">
              {SITE_NAME}
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              Поиск и бронирование банкетных залов для свадеб и мероприятий в
              Махачкале и Дагестане
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Навигация</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/venues" className="hover:text-brand-500">
                Каталог залов
              </Link>
              <Link href="/register" className="hover:text-brand-500">
                Разместить зал
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Контакты</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="tel:+79280000000" className="hover:text-brand-500">
                +7 (928) 000-00-00
              </a>
              <p>Махачкала, Дагестан</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-surface-200 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
