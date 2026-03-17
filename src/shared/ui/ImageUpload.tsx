"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/shared/lib/utils"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

export interface UploadedImage {
  url: string
  key: string
  kind?: "image" | "video"
}

const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]

const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

const MAX_SIZE_BYTES = 100 * 1024 * 1024

interface ImageUploadProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxFiles?: number
  className?: string
  disabled?: boolean
}

export const ImageUpload = ({
  value,
  onChange,
  maxFiles = 10,
  className,
  disabled = false,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File): Promise<UploadedImage> => {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error ?? "Ошибка загрузки")
    }
    const { data } = await res.json()
    const isVideo = !IMAGE_MIME_TYPES.includes(file.type)
    return {
      url: data.url,
      key: data.key,
      kind: isVideo ? "video" : "image",
    }
  }, [])

  const processFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || disabled || value.length >= maxFiles) return
      const accepted = Array.from(files).filter((file) => {
        if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
          return false
        }
        if (file.size > MAX_SIZE_BYTES) {
          toast.error("Видео не должно превышать 100 МБ")
          return false
        }
        return true
      })
      const toAdd = Math.min(accepted.length, maxFiles - value.length)
      if (toAdd === 0) return
      setUploading(true)
      const newImages: UploadedImage[] = []
      const total = toAdd
      let done = 0
      try {
        for (let i = 0; i < toAdd; i++) {
          const uploaded = await uploadFile(accepted[i])
          newImages.push(uploaded)
          done++
          setProgress((done / total) * 100)
        }
        onChange([...value, ...newImages])
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [value, onChange, maxFiles, disabled, uploadFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragActive(false)
      processFiles(e.dataTransfer.files)
    },
    [processFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const related = e.relatedTarget as Node | null
    if (!related || !e.currentTarget.contains(related)) {
      setIsDragActive(false)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (disabled || uploading || value.length >= maxFiles) return
    inputRef.current?.click()
  }, [disabled, uploading, value.length, maxFiles])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files)
      e.target.value = ""
    },
    [processFiles]
  )

  const handleRemove = useCallback(
    (index: number) => {
      const next = value.filter((_, i) => i !== index)
      onChange(next)
    },
    [value, onChange]
  )

  return (
    <div className={cn("space-y-4", className)}>
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={cn(
          "flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors",
          isDragActive && "border-brand-400 bg-brand-50",
          (disabled || uploading || value.length >= maxFiles) &&
            "cursor-not-allowed opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_MIME_TYPES.join(",")}
          multiple
          className="sr-only"
          onChange={handleInputChange}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-brand-500" />
            <span className="text-sm text-muted-foreground">
              Загрузка... {Math.round(progress)}%
            </span>
          </div>
        ) : (
          <>
            <Upload className="size-8 text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground">
              Перетащите фото или видео либо нажмите для выбора
            </span>
            <span className="text-xs text-muted-foreground">
              {value.length} / {maxFiles}
            </span>
          </>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((item, index) => {
            const isVideo = item.kind === "video"
            return (
              <div
                key={item.key}
                className="group relative aspect-square overflow-hidden rounded-lg border border-surface-200"
              >
                {isVideo ? (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    controls
                    muted
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                )}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Удалить"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
