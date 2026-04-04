/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Type",
            value: "text/html; charset=utf-8",
          },
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
