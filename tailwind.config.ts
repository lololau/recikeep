import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ecru": '#fef1e2',
        "dk-green": "#0A6847"
      },
    },
  },
  plugins: [require('@tailwindcss/typography')]
};
export default config;
