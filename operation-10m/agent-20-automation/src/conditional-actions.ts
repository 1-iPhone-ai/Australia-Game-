import type {
  HumanAutomationTrigger,
  HumanAutomationTriggerType,
  PortableActionRequirement,
  PortableRequirementGroup,
} from './types.js';

export interface AutomationActorSnapshot {
  money: number;
  inventory: string[];
  currentRegion: string;
  actionPoints?: number;
  completedChallengeCount?: number;
  level?: number;
}

export interface ConditionalActionContext {
  actor: AutomationActorSnapshot;
  currentDay: number;
  currentTurn: number;
  isNewDayForActor: boolean;
  extendedTriggersEnabled: boolean;
  consecutiveIdleTurns?: number;
  settingsFlags: Record<string, boolean | undefined>;
}

const TRIGGER_TYPES: HumanAutomationTriggerType[] = [
  'turn_start',
  'day_start',
  'cash_below_threshold',
  'cash_above_threshold',
  'resource_quantity_at_least',
  'resource_quantity_at_most',
  'consecutive_idle_turns_at_or_above',
  'level_at_or_above',
  'manual_test_only',
  'day_number_at_or_above',
  'turn_number_at_or_above',
];

export function isKnownAutomationTriggerType(type: string): type is HumanAutomationTriggerType {
  return (TRIGGER_TYPES as string[]).includes(type);
}

/** Pure trigger evaluation (subset of V9.4 evaluateHumanAutomationTrigger). */
export function evaluateAutomationTrigger(
  trigger: HumanAutomationTrigger,
  ctx: ConditionalActionContext
): boolean {
  const { actor, currentDay, currentTurn, isNewDayForActor, extendedTriggersEnabled } = ctx;
  switch (trigger.type) {
    case 'turn_start':
      return true;
    case 'day_start':
      return isNewDayForActor;
    case 'cash_below_threshold':
      return actor.money < (trigger.thresholdAmount ?? 0);
    case 'cash_above_threshold':
      return actor.money > (trigger.thresholdAmount ?? 0);
    case 'resource_quantity_at_least': {
      const res = trigger.resource || '';
      const count = actor.inventory.filter(r => r === res).length;
      return count >= (trigger.thresholdAmount ?? 0);
    }
    case 'resource_quantity_at_most': {
      const res = trigger.resource || '';
      const count = actor.inventory.filter(r => r === res).length;
      return count <= (trigger.thresholdAmount ?? 0);
    }
    case 'consecutive_idle_turns_at_or_above':
      return extendedTriggersEnabled
        ? (ctx.consecutiveIdleTurns ?? 0) >= (trigger.thresholdAmount ?? 1)
        : false;
    case 'level_at_or_above':
      return extendedTriggersEnabled ? (actor.level ?? 1) >= (trigger.thresholdAmount ?? 1) : false;
    case 'day_number_at_or_above':
      return extendedTriggersEnabled ? currentDay >= (trigger.thresholdAmount ?? 0) : false;
    case 'turn_number_at_or_above':
      return extendedTriggersEnabled ? currentTurn >= (trigger.thresholdAmount ?? 0) : false;
    case 'manual_test_only':
    default:
      return false;
  }
}

const MAX_GROUP_DEPTH = 8;

function evaluateRequirementLeaf(
  req: PortableActionRequirement,
  ctx: ConditionalActionContext
): { applicable: boolean; passed: boolean } {
  if (!req.enabled) return { applicable: false, passed: true };
  const { actor, settingsFlags } = ctx;
  switch (req.kind) {
    case 'cash_at_least':
      return { applicable: true, passed: actor.money >= Number(req.value ?? 0) };
    case 'cash_at_most':
      return { applicable: true, passed: actor.money <= Number(req.value ?? 0) };
    case 'ap_at_least':
      return { applicable: true, passed: (actor.actionPoints ?? 0) >= Number(req.value ?? 0) };
    case 'region_equals':
      return { applicable: true, passed: actor.currentRegion === String(req.value ?? '') };
    case 'flag_enabled':
      return { applicable: true, passed: Boolean(settingsFlags[String(req.value ?? '')]) };
    default:
      return { applicable: false, passed: true };
  }
}

function evaluateRequirementGroupTree(
  node: PortableActionRequirement | PortableRequirementGroup,
  strictnessFilter: 'hard' | 'soft',
  ctx: ConditionalActionContext,
  depth = 0
): { applicable: boolean; passed: boolean } {
  if (depth > MAX_GROUP_DEPTH) {
    return strictnessFilter === 'hard'
      ? { applicable: true, passed: false }
      : { applicable: false, passed: true };
  }
  if ('items' in node && Array.isArray(node.items)) {
    const group = node as PortableRequirementGroup;
    const results = group.items.map(item => evaluateRequirementGroupTree(item, strictnessFilter, ctx, depth + 1));
    const applicable = results.filter(r => r.applicable);
    if (applicable.length === 0) return { applicable: false, passed: true };
    const passed =
      group.mode === 'any_may_pass'
        ? applicable.some(r => r.passed)
        : applicable.every(r => r.passed);
    return { applicable: true, passed };
  }
  const req = node as PortableActionRequirement;
  const reqStrictness = req.strictness === 'soft' ? 'soft' : 'hard';
  if (reqStrictness !== strictnessFilter) return { applicable: false, passed: true };
  return evaluateRequirementLeaf(req, ctx);
}

/** Hard + soft requirement groups — both must pass (matches V9.4 evaluateActionRequirements shape). */
export function evaluateAutomationConditionGroup(
  group: PortableRequirementGroup | null | undefined,
  ctx: ConditionalActionContext
): { approved: boolean; failingHard: boolean; failingSoft: boolean } {
  if (!group) return { approved: true, failingHard: false, failingSoft: false };
  const hard = evaluateRequirementGroupTree(group, 'hard', ctx);
  const soft = evaluateRequirementGroupTree(group, 'soft', ctx);
  const hardOk = !hard.applicable || hard.passed;
  const softOk = !soft.applicable || soft.passed;
  return {
    approved: hardOk && softOk,
    failingHard: hard.applicable && !hard.passed,
    failingSoft: soft.applicable && !soft.passed,
  };
}

export interface ConditionalAutomationDecisionInput {
  trigger: HumanAutomationTrigger;
  conditions: PortableRequirementGroup | null;
  ctx: ConditionalActionContext;
}

export interface ConditionalAutomationDecision {
  wouldRun: boolean;
  reason: string;
  triggerFired: boolean;
  conditionsApproved: boolean;
}

/** Single chokepoint: trigger AND optional requirement tree. */
export function evaluateConditionalAutomationAction(
  input: ConditionalAutomationDecisionInput
): ConditionalAutomationDecision {
  const triggerFired = evaluateAutomationTrigger(input.trigger, input.ctx);
  if (!triggerFired) {
    return {
      wouldRun: false,
      reason: `Trigger "${input.trigger.type}" is not currently true.`,
      triggerFired: false,
      conditionsApproved: true,
    };
  }
  const gate = evaluateAutomationConditionGroup(input.conditions, input.ctx);
  if (!gate.approved) {
    const part = gate.failingHard ? 'hard requirement' : 'soft requirement';
    return {
      wouldRun: false,
      reason: `Conditional action blocked: ${part} failed.`,
      triggerFired: true,
      conditionsApproved: false,
    };
  }
  return {
    wouldRun: true,
    reason: 'Trigger and conditions satisfied.',
    triggerFired: true,
    conditionsApproved: true,
  };
}
