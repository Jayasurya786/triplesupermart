import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf3",
          100: "#d8f6e4",
          200: "#b1ebca",
          300: "#7ad8a7",
          400: "#46c184",
          500: "#2aa369",
          600: "#1f7a4a",
          700: "#185c39",
          800: "#12402a",
          900: "#0d2b1c",
        },
      },
      fontFamily: {
        display: ["Sora", "Segoe UI", "Helvetica Neue", "sans-serif"],
        body: ["Manrope", "Segoe UI", "Helvetica Neue", "sans-serif"],
      },
      boxShadow: {
        glass: "0 10px 30px rgba(18, 64, 42, 0.15)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
} satisfies Config;
