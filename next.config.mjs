const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Cloudflare Worker globals are validated by the primary Vinext build.
  // Vercel's compatibility build does not load those runtime declarations.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
