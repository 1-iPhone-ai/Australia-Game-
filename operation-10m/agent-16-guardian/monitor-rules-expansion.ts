import type { AdvisoryMonitorRule, AdvisoryOpsKind, GuardianCoPilotMonitorSnapshot } from './types.js';

const rivalNearVictoryThreshold = (s: GuardianCoPilotMonitorSnapshot): boolean => {
  if (s.rivalVictoryProgressPct === null) return false;
  return s.rivalVictoryProgressPct >= s.victoryThresholdPct * 0.85;
};

export const ADVISORY_MONITOR_RULES_EXPANSION: AdvisoryMonitorRule[] = [
  {
    id: 'rival_near_victory',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'critical',
    title: 'Rival Near Victory',
    detailTemplate: 'Rival victory progress is approaching the scenario threshold',
    evidenceFields: ['rivalVictoryProgressPct', 'victoryThresholdPct'],
    evaluate: rivalNearVictoryThreshold,
    followUp: 'Prioritize blocking rival primary objectives or accelerating yours.',
    deepLink: { tab: 'strategy', section: 'victory' },
  },
  {
    id: 'objective_deadline_imminent',
    category: 'objective',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Objective Deadline Imminent',
    detailTemplate: 'Primary objective deadline within 2 turns',
    evidenceFields: ['objectiveTurnsRemaining', 'objectiveProgressPct'],
    evaluate: s =>
      s.objectiveActive &&
      s.objectiveTurnsRemaining !== null &&
      s.objectiveTurnsRemaining <= 2 &&
      (s.objectiveProgressPct === null || s.objectiveProgressPct < 100),
  },
  {
    id: 'objective_stalled',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Objective Stalled',
    detailTemplate: 'Primary objective progress is behind schedule',
    evidenceFields: ['objectiveProgressPct', 'objectiveTurnsRemaining'],
    evaluate: s =>
      s.objectiveActive &&
      s.objectiveProgressPct !== null &&
      s.objectiveProgressPct < 35 &&
      s.objectiveTurnsRemaining !== null &&
      s.objectiveTurnsRemaining <= 5,
  },
  {
    id: 'objective_travel_recommended',
    category: 'objective',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Travel Toward Objective',
    detailTemplate: 'You have AP but are not in the objective region',
    evidenceFields: ['region', 'objectiveTargetRegion', 'apRemaining', 'playerInObjectiveRegion'],
    evaluate: s =>
      s.objectiveActive &&
      Boolean(s.objectiveTargetRegion) &&
      !s.playerInObjectiveRegion &&
      s.apRemaining > 0,
    followUp: 'Travel is a suggestion only — confirm in Co-Pilot or act manually.',
  },
  {
    id: 'objective_region_aligned',
    category: 'objective',
    kind: 'monitor',
    defaultSeverity: 'info',
    title: 'Objective Region Aligned',
    detailTemplate: 'Current region matches primary objective target',
    evidenceFields: ['region', 'objectiveTargetRegion', 'playerInObjectiveRegion'],
    evaluate: s => s.objectiveActive && s.playerInObjectiveRegion,
  },
  {
    id: 'objective_no_tracked_primary',
    category: 'objective',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'No Tracked Primary Objective',
    detailTemplate: 'Scenario focus detected but no primary objective progress is tracked',
    evidenceFields: ['objectiveActive', 'objectiveProgressPct'],
    evaluate: s => !s.objectiveActive && s.objectiveRegion !== null,
  },
  {
    id: 'guardian_maximum_protection',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'medium',
    title: 'Guardian Maximum Protection',
    detailTemplate: 'Guardian is on maximum protection — more actions will require confirmation',
    evidenceFields: ['guardianEnabled', 'guardianProtectionMaximum', 'guardianProtectionLevel'],
    evaluate: s => s.guardianEnabled && s.guardianProtectionMaximum,
    deepLink: { tab: 'aiTeams', section: 'aiTeams.guardian' },
  },
  {
    id: 'guardian_require_confirmation_mode',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'medium',
    title: 'Guardian Requires Confirmation',
    detailTemplate: 'Guardian response mode requires confirmation before risky actions',
    evidenceFields: ['guardianEnabled', 'guardianRequiresConfirmation', 'guardianResponseMode'],
    evaluate: s => s.guardianEnabled && s.guardianRequiresConfirmation,
  },
  {
    id: 'guardian_critical_only_mode',
    category: 'guardian',
    kind: 'monitor',
    defaultSeverity: 'low',
    title: 'Guardian Critical Only',
    detailTemplate: 'Guardian will warn on critical mistakes only',
    evidenceFields: ['guardianEnabled', 'guardianProtectionLevel'],
    evaluate: s => s.guardianEnabled && s.guardianProtectionLevel === 'critical_only',
  },
  {
    id: 'guardian_copilot_autonomy_mismatch',
    category: 'guardian',
    kind: 'advice',
    defaultSeverity: 'high',
    title: 'Guardian And Co-Pilot Autonomy Mismatch',
    detailTemplate: 'Co-Pilot autonomous mode with strict Guardian confirmations may stall turns',
    evidenceFields: ['copilotAutonomousActive', 'guardianRequiresConfirmation', 'copilotAuthorityMode'],
    evaluate: s =>
      s.copilotAutonomousActive &&
      s.guardianRequiresConfirmation &&
      (s.copilotAuthorityMode === 'autonomous' || s.copilotAuthorityMode === 'rescue'),
    followUp: 'Review Guardian response mode or Co-Pilot authority — advisory only.',
  },
  {
    id: 'guardian_off_during_takeover',
    category: 'guardian',
    kind: 'alert',
    defaultSeverity: 'high',
    title: 'Guardian Off During Takeover',
    detailTemplate: 'Guardian is disabled while a Co-Pilot takeover session is active',
    evidenceFields: ['guardianEnabled', 'takeoverSessionActive'],
    evaluate: s => !s.guardianEnabled && s.takeoverSessionActive,
  },
];

export function countExpansionRulesByKind(): Record<AdvisoryOpsKind, number> {
  const out: Record<AdvisoryOpsKind, number> = { monitor: 0, advice: 0, alert: 0 };
  for (const r of ADVISORY_MONITOR_RULES_EXPANSION) out[r.kind] += 1;
  return out;
}
