import { v1014laborBandMigration, v1014laborClamp } from './bands';
import type { NationalHouseholdBudgetDetail } from './household-budget-detail';
import {
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_LIMITS,
  type LaborDemographicsInputs,
  type LaborMigrationShock,
  type LaborMigrationShockView,
  type MigrationFlowBand,
  type MigrationShockKind
} from './types';

export const MIGRATION_SHOCK_LABEL: Record<MigrationShockKind, string> = {
  resource_boom_inflow: 'Resource-sector labor inflow shock',
  housing_affordability_outflow: 'Housing affordability outflow shock',
  essential_access_outflow: 'Essential access outflow shock',
  metro_talent_pull: 'Metro talent pull shock',
  frontier_recovery_inflow: 'Frontier recovery inflow shock'
};

function shockId(kind: MigrationShockKind, regionId: string, turn: number): string {
  return `msh_${kind}_${regionId}_t${turn}`;
}

export function detectMigrationShocks(params: {
  turn: number;
  inputs: LaborDemographicsInputs;
  householdBudget: NationalHouseholdBudgetDetail;
}): LaborMigrationShock[] {
  const { turn, inputs, householdBudget } = params;
  const shocks: LaborMigrationShock[] = [];
  const duration = V1014_LABOR_LIMITS.migrationShockDefaultDuration;

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const miningOut = Number(inputs.industries?.regions?.[regionId]?.industries?.mining?.effectiveOutput || 0);
    if (miningOut >= 45 && (regionId === 'WA' || regionId === 'QLD')) {
      shocks.push({
        id: shockId('resource_boom_inflow', regionId, turn),
        kind: 'resource_boom_inflow',
        regionId,
        magnitude: v1014laborClamp(8 + miningOut * 0.15, 8, 22),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'High mining effectiveOutput pulls structural inflow (no population counts).'
      });
    }

    const hh = householdBudget.regions[regionId];
    if (hh && hh.budgetPressureScore >= 68) {
      shocks.push({
        id: shockId('housing_affordability_outflow', regionId, turn),
        kind: 'housing_affordability_outflow',
        regionId,
        magnitude: -v1014laborClamp(hh.budgetPressureScore * 0.18, 6, 18),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'Severe household budget pressure discourages net inflow.'
      });
    }
    if (hh && hh.essentialsGapScore >= 55) {
      shocks.push({
        id: shockId('essential_access_outflow', regionId, turn),
        kind: 'essential_access_outflow',
        regionId,
        magnitude: -v1014laborClamp(hh.essentialsGapScore * 0.12, 4, 14),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'Essential access strain increases outflow pressure.'
      });
    }

    const techOut = Number(inputs.industries?.regions?.[regionId]?.industries?.technology?.effectiveOutput || 0);
    if ((regionId === 'NSW' || regionId === 'VIC') && techOut >= 35 && hh && hh.budgetPressureScore <= 45) {
      shocks.push({
        id: shockId('metro_talent_pull', regionId, turn),
        kind: 'metro_talent_pull',
        regionId,
        magnitude: v1014laborClamp(6 + techOut * 0.1, 6, 16),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'Metro tech output with manageable budgets attracts talent inflow.'
      });
    }
  });

  if (householdBudget.shockSensitivity === 'critical' || householdBudget.shockSensitivity === 'high') {
    const frontier = ['NT', 'TAS', 'SA'].find(
      c => (householdBudget.regions[c]?.budgetPressureScore ?? 50) <= 40
    );
    if (frontier) {
      shocks.push({
        id: shockId('frontier_recovery_inflow', frontier, turn),
        kind: 'frontier_recovery_inflow',
        regionId: frontier,
        magnitude: 7,
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'National household shock sensitivity redirects modest recovery inflow to a frontier region.'
      });
    }
  }

  return shocks.slice(0, V1014_LABOR_LIMITS.maxActiveMigrationShocks);
}

export function mergeMigrationShocks(
  persisted: LaborMigrationShock[] | undefined,
  detected: LaborMigrationShock[],
  overrides: LaborMigrationShock[] | undefined,
  turn: number
): LaborMigrationShock[] {
  const byId = new Map<string, LaborMigrationShock>();
  (persisted || []).forEach(s => {
    if (s.turnsRemaining > 0) byId.set(s.id, s);
  });
  detected.forEach(s => byId.set(s.id, s));
  (overrides || []).forEach(s => byId.set(s.id, { ...s, startedTurn: s.startedTurn || turn }));
  return [...byId.values()]
    .filter(s => s.turnsRemaining > 0)
    .slice(-V1014_LABOR_LIMITS.maxActiveMigrationShocks);
}

export function advanceMigrationShocks(shocks: LaborMigrationShock[], turn: number): LaborMigrationShock[] {
  return shocks
    .map(s => ({
      ...s,
      turnsRemaining: Math.max(0, s.turnsRemaining - (s.startedTurn < turn ? 1 : 0))
    }))
    .filter(s => s.turnsRemaining > 0);
}

export function applyMigrationShocksToRegions(
  regions: Record<string, { migrationFlow: MigrationFlowBand; migrationFlowScore: number }>,
  shocks: LaborMigrationShock[]
): { totalDeltaApplied: number; regionsTouched: string[] } {
  const deltas: Record<string, number> = {};
  shocks.forEach(s => {
    deltas[s.regionId] = (deltas[s.regionId] || 0) + s.magnitude;
  });
  let totalDeltaApplied = 0;
  const regionsTouched: string[] = [];
  Object.entries(deltas).forEach(([regionId, delta]) => {
    if (!regions[regionId]) return;
    const next = v1014laborClamp(regions[regionId].migrationFlowScore + delta);
    regions[regionId].migrationFlowScore = next;
    regions[regionId].migrationFlow = v1014laborBandMigration(next);
    totalDeltaApplied += Math.abs(delta);
    regionsTouched.push(regionId);
  });
  return { totalDeltaApplied, regionsTouched };
}

export function toMigrationShockViews(shocks: LaborMigrationShock[]): LaborMigrationShockView[] {
  return shocks.map(s => ({
    id: s.id,
    kind: s.kind,
    regionId: s.regionId,
    magnitude: s.magnitude,
    turnsRemaining: s.turnsRemaining,
    label: MIGRATION_SHOCK_LABEL[s.kind]
  }));
}
