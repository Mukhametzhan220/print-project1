import type { NextConfig } from "next";

// Workaround for Node.js versions that expose an incomplete global localStorage
if (typeof globalThis !== "undefined" && globalThis.localStorage && !globalThis.localStorage.getItem) {
  delete (globalThis as any).localStorage;
}

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
