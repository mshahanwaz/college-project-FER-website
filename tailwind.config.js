/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        angry: {
          light: "#fecaca",
          dark: "#dc2626",
        },
        sad: {
          light: "#fed7aa",
          dark: "#ea580c",
        },
        surprise: {
          light: "#fef08a",
          dark: "#ca8a04",
        },
        neutral: {
          light: "#e5e7eb",
          dark: "#4b5563",
        },
        happy: {
          light: "#bbf7d0",
          dark: "#16a34a",
        },
      },
    },
  },
  plugins: [],
};
