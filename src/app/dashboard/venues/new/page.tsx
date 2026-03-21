import { redirect } from "next/navigation"
import { auth } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib/prisma"
import { NewVenueForm } from "@/features/venue-create"

export const dynamic = "force-dynamic"

export default async function NewVenuePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
    redirect("/")
  }

  if (session.user.role === "OWNER") {
    const approved = await prisma.venuePlacementRequest.findFirst({
      where: { userId: session.user.id, status: "APPROVED" },
      select: { id: true },
    })

    if (!approved) {
      redirect("/dashboard")
    }
  }

  return <NewVenueForm />
}
