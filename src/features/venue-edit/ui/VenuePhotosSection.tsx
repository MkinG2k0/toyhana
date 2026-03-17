import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { ImageUpload, type UploadedImage } from "@/shared/ui/ImageUpload"

interface VenuePhotosSectionProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
}

export const VenuePhotosSection = ({
  value,
  onChange,
}: VenuePhotosSectionProps) => (
  <Card className="border-surface-200">
    <CardHeader>
      <CardTitle>Фотографии</CardTitle>
    </CardHeader>
    <CardContent>
      <ImageUpload value={value} onChange={onChange} maxFiles={10} />
      <p className="mt-2 text-xs text-muted-foreground">
        Обновите фото зала. Первое фото используется как обложка.
      </p>
    </CardContent>
  </Card>
)
