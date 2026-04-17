import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants.js";

/** @type {import("next").NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY || "";
const repoName = repository.split("/")[1] || "";
const isUserOrOrgPagesRepo = repoName.endsWith(".github.io");
const shouldUseRepoBasePath =
  isGithubActions && !isUserOrOrgPagesRepo && !!repoName;

const nextConfig = {
  reactStrictMode: true,
  output: "export" as const,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: shouldUseRepoBasePath ? `/${repoName}` : "",
  assetPrefix: shouldUseRepoBasePath ? `/${repoName}/` : undefined,
};

const nextConfigFunction = async (phase: string) => {
  const shouldEnablePwa =
    !isGithubActions &&
    (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD);

  if (shouldEnablePwa) {
    const withPWA = (await import("@ducanh2912/next-pwa")).default({
      dest: "public",
      register: true,
    });
    return withPWA(nextConfig);
  }
  return nextConfig;
};

export default nextConfigFunction;
