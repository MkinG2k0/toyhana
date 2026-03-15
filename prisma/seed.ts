import { PrismaClient } from "../generated/prisma/client"

const prisma = new PrismaClient()

const VENUES_DATA = [
  {
    name: "Золотая Империя",
    slug: "zolotaya-imperiya",
    description:
      "Один из самых известных банкетных залов Махачкалы. Роскошный интерьер в восточном стиле, вместимость до 800 гостей. Собственная кухня с опытными поварами, специализирующимися на дагестанской и европейской кухне. Просторная парковка, удобное расположение в центре города.",
    address: "ул. Богатырёва, 12",
    district: "Советский",
    latitude: 42.9746,
    longitude: 47.5074,
    capacityMin: 200,
    capacityMax: 800,
    pricePerPerson: 1500,
    hasHalalKitchen: true,
    allowOwnCook: false,
    hasPrayerRoom: true,
    hasSeparateHalls: true,
    hasStage: true,
    hasProjector: true,
    hasParking: true,
    hasSoundSystem: true,
    hasWelcomeZone: true,
    hasOutdoorArea: false,
    cuisineTypes: ["дагестанская", "европейская"],
    isVerified: true,
    isPremium: true,
  },
  {
    name: "Валас",
    slug: "valas",
    description:
      "Современный банкетный комплекс на проспекте Амет-Хана Султана. Два просторных зала с панорамными окнами и современным дизайном. Идеально подходит для свадеб и корпоративных мероприятий. Профессиональная команда поваров и официантов.",
    address: "просп. Амет-Хана Султана, 28",
    district: "Кировский",
    latitude: 42.9632,
    longitude: 47.5155,
    capacityMin: 150,
    capacityMax: 500,
    pricePerPerson: 1200,
    hasHalalKitchen: true,
    allowOwnCook: true,
    hasPrayerRoom: false,
    hasSeparateHalls: false,
    hasStage: true,
    hasProjector: true,
    hasParking: true,
    hasSoundSystem: true,
    hasWelcomeZone: true,
    hasOutdoorArea: true,
    cuisineTypes: ["дагестанская", "европейская", "турецкая"],
    isVerified: true,
    isPremium: false,
  },
  {
    name: "Шамхал",
    slug: "shamkhal",
    description:
      "Уютный банкетный зал в Ленинкенте с видом на горы. Традиционный дагестанский стиль оформления. Большая территория с летней площадкой и мангальной зоной. Можно привезти своего повара — зал предоставляет профессиональную кухню со всем оборудованием.",
    address: "с. Ленинкент, ул. Центральная, 5",
    district: "Ленинкент",
    latitude: 42.9981,
    longitude: 47.4722,
    capacityMin: 100,
    capacityMax: 400,
    pricePerPerson: 800,
    hasHalalKitchen: true,
    allowOwnCook: true,
    hasPrayerRoom: true,
    hasSeparateHalls: true,
    hasStage: true,
    hasProjector: false,
    hasParking: true,
    hasSoundSystem: true,
    hasWelcomeZone: false,
    hasOutdoorArea: true,
    cuisineTypes: ["дагестанская"],
    isVerified: true,
    isPremium: false,
  },
  {
    name: "Парадиз",
    slug: "paradiz",
    description:
      "Элегантный банкетный зал в европейском стиле. Высокие потолки, хрустальные люстры, современная аудиосистема. Шеф-повар с опытом работы в лучших ресторанах Москвы и Дагестана. Идеально для тех, кто ценит изысканность и комфорт.",
    address: "ул. Абу Даги, 45",
    district: "Советский",
    latitude: 42.9791,
    longitude: 47.5012,
    capacityMin: 100,
    capacityMax: 350,
    pricePerPerson: 2000,
    hasHalalKitchen: true,
    allowOwnCook: false,
    hasPrayerRoom: false,
    hasSeparateHalls: false,
    hasStage: true,
    hasProjector: true,
    hasParking: true,
    hasSoundSystem: true,
    hasWelcomeZone: true,
    hasOutdoorArea: false,
    cuisineTypes: ["дагестанская", "европейская", "авторская"],
    isVerified: true,
    isPremium: true,
  },
  {
    name: "Версаль",
    slug: "versal",
    description:
      "Классический банкетный зал с роскошным интерьером. Лепнина, мраморные колонны, великолепная сцена для артистов. Огромная вместимость — до 1000 гостей. Собственная кондитерская для свадебных тортов. Парковка на 200 автомобилей.",
    address: "ул. Бейбулатова, 10",
    district: "Ленинский",
    latitude: 42.9655,
    longitude: 47.4901,
    capacityMin: 300,
    capacityMax: 1000,
    pricePerPerson: 1800,
    hasHalalKitchen: true,
    allowOwnCook: false,
    hasPrayerRoom: true,
    hasSeparateHalls: true,
    hasStage: true,
    hasProjector: true,
    hasParking: true,
    hasSoundSystem: true,
    hasWelcomeZone: true,
    hasOutdoorArea: true,
    cuisineTypes: ["дагестанская", "европейская", "турецкая"],
    isVerified: true,
    isPremium: false,
  },
]

