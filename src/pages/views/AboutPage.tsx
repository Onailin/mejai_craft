import { AboutSection } from "../../components/AboutSection";
import type { PageContent } from "../types";

export function AboutPage({ page }: { page: PageContent }) {
  return <AboutSection page={page} />;
}
