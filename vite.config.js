import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
 server: {
    allowedHosts: ['ffd863a926fa.ngrok-free.app'],
  },
  plugins: [react(), tailwindcss()],
});
