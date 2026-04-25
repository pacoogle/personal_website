import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Sottopercorso (es. /repo) se il sito è su `username.github.io/nome-repo/`. Lascia vuoto se usi un dominio in radice. */
const basePath =
  (process.env.PAGES_BASE_PATH || "").replace(/\/$/, "") || undefined;

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  outputFileTracingRoot: __dirname,
  ...(basePath
    ? { basePath, assetPrefix: process.env.PAGES_ASSET_PREFIX || basePath }
    : {}),
};

export default nextConfig;
