/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http",  hostname: "localhost" },
      { protocol: "https", hostname: "api.movie-in-the-park.com" },
      { protocol: "https", hostname: "*.render.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Force UTF-8 à niveau HTTP pour éviter tout conflit d'encodage côté serveur
          {
            key: "Content-Type",
            value: "text/html; charset=utf-8",
          },
          // Sécurité
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
