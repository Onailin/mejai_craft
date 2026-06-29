import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        luxury: {
          espresso: "#ffffff",
          charcoal: "#e5e7eb",
          ink: "#1f2937",
          ivory: "#f8fafc",
          muted: "#6b7280",
          gold: "#9ca3af",
        },
      },
      fontFamily: {
        sans: ['"Prompt"', '"Noto Sans Thai"', "system-ui", "sans-serif"],
        serif: ['"Prompt"', '"Noto Sans Thai"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
