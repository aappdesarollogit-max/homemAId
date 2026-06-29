export const releaseInfo = {
  appVersion: "0.1.0-alpha.1",
  releaseName: "Closed Alpha",
  buildDate: process.env.NEXT_PUBLIC_BUILD_DATE ?? "2026-06-29",
  gitCommit:
    process.env.NEXT_PUBLIC_GIT_COMMIT ??
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ??
    null,
};

export function getReleaseLabel() {
  return `${releaseInfo.releaseName} ${releaseInfo.appVersion}`;
}
