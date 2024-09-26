import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
 
const config: Config = withUt({
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
      fontFamily: {
        gupter: ["Gupter", "serif"],
        inter: ["Inter", "sans-serif"],
        pt_serif: ["PT Serif", "serif"]
      },
    },
  },
  plugins: [require('@tailwindcss/typography')]
});
export default config;
