import { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth-guard"
import { success, error, serverError } from "@/lib/api-response"
import { uploadToS3 } from "@/lib/s3"
import sharp from "sharp"

const MAX_WIDTH = 1200
const QUALITY = 80

export async function POST(req: NextRequest) {
  try {
    const result = await requireAuth(["OWNER", "ADMIN"])
    if (result.error) return result.error

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file || !(file instanceof File)) {
      return error("Файл не найден")
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return error("Допустимые форматы: JPEG, PNG, WebP")
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const meta = await sharp(buffer).metadata()
    const width = meta.width ?? 0

    const processed =
      width > MAX_WIDTH
        ? await sharp(buffer)
            .resize(MAX_WIDTH)
            .jpeg({ quality: QUALITY })
            .toBuffer()
        : await sharp(buffer)
            .jpeg({ quality: QUALITY })
            .toBuffer()

    const ext = file.name.split(".").pop() ?? "jpg"
    const key = `venues/${result.user.id}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

    const url = await uploadToS3(key, processed, "image/jpeg")

    return success({ url, key })
  } catch (err) {
    return serverError(err)
  }
}
