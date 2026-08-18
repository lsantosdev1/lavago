/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563EB", // Electric Blue
          hover: "#1D4ED8", // Blue Dark
          accent: "#10B981", // Emerald Green (Aberto agora / Sucesso)
          warning: "#F59E0B", // Dourado para avaliações/estrelas
          danger: "#EF4444",
        },
        surface: {
          background: "#0B0F19", // Fundo principal escuro profundo
          card: "#131B2E", // Cartões e modais
          cardHover: "#1B2640", // Hover dos cartões
          input: "#0F1629", // Inputs e caixas de busca
          border: "#1E293B", // Bordas sutis
          borderActive: "#3B82F6", // Bordas em foco
        },
        text: {
          primary: "#F8FAFC", // Títulos e destaques (Slate 50)
          secondary: "#94A3B8", // Textos auxiliares e legendas (Slate 400)
          muted: "#64748B", // Placeholder e datas (Slate 500)
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
