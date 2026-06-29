import { prisma } from "@/lib/prisma";
import { createLuckyStone, deleteLuckyStone, updateLuckyStone } from "@/actions/admin";

export default async function AdminLuckyStonesPage() {
  const stones = await prisma.luckyStone.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-stone-800">Lucky Stones</h1>

      <form action={createLuckyStone} className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-medium">เพิ่มหินนำโชค</h2>
        <input name="name" placeholder="ชื่อ" required className="rounded-lg border px-3 py-2" />
        <input name="meaning" placeholder="ความหมาย" className="rounded-lg border px-3 py-2" />
        <textarea name="description" placeholder="รายละเอียด" className="md:col-span-2 rounded-lg border px-3 py-2" rows={3} />
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required className="md:col-span-2" />
        <button type="submit" className="rounded-full bg-stone-900 px-5 py-2 text-sm text-white">บันทึก</button>
      </form>

      <div className="space-y-4">
        {stones.map((stone) => (
          <form key={stone.id} action={updateLuckyStone.bind(null, stone.id)} className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-2">
            <div className="md:col-span-2 flex items-center gap-4">
              <img src={stone.imageUrl} alt={stone.name} className="h-20 w-20 rounded-lg object-cover" />
              <p className="font-medium">{stone.name}</p>
            </div>
            <input name="name" defaultValue={stone.name} required className="rounded-lg border px-3 py-2" />
            <input name="meaning" defaultValue={stone.meaning ?? ""} className="rounded-lg border px-3 py-2" />
            <textarea name="description" defaultValue={stone.description ?? ""} className="md:col-span-2 rounded-lg border px-3 py-2" rows={2} />
            <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="md:col-span-2" />
            <div className="flex gap-2">
              <button type="submit" className="rounded-full bg-stone-900 px-5 py-2 text-sm text-white">อัปเดต</button>
              <button formAction={deleteLuckyStone.bind(null, stone.id)} className="rounded-full border border-red-300 px-5 py-2 text-sm text-red-600">ลบ</button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
