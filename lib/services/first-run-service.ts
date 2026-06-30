import AnalyticsEngine from "@/core/product/AnalyticsEngine";
import { removeStorageItem, readStorageJson, writeStorageJson } from "@/lib/safe-storage";
import {
  generateMemberId,
  getInitialSettings,
  MEMBERS_STORAGE_KEY,
  saveHouseholdMembers,
  saveHouseholdSettings,
  SETTINGS_STORAGE_KEY,
} from "@/lib/services/settings-service";
import { saveInventoryProducts } from "@/lib/services/inventory-service";
import { savePurchases } from "@/lib/services/purchase-service";
import { householdMembers, inventoryProducts, purchases } from "@/lib/mock-home";
import type { HouseholdMember, HouseholdSettings } from "@/types/domain";

const FIRST_RUN_STORAGE_KEY = "homemaid.firstRun";

export type OnboardingMode = "empty" | "demo";

export type WelcomeStepId =
  | "first_product"
  | "first_purchase"
  | "review_consumption"
  | "try_assistant";

export type FirstRunState = {
  onboardingComplete: boolean;
  demoMode: boolean;
  startedAt?: string;
  completedAt?: string;
  welcomeCompleted: boolean;
  welcomeChecklist: Record<WelcomeStepId, boolean>;
};

export type OnboardingInput = {
  householdName: string;
  owner: string;
  memberCount: number;
  monthlyBudget: number;
  currency: string;
  favoriteStore?: string;
  mode: OnboardingMode;
};

const emptyChecklist: Record<WelcomeStepId, boolean> = {
  first_product: false,
  first_purchase: false,
  review_consumption: false,
  try_assistant: false,
};

function trackFirstRunEvent(tipo: Parameters<AnalyticsEngine["track"]>[0]["tipo"]) {
  if (typeof window === "undefined") return;
  new AnalyticsEngine().track({
    tipo,
    pantalla: "first-run",
    usuario: "Alpha user",
  });
}

function getFirstRunState(): FirstRunState {
  return {
    onboardingComplete: false,
    demoMode: false,
    welcomeCompleted: false,
    welcomeChecklist: emptyChecklist,
    ...readStorageJson<Partial<FirstRunState>>(FIRST_RUN_STORAGE_KEY, {}),
  };
}

function saveFirstRunState(updates: Partial<FirstRunState>) {
  const currentState = getFirstRunState();
  const nextState: FirstRunState = {
    ...currentState,
    ...updates,
    welcomeChecklist: {
      ...emptyChecklist,
      ...currentState.welcomeChecklist,
      ...updates.welcomeChecklist,
    },
  };

  writeStorageJson(FIRST_RUN_STORAGE_KEY, nextState);
  return nextState;
}

function hasValidHouseholdSettings() {
  const settings = readStorageJson<Partial<HouseholdSettings> | null>(
    SETTINGS_STORAGE_KEY,
    null,
  );

  return Boolean(settings?.name?.trim() && settings?.owner?.trim());
}

function buildSettings(input: OnboardingInput): HouseholdSettings {
  const initialSettings = getInitialSettings();
  const favoriteStores = input.favoriteStore?.trim()
    ? [input.favoriteStore.trim()]
    : initialSettings.favoriteStores;

  return {
    ...initialSettings,
    name: input.householdName,
    owner: input.owner,
    monthlyBudget: input.monthlyBudget,
    currency: input.currency,
    favoriteStores,
  };
}

function buildMembers(owner: string, memberCount: number): HouseholdMember[] {
  const count = Math.max(1, Math.min(12, Math.round(memberCount)));

  return Array.from({ length: count }, (_, index) => {
    const name = index === 0 ? owner : `Integrante ${index + 1}`;

    return {
      id: generateMemberId(name),
      name,
      role: index === 0 ? "Responsable" : "Integrante",
      avatar: name.trim().slice(0, 1).toUpperCase() || "H",
    };
  });
}

export function isFirstRun() {
  const state = getFirstRunState();
  return !hasValidHouseholdSettings() || !state.onboardingComplete;
}

export function markStarted() {
  trackFirstRunEvent("first_run_started");
  return saveFirstRunState({
    startedAt: new Date().toISOString(),
  });
}

export function markCompleted(demoMode = false) {
  trackFirstRunEvent("onboarding_completed");
  return saveFirstRunState({
    onboardingComplete: true,
    demoMode,
    completedAt: new Date().toISOString(),
  });
}

export function completeOnboarding(input: OnboardingInput) {
  const settings = saveHouseholdSettings(buildSettings(input));
  const members =
    input.mode === "demo"
      ? saveHouseholdMembers(householdMembers)
      : saveHouseholdMembers(buildMembers(input.owner, input.memberCount));

  if (input.mode === "demo") {
    saveInventoryProducts(inventoryProducts);
    savePurchases(purchases);
    trackFirstRunEvent("demo_selected");
  } else {
    saveInventoryProducts([]);
    savePurchases([]);
    trackFirstRunEvent("empty_home_selected");
  }

  markCompleted(input.mode === "demo");

  return {
    settings,
    members,
  };
}

export function isDemoMode() {
  return getFirstRunState().demoMode;
}

export function startFromScratch() {
  saveInventoryProducts([]);
  savePurchases([]);
  saveHouseholdMembers(buildMembers(readStorageJson<HouseholdSettings>(
    SETTINGS_STORAGE_KEY,
    getInitialSettings(),
  ).owner, 1));

  return saveFirstRunState({
    demoMode: false,
  });
}

export function getWelcomeState() {
  return getFirstRunState();
}

export function updateWelcomeChecklist(updates: Partial<Record<WelcomeStepId, boolean>>) {
  const currentState = getFirstRunState();
  const state = saveFirstRunState({
    welcomeChecklist: {
      ...currentState.welcomeChecklist,
      ...updates,
    },
  });
  const isComplete = Object.values(state.welcomeChecklist).every(Boolean);

  if (isComplete && !state.welcomeCompleted) {
    trackFirstRunEvent("welcome_completed");
    return saveFirstRunState({
      welcomeCompleted: true,
    });
  }

  return state;
}

export function markWelcomeCompleted() {
  trackFirstRunEvent("welcome_completed");
  return saveFirstRunState({
    welcomeCompleted: true,
    welcomeChecklist: {
      first_product: true,
      first_purchase: true,
      review_consumption: true,
      try_assistant: true,
    },
  });
}

export function reset() {
  removeStorageItem(FIRST_RUN_STORAGE_KEY);
  removeStorageItem(SETTINGS_STORAGE_KEY);
  removeStorageItem(MEMBERS_STORAGE_KEY);
  saveInventoryProducts([]);
  savePurchases([]);
}
