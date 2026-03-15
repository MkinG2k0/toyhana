"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const DISTRICTS = [
  "Советский",
  "Кировский",
  "Ленинский",
  "Ленинкент",
  "Редукторный",
];

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const router = useRouter();
  const [guestCount, setGuestCount] = useState("");
  const [district, setDistrict] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (guestCount) params.set("capacityMin", guestCount);
    if (district && district !== "all") params.set("district", district);
    router.push(`/venues?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl text-black  bg-white p-3 shadow-lg md:items-center md:gap-2 md:rounded-full md:p-2",
        className,
      )}
    >
      <Input
        type="number"
        placeholder="Кол-во гостей"
        value={guestCount}
        onChange={(e) => setGuestCount(e.target.value)}
        className="border-0 bg-surface-50 md:w-40"
      />
      <Select
        value={district}
        onValueChange={(v: string | null) => setDistrict(v ?? "all")}
      >
        <SelectTrigger className="border-0 bg-surface-50 md:w-44">
          <SelectValue placeholder="Район" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все районы</SelectItem>
          {DISTRICTS.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleSearch}
        className="bg-brand-500 hover:bg-brand-600 md:rounded-full"
        size="lg"
      >
        <Search className="mr-2 size-4" />
        Найти
      </Button>
    </div>
  );
};
