import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import * as dotenv from "dotenv";

export default defineConfig(async ({ mode }) => {
  const envFile = path.resolve(".env");
  if (!fs.existsSync(envFile)) {
    throw new Error("Env file is missing");
  }

  dotenv.config({ override: true });
  const APP_SETTINGS = await import("./app_settings");

  return {
    base: "./",
    publicDir: "./public",
    server: {
      host: false,
    },
    build: {
      outDir: "./dist",
      emptyOutDir: true,
      minify: "terser",
    },
    resolve: {
      alias: {
        "~/shapes_package": path.resolve(
          __dirname,
          "./src/scripts/shapes_packages/" + APP_SETTINGS.SHAPES_PACKAGE_NAME + "/package.js"
        ),
      },
    },
    plugins: [ViteMinifyPlugin()],
    define: {
      APP_SETTINGS,
    },
  };
});
