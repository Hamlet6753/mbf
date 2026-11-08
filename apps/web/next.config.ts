import type { NextConfig } from "next";
import { validateEnvironment } from "./environment.mjs";

const environment = validateEnvironment(process.env);
const nextConfig: NextConfig = {
  distDir: environment === "prod" ? ".next-prod" : ".next-dev",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};
export default nextConfig;
