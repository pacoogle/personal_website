import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#121212",
        ink: {
          DEFAULT: "#121212",
        },
        accent: {
          DEFAULT: "#4F5FD7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: [
          "var(--font-outfit)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
