import { futureAutomationRules, type AutomationRule } from "@/core/platform/automation/AutomationRules";
import type { DomainEvent } from "@/core/platform/events/EventTypes";

export default class AutomationEngine {
  private rules = new Map<string, AutomationRule>();

  constructor(initialRules: AutomationRule[] = futureAutomationRules) {
    initialRules.forEach((rule) => this.registerRule(rule));
  }

  registerRule(rule: AutomationRule) {
    this.rules.set(rule.id, rule);
  }

  enableRule(id: string) {
    const rule = this.rules.get(id);
    if (!rule) return;
    this.rules.set(id, { ...rule, enabled: true });
  }

  disableRule(id: string) {
    const rule = this.rules.get(id);
    if (!rule) return;
    this.rules.set(id, { ...rule, enabled: false });
  }

  evaluateEvent(event: DomainEvent) {
    return Array.from(this.rules.values())
      .filter((rule) => rule.enabled && rule.eventTypes.includes(event.type))
      .filter((rule) => rule.evaluate(event));
  }

  evaluateAll(events: DomainEvent[]) {
    return events.flatMap((event) => this.evaluateEvent(event));
  }
}
