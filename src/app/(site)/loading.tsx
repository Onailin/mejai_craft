export default function SiteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center pt-24">
      <div className="h-9 w-9 animate-pulse rounded-full bg-stone-200" aria-hidden />
      <span className="sr-only">กำลังโหลด</span>
    </div>
  );
}
