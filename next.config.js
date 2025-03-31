/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["raw.githubusercontent.com"],
  },

  // Add rewrites to proxy API requests to the Flask backend
  async rewrites() {
    return [
      {
        source: "/api/chat", // The API route in your Next.js frontend
        destination: [
          "http://localhost:8000/api/chat",
          "https://dsa-snowy.vercel.app/api/chat",
          "https://dsa-harrison-ezes-projects.vercel.app/api/chat",
          "https://dsa-git-main-harrison-ezes-projects.vercel.app/api/chat",
        ],
      },
    ];
  },
};

module.exports = nextConfig;
