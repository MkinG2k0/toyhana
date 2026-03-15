"use client"

import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PhoneInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

const applyMask = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 10)
  if (digits.length === 0) return ""
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  if (digits.length <= 8)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`
}

export const PhoneInput = ({
  id,
  value,
  onChange,
  disabled,
  className,
}: PhoneInputProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value.replace(/[^0-9()\s-]/g, "")
      const digits = rawInput.replace(/\D/g, "").slice(0, 10)
      onChange(digits)
    },
    [onChange]
  )

  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        +7
      </span>
      <Input
        id={id}
        type="tel"
        placeholder="(928) 000-00-00"
        value={applyMask(value)}
        onChange={handleChange}
        disabled={disabled}
        className="pl-9"
      />
    </div>
  )
}
