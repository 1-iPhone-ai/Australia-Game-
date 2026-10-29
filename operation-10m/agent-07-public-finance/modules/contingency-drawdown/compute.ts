import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalRulesFrameworkReport } from '../fiscal-rules/types';
import type {
  ContingencyDrawdownEntry,
  ContingencyDrawdownRegisterReport,
  DrawdownReason
} from './types';
import { CONTINGENCY_DRAWDOWN_REGISTER_SCHEMA } from './types';

const DRAWDOWN_RATIO_CAP = 0.62;

function entry(
  id: string,
  reason: DrawdownReason,
  label: string,
  draw: number,
  opening: number
): ContingencyDrawdownEntry {
  const remainingFlexPoints = Math.round(Math.max(0, opening - draw) * 10) / 10;
  return {
    id,
    reason,
    label,
    drawdownPoints: Math.round(draw * 10) / 10,
    remainingFlexPoints,
    withinEntryCap: draw <= opening * 0.28 + 0.5
  };
}

export function buildContingencyDrawdownRegisterReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  openingFlexPoints: number,
  fiscalRules?: FiscalRulesFrameworkReport
): ContingencyDrawdownRegisterReport {
  const shockScale =
    v1012.pressure === 'critical' ? 1.45 : v1012.pressure === 'strained' ? 1.2 : v1012.pressure === 'tight' ? 1.05 : 1;
  const openingFlex = Math.round(Math.max(2, openingFlexPoints) * 10) / 10;

  const raw: Array<[string, DrawdownReason, string, number]> = [
    ['cd_shock', 'shock_response', 'Macro shock response', openingFlex * 0.12 * shockScale],
    ['cd_overrun', 'program_overrun', 'Program overrun top-up', openingFlex * 0.08 * (1 + v1012.maintenanceLoad * 0.02)],
    ['cd_disaster', 'disaster_relief', 'Disaster relief advance', openingFlex * 0.06 * shockScale],
    ['cd_policy', 'policy_top_up', 'Policy top-up (limited)', openingFlex * 0.05 * (v1012.revenuePolicy === 'expansionary' ? 1.25 : 1)]
  ];

  let entries: ContingencyDrawdownEntry[] = raw.map(([id, reason, label, draw]) =>
    entry(id, reason, label, draw, openingFlex)
  );

  let aggregateDrawdownPoints = Math.round(entries.reduce((s, e) => s + e.drawdownPoints, 0) * 10) / 10;

  if (v1012.pressure !== 'critical' && openingFlex > 0 && aggregateDrawdownPoints / openingFlex > DRAWDOWN_RATIO_CAP) {
    const scale = (DRAWDOWN_RATIO_CAP * openingFlex) / Math.max(0.1, aggregateDrawdownPoints);
    entries = entries.map(e => {
      const draw = Math.round(e.drawdownPoints * scale * 10) / 10;
      return entry(e.id, e.reason, e.label, draw, openingFlex);
    });
    aggregateDrawdownPoints = Math.round(entries.reduce((s, e) => s + e.drawdownPoints, 0) * 10) / 10;
  }

  const closingFlexPoints = Math.round(Math.max(0, openingFlex - aggregateDrawdownPoints) * 10) / 10;
  const drawdownToOpeningRatio =
    openingFlex <= 0 ? 0 : Math.round((aggregateDrawdownPoints / openingFlex) * 1000) / 1000;

  const withinDrawdownCap =
    drawdownToOpeningRatio <= DRAWDOWN_RATIO_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && drawdownToOpeningRatio <= DRAWDOWN_RATIO_CAP * 1.08);

  const breachCount = fiscalRules?.breachCount ?? 0;
  const contingencyObserved =
    fiscalRules?.assessments.find(a => a.ruleId === 'contingency_reserve_min')?.observed ?? closingFlexPoints;
  const coherentWithFiscalRules =
    breachCount <= 2 ||
    closingFlexPoints >= Math.min(contingencyObserved, openingFlex) * 0.35 ||
    v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinDrawdownCap) {
    warnings.push(`Drawdown ratio ${drawdownToOpeningRatio} exceeds cap ${DRAWDOWN_RATIO_CAP}.`);
  }
  if (!coherentWithFiscalRules) {
    warnings.push(`Closing flex ${closingFlexPoints} inconsistent with fiscal rules breaches ${breachCount}.`);
  }

  const narrative = withinDrawdownCap
    ? `Contingency drawdown ${aggregateDrawdownPoints} from opening flex ${openingFlex}; closing ${closingFlexPoints}.`
    : `Contingency alert: drawdown ratio ${drawdownToOpeningRatio}.`;

  return {
    schemaVersion: CONTINGENCY_DRAWDOWN_REGISTER_SCHEMA,
    turn,
    entries,
    openingFlexPoints: openingFlex,
    aggregateDrawdownPoints,
    closingFlexPoints,
    drawdownToOpeningRatio,
    withinDrawdownCap,
    coherentWithFiscalRules,
    narrative,
    warnings
  };
}
