/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070B14",
        primary: "#4F8CFF",
        accent: "#7C4DFF",
        success: "#22C55E",
        text: "#F8FAFC",
        muted: "#94A3B8",
      },
    },
  },
  plugins: [],
};
