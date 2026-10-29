import { buildBudgetEnvelope } from '../fiscal-outcomes/budget-envelopes';
import type { FiscalOutcomeBand, V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { MediumTermFiscalOutlook, OutlookYearProjection } from './types';
import { MEDIUM_TERM_OUTLOOK_SCHEMA } from './types';

function bandFromHeadroom(headroom: number): FiscalOutcomeBand {
  if (headroom >= 12) return 'strong';
  if (headroom >= 4) return 'healthy';
  if (headroom >= -2) return 'mixed';
  if (headroom >= -10) return 'weak';
  return 'critical';
}

function pressureFromHeadroom(h: number): V1012FiscalSnapshot['pressure'] {
  if (h >= 12) return 'comfortable';
  if (h >= 5) return 'healthy';
  if (h >= 0) return 'tight';
  if (h >= -8) return 'strained';
  return 'critical';
}

export function buildMediumTermFiscalOutlook(
  base: V1012FiscalSnapshot,
  horizonTurns = 4
): MediumTermFiscalOutlook {
  const projections: OutlookYearProjection[] = [];
  const risks: string[] = [];
  let working = { ...base };

  for (let i = 0; i <= horizonTurns; i++) {
    const turn = base.turn + i;
    const revenueDrift = base.revenuePolicy === 'revenue_focused' ? 0.8 : base.revenuePolicy === 'growth_focused' ? 0.4 : 0.55;
    const headroomDrift = -0.35 - working.debtServiceLoad * 0.02 + (base.reservePolicy === 'prudent' ? 0.15 : 0);
    working = {
      ...working,
      turn,
      revenueCapacity: Math.max(0, Math.min(100, Math.round((working.revenueCapacity + revenueDrift) * 10) / 10)),
      fiscalHeadroom: Math.round((working.fiscalHeadroom + headroomDrift) * 10) / 10,
      debtServiceLoad: Math.round((working.debtServiceLoad + working.debtLevel * 0.008) * 10) / 10,
      maintenanceLoad: Math.round((working.maintenanceLoad + 0.12) * 10) / 10,
      pressure: pressureFromHeadroom(working.fiscalHeadroom)
    };
    const envelope = buildBudgetEnvelope(working);
    projections.push({
      label: i === 0 ? 'Budget' : `Forward +${i}`,
      turn,
      revenueCapacity: working.revenueCapacity,
      fiscalHeadroom: working.fiscalHeadroom,
      debtServiceLoad: working.debtServiceLoad,
      envelopeCapacity: envelope.totalCapacityPoints,
      underlyingCashBalance: Math.round((working.fiscalHeadroom * 0.9 - working.debtServiceLoad * 0.4) * 10) / 10,
      pressure: working.pressure
    });
  }

  const averageHeadroom =
    Math.round((projections.reduce((s, p) => s + p.fiscalHeadroom, 0) / projections.length) * 10) / 10;
  const worst = projections.reduce((w, p) => (p.fiscalHeadroom < w.fiscalHeadroom ? p : w), projections[0]!);
  const worstPressure = worst.pressure;

  if (worstPressure === 'critical' || worstPressure === 'strained') {
    risks.push('Forward path shows sustained pressure — align capital pipeline with envelope flex.');
  }
  if (projections.some(p => p.debtServiceLoad > 18)) {
    risks.push('Debt service load crosses soft 18pt guard within horizon.');
  }
  if (averageHeadroom < 2) {
    risks.push('Average headroom thin — recurring commitments may crowd out contingency.');
  }

  const trajectoryBand = bandFromHeadroom(averageHeadroom);
  const narrative =
    trajectoryBand === 'strong' || trajectoryBand === 'healthy'
      ? 'Medium-term fiscal settings support staged investment if commitments stay disciplined.'
      : 'Medium-term outlook requires sequencing of capital and transfer growth.';

  return {
    schemaVersion: MEDIUM_TERM_OUTLOOK_SCHEMA,
    baseTurn: base.turn,
    horizonTurns,
    projections,
    averageHeadroom,
    worstPressure,
    trajectoryBand,
    narrative,
    risks
  };
}
