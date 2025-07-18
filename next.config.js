
const withPWAInit = require("@ducanh2912/next-pwa");

const withPWA = withPWAInit.default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/_offline',
  },
  runtimeCaching: [
    {
      urlPattern: ({ url }) => {
        return url.pathname.startsWith('/dashboard');
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'dashboard-pages',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https?:\/\/.*\.(?:png|jpg|jpeg|svg|gif|ico|webp|avif)/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
     {
      urlPattern: /^https?:\/\/fonts.googleapis.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /^https?:\/\/fonts.gstatic.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname === '/',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'start-page',
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 24 * 60 * 60, // 1 Day
        },
      },
    },
  ],
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

module.exports = withPWA(nextConfig);
