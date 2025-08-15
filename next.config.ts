import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
