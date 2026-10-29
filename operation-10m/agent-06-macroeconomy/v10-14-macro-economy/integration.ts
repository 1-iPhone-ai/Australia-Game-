import { v1014macroClamp } from './math.ts';
import type { GuardianDetectedRisk, GuardianEvaluationContext, NationalMacroEconomyState } from './types.ts';
import { validateNationalMacroEconomyState } from './accounting/validate-state.ts';

export function computeMacroEconomyRankingFit(
  state: NationalMacroEconomyState | null | undefined,
  regionId: string | null
): number {
  if (!state) return 0;
  let fit = 0;
  if (state.productivityBand === 'strong' || state.productivityBand === 'leading') fit += 1;
  if (state.investmentClimate === 'balanced' || state.investmentClimate === 'active') fit += 0.5;
  if (regionId) {
    const row = state.regionalContributions.find(r => r.regionId === regionId);
    if (row && (row.role === 'driver' || row.role === 'anchor')) fit += 0.5;
  }
  return v1014macroClamp(fit, -2, 2);
}

export function evaluateMacroEconomyGuardianWarnings(gs: any): Array<{
  id: string;
  title: string;
  detail: string;
  severity: 'info' | 'warn';
}> {
  if (gs.gameSettings && (gs.gameSettings.macroEconomyEnabled === false || gs.gameSettings.nationalSystemsEnabled === false)) {
    return [];
  }
  const st = gs.macroEconomyState as NationalMacroEconomyState | undefined;
  if (!st) return [];
  const out: Array<{ id: string; title: string; detail: string; severity: 'info' | 'warn' }> = [];
  const validation = validateNationalMacroEconomyState(st);
  if (!validation.valid) {
    out.push({
      id: 'me_accounting',
      title: 'Macro accounting identity drift',
      detail: validation.issues.join('; '),
      severity: 'warn'
    });
  }
  if (st.cyclePhase === 'contraction' || st.cyclePhase === 'trough') {
    out.push({
      id: 'me_cycle_down',
      title: 'National business cycle is weakening',
      detail: `Phase ${st.cyclePhase}`,
      severity: 'info'
    });
  }
  if (st.investmentClimate === 'frozen') {
    out.push({
      id: 'me_inv_frozen',
      title: 'Macro investment climate frozen',
      detail: 'National gross investment index is depressed',
      severity: 'info'
    });
  }
  return out;
}

export function evaluateMacroEconomyGuardianContext(
  context: GuardianEvaluationContext
): readonly GuardianDetectedRisk[] {
  if (context.isReplay) return [];
  const gs: any = context.gameState || {};
  const warnings = evaluateMacroEconomyGuardianWarnings({ ...gs, gameSettings: gs.gameSettings || context.gameSettings });
  if (!warnings.length) return [];
  return warnings.map((w, i) => ({
    id: `risk_macro_economy_${context.actorId}_t${context.turn}_${i}`,
    category: 'economy',
    severity: w.severity === 'warn' ? 'moderate' : 'informational',
    title: w.title,
    description: w.detail,
    evidence: ['V10.14 national macro accounting layer'],
    assumptions: ['National macro indices are not player cash; proceeding remains legal.'],
    probability: 1,
    estimatedImpact: 0,
    confidence: 0.8,
    reversible: true,
    immediate: false,
    triggeredSettingKeys: [],
    systemIds: ['macro_economy']
  }));
}
