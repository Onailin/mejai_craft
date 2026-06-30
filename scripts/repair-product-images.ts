import { repairAllJewelryProductImages } from "../src/lib/repair-content-images";

async function main() {
  await repairAllJewelryProductImages();
  console.log("Jewelry product images repaired.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
