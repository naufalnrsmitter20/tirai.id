/** @type {import('next').NextConfig} */
const nextConfig = {
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ['cloudinary'],
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
