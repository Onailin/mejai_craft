import { AboutOverviewSection } from "../../components/AboutOverviewSection";
import type { PageContent } from "../types";

export function AboutPage({ page }: { page: PageContent }) {
  return <AboutOverviewSection page={page} />;
}
