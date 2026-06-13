/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trustseal.enamad.ir',
        pathname: '/logo.aspx**',
      },
      {
        protocol: 'https',
        hostname: 's3.ir-thr-at1.arvanstorage.ir',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
