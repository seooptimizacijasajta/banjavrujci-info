import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#159e8c", dark: "#0f766e", light: "#7fd9c9", mint: "#5bbfa6" }
      }
    }
  },
  plugins: []
};
export default config;
