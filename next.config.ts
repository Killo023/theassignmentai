import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "www.theassignmentai.com", "theassignmentai.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.theassignmentai.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'theassignmentai.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Add this to bypass image optimization issues
  },
  // Add cache-busting headers
  async headers() {
    return [
      {
        source: '/dashboard/new',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  // Disable static optimization for dynamic content
  experimental: {
    optimizeCss: false,
  },
  // Force rebuild - Enhanced Assignment Form Update v2.0
  generateBuildId: async () => {
    return 'enhanced-assignment-form-v2-' + Date.now();
  },
};

export default nextConfig; 