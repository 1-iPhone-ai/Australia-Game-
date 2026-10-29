import { AGENT14_LIMITS, AGENT14_PILLARS } from './constants.ts';
import type {
  CapacityAndSpendingInputs,
  CapacityBindingConstraint,
  PillarCapacitySlice,
  PublicServiceCapacitySnapshot,
  PublicServicePillar,
  SpendingCommitment,
  WorkforceReadiness,
} from './types.ts';

function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function workforceScore(readiness: WorkforceReadiness | undefined, gap: number): number {
  let score = 62 - gap * 0.45;
  switch (readiness) {
    case 'strong':
      score += 12;
      break;
    case 'balanced':
      score += 4;
      break;
    case 'strained':
      score -= 10;
      break;
    case 'weak':
      score -= 18;
      break;
    case 'blocking':
      score -= 28;
      break;
    default:
      break;
  }
  return clamp(score);
}

export function computeFiscalAbsorptionCap(fiscalHeadroom: number, stateCapacityLoad: number): number {
  const head = clamp(fiscalHeadroom, 0, 100);
  const load = clamp(stateCapacityLoad, 0, 100);
  const cap =
    AGENT14_LIMITS.minFiscalAbsorption +
    (head / 100) * (AGENT14_LIMITS.maxFiscalAbsorption - AGENT14_LIMITS.minFiscalAbsorption) -
    load * 0.22;
  return clamp(cap, AGENT14_LIMITS.minFiscalAbsorption, AGENT14_LIMITS.maxFiscalAbsorption);
}

export function computeNationalProgramSlots(
  fiscalHeadroom: number,
  stateCapacityLoad: number
): number {
  const base = AGENT14_LIMITS.defaultNationalSlots;
  const bonus = fiscalHeadroom >= 70 ? 2 : fiscalHeadroom >= 55 ? 1 : 0;
  const penalty = stateCapacityLoad >= 75 ? 2 : stateCapacityLoad >= 55 ? 1 : 0;
  return Math.max(3, Math.min(AGENT14_LIMITS.maxActiveCommitments, base + bonus - penalty));
}

function pillarLoad(
  active: SpendingCommitment[],
  pillar: PublicServicePillar,
  turn: number
): { loadPoints: number; count: number } {
  let loadPoints = 0;
  let count = 0;
  for (const c of active) {
    if (c.pillar !== pillar) continue;
    if (turn < c.committedTurn) continue;
    const elapsed = turn - c.committedTurn;
    if (elapsed >= c.durationTurns) continue;
    count += 1;
    loadPoints += c.fiscalLoadPoints / Math.max(1, c.durationTurns);
  }
  return { loadPoints, count };
}

export function computePublicServiceCapacity(
  inputs: CapacityAndSpendingInputs,
  activeCommitments: SpendingCommitment[]
): PublicServiceCapacitySnapshot {
  const turn = Math.max(1, Math.floor(inputs.turn || 1));
  const fiscalHeadroom = clamp(inputs.fiscalHeadroom ?? 55);
  const stateCapacityLoad = clamp(inputs.stateCapacityLoad ?? 40);
  const gap = clamp(inputs.workforceSpecialistGap ?? 32);
  const wf = workforceScore(inputs.workforceReadiness, gap);

  const nationalProgramSlots = computeNationalProgramSlots(fiscalHeadroom, stateCapacityLoad);
  const slotsUsed = activeCommitments.filter(
    (c) => turn >= c.committedTurn && turn - c.committedTurn < c.durationTurns
  ).length;
  const slotsFree = Math.max(0, nationalProgramSlots - slotsUsed);

  const fiscalAbsorptionCap = computeFiscalAbsorptionCap(fiscalHeadroom, stateCapacityLoad);
  let fiscalLoadScheduledThisTurn = 0;
  for (const c of activeCommitments) {
    if (turn < c.committedTurn || turn - c.committedTurn >= c.durationTurns) continue;
    fiscalLoadScheduledThisTurn += c.fiscalLoadPoints / Math.max(1, c.durationTurns);
  }
  fiscalLoadScheduledThisTurn = Math.round(fiscalLoadScheduledThisTurn * 10) / 10;

  const fiscalHeadroomUsedRatio =
    fiscalAbsorptionCap > 0 ? clamp((fiscalLoadScheduledThisTurn / fiscalAbsorptionCap) * 100) : 100;

  const workforceUtilization = clamp(
    (slotsUsed / Math.max(1, nationalProgramSlots)) * 55 + (100 - wf) * 0.35 + gap * 0.25
  );

  const byPillar = {} as Record<PublicServicePillar, PillarCapacitySlice>;
  let capacitySum = 0;
  for (const pillar of AGENT14_PILLARS) {
    const { loadPoints, count } = pillarLoad(activeCommitments, pillar, turn);
    const pillarCap = fiscalAbsorptionCap / 3;
    const loadRatio = pillarCap > 0 ? loadPoints / pillarCap : 1;
    const capacityIndex = clamp(100 - loadRatio * 38 - (count > 3 ? (count - 3) * 6 : 0));
    byPillar[pillar] = {
      capacityIndex,
      loadRatio: Math.round(loadRatio * 100) / 100,
      activeCommitments: count,
    };
    capacitySum += capacityIndex;
  }

  let bindingConstraint: CapacityBindingConstraint = 'none';
  if (slotsFree <= 0) bindingConstraint = 'program_slots';
  else if (fiscalLoadScheduledThisTurn > fiscalAbsorptionCap * 1.02) bindingConstraint = 'fiscal_absorption';
  else if (workforceUtilization >= 88) bindingConstraint = 'workforce';

  const deliveryCapacityIndex = clamp(
    capacitySum / AGENT14_PILLARS.length -
      (bindingConstraint === 'fiscal_absorption' ? 8 : 0) -
      (bindingConstraint === 'program_slots' ? 6 : 0)
  );

  const evidence = [
    `slots ${slotsUsed}/${nationalProgramSlots}`,
    `fiscal ${fiscalLoadScheduledThisTurn}/${fiscalAbsorptionCap}`,
    `workforce util ${workforceUtilization}`,
    `binding ${bindingConstraint}`,
  ];

  return {
    turn,
    nationalProgramSlots,
    slotsUsed,
    slotsFree,
    fiscalAbsorptionCap,
    fiscalLoadScheduledThisTurn,
    fiscalHeadroomUsedRatio,
    workforceUtilization,
    deliveryCapacityIndex,
    bindingConstraint,
    byPillar,
    evidence,
  };
}

export function canAcceptSpendingCommitment(
  capacity: PublicServiceCapacitySnapshot,
  commitment: Pick<SpendingCommitment, 'fiscalLoadPoints' | 'durationTurns'>
): { allowed: boolean; reason: string } {
  if (capacity.slotsFree <= 0) {
    return { allowed: false, reason: 'No free national program slots for a new commitment.' };
  }
  const incrementalLoad = commitment.fiscalLoadPoints / Math.max(1, commitment.durationTurns);
  if (capacity.fiscalLoadScheduledThisTurn + incrementalLoad > capacity.fiscalAbsorptionCap * 1.05) {
    return {
      allowed: false,
      reason: 'Incremental fiscal load would exceed public finance absorption capacity this turn.',
    };
  }
  return { allowed: true, reason: 'Within capacity.' };
}
