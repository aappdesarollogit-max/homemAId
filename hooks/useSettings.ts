"use client";

import { useEffect, useState } from "react";
import {
  createHouseholdMember,
  deleteHouseholdMember,
  getHouseholdMembers,
  getHouseholdSettings,
  resetHouseholdSettings,
  updateHouseholdMember,
  updateHouseholdSettings,
  type HouseholdMemberDraft,
  type HouseholdMemberUpdate,
  type HouseholdSettingsUpdate,
} from "@/lib/services/settings-service";
import type { HouseholdMember, HouseholdSettings } from "@/types/domain";

export function useSettings() {
  const [settings, setSettings] = useState<HouseholdSettings | undefined>();
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setSettings(getHouseholdSettings());
      setMembers(getHouseholdMembers());
      setIsLoaded(true);
    });
  }, []);

  function updateSettings(updates: HouseholdSettingsUpdate) {
    const nextSettings = updateHouseholdSettings(updates);
    setSettings(nextSettings);
    return nextSettings;
  }

  function createMember(member: HouseholdMemberDraft) {
    const newMember = createHouseholdMember(member);
    setMembers(getHouseholdMembers());
    return newMember;
  }

  function updateMember(id: string, updates: HouseholdMemberUpdate) {
    const updatedMember = updateHouseholdMember(id, updates);
    setMembers(getHouseholdMembers());
    return updatedMember;
  }

  function deleteMember(id: string) {
    const nextMembers = deleteHouseholdMember(id);
    setMembers(nextMembers);
    return nextMembers;
  }

  function resetSettings() {
    const resetState = resetHouseholdSettings();
    setSettings(resetState.settings);
    setMembers(resetState.members);
    return resetState;
  }

  return {
    settings,
    members,
    isLoaded,
    updateSettings,
    createMember,
    updateMember,
    deleteMember,
    resetSettings,
  };
}
