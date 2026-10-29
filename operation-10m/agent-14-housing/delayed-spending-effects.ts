import { AGENT14_DEFAULT_PROGRAM_TIMING, AGENT14_LIMITS } from './constants.ts';
import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  DelayedSpendingPersisted,
  DelayedSpendingTurnEffects,
  PublicServicePillar,
  SpendingCommitment,
} from './types.ts';

export function createInitialDelayedSpendingPersisted(): DelayedSpendingPersisted {
  return {
    schemaVersion: '10.14.42-scale-wave-42' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    active: [],
    history: [],
  };
}

export function sanitizeDelayedSpendingPersisted(
  raw?: DelayedSpendingPersisted | null
): DelayedSpendingPersisted {
  if (!raw || typeof raw !== 'object') return createInitialDelayedSpendingPersisted();
  const active = Array.isArray(raw.active)
    ? raw.active
        .filter(
          (c) =>
            c &&
            typeof c.id === 'string' &&
            typeof c.programId === 'string' &&
            typeof c.committedTurn === 'number'
        )
        .slice(0, AGENT14_LIMITS.maxActiveCommitments)
    : [];
  return {
    schemaVersion: '10.14.42-scale-wave-42' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    active,
    history: Array.isArray(raw.history) ? raw.history.slice(-AGENT14_LIMITS.maxHistory) : [],
  };
}

export function makeSpendingCommitment(
  partial: Omit<
    SpendingCommitment,
    'effectLagTurns' | 'rampTurns'
  > &
    Partial<Pick<SpendingCommitment, 'effectLagTurns' | 'rampTurns'>>
): SpendingCommitment {
  return {
    ...partial,
    effectLagTurns: partial.effectLagTurns ?? AGENT14_DEFAULT_PROGRAM_TIMING.effectLagTurns,
    rampTurns: partial.rampTurns ?? AGENT14_DEFAULT_PROGRAM_TIMING.rampTurns,
  };
}

function rampFactor(commit: SpendingCommitment, turn: number): number {
  const effectTurn = commit.committedTurn + commit.effectLagTurns;
  if (turn < effectTurn) return 0;
  const rampEnd = effectTurn + Math.max(1, commit.rampTurns);
  if (turn >= rampEnd) return 1;
  return (turn - effectTurn + 1) / Math.max(1, commit.rampTurns);
}

/** Advance delayed spending one turn; pure function returning new persisted state and derived effects. */
export function advanceDelayedSpendingEffects(
  turn: number,
  persistedIn: DelayedSpendingPersisted | null | undefined
): { persisted: DelayedSpendingPersisted; effects: DelayedSpendingTurnEffects } {
  const persisted = sanitizeDelayedSpendingPersisted(persistedIn);
  const t = Math.max(1, Math.floor(turn));
  let fiscalLoadThisTurn = 0;
  const completedProjectBoost: Record<PublicServicePillar, number> = {
    housing: 0,
    healthcare: 0,
    education: 0,
  };
  const regionalKpiDelta: DelayedSpendingTurnEffects['regionalKpiDelta'] = {};
  const maturedCommitmentIds: string[] = [];
  const events: DelayedSpendingTurnEffects['events'] = [];
  const stillActive: SpendingCommitment[] = [];

  for (const c of persisted.active) {
    if (t < c.committedTurn) {
      stillActive.push(c);
      continue;
    }
    const elapsed = t - c.committedTurn;
    if (elapsed < c.durationTurns) {
      stillActive.push(c);
      fiscalLoadThisTurn += c.fiscalLoadPoints / Math.max(1, c.durationTurns);
    } else if (elapsed === c.durationTurns) {
      maturedCommitmentIds.push(c.id);
      events.push({
        id: `ps_mat_${c.id}_t${t}`,
        kind: 'program_spending_matured',
        summary: `Program ${c.programId} fiscal tranche completed; KPI ramp continues from lag pipeline.`,
      });
    }

    const ramp = rampFactor(c, t);
    if (ramp <= 0) continue;

    const kpiUnits = (c.baseImpact / 10) * ramp;
    if (c.pillar === 'housing') completedProjectBoost.housing += kpiUnits;
    if (c.pillar === 'healthcare') completedProjectBoost.healthcare += kpiUnits;
    if (c.pillar === 'education') completedProjectBoost.education += kpiUnits;

    if (!regionalKpiDelta[c.regionId]) regionalKpiDelta[c.regionId] = {};
    const prev = regionalKpiDelta[c.regionId]![c.pillar] ?? 0;
    regionalKpiDelta[c.regionId]![c.pillar] = prev + kpiUnits * 2.5;
  }

  persisted.active = stillActive.slice(0, AGENT14_LIMITS.maxActiveCommitments);
  persisted.history.push({
    id: `ps_spend_t${t}`,
    turn: t,
    summary: `Fiscal load ${Math.round(fiscalLoadThisTurn * 10) / 10}; active ${persisted.active.length}`,
  });
  persisted.history = persisted.history.slice(-AGENT14_LIMITS.maxHistory);

  return {
    persisted,
    effects: {
      turn: t,
      fiscalLoadThisTurn: Math.round(fiscalLoadThisTurn * 10) / 10,
      completedProjectBoost,
      regionalKpiDelta,
      maturedCommitmentIds,
      events,
    },
  };
}

export function commitSpendingProgram(
  persistedIn: DelayedSpendingPersisted | null | undefined,
  commitment: SpendingCommitment
): DelayedSpendingPersisted {
  const persisted = sanitizeDelayedSpendingPersisted(persistedIn);
  persisted.active = [...persisted.active, commitment].slice(-AGENT14_LIMITS.maxActiveCommitments);
  persisted.history.push({
    id: `ps_commit_${commitment.id}`,
    turn: commitment.committedTurn,
    summary: `Committed ${commitment.programId} (${commitment.pillar}) lag=${commitment.effectLagTurns} ramp=${commitment.rampTurns}`,
  });
  persisted.history = persisted.history.slice(-AGENT14_LIMITS.maxHistory);
  return persisted;
}
