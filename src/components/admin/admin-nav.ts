export type AdminNavIcon =
  | "dashboard"
  | "gem"
  | "calendar"
  | "mountain"
  | "tags"
  | "shopping-bag"
  | "hammer"
  | "image"
  | "settings";

export type AdminNavItem = {
  href: string;
  label: string;
  labelTh: string;
  icon: AdminNavIcon;
  adminOnly?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", labelTh: "ภาพรวม", icon: "dashboard" },
  { href: "/admin/gems", label: "Gems", labelTh: "พลอย", icon: "gem" },
  { href: "/admin/birthstones", label: "Daily Stones", labelTh: "พลอยวันเกิด", icon: "calendar" },
  { href: "/admin/lucky-stones", label: "Lucky Stones", labelTh: "หินนำโชค", icon: "mountain" },
  { href: "/admin/jewelry/categories", label: "Categories", labelTh: "หมวดจิวเวลรี่", icon: "tags" },
  { href: "/admin/jewelry/products", label: "Products", labelTh: "สินค้า", icon: "shopping-bag" },
  { href: "/admin/workshops", label: "Workshops", labelTh: "เวิร์คชอป", icon: "hammer" },
  { href: "/admin/banners", label: "Banners", labelTh: "แบนเนอร์", icon: "image" },
  { href: "/admin/settings", label: "Settings", labelTh: "ตั้งค่า", icon: "settings", adminOnly: true },
];
