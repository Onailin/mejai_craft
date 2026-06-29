import {
  LayoutDashboard,
  CalendarDays,
  Gem,
  Sparkles,
  Tags,
  ShoppingBag,
  Hammer,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { AdminNavIcon } from "./admin-nav";

export const adminNavIconMap: Record<AdminNavIcon, LucideIcon> = {
  dashboard: LayoutDashboard,
  calendar: CalendarDays,
  gem: Gem,
  sparkles: Sparkles,
  tags: Tags,
  "shopping-bag": ShoppingBag,
  hammer: Hammer,
  settings: Settings,
};
