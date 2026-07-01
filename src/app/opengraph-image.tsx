import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_BRAND_NAME, SITE_DESCRIPTION } from "@/lib/brand";

export const alt = SITE_BRAND_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoData = await readFile(join(process.cwd(), "public/logo/logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #fafaf9 0%, #f5f1eb 45%, #efe7dc 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 64px",
            borderRadius: 32,
            background: "rgba(255,255,255,0.82)",
            boxShadow: "0 24px 80px rgba(28,25,23,0.12)",
          }}
        >
          <img src={logoSrc} width={180} height={320} alt="" />
          <div
            style={{
              marginTop: 28,
              fontSize: 52,
              fontWeight: 600,
              color: "#1c1917",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE_BRAND_NAME}
          </div>
          <div
            style={{
              marginTop: 16,
              maxWidth: 760,
              textAlign: "center",
              fontSize: 24,
              lineHeight: 1.5,
              color: "#57534e",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
