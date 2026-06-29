import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const gem = await prisma.gem.findFirst({ select: { imageUrl: true } });
const jewelry = await prisma.jewelryProductImage.findFirst({ select: { imageUrl: true } });
const workshop = await prisma.workshopBannerImage.findFirst({ select: { imageUrl: true } });

console.log("gem:", gem?.imageUrl);
console.log("jewelry:", jewelry?.imageUrl);
console.log("workshop:", workshop?.imageUrl);

const localGems = await prisma.gem.count({ where: { imageUrl: { startsWith: "/images/" } } });
const totalGems = await prisma.gem.count();
console.log(`gems with local paths: ${localGems}/${totalGems}`);

await prisma.$disconnect();
