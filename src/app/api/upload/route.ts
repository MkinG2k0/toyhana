import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth-guard'
import { success, error, serverError } from '@/lib/api-response'
import { uploadToS3 } from '@/lib/s3'
import sharp from 'sharp'

const MAX_WIDTH = 1200
const QUALITY = 80
const MAX_SIZE_BYTES = 100 * 1024 * 1024 // 100 MB

export async function POST(req: NextRequest) {
	try {
		const result = await requireAuth(['OWNER', 'ADMIN'])
		if (result.error) return result.error

		const formData = await req.formData()
		const file = formData.get('file') as File | null
		if (!file || !(file instanceof File)) {
			return error('Файл не найден')
		}

		if (file.size > MAX_SIZE_BYTES) {
			return error('Файл не должен превышать 100 МБ')
		}

		const imageTypes = ['image/jpeg', 'image/png', 'image/webp']
		const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
		const isImage = imageTypes.includes(file.type)
		const isVideo = videoTypes.includes(file.type)

		if (!isImage && !isVideo) {
			return error('Допустимые форматы: JPEG, PNG, WebP, MP4, WebM, QuickTime')
		}

		const buffer = Buffer.from(await file.arrayBuffer())

		if (isVideo) {
			const ext = file.name.split('.').pop() ?? 'mp4'
			const key = `${result.user.id}/${Date.now()}-${crypto
				.randomUUID()
				.slice(0, 8)}.${ext}`

			const url = await uploadToS3(key, buffer)

			return success({url, key})
		}

		const meta = await sharp(buffer).metadata()
		const width = meta.width ?? 0

		const processed =
			width > MAX_WIDTH
				? await sharp(buffer)
					.resize(MAX_WIDTH)
					.jpeg({quality: QUALITY})
					.toBuffer()
				: await sharp(buffer).jpeg({quality: QUALITY}).toBuffer()

		const ext = file.name.split('.').pop() ?? 'jpg'
		const key = `${result.user.id}/${Date.now()}-${crypto
			.randomUUID()
			.slice(0, 8)}.${ext}`

		const url = await uploadToS3(key, processed)

		return success({url, key})
	} catch (err) {
		return serverError(err)
	}
}
