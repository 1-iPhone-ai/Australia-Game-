import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CascadingFailureRiskRow,
  OP10M_A11_CompoundShockSaturationRow,
  OP10M_A11_InstitutionalTrustErosionRow,
  OP10M_A11_IrrecoverableCollapseBand,
  OP10M_A11_IrrecoverableCollapseThresholdRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function collapseBand(score: number): OP10M_A11_IrrecoverableCollapseBand {
  if (score < 27) return 'recoverable';
  if (score < 45) return 'stressed';
  if (score < 62) return 'terminal';
  return 'irrecoverable';
}

export function op10mA11ComputeSettlementIrrecoverableCollapseThreshold(args: {
  cascadingFailureRisk: OP10M_A11_CascadingFailureRiskRow[];
  compoundShockSaturation: OP10M_A11_CompoundShockSaturationRow[];
  institutionalTrustErosion: OP10M_A11_InstitutionalTrustErosionRow[];
}): { rows: OP10M_A11_IrrecoverableCollapseThresholdRow[]; nationalIndex: number } {
  const cascadeByRegion = new Map(args.cascadingFailureRisk.map((c) => [c.regionId, c]));
  const shockByRegion = new Map(args.compoundShockSaturation.map((s) => [s.regionId, s]));
  const trustByRegion = new Map(args.institutionalTrustErosion.map((t) => [t.regionId, t]));

  const rows: OP10M_A11_IrrecoverableCollapseThresholdRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const cascade = cascadeByRegion.get(rid);
    const shock = shockByRegion.get(rid);
    const trust = trustByRegion.get(rid);

    const cascadeDrag = cascade ? op10mA11Clamp(cascade.cascadeScore * 0.46) : 14;
    const shockDrag = shock ? op10mA11Clamp(shock.saturationScore * 0.41) : 12;
    const trustDrag = trust ? op10mA11Clamp(trust.erosionScore * 0.35) : 10;

    const thresholdScore = op10mA11Clamp(cascadeDrag + shockDrag + trustDrag * 0.5);
    weighted += thresholdScore;

    const markers: string[] = [];
    if (cascade && (cascade.band === 'cascade_risk' || cascade.band === 'systemic')) {
      markers.push('cascade threshold');
    }
    if (shock && (shock.band === 'saturated' || shock.band === 'overwhelmed')) {
      markers.push('shock overload');
    }
    if (trust && (trust.band === 'brittle' || trust.band === 'breakdown')) {
      markers.push('trust void');
    }
    if (!markers.length) markers.push('recovery headroom');

    rows.push({
      regionId: rid,
      thresholdScore: op10mA11Round(thresholdScore),
      band: collapseBand(thresholdScore),
      markers: markers.slice(0, 3),
      narrative: `${rid} irrecoverable collapse threshold ${collapseBand(thresholdScore)} (${op10mA11Round(thresholdScore)}); ${markers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.thresholdScore - a.thresholdScore), nationalIndex };
}

export function op10mA11RegionsWithIrrecoverableCollapse(
  rows: OP10M_A11_IrrecoverableCollapseThresholdRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'terminal' || r.band === 'irrecoverable').map((r) => r.regionId);
}

export function op10mA11IrrecoverableCollapseThresholdEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 6;
}
