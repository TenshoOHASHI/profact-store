import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },

  define: {
    "global.URL": "URL",
  },
});
