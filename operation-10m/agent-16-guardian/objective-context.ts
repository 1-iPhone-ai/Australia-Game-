import type { GuardianCoPilotMonitorSnapshot } from './types.js';

export interface ParsedObjectiveContext {
  objectiveActive: boolean;
  objectivePrimaryLabel: string | null;
  objectiveTargetRegion: string | null;
  objectiveProgressPct: number | null;
  objectiveTurnsRemaining: number | null;
  playerInObjectiveRegion: boolean;
  rivalVictoryProgressPct: number | null;
  victoryThresholdPct: number;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function clampPct(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

function pickPrimaryObjective(gs: Record<string, unknown>): Record<string, unknown> | null {
  const direct = gs.activePrimaryObjective || gs.currentPrimaryObjective;
  if (direct && typeof direct === 'object') return direct as Record<string, unknown>;

  const mission = (gs.activeMission || gs.currentMission || gs.missionState) as Record<string, unknown> | undefined;
  if (mission && typeof mission === 'object') {
    const objs = mission.objectives;
    if (Array.isArray(objs)) {
      const primary = objs.find(
        (o: unknown) =>
          o &&
          typeof o === 'object' &&
          ((o as Record<string, unknown>).isMandatory !== false && (o as Record<string, unknown>).completed !== true)
      );
      if (primary && typeof primary === 'object') return primary as Record<string, unknown>;
    }
    if (typeof mission.primaryObjective === 'object') return mission.primaryObjective as Record<string, unknown>;
  }

  const lists = [gs.primaryObjectives, gs.objectives, gs.scenarioObjectives];
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    const row = list.find(
      (o: unknown) => o && typeof o === 'object' && (o as Record<string, unknown>).completed !== true
    );
    if (row && typeof row === 'object') return row as Record<string, unknown>;
  }
  return null;
}

function objectiveProgressPct(obj: Record<string, unknown> | null): number | null {
  if (!obj) return null;
  if (typeof obj.progressPct === 'number') return clampPct(obj.progressPct);
  const target = num(obj.targetValue, num(obj.target, 0));
  const current = num(obj.currentProgress, num(obj.progress, 0));
  if (target <= 0) return obj.completed === true ? 100 : 0;
  return clampPct((current / target) * 100);
}

function objectiveTurnsRemaining(obj: Record<string, unknown> | null, gs: Record<string, unknown>, turn: number): number | null {
  if (!obj) return null;
  if (typeof obj.turnsRemaining === 'number') return Math.max(0, Math.floor(obj.turnsRemaining));
  if (typeof obj.deadlineTurn === 'number') return Math.max(0, obj.deadlineTurn - turn);
  const missionDeadline = num(gs.missionDeadlineTurn, num(gs.scenarioDeadlineTurn, 0));
  if (missionDeadline > 0) return Math.max(0, missionDeadline - turn);
  return null;
}

export function parseObjectiveContextFromGame(
  gs: Record<string, unknown>,
  playerRegion: string
): ParsedObjectiveContext {
  const turn = num(gs.turnCounter, num(gs.turn, 1));
  const primary = pickPrimaryObjective(gs);
  const focus = (gs.currentFocus || gs.objectiveFocus) as { regionId?: string; region?: string; label?: string } | null;
  const targetRegion = String(
    primary?.targetRegion ||
      primary?.regionId ||
      primary?.region ||
      focus?.regionId ||
      focus?.region ||
      ''
  ).trim();
  const objectiveTargetRegion = targetRegion || null;
  const labelRaw =
    (typeof primary?.description === 'string' && primary.description) ||
    (typeof primary?.title === 'string' && primary.title) ||
    (typeof focus?.label === 'string' && focus.label) ||
    null;
  const objectivePrimaryLabel = labelRaw ? labelRaw.slice(0, 120) : null;
  const progress = objectiveProgressPct(primary);
  const turnsRemaining = objectiveTurnsRemaining(primary, gs, turn);
  const objectiveActive = Boolean(primary || objectiveTargetRegion || objectivePrimaryLabel);

  const rivalRaw = gs.rivalVictoryProgress ?? gs.rivalDominanceShare ?? gs.rivalVictoryShare;
  const rivalVictoryProgressPct =
    rivalRaw === null || rivalRaw === undefined
      ? null
      : clampPct(num(rivalRaw, 0) <= 1 ? num(rivalRaw, 0) * 100 : num(rivalRaw, 0));

  const thresholdRaw = gs.victoryThreshold ?? gs.scenarioVictoryThreshold ?? 0.8;
  const victoryThresholdPct = clampPct(num(thresholdRaw, 0.8) <= 1 ? num(thresholdRaw, 0.8) * 100 : num(thresholdRaw, 80));

  const playerInObjectiveRegion = Boolean(
    objectiveTargetRegion && playerRegion && objectiveTargetRegion.toUpperCase() === playerRegion.toUpperCase()
  );

  return {
    objectiveActive,
    objectivePrimaryLabel,
    objectiveTargetRegion,
    objectiveProgressPct: progress,
    objectiveTurnsRemaining: turnsRemaining,
    playerInObjectiveRegion,
    rivalVictoryProgressPct,
    victoryThresholdPct,
  };
}

export function mergeObjectiveContextIntoSnapshot(
  base: GuardianCoPilotMonitorSnapshot,
  ctx: ParsedObjectiveContext
): GuardianCoPilotMonitorSnapshot {
  const objectiveRegion = base.objectiveRegion || ctx.objectiveTargetRegion;
  return {
    ...base,
    objectiveRegion,
    objectiveActive: ctx.objectiveActive,
    objectivePrimaryLabel: ctx.objectivePrimaryLabel,
    objectiveTargetRegion: ctx.objectiveTargetRegion,
    objectiveProgressPct: ctx.objectiveProgressPct,
    objectiveTurnsRemaining: ctx.objectiveTurnsRemaining,
    playerInObjectiveRegion: ctx.playerInObjectiveRegion,
    rivalVictoryProgressPct: ctx.rivalVictoryProgressPct,
    victoryThresholdPct: ctx.victoryThresholdPct,
    guardianRequiresConfirmation: base.guardianResponseMode === 'require_confirmation',
    guardianProtectionMaximum: base.guardianProtectionLevel === 'maximum_protection',
  };
}

/** Recommendation-only hints tied to live objective fields (never executable). */
export function buildObjectiveAwareAdviceHints(snapshot: GuardianCoPilotMonitorSnapshot): string[] {
  const hints: string[] = [];
  if (snapshot.objectiveActive && snapshot.objectivePrimaryLabel) {
    hints.push(`Primary objective: ${snapshot.objectivePrimaryLabel}`);
  }
  if (
    snapshot.objectiveActive &&
    snapshot.objectiveTargetRegion &&
    !snapshot.playerInObjectiveRegion &&
    snapshot.apRemaining > 0
  ) {
    hints.push(
      `Consider travel to ${snapshot.objectiveTargetRegion} — you are in ${snapshot.region} with ${snapshot.apRemaining} AP left`
    );
  }
  if (snapshot.objectiveProgressPct !== null && snapshot.objectiveProgressPct < 100) {
    hints.push(`Objective progress is ${snapshot.objectiveProgressPct}% from live mission state`);
  }
  return hints.slice(0, 3);
}
