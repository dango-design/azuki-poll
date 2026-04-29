import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
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
