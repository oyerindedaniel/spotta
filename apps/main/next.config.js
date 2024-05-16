/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@repo/api",
    "@repo/trpc",
    "@repo/db",
    "@repo/ui",
    "@repo/hooks",
    "@repo/trpc",
    "@repo/i18n",
    "@repo/validations",
    "@repo/utils",
  ],
};
