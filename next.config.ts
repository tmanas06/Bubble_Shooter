import type { NextConfig } from "next";

// List of allowed domains for images and API requests
const allowedDomains = [
  'loca.lt',
  '*.loca.lt',
  'i.imgur.com',
  'res.cloudinary.com',
  'pbs.twimg.com',
  'abs.twimg.com',
  'api.neynar.com',
  '*.farcaster.xyz',
  'farcaster.xyz',
];

const nextConfig: NextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Configure images
  images: {
    domains: allowedDomains,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Enable CORS for development and production
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
            value: 'Content-Type, Authorization, x-neynar-version',
          },
        ],
      },
    ];
  },
  
  // Enable experimental features
  experimental: {
    serverActions: {
      // Allow server actions from all origins for Farcaster
      allowedOrigins: ['*']
    },
    // Enable server components
    serverComponentsExternalPackages: ['@neynar/nodejs-sdk', 'pino'],
  },
  
  // Configure server external packages
  serverExternalPackages: ['pino', '@neynar/nodejs-sdk'],
  
  // Environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_NEYNAR_CLIENT_ID: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID,
    NEXT_PUBLIC_NEYNAR_CLIENT_SECRET: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-vercel-url.vercel.app',
  },
  
  // Enable output file tracing for better performance
  output: 'standalone',
  
  // Configure webpack
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    if (!isServer) {
      // Don't include certain packages in the client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },
  
  // Enable rewrites for Farcaster frame endpoints
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
