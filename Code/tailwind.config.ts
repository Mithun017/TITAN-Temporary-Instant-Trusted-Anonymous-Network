import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        titan: {
          bg: "#1a1a1a",
          canvas: "#121212",
          surface: "#242424",
          raised: "#2a2a2a",
          hover: "#323232",
          border: "#333333",
          borderFocus: "#4a4a4a",
          text: "#eff1f3",
          muted: "#9da3af",
          accent: "#ffa116",      // LeetCode orange primary
          accentGreen: "#2cbb5d", // LeetCode green (Easy / Connected)
          accentAmber: "#ffc01e", // LeetCode amber (Medium / Reconnecting)
          accentRed: "#ff375f",   // LeetCode red (Hard / Error / Disconnected)
          codeBg: "#1e1e1e",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Cascadia Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;

