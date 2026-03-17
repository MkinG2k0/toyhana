import type { Metadata } from "next"
import { Footer } from "@/widgets/layout"
import { VenueCatalog } from "@/widgets/venue-catalog"
import { getVenuesList } from "@/entities/venue/server"

export const revalidate = 3600
export const metadata: Metadata = {
  title: "Банкетные залы — каталог",
  description:
    "Найдите идеальный банкетный зал для свадьбы в Махачкале и Дагестане. Фильтрация по вместимости, цене, наличию халяль кухни.",
}

export default async function VenuesPage() {
  const initialData = await getVenuesList({})
  return (
    <>
      <VenueCatalog initialData={initialData} />
      <Footer />
    </>
  )
}
