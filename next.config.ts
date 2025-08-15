import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable CORS for development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // Enable experimental features
  experimental: {
    serverActions: {
      // Allow server actions from localhost and localtunnel
      allowedOrigins: ['localhost:3000', '*.loca.lt']
    }
  },
  
  // Configure server external packages
  serverExternalPackages: ['pino'],
  
  // Configure image domains
  images: {
    domains: ['loca.lt', '*.loca.lt'],
  },
  async rewrites() {
    return [
      {
        source: '/_next/static/:path*',
        destination: '/_next/static/:path*',
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'cca-lite.coinbase.com',
          },
        ],
        destination: '/404',
      },
    ]
  },
};

export default nextConfig;
