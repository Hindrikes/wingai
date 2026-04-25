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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // WingAI Sand design tokens
        ink: {
          50: "#F5F0EB",
          100: "#EDE4D9",
          200: "#D9CEBC",
          300: "#BFB0A0",
          400: "#A49182",
          500: "#8C7B6B",
          600: "#6B5D52",
          700: "#3D3630",
          800: "#2A2420",
          900: "#1C1916",
          950: "#100E0C",
        },
        terra: {
          50: "#FDF2EE",
          100: "#FAE3D9",
          200: "#F3C4AF",
          300: "#E99E80",
          400: "#D97650",
          500: "#C4532A",
          600: "#A84522",
          700: "#8A371B",
          800: "#6B2A14",
          900: "#4A1D0E",
        },
        forest: {
          50: "#EDF4EE",
          100: "#D6E8D8",
          200: "#AECFB2",
          300: "#80B488",
          400: "#559762",
          500: "#3D7A48",
          600: "#2D4A32",
          700: "#203625",
          800: "#142218",
          900: "#0A110C",
        },
        sand: {
          50: "#FDFAF7",
          100: "#FAF6F0",
          200: "#F5EFE6",
          300: "#EDE4D6",
          400: "#D9CEBC",
          500: "#C5B8A6",
          600: "#B09E8E",
          700: "#8C7B6B",
          800: "#6B5A4A",
          900: "#4A3D30",
        },
        // Keep for backwards compat — mapped to new palette
        wing: {
          50: "#F5EFE6",
          100: "#EDE4D6",
          200: "#D9CEBC",
          300: "#BFB0A0",
          400: "#A49182",
          500: "#8C7B6B",
          600: "#C4532A",
          700: "#A84522",
          800: "#2D4A32",
          900: "#1C1916",
          950: "#100E0C",
        },
        coral: {
          400: "#E97050",
          500: "#C4532A",
        },
        sage: {
          400: "#80B488",
          500: "#2D4A32",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-instrument)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
