import { AuthProvider } from "@/components/providers/AuthProvider";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
