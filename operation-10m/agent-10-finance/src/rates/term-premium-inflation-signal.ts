import type { InflationConditionsBand } from '../definitions/types.js';
import type { FiscalPressureBand, SovereignDebtPressureBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TermPremiumSignalBand = 'anchored' | 'creeping' | 'unanchored' | 'stress';

export interface TermPremiumInflationSignal {
  signalBand: TermPremiumSignalBand;
  premiumBps: number;
  narrative: string;
}

/** Long-end term premium as inflation-expectations stress metaphor (deterministic). */
export function assessTermPremiumInflationSignal(input: {
  inflationBand: InflationConditionsBand;
  fiscalPressure: FiscalPressureBand;
  sovereignDebtPressure: SovereignDebtPressureBand;
  highInflationScenario: boolean;
}): TermPremiumInflationSignal {
  let premiumBps = 45;
  if (input.inflationBand === 'elevated') premiumBps += 35;
  if (input.inflationBand === 'high') premiumBps += 75;
  if (input.inflationBand === 'scenario_runaway') premiumBps += 120;

  if (input.fiscalPressure === 'strained') premiumBps += 25;
  if (input.fiscalPressure === 'critical') premiumBps += 55;

  if (input.sovereignDebtPressure === 'elevated') premiumBps += 30;
  if (input.sovereignDebtPressure === 'high' || input.sovereignDebtPressure === 'critical') {
    premiumBps += 50;
  }

  if (input.highInflationScenario) premiumBps += 20;

  premiumBps = finClamp(premiumBps, 15, 420);

  let signalBand: TermPremiumSignalBand = 'anchored';
  if (premiumBps >= 280) signalBand = 'stress';
  else if (premiumBps >= 175) signalBand = 'unanchored';
  else if (premiumBps >= 95) signalBand = 'creeping';

  const narrative =
    signalBand === 'stress'
      ? 'Term premium elevated — long-run inflation expectations under stress in metadata.'
      : signalBand === 'unanchored'
        ? 'Term premium creeping up — fiscal and inflation mix unanchoring long rates.'
        : signalBand === 'creeping'
          ? 'Mild term premium drift — monitor fiscal and CPI bands.'
          : 'Term premium consistent with anchored inflation expectations.';

  return { signalBand, premiumBps: finRound(premiumBps, 0), narrative };
}

export function termPremiumTighteningBias(signal: TermPremiumInflationSignal): number {
  if (signal.signalBand === 'stress') return 0.22;
  if (signal.signalBand === 'unanchored') return 0.12;
  if (signal.signalBand === 'creeping') return 0.05;
  return 0;
}
