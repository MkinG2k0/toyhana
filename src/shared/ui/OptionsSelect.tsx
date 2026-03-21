"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface OptionsSelectProps {
  value: string;
  onValueChange: (value: string | null) => void;
  options: SelectOption[];
  placeholder: string;
  className?: string;
}

export const OptionsSelect = ({
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: OptionsSelectProps) => {
  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={placeholder}>
          {selectedLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
