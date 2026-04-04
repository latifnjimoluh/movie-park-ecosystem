/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
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
