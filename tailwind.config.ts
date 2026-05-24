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
        paper: "#eef6fc",
        ink: "#122029",
        coral: "#f56b4f",
        sand: "#f1d4ad",
        moss: "#315f4c",
        sky: "#7bb7d8",
      },
      boxShadow: {
        card: "0 24px 60px rgba(18, 32, 41, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "mesh-warm":
          "radial-gradient(circle at 10% 20%, rgba(54, 132, 214, 0.22), transparent 30%), radial-gradient(circle at 80% 15%, rgba(93, 184, 224, 0.24), transparent 28%), radial-gradient(circle at 75% 75%, rgba(35, 120, 176, 0.16), transparent 26%)",
      },
    },
  },
  plugins: [],
};

export default config;
