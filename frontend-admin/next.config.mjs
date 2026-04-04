/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http",  hostname: "localhost" },
      { protocol: "https", hostname: "api.movie-in-the-park.com" },
      { protocol: "https", hostname: "*.render.com" },
    ],
  },

  // Empêche Next.js de remonter à un package-lock.json parent sur le VPS
  turbopack: {
    root: process.cwd(),
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Ne pas forcer Content-Type ici : ça écraserait le MIME type
          // des fichiers JS/CSS servis par /_next/static et briserait le chargement
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ]
  },
}

export default nextConfig
