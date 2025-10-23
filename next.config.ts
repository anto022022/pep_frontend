import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript checking during builds
  },
  sassOptions: {
    additionalData: `$var: red;`,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pepagora.s3.ap-south-1.amazonaws.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "pepupload.s3.ap-southeast-1.amazonaws.com/",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "sandbox.pepagora.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4487",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.26",
        port: "4487",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.225",
        port: "4487",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "183.82.251.239",
        port: "8002",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/:locale/c/:category",
        destination: "/:locale/categories/:category",
      },
      {
        source: "/:locale/sc/:subcategory",
        destination: "/:locale/subcategories/:subcategory",
      },
      {
        source: "/:locale/pc/:productCategory",
        destination: "/:locale/productcategories/:productCategory",
      },
      {
        source: "/:locale/p/:product",
        destination: "/:locale/products/:product",
      },
      // === HTML extension hiding rewrite ===
      {
        source: "/:locale/s/:page",
        destination: "/s/:page.html",
      },
      // === Static asset rewrites for locale-prefixed requests ===
      {
        source: "/:locale/s/:path*",
        destination: "/s/:path*",
      },
      {
        source: "/:locale/css/:path*",
        destination: "/s/css/:path*",
      },
      {
        source: "/:locale/js/:path*",
        destination: "/s/js/:path*",
      },
      // === Add this new rule for direct image access ===
      {
        source: "/:locale/images/:path*",
        destination: "/s/images/:path*",
      },
      // === Add rules for component access ===
      {
        source: "/:locale/components/:path*",
        destination: "/s/components/:path*",
      },
      {
        source: "/components/:path*",
        destination: "/s/components/:path*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
