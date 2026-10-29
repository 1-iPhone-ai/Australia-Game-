import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { NationalRevenueLedger } from '../revenue-ledger/types';
import type { TaxPolicyLever, TaxPolicySensitivityLine, TaxPolicySensitivityReport } from './types';
import { TAX_POLICY_SENSITIVITY_SCHEMA } from './types';

const AGGREGATE_MARGINAL_CAP = 14;

function line(
  id: string,
  lever: TaxPolicyLever,
  label: string,
  marginal: number,
  elasticity: number
): TaxPolicySensitivityLine {
  const withinSensitivityBand = Math.abs(marginal) <= 5.5 && elasticity >= 0.08 && elasticity <= 1.2;
  return {
    id,
    lever,
    label,
    marginalRevenuePoints: Math.round(marginal * 10) / 10,
    elasticity: Math.round(elasticity * 100) / 100,
    withinSensitivityBand
  };
}

export function buildTaxPolicySensitivityReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  ledger?: NationalRevenueLedger
): TaxPolicySensitivityReport {
  const policySkew =
    v1012.revenuePolicy === 'expansionary' ? -0.35 : v1012.revenuePolicy === 'revenue_focused' ? 0.45 : 0;
  const headroomSkew = Math.max(-0.4, Math.min(0.5, v1012.fiscalHeadroom * 0.04));

  const raw: Array<[string, TaxPolicyLever, string, number, number]> = [
    ['tps_pit', 'personal_income', 'Personal income schedule', 2.8 + policySkew + headroomSkew, 0.42],
    ['tps_company', 'company_tax', 'Company tax base', 2.1 + policySkew * 0.8, 0.55],
    ['tps_gst', 'consumption_base', 'Consumption base breadth', 1.6 + headroomSkew * 0.6, 0.38],
    ['tps_rent', 'resource_rent', 'Resource rent sensitivity', 3.4 - policySkew * 0.5, 0.72]
  ];

  let lines: TaxPolicySensitivityLine[] = raw.map(([id, lever, label, marginal, elast]) =>
    line(id, lever, label, marginal, elast)
  );

  if (v1012.pressure !== 'critical') {
    lines = lines.map(l =>
      l.withinSensitivityBand
        ? l
        : {
            ...l,
            marginalRevenuePoints: Math.sign(l.marginalRevenuePoints) * Math.min(5.5, Math.abs(l.marginalRevenuePoints)),
            withinSensitivityBand: true
          }
    );
  }

  const aggregateMarginalPoints = Math.round(lines.reduce((s, l) => s + l.marginalRevenuePoints, 0) * 10) / 10;
  const modeledUpliftPoints = Math.round(aggregateMarginalPoints * (0.35 + (turn % 5) * 0.02) * 10) / 10;

  const ledgerDelta = ledger?.streams.reduce((s, st) => s + st.deltaPoints, 0) ?? 0;
  const coherentWithLedgerDelta =
    Math.abs(modeledUpliftPoints - ledgerDelta * 0.25) <= 4.5 ||
    v1012.pressure === 'critical' ||
    !ledger?.reconciledToV1012;

  const withinAggregateBand =
    Math.abs(aggregateMarginalPoints) <= AGGREGATE_MARGINAL_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && Math.abs(aggregateMarginalPoints) <= AGGREGATE_MARGINAL_CAP * 1.1);

  const warnings: string[] = [];
  if (!withinAggregateBand) {
    warnings.push(`Aggregate marginal ${aggregateMarginalPoints} exceeds cap ${AGGREGATE_MARGINAL_CAP}.`);
  }
  if (!coherentWithLedgerDelta) {
    warnings.push(`Modeled uplift ${modeledUpliftPoints} diverges from ledger delta ${ledgerDelta}.`);
  }

  const narrative = withinAggregateBand
    ? `Tax policy sensitivity aggregate ${aggregateMarginalPoints} pts; modeled uplift ${modeledUpliftPoints}.`
    : `Tax sensitivity alert: aggregate marginal ${aggregateMarginalPoints}.`;

  return {
    schemaVersion: TAX_POLICY_SENSITIVITY_SCHEMA,
    turn,
    lines,
    aggregateMarginalPoints,
    modeledUpliftPoints,
    withinAggregateBand,
    coherentWithLedgerDelta,
    narrative,
    warnings
  };
}
