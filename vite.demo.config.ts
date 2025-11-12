import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "./",
  build: {
    outDir: "docs", // GitHub Pages usa 'docs' por defecto
    emptyOutDir: true,
  },
  base: "/lane-scheduler-react/", // Cambia esto por el nombre real de tu repo
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
