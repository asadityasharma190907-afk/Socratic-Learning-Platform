/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Required for GitHub Pages deployment if it's hosted in a subpath,
  // but since it's an offline-first PWA and we might host on root or subpath,
  // we'll leave it default and let actions/configure-pages handle basePath if needed.
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
