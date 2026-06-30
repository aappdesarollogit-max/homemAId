export const featureFlags = {
  parserV2: true,
  eventDrivenWelcomeChecklist: true,
  onboardingContextHelp: true,
  qualityDashboard: true,
  externalAi: false,
  supabase: false,
  ocr: false,
};

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag) {
  return featureFlags[flag];
}
