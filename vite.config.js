import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // Configure the dev server
  server: {
    // This makes the server accessible on your local network
    host: true,
  },
  plugins: [react(), tailwindcss()],
});
