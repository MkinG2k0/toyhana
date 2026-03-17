import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import { Sidebar, DashboardMobileNav } from "@/widgets/layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  if (role !== "OWNER" && role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
        <aside className="hidden w-56 shrink-0 border-r border-surface-200 bg-surface-50 lg:block">
          <div className="sticky top-16 py-4">
            <Sidebar />
          </div>
        </aside>
        <div className="flex-1 p-4 lg:p-6">
          <DashboardMobileNav />
          {children}
        </div>
      </div>
    </>
  );
}
