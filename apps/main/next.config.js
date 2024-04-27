/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@repo/api", "@repo/trpc", "@repo/db", "@repo/ui"],
};
