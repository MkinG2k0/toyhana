"use client"

import { useCallback, useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { OptionsSelect } from "@/shared/ui"
import { cn } from "@/shared/lib/utils"

const DISTRICTS = [
  "Советский",
  "Кировский",
  "Ленинский",
  "Ленинкент",
  "Редукторный",
] as const

const ALL_DISTRICTS_VALUE = "Все районы"

const DISTRICT_SELECT_OPTIONS = [
  { value: ALL_DISTRICTS_VALUE, label: ALL_DISTRICTS_VALUE },
  ...DISTRICTS.map((d) => ({ value: d, label: d })),
]

const searchBarOuterClass =
  "flex gap-3 rounded-2xl text-black bg-white p-3 shadow-lg md:items-center md:gap-2 md:rounded-full md:p-2"

interface SearchBarProps {
  className?: string
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const router = useRouter()
  const [guestCount, setGuestCount] = useState("")
  const [district, setDistrict] = useState(ALL_DISTRICTS_VALUE)

  const handleGuestCountChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setGuestCount(event.target.value)
    },
    [],
  )

  const handleDistrictChange = useCallback((value: string | null) => {
    setDistrict(value ?? ALL_DISTRICTS_VALUE)
  }, [])

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    const parsed = Number(guestCount.trim())
    if (Number.isFinite(parsed) && parsed > 0) {
      params.set("capacityMin", String(Math.floor(parsed)))
    }
    if (district !== ALL_DISTRICTS_VALUE) {
      params.set("district", district)
    }
    const qs = params.toString()
    router.push(qs ? `/venues?${qs}` : "/venues")
  }, [district, guestCount, router])

  return (
    <div className={cn(searchBarOuterClass, className)}>
      <Input
        type="number"
        placeholder="Кол-во гостей"
        value={guestCount}
        onChange={handleGuestCountChange}
        className="border-0 bg-surface-50 md:w-40"
      />
      <OptionsSelect
        value={district}
        onValueChange={handleDistrictChange}
        options={DISTRICT_SELECT_OPTIONS}
        placeholder="Район"
        className="border-0 bg-surface-50 md:w-44"
      />
      <Button
        onClick={handleSearch}
        className="bg-brand-500 hover:bg-brand-600 md:rounded-full"
        size="lg"
      >
        <Search className="mr-2 size-4" />
        Найти
      </Button>
    </div>
  )
}
