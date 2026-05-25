import { AboutSection } from "../../components/AboutSection";
import type { PageContent } from "../types";

export function ContactPage({ page }: { page: PageContent }) {
  return <AboutSection page={page} />;
}
