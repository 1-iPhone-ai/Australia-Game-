import { buildBudgetEnvelope } from '../fiscal-outcomes/budget-envelopes';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ExpenditureCeilingRow, ForwardEstimateBand, MultiYearExpenditureFramework } from './types';
import { MULTI_YEAR_FRAMEWORK_SCHEMA } from './types';

const CATEGORY_GROWTH_CAPS: Partial<Record<ExpenditureCeilingRow['category'], number>> = {
  health_social: 3.2,
  education_skills: 2.8,
  infrastructure_capital: 4.5,
  defence_security: 2.0,
  transfers_states: 3.5,
  debt_service_reserve: 1.5,
  contingency: 0.5
};

export function buildExpenditureCeilingRows(
  v1012: V1012FiscalSnapshot,
  envelope = buildBudgetEnvelope(v1012)
): ExpenditureCeilingRow[] {
  return envelope.lines.map(line => {
    const growthCap = CATEGORY_GROWTH_CAPS[line.category] ?? 2.5;
    const baseline = line.allocatedPoints;
    const ceiling = Math.round(baseline * (1 + growthCap / 100) * 10) / 10;
    const headroom = Math.round((ceiling - baseline) * 10) / 10;
    const binding = v1012.fiscalHeadroom < 0 && (line.flexPoints <= 1 || v1012.pressure === 'strained' || v1012.pressure === 'critical');
    return {
      category: line.category,
      baselinePoints: baseline,
      ceilingPoints: ceiling,
      growthCapPercent: growthCap,
      headroomToCeiling: headroom,
      binding
    };
  });
}

export function buildMultiYearExpenditureFramework(
  v1012: V1012FiscalSnapshot,
  horizonTurns = 4
): MultiYearExpenditureFramework {
  const warnings: string[] = [];
  const persisted = createInitialFiscalOutcomesPersisted(v1012.turn);
  const { state } = computeFiscalOutcomesLayer({ turn: v1012.turn, v1012 }, persisted);
  const ceilings = buildExpenditureCeilingRows(v1012, state.budget);
  const forwardBands: ForwardEstimateBand[] = [];

  let working = { ...v1012 };
  for (let i = 0; i <= horizonTurns; i++) {
    const turn = v1012.turn + i;
    const envelope = buildBudgetEnvelope(working);
    const recurring = scheduleRecurringCommitments(turn, working, envelope);
    const infraLine = envelope.lines.find(l => l.category === 'infrastructure_capital');
    const contingency = envelope.lines.find(l => l.category === 'contingency');
    const capitalPipeline = Math.round((infraLine?.allocatedPoints ?? 0) * (1 + i * 0.04) * 10) / 10;
    const withinCeiling =
      recurring.totalLoadThisTurn <= envelope.totalCapacityPoints * 0.48 &&
      capitalPipeline <= (infraLine?.flexPoints ?? 0) + envelope.totalCapacityPoints * 0.12;

    forwardBands.push({
      turn,
      label: i === 0 ? 'Budget' : `Forward +${i}`,
      envelopeCapacity: envelope.totalCapacityPoints,
      recurringLoad: recurring.totalLoadThisTurn,
      capitalPipeline,
      contingencyFlex: contingency?.flexPoints ?? 0,
      withinCeiling
    });

    working = {
      ...working,
      turn,
      fiscalHeadroom: Math.round((working.fiscalHeadroom - 0.25 - working.debtServiceLoad * 0.015) * 10) / 10,
      maintenanceLoad: Math.round((working.maintenanceLoad + 0.08) * 10) / 10
    };
  }

  const aggregateCeilingBinding = ceilings.some(c => c.binding) || forwardBands.some(b => !b.withinCeiling);
  const parameterSettingsGrowth =
    Math.round(ceilings.reduce((s, c) => s + c.growthCapPercent, 0) / Math.max(1, ceilings.length) * 10) / 10;

  if (aggregateCeilingBinding) {
    warnings.push('At least one forward band or category ceiling is binding under current settings.');
  }
  if (forwardBands.some(b => b.contingencyFlex < 2)) {
    warnings.push('Contingency flex falls below 2pt guard in forward estimates.');
  }

  const narrative = aggregateCeilingBinding
    ? 'Multi-year framework signals sequencing — align parameter settings with ceiling headroom.'
    : 'Multi-year expenditure settings remain within staged ceiling bands across the horizon.';

  return {
    schemaVersion: MULTI_YEAR_FRAMEWORK_SCHEMA,
    baseTurn: v1012.turn,
    horizonTurns,
    ceilings,
    forwardBands,
    aggregateCeilingBinding,
    parameterSettingsGrowth,
    narrative,
    warnings
  };
}
