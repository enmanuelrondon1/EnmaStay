// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL_DIRECT });
const prisma = new PrismaClient({ adapter });


type SeedProperty = {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  parkings: number;
  image: string;
};

const properties: SeedProperty[] = [
  {
    title: "Tranquil Terrace Tranquility Haven",
    description:
      "Villa con dos helipuertos privados y vistas panoramicas al mar desde casi cada habitacion. Los interiores amplios combinan piezas de arte contemporaneo con acabados en marmol, ideal para quien busca privacidad absoluta sin sacrificar acceso rapido a la ciudad.",
    price: 3240,
    address: "Street 1",
    city: "Chicago",
    country: "US",
    latitude: 41.8781,
    longitude: -87.6298,
    bedrooms: 4,
    bathrooms: 3,
    parkings: 2,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Oceanview Oasis Serenity Escape",
    description:
      "A pie de playa, esta propiedad prioriza la luz natural: ventanales de piso a techo en cada dormitorio y una terraza que se funde con la arena. Cocina abierta pensada para recibir invitados mientras se disfruta del atardecer.",
    price: 4240,
    address: "Street 2",
    city: "Multan",
    country: "Pakistan",
    latitude: 30.1575,
    longitude: 71.5249,
    bedrooms: 3,
    bathrooms: 2,
    parkings: 1,
    image:
      "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Sunrise Sanctuary Solace Retreat",
    description:
      "Casa de campo restaurada que conserva vigas de madera originales del siglo pasado, combinadas con instalaciones modernas de climatizacion. Jardin privado con huerto y zona de fogata para las noches frescas.",
    price: 3240,
    address: "Street 3",
    city: "Los Angeles", // Nota: original decía "California" (estado, no ciudad)
    country: "US",
    latitude: 34.0522,
    longitude: -118.2437,
    bedrooms: 2,
    bathrooms: 1,
    parkings: 1,
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Urban Elegance Sophistication Haven",
    description:
      "Penthouse en pleno centro con vistas de 360 grados a la ciudad. Diseno minimalista con automatizacion completa: iluminacion, cortinas y climatizacion controlables desde una sola app. A pasos de restaurantes y vida nocturna.",
    price: 6240,
    address: "Street 4",
    city: "Karachi",
    country: "Pakistan",
    latitude: 24.8607,
    longitude: 67.0011,
    bedrooms: 3,
    bathrooms: 3,
    parkings: 2,
    image:
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Rustic Retreat Charm Cottage",
    description:
      "Cabana rustica en la montana, perfecta para escapadas de fin de semana. Chimenea de piedra natural, porche con hamacas y senderos privados de caminata a pocos metros de la puerta principal.",
    price: 7050,
    address: "Street 5",
    city: "San Diego",
    country: "US",
    latitude: 32.7157,
    longitude: -117.1611,
    bedrooms: 5,
    bathrooms: 4,
    parkings: 3,
    image:
      "https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Garden Grove Oasis Retreat Haven",
    description:
      "Residencia familiar rodeada de jardines botanicos privados, con alberca climatizada y area de juegos para ninos. Zona tranquila, ideal para quienes buscan espacio sin alejarse de escuelas y servicios.",
    price: 2000,
    address: "Street 6",
    city: "Phoenix",
    country: "US",
    latitude: 33.4484,
    longitude: -112.074,
    bedrooms: 3,
    bathrooms: 2,
    parkings: 2,
    image:
      "https://plus.unsplash.com/premium_photo-1709684162107-360d24a6079f?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Mountain View Majestic Manor",
    description:
      "Mansion de altura con vistas directas a la cordillera. Sala de cine privada, bodega climatizada para vinos y gimnasio equipado. Construida con materiales locales que se integran al paisaje natural.",
    price: 2500,
    address: "Street 7",
    city: "Lahore",
    country: "Pakistan",
    latitude: 31.5204,
    longitude: 74.3587,
    bedrooms: 6,
    bathrooms: 5,
    parkings: 4,
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Seaside Serenity Coastal Getaway",
    description:
      "Departamento frente al mar con muelle privado para embarcaciones pequenas. Balcon corrido en todos los ambientes y acceso directo a una playa de arena blanca poco concurrida.",
    price: 2950,
    address: "Street 8",
    city: "Lahore",
    country: "Pakistan",
    latitude: 31.5304,
    longitude: 74.3487,
    bedrooms: 2,
    bathrooms: 2,
    parkings: 1,
    image:
      "https://images.unsplash.com/photo-1592595896616-c37162298647?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Riverside Retreat Tranquil Oasis",
    description:
      "Casa junto al rio con muelle propio para pesca y kayak. Terraza de madera elevada sobre el agua, perfecta para desayunar escuchando la corriente. Ambiente silencioso, lejos del ruido urbano.",
    price: 3250,
    address: "Street 9",
    city: "Chicago",
    country: "US",
    latitude: 41.8881,
    longitude: -87.6198,
    bedrooms: 3,
    bathrooms: 2,
    parkings: 1,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Luxury Villa Paradise",
    description:
      "Villa de estilo mediterraneo con alberca infinita que se confunde con el horizonte. Suite principal con vestidor doble y jacuzzi privado en la terraza superior. Servicio de jardineria y mantenimiento incluido.",
    price: 2500,
    address: "Street 10",
    city: "San Diego",
    country: "US",
    latitude: 32.7257,
    longitude: -117.1711,
    bedrooms: 4,
    bathrooms: 3,
    parkings: 2,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
  },
];

async function main() {
  console.log("Limpiando datos existentes...");
  await prisma.booking.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();

  console.log("Creando propiedades...");
  for (const [index, prop] of properties.entries()) {
    const { image, ...data } = prop;

    const created = await prisma.property.create({
      data: {
        ...data,
        images: {
          create: [{ url: image, order: 0 }],
        },
      },
    });

    // Rellenar la columna geography(Point, 4326) vía raw SQL,
    // ya que Prisma no puede escribir tipos Unsupported directamente.
    await prisma.$executeRaw`
      UPDATE "Property"
      SET "location" = ST_SetSRID(ST_MakePoint(${prop.longitude}, ${prop.latitude}), 4326)::geography
      WHERE "id" = ${created.id}
    `;

    console.log(`  [${index + 1}/10] ${created.title}`);
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });