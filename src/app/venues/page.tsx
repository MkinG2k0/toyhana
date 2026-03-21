import { Suspense } from "react"
import type { Metadata } from "next"
import {
  parseRawSearchParamsToVenueListParams,
  venueListParamsSignature,
} from "@/entities/venue"
import { getVenuesList } from "@/entities/venue/server"
import { Footer } from "@/widgets/layout"
import {
  VenueCatalog,
  VenueCatalogSuspenseFallback,
} from "@/widgets/venue-catalog"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Банкетные залы — каталог",
  description:
    "Найдите идеальный банкетный зал для свадьбы в Махачкале и Дагестане. Фильтрация по вместимости, цене, наличию халяль кухни.",
}

interface VenuesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const raw = await searchParams
  const listParams = parseRawSearchParamsToVenueListParams(raw)
  const filtersSignature = venueListParamsSignature(listParams)
  const initialData = await getVenuesList(listParams)

  return (
    <>
      <Suspense fallback={<VenueCatalogSuspenseFallback />}>
        <VenueCatalog
          initialData={initialData}
          filtersSignature={filtersSignature}
        />
      </Suspense>
      <Footer />
    </>
  )
}
