const withPWA = require('next-pwa')({
    dest: 'public',  // Określa, gdzie zapisywać pliki PWA, np. service worker
    disable: process.env.NODE_ENV === 'development',  // Wyłącza PWA w trybie deweloperskim
  });
  
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    //output: 'standalone',
    experimental: {
      middleware: true,
    },
  };
  
  module.exports = withPWA(nextConfig);
  