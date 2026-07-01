import {
  LayoutDashboard,
  CalendarDays,
  Gem,
  Mountain,
  Tags,
  ShoppingBag,
  Hammer,
  Image,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { AdminNavIcon } from "./admin-nav";

export const adminNavIconMap: Record<AdminNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  calendar: CalendarDays,
  gem: Gem,
  mountain: Mountain,
  tags: Tags,
  "shopping-bag": ShoppingBag,
  hammer: Hammer,
  image: Image,
  settings: Settings,
};
