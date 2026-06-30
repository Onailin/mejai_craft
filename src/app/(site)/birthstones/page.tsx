import type { Metadata } from "next";
import { BirthstonesView } from "@/components/views/BirthstonesView";
import { loadBirthstones } from "@/lib/load-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "พลอยประจำวันเกิด",
  description: "พลอยประจำวันเกิดแต่ละวัน — คู่มืออัญมณีประจำวันจาก Mejai Crafts",
};

export default async function BirthstonesPage() {
  const birthstones = await loadBirthstones("th");
  return <BirthstonesView initialBirthstones={birthstones} />;
}
