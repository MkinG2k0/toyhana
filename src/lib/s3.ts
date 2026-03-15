import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.S3_REGION ?? "ru-central1",
  endpoint: process.env.S3_ENDPOINT ?? "https://storage.yandexcloud.net",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "",
  },
  forcePathStyle: true,
})

const BUCKET = process.env.S3_BUCKET ?? "toykhana-media"

export const uploadToS3 = async (
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: "public-read",
    })
  )
  const endpoint = process.env.S3_ENDPOINT ?? "https://storage.yandexcloud.net"
  return `${endpoint.replace(/\/$/, "")}/${BUCKET}/${key}`
}

export const deleteFromS3 = async (key: string): Promise<void> => {
  await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
