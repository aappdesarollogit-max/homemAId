export function isStorageAvailable() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = "homemaid.storage.probe";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function readStorageJson<T>(key: string, fallback: T): T {
  if (!isStorageAvailable()) return fallback;

  try {
    const storedValue = window.localStorage.getItem(key);
    if (!storedValue) return fallback;
    return JSON.parse(storedValue) as T;
  } catch {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Storage may become unavailable between reads and cleanup.
    }
    return fallback;
  }
}

export function writeStorageJson<T>(key: string, value: T) {
  if (!isStorageAvailable()) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(key: string) {
  if (!isStorageAvailable()) return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
