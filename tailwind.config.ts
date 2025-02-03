import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bru1: "var(--bru1)",
        bru2: "var(--bru2)",
        bru3: "var(--bru3)",
        bru4: "var(--bru4)",
        bru5: "var(--bru5)",
      },
    },
  },
  plugins: [],
};
export default config;
