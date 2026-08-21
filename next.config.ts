import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
    // Forwards browser errors to your terminal where Codex/Copilot can ingest them
    browserToTerminal: true,
  },
};

export default nextConfig;
