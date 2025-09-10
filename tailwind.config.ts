import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      gridAutoRows: {
        'widget': '120px'
      }
    },
  },
  plugins: [],
};
export default config;
