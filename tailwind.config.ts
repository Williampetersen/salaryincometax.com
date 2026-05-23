import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fbf7ef",
        ink: "#122029",
        coral: "#f56b4f",
        sand: "#f1d4ad",
        moss: "#315f4c",
        sky: "#9ac6d9",
      },
      boxShadow: {
        card: "0 24px 60px rgba(18, 32, 41, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "mesh-warm":
          "radial-gradient(circle at 10% 20%, rgba(245, 107, 79, 0.22), transparent 30%), radial-gradient(circle at 80% 15%, rgba(154, 198, 217, 0.24), transparent 28%), radial-gradient(circle at 75% 75%, rgba(49, 95, 76, 0.16), transparent 26%)",
      },
    },
  },
  plugins: [],
};

export default config;
