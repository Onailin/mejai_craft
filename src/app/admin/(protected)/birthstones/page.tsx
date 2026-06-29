import { clearBirthstoneDayImage, uploadBirthstoneDayImage } from "@/actions/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dayOptions = [
  "วันอาทิตย์",
  "วันจันทร์",
  "วันอังคาร",
  "วันพุธ",
  "วันพฤหัสบดี",
  "วันศุกร์",
  "วันเสาร์",
];

export default async function AdminBirthstonesPage() {
  const stones = await prisma.birthstone.findMany({ orderBy: { sortOrder: "asc" } });
  const stoneByDay = new Map(stones.map((stone) => [stone.month, stone]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-stone-900">พลอยประจำวันเกิด</h1>
        <p className="mt-2 text-sm text-stone-500">
          อัปโหลดรูปสำหรับแต่ละวันเกิด รูปที่อัปโหลดแล้วเท่านั้นจะแสดงบนหน้า Home
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dayOptions.map((day) => {
          const stone = stoneByDay.get(day);

          return (
            <form
              key={day}
              action={uploadBirthstoneDayImage.bind(null, day)}
              className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-stone-900">{day}</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    stone?.imageUrl
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {stone?.imageUrl ? "มีรูปแล้ว" : "ยังไม่มีรูป"}
                </span>
              </div>

              {stone?.imageUrl ? (
                <img src={stone.imageUrl} alt={day} className="aspect-[4/5] w-full rounded-xl object-cover" />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-400">
                  อัปโหลดรูปจากมือถือ
                </div>
              )}

              <div className="space-y-3">
                <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="w-full text-sm" />
                <div className="flex flex-wrap gap-2">
                  <button type="submit" className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white">
                    {stone?.imageUrl ? "เปลี่ยนรูป" : "อัปโหลดรูป"}
                  </button>
                  {stone?.imageUrl ? (
                    <button
                      formAction={clearBirthstoneDayImage.bind(null, day)}
                      className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-600"
                    >
                      ลบรูป
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