const PLACEHOLDER_PHOTOS = [
  "/images/placeholder/venue-1.jpg",
  "/images/placeholder/venue-2.jpg",
  "/images/placeholder/venue-3.jpg",
  "/images/placeholder/venue-4.jpg",
  "/images/placeholder/venue-5.jpg",
]

const REVIEW_TEXTS = [
  "Прекрасный зал! Провели свадьбу на 400 гостей, все остались довольны. Кухня выше всяких похвал, обслуживание на высшем уровне.",
  "Хороший зал, но парковка могла бы быть побольше. В остальном всё отлично — вкусная еда, красивый интерьер.",
  "Очень рекомендую! Отмечали помолвку, всё было организовано идеально. Персонал внимательный и вежливый.",
]

const REVIEWER_NAMES = [
  "Магомед",
  "Патимат",
  "Ахмед",
  "Хадижат",
  "Расул",
  "Аминат",
]

async function main() {
  console.info("Seeding database...")

  const owner = await prisma.user.upsert({
    where: { phone: "+79280000001" },
    update: {},
    create: {
      phone: "+79280000001",
      name: "Магомед Исмаилов",
      role: "OWNER",
    },
  })

  const clients = await Promise.all(
    REVIEWER_NAMES.map((name, i) =>
      prisma.user.upsert({
        where: { phone: `+7928000100${i}` },
        update: {},
        create: {
          phone: `+7928000100${i}`,
          name,
          role: "CLIENT",
        },
      })
    )
  )

  for (const venueData of VENUES_DATA) {
    const venue = await prisma.venue.upsert({
      where: { slug: venueData.slug },
      update: {},
      create: {
        ...venueData,
        ownerId: owner.id,
        allowOwnFruits: true,
      },
    })

    const existingPhotos = await prisma.venuePhoto.count({
      where: { venueId: venue.id },
    })

    if (existingPhotos === 0) {
      await prisma.venuePhoto.createMany({
        data: PLACEHOLDER_PHOTOS.map((url, index) => ({
          venueId: venue.id,
          url,
          key: `placeholder/${venue.slug}-${index}`,
          order: index,
          isMain: index === 0,
        })),
      })
    }

    const existingReviews = await prisma.review.count({
      where: { venueId: venue.id },
    })

    if (existingReviews === 0) {
      const reviewCount = Math.min(3, clients.length)
      for (let i = 0; i < reviewCount; i++) {
        const rating = 4 + Math.round(Math.random())
        await prisma.review.create({
          data: {
            venueId: venue.id,
            authorId: clients[i].id,
            rating,
            text: REVIEW_TEXTS[i % REVIEW_TEXTS.length],
            foodRating: 3 + Math.floor(Math.random() * 3),
            serviceRating: 3 + Math.floor(Math.random() * 3),
            ambienceRating: 4 + Math.round(Math.random()),
            isModerated: true,
          },
        })
      }

      const reviews = await prisma.review.findMany({
        where: { venueId: venue.id },
        select: { rating: true },
      })

      const avg =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

      await prisma.venue.update({
        where: { id: venue.id },
        data: {
          averageRating: Math.round(avg * 10) / 10,
          reviewCount: reviews.length,
          viewCount: 100 + Math.floor(Math.random() * 500),
        },
      })
    }
  }

  console.info("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
