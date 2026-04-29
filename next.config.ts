import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  // Empty turbopack config silences Next 16's "webpack config without
  // turbopack config" warning. Dev uses Turbopack; production uses
  // webpack via `next build --webpack` for the hash-naming control below.
  turbopack: {},
  // Hex-only chunk hashes (0-9, a-f) so the random filename can't
  // contain substrings ad blockers pattern-match (e.g. "xxx").
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.output.hashFunction = "sha256";
      config.output.hashDigest = "hex";
      config.output.hashDigestLength = 16;
    }
    return config;
  },
};

export default nextConfig;
