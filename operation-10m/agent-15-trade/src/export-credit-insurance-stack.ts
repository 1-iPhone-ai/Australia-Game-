import type {
  GTELMaritimeRiskSnapshot,
  GTELPersisted,
  GTELExportInsuranceStackSnapshot,
  GTELTradeEnforcementSnapshot,
  GTELTradeFinanceSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELExportInsuranceStackBand = GTELExportInsuranceStackSnapshot['band'];

function stackBand(composite: number): GTELExportInsuranceStackBand {
  if (composite >= 0.78) return 'robust';
  if (composite >= 0.58) return 'adequate';
  if (composite >= 0.38) return 'strained';
  return 'impaired';
}

export function sanitizeExportInsuranceStackSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.56), 0.22, 0.92);
}

export function createEmptyExportInsuranceStackSnapshot(): GTELExportInsuranceStackSnapshot {
  return {
    compositeScore: 0.56,
    band: 'adequate',
    blendedPremium: 0.1,
    creditHeadroom: 0.62,
    summary: 'Export credit and marine insurance markets are broadly aligned.',
  };
}

export function advanceExportInsuranceStackSmoothing(
  persisted: GTELPersisted,
  rawComposite: number,
): GTELPersisted {
  const prev = sanitizeExportInsuranceStackSmoothing(persisted.exportInsuranceStackSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawComposite, 0.22, 0.92) * 0.28, 0.22, 0.92);
  return { ...persisted, exportInsuranceStackSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeExportInsuranceStackSnapshot(input: {
  tradeFinance: GTELTradeFinanceSnapshot;
  maritimeRisk: GTELMaritimeRiskSnapshot;
  tradeEnforcement: GTELTradeEnforcementSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELExportInsuranceStackSnapshot; persisted: GTELPersisted } {
  const financeLift = gtelClamp(input.tradeFinance.availabilityScore * 0.42, 0.05, 0.38);
  const maritimeDrag = gtelClamp(input.maritimeRisk.premiumIndex * 0.28 + input.maritimeRisk.insuranceLoad * 0.12, 0, 0.32);
  const enforcementDrag = gtelClamp(input.tradeEnforcement.probeLoad * 0.35 + input.tradeEnforcement.intensity * 0.08, 0, 0.22);
  const rawComposite = gtelClamp(0.38 + financeLift - maritimeDrag - enforcementDrag, 0.22, 0.92);
  const persisted = advanceExportInsuranceStackSmoothing(input.persisted, rawComposite);
  const compositeScore = sanitizeExportInsuranceStackSmoothing(persisted.exportInsuranceStackSmoothing);
  const band = stackBand(compositeScore);
  const blendedPremium = gtelClamp(
    input.tradeFinance.financingPremium * 0.45 +
      input.maritimeRisk.insuranceLoad * 0.35 +
      input.tradeEnforcement.probeLoad * 0.2,
    0.04,
    0.48,
  );
  const creditHeadroom = gtelClamp(
    compositeScore * 0.55 + input.tradeFinance.availabilityScore * 0.35 - blendedPremium * 0.15,
    0.18,
    0.88,
  );

  const summary =
    band === 'robust'
      ? 'Export credit insurers and marine underwriters are offering stacked cover without punitive loadings.'
      : band === 'impaired'
        ? 'Stacked export credit and war-risk premiums are choking new shipment declarations.'
        : band === 'strained'
          ? 'Blended insurance and export finance premiums are squeezing marginal export lanes.'
          : 'Export credit and marine insurance markets are broadly aligned.';

  return {
    snapshot: {
      compositeScore: Math.round(compositeScore * 1000) / 1000,
      band,
      blendedPremium: Math.round(blendedPremium * 1000) / 1000,
      creditHeadroom: Math.round(creditHeadroom * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function exportInsuranceStackExportScale(snapshot: GTELExportInsuranceStackSnapshot): number {
  if (snapshot.band === 'robust') return gtelClamp(1 + snapshot.creditHeadroom * 0.04, 1, 1.05);
  if (snapshot.band === 'impaired') return gtelClamp(0.84 + snapshot.compositeScore * 0.08, 0.8, 0.9);
  if (snapshot.band === 'strained') return gtelClamp(0.9 + snapshot.compositeScore * 0.06, 0.86, 0.96);
  return gtelClamp(0.96 + snapshot.compositeScore * 0.03, 0.92, 1.02);
}

export function exportInsuranceStackDomesticStress(snapshot: GTELExportInsuranceStackSnapshot): number {
  if (snapshot.band === 'impaired') return gtelClamp((0.55 - snapshot.compositeScore) * 0.12, 0.03, 0.08);
  if (snapshot.band === 'strained') return gtelClamp((0.5 - snapshot.compositeScore) * 0.08, 0, 0.05);
  return 0;
}

export function exportInsuranceStackWorldEvent(
  snapshot: GTELExportInsuranceStackSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'strained' && snapshot.band !== 'impaired') return null;
  if (snapshot.blendedPremium < 0.18) return null;
  return {
    id: `gtel_insurance_stack_${turn}`,
    turn,
    kind: 'trade',
    title: 'Export insurance stack repricing',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'WA'],
  };
}

export function exportInsuranceStackGiNotes(
  stack: GTELExportInsuranceStackSnapshot | null | undefined,
): string[] {
  if (!stack) return [];
  return [
    `Export credit insurance stack: ${stack.band} (${Math.round(stack.compositeScore * 100)}% composite).`,
    stack.summary,
  ];
}
