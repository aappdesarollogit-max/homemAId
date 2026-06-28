export type PWADisplayMode = "standalone" | "browser" | "fullscreen" | "minimal-ui" | "unknown";

export function isIOS() {
  if (typeof window === "undefined") return false;

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function isStandaloneMode() {
  if (typeof window === "undefined") return false;

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean;
  };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function canInstallPWA() {
  if (typeof window === "undefined") return false;

  return !isStandaloneMode() && "serviceWorker" in window.navigator;
}

export function getPWADisplayMode(): PWADisplayMode {
  if (typeof window === "undefined") return "unknown";

  const displayModes: PWADisplayMode[] = ["fullscreen", "standalone", "minimal-ui", "browser"];
  return displayModes.find((mode) => window.matchMedia(`(display-mode: ${mode})`).matches) ?? "unknown";
}
