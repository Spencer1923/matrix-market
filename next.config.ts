import type { NextConfig } from "next";

// Pull the hostname out of your Supabase URL so Next.js allows images from it
const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

const nextConfig: NextConfig = {
  images: {
    // Next.js only optimizes images from hosts you list here
    remotePatterns: [{ protocol: "https", hostname: supabaseHost }],
  },
  experimental: {
    // Form submissions are capped at 1MB by default, too small for photos
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;