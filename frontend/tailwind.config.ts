import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#120621",
        secondary: "#170B29",
        terciary: "#1E1330",
        borderColor: "#251936",
        brandColor: "#5D00BA",
      },
      height: {
        "calc-header-screen": "calc(100vh - 90px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
