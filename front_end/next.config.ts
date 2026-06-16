/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',

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
    // تنظیمات جدید برای بهبود performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60, // کش کردن تصاویر برای 60 ثانیه
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // کاهش کیفیت برای سرعت بیشتر (اختیاری)
    // کیفیت پیش‌فرض 75 است
  },

  // تنظیمات timeout برای page generation
  staticPageGenerationTimeout: 120, // 120 ثانیه

  // تنظیمات برای بهبود performance
  swcMinify: true,
  compress: true,

  // تنظیمات experimental (اختیاری)
  experimental: {
    optimizeCss: true, // بهینه‌سازی CSS
    optimizePackageImports: ['lodash', 'react-icons'],
  },

  // تنظیمات headers (برای کش کردن)
  async headers() {
    return [
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;