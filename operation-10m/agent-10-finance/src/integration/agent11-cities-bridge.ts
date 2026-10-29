import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only cities / regions snapshot from Agent 11 (contract only). */
export interface Agent11CitiesSnapshot {
  turn: number;
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  urbanizationPressure: 'low' | 'medium' | 'high';
  regionalDispersionScore: number;
  /** Round 21: critical metro rent dispersion band. */
  metroRentDispersionCritical?: boolean;
  /** Round 21: regional markets syncing housing inflation. */
  regionalHousingInflationSync?: boolean;
  /** Round 32: urban rent inflation latch. */
  urbanRentInflationLatch?: boolean;
  /** Round 32: metro dispersion stress band. */
  metroDispersionStressBand?: 'aligned' | 'widening' | 'critical';
}

export function mergeAgent11IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent11CitiesSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.vacancyBand === 'critical' || snapshot.rentGrowthBand === 'surging') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.09, 0.85, 1.45);
  } else if (snapshot.vacancyBand === 'tight' || snapshot.rentGrowthBand === 'strong') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.urbanizationPressure === 'high' && snapshot.regionalDispersionScore > 0.55) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  let householdAffordability = base.householdAffordability;
  if (snapshot.vacancyBand === 'critical' && snapshot.rentGrowthBand !== 'subdued') {
    householdAffordability = 'severe_pressure';
  } else if (snapshot.rentGrowthBand === 'strong' || snapshot.rentGrowthBand === 'surging') {
    householdAffordability = householdAffordability === 'healthy' ? 'strained' : householdAffordability;
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.metroRentDispersionCritical && snapshot.regionalHousingInflationSync) {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.urbanRentInflationLatch && snapshot.metroDispersionStressBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.metroDispersionStressBand === 'widening' && snapshot.rentGrowthBand === 'surging') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    householdAffordability,
    highInflationScenario,
    householdInflationScenarioActive:
      base.householdInflationScenarioActive ||
      snapshot.rentGrowthBand === 'surging' ||
      snapshot.vacancyBand === 'critical',
  };
}

export function agent11CitiesBridgeIntegrationNote(): string {
  return 'Agent 11 cities snapshot adjusts shelter-side inflation and affordability flags; no land price writes.';
}
