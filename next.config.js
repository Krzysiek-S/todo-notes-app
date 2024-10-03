/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'standalone',
    experimental: {
        middleware: true,
    }
};

module.exports = nextConfig;
