// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        bg: 'oklch(100% 0 0)', // pure white
        surface: 'oklch(98% 0.005 70)',
        fg: 'oklch(20% 0.02 70)',
        muted: 'oklch(60% 0.01 70)',
        border: 'oklch(90% 0.01 70)',
        accent: 'oklch(65% 0.20 45)',
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      fontFamily: {
        display: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['SF Pro Text', '-apple-system', 'BlinkMacSystemFile', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
