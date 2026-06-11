import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    target: "es2018",
  },
  server: {
    // host: "127.0.0.1",
    port: 25565,
    strictPort: true,
  },
});
