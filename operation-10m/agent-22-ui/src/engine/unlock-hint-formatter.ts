import { UI_MILESTONE_BY_ID } from '../registry/progression-milestones.js';
import type { EvolvingPanelDefinition } from '../types/progression.js';
import { evaluateUnlockRule, type ProgressionSignalSnapshot } from '../types/progression.js';

export function formatUnlockRequirementLabel(key: string): string {
  if (key.startsWith('day≥')) return `Reach ${key.replace('day≥', 'day ')}`;
  if (key.startsWith('turn≥')) return `Complete ${key.replace('turn≥', 'turn ')}`;
  if (key.startsWith('interface≥')) return `Use ${key.replace('interface≥', '')} interface`;
  if (key.startsWith('concept:')) return `Learn: ${key.replace('concept:', '').replace(/_/g, ' ')}`;
  if (key.startsWith('milestone:')) {
    const id = key.replace('milestone:', '');
    return UI_MILESTONE_BY_ID[id]?.title ?? id;
  }
  return key;
}

export function buildUnlockHintForPanel(
  panel: EvolvingPanelDefinition,
  signals: ProgressionSignalSnapshot
): string {
  const evalResult = evaluateUnlockRule(panel.unlock, signals);
  if (evalResult.ok) return 'Unlocked';
  if (evalResult.reasons.length === 0) return 'Keep playing to unlock';
  return evalResult.reasons.map(formatUnlockRequirementLabel).join(' · ');
}

export function buildCoachHeadline(panel: EvolvingPanelDefinition, signals: ProgressionSignalSnapshot): string {
  const hint = buildUnlockHintForPanel(panel, signals);
  if (hint === 'Unlocked') return `${panel.label} is available.`;
  return `${panel.label} unlocks when: ${hint}`;
}
