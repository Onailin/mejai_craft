import Image from "next/image";
import { SITE_BRAND_NAME, SITE_LOGO_PATH } from "@/lib/brand";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  sm: "h-10 w-auto",
  md: "h-16 w-auto sm:h-20",
  lg: "h-24 w-auto sm:h-28",
  xl: "h-36 w-auto sm:h-44",
} as const;

export function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  return (
    <Image
      src={SITE_LOGO_PATH}
      alt={SITE_BRAND_NAME}
      width={220}
      height={64}
      className={`object-contain ${sizeClasses[size]} ${className}`}
      priority
    />
  );
}
