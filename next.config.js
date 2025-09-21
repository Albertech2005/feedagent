/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows production builds even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This allows production builds even with TypeScript errors
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig