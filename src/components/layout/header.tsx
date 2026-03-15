"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-brand-600">
            Тойхана
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/venues"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-500"
          >
            Каталог залов
          </Link>
          {session?.user?.role === "OWNER" && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-500"
            >
              Мой кабинет
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <div className="hidden md:flex md:items-center md:gap-2">
              <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                Войти
              </Button>
              <Button
                size="sm"
                className="bg-brand-500 hover:bg-brand-600"
                render={<Link href="/register" />}
              >
                Зарегистрироваться
              </Button>
            </div>
          )}
          <MobileNav
            isLoggedIn={!!session?.user}
            userRole={session?.user?.role}
          />
        </div>
      </div>
    </header>
  );
};
