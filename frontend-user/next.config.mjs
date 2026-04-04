/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // Empêche Next.js de remonter à un package-lock.json parent sur le VPS
  // (évite l'erreur "inferred workspace root" sur un monorepo détecté à tort)
  turbopack: {
    root: process.cwd(),
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ]
  },

  // Désactive le badge Vercel / V0 (le rond noir "N")
  vercelToolbar: {
    enable: false,
  },

  experimental: {
    reactCompiler: false,
    turbotrace: {
      logTracing: false,
      memoryBufferSize: 0,
    },
  },
};

export default nextConfig;
