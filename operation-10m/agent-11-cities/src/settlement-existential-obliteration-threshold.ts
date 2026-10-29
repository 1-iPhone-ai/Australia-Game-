import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseHorizonConvergenceRow,
  OP10M_A11_ExistentialContinuityFractureRow,
  OP10M_A11_ExistentialObliterationThresholdBand,
  OP10M_A11_ExistentialObliterationThresholdRow,
  OP10M_A11_ExistentialTerminusLockRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function obliterationBand(score: number): OP10M_A11_ExistentialObliterationThresholdBand {
  if (score < 25) return 'dormant';
  if (score < 41) return 'approaching';
  if (score < 58) return 'breached';
  return 'obliterated';
}

export function op10mA11ComputeSettlementExistentialObliterationThreshold(args: {
  existentialTerminusLock: OP10M_A11_ExistentialTerminusLockRow[];
  collapseHorizonConvergence: OP10M_A11_CollapseHorizonConvergenceRow[];
  existentialContinuityFracture: OP10M_A11_ExistentialContinuityFractureRow[];
}): { rows: OP10M_A11_ExistentialObliterationThresholdRow[]; nationalIndex: number } {
  const terminusByRegion = new Map(args.existentialTerminusLock.map((t) => [t.regionId, t]));
  const horizonByRegion = new Map(args.collapseHorizonConvergence.map((c) => [c.regionId, c]));
  const fractureByRegion = new Map(args.existentialContinuityFracture.map((e) => [e.regionId, e]));

  const rows: OP10M_A11_ExistentialObliterationThresholdRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const terminus = terminusByRegion.get(rid);
    const horizon = horizonByRegion.get(rid);
    const fracture = fractureByRegion.get(rid);

    const terminusDrag = terminus ? op10mA11Clamp(terminus.terminusScore * 0.47) : 14;
    const horizonDrag = horizon ? op10mA11Clamp(horizon.convergenceScore * 0.42) : 12;
    const fractureDrag = fracture ? op10mA11Clamp(fracture.fractureScore * 0.39) : 11;

    const thresholdScore = op10mA11Clamp(terminusDrag + horizonDrag + fractureDrag * 0.5);
    weighted += thresholdScore;

    const triggers: string[] = [];
    if (terminus && (terminus.band === 'sealed' || terminus.band === 'terminal')) {
      triggers.push('terminus breach');
    }
    if (horizon && (horizon.band === 'imminent' || horizon.band === 'locked')) {
      triggers.push('horizon breach');
    }
    if (fracture && (fracture.band === 'shattered' || fracture.band === 'extinguished')) {
      triggers.push('continuity void');
    }
    if (!triggers.length) triggers.push('threshold dormant');

    rows.push({
      regionId: rid,
      thresholdScore: op10mA11Round(thresholdScore),
      band: obliterationBand(thresholdScore),
      triggers: triggers.slice(0, 3),
      narrative: `${rid} existential obliteration threshold ${obliterationBand(thresholdScore)} (${op10mA11Round(thresholdScore)}); ${triggers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.thresholdScore - a.thresholdScore), nationalIndex };
}

export function op10mA11RegionsWithObliteratedExistentialThreshold(
  rows: OP10M_A11_ExistentialObliterationThresholdRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'breached' || r.band === 'obliterated').map((r) => r.regionId);
}

export function op10mA11ExistentialObliterationThresholdEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
