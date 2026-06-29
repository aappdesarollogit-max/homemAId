import { householdMembers, householdSummary } from "@/lib/mock-home";
import { publishDomainEvent } from "@/core/platform/events/EventBus";
import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";
import type { HouseholdMember, HouseholdSettings } from "@/types/domain";

const SETTINGS_STORAGE_KEY = "homemaid.household.settings";
const MEMBERS_STORAGE_KEY = "homemaid.household.members";

export type HouseholdSettingsUpdate = Partial<HouseholdSettings>;
export type HouseholdMemberDraft = Omit<HouseholdMember, "id">;
export type HouseholdMemberUpdate = Partial<HouseholdMemberDraft>;

function getInitialSettings(): HouseholdSettings {
  return {
    name: householdSummary.name,
    owner: householdSummary.owner,
    monthlyBudget: householdSummary.monthlyBudget,
    currency: "CLP",
    language: "Español",
    budgetAlertThreshold: 80,
    favoriteStores: ["Supermercado"],
    priorityCategories: ["Despensa", "Lácteos", "Limpieza"],
    purchaseFrequency: "Semanal",
  };
}

function normalizeSettings(settings: HouseholdSettings): HouseholdSettings {
  return {
    ...settings,
    name: settings.name.trim() || householdSummary.name,
    owner: settings.owner.trim() || householdSummary.owner,
    monthlyBudget: Math.max(0, Number(settings.monthlyBudget)),
    currency: settings.currency.trim() || "CLP",
    language: settings.language.trim() || "Español",
    budgetAlertThreshold: Math.min(
      100,
      Math.max(1, Number(settings.budgetAlertThreshold)),
    ),
    favoriteStores: settings.favoriteStores.map((store) => store.trim()).filter(Boolean),
    priorityCategories: settings.priorityCategories
      .map((category) => category.trim())
      .filter(Boolean),
    purchaseFrequency: settings.purchaseFrequency.trim() || "Semanal",
  };
}

function generateMemberId(name: string) {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());

  return `${base || "integrante"}-${suffix}`;
}

export function getHouseholdSettings() {
  return normalizeSettings({
    ...getInitialSettings(),
    ...readStorageJson<Partial<HouseholdSettings>>(SETTINGS_STORAGE_KEY, {}),
  });
}

export function saveHouseholdSettings(settings: HouseholdSettings) {
  const normalizedSettings = normalizeSettings(settings);

  writeStorageJson(SETTINGS_STORAGE_KEY, normalizedSettings);

  return normalizedSettings;
}

export function updateHouseholdSettings(updates: HouseholdSettingsUpdate) {
  const settings = saveHouseholdSettings({
    ...getHouseholdSettings(),
    ...updates,
  });
  publishDomainEvent({
    type: "settings.updated",
    source: "settings",
    payload: {
      updatedFields: Object.keys(updates),
    },
  });
  return settings;
}

export function getHouseholdMembers() {
  return readStorageJson<HouseholdMember[]>(MEMBERS_STORAGE_KEY, householdMembers);
}

export function saveHouseholdMembers(members: HouseholdMember[]) {
  const normalizedMembers = members.map((member) => ({
    ...member,
    name: member.name.trim(),
    role: member.role.trim(),
    avatar: member.avatar.trim() || member.name.trim().slice(0, 1).toUpperCase(),
  }));

  writeStorageJson(MEMBERS_STORAGE_KEY, normalizedMembers);

  return normalizedMembers;
}

export function createHouseholdMember(member: HouseholdMemberDraft) {
  const members = getHouseholdMembers();
  const newMember: HouseholdMember = {
    id: generateMemberId(member.name),
    name: member.name.trim(),
    role: member.role.trim(),
    avatar: member.avatar.trim() || member.name.trim().slice(0, 1).toUpperCase(),
  };

  saveHouseholdMembers([...members, newMember]);
  return newMember;
}

export function updateHouseholdMember(id: string, updates: HouseholdMemberUpdate) {
  let updatedMember: HouseholdMember | undefined;
  const nextMembers = getHouseholdMembers().map((member) => {
    if (member.id !== id) return member;

    updatedMember = {
      ...member,
      ...updates,
      name: updates.name?.trim() ?? member.name,
      role: updates.role?.trim() ?? member.role,
      avatar: updates.avatar?.trim() || member.avatar,
    };

    return updatedMember;
  });

  saveHouseholdMembers(nextMembers);
  return updatedMember;
}

export function deleteHouseholdMember(id: string) {
  const members = getHouseholdMembers();
  if (members.length <= 1) return members;

  const nextMembers = members.filter((member) => member.id !== id);
  saveHouseholdMembers(nextMembers);
  return nextMembers;
}

export function resetHouseholdSettings() {
  const initialSettings = getInitialSettings();

  saveHouseholdSettings(initialSettings);
  saveHouseholdMembers(householdMembers);

  return {
    settings: initialSettings,
    members: householdMembers,
  };
}
