/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lumina: {
          bg: {
            primary: "#0A0A0F",
            secondary: "#12121A",
            card: "#1A1A24",
          },
          accent: {
            purple: "#7C6FF7",
            teal: "#4ECDC4",
            coral: "#FF6B6B",
          },
          text: {
            primary: "#FFFFFF",
            secondary: "#A0A0B0",
            muted: "#5A5A6E",
          },
          success: "#4ECDC4",
          warning: "#FFD93D",
        },
      },
      fontFamily: {
        inter: ["Inter_400Regular", "Inter_500Medium", "Inter_600SemiBold", "Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
