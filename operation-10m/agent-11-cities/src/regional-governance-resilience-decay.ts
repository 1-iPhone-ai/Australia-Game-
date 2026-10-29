import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_GovernanceFrictionRow,
  OP10M_A11_GovernanceResilienceBand,
  OP10M_A11_GovernanceResilienceRow,
  OP10M_A11_ReliefEquityGapRow,
  OP10M_A11_RegionId,
  OP10M_A11_SystemicFragilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function resilienceBand(score: number): OP10M_A11_GovernanceResilienceBand {
  if (score < 22) return 'resilient';
  if (score < 40) return 'eroding';
  if (score < 58) return 'brittle';
  return 'collapsed';
}

export function op10mA11ComputeRegionalGovernanceResilienceDecay(args: {
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  systemicFragility: OP10M_A11_SystemicFragilityRow[];
  reliefEquityGap: OP10M_A11_ReliefEquityGapRow[];
}): { rows: OP10M_A11_GovernanceResilienceRow[]; nationalIndex: number } {
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const systemicByRegion = new Map(args.systemicFragility.map((s) => [s.regionId, s]));
  const equityByRegion = new Map(args.reliefEquityGap.map((r) => [r.regionId, r]));

  const rows: OP10M_A11_GovernanceResilienceRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const governance = governanceByRegion.get(rid);
    const systemic = systemicByRegion.get(rid);
    const equity = equityByRegion.get(rid);

    const frictionDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.48) : 14;
    const systemicDrag = systemic ? op10mA11Clamp(systemic.fragilityScore * 0.4) : 12;
    const equityDrag = equity ? op10mA11Clamp(equity.gapScore * 0.34) : 10;

    const decayScore = op10mA11Clamp(frictionDrag + systemicDrag + equityDrag * 0.55);
    weighted += decayScore;

    const drivers: string[] = [];
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      drivers.push('coordination breakdown');
    }
    if (systemic && (systemic.band === 'systemic' || systemic.band === 'cascade_risk')) {
      drivers.push('systemic stress');
    }
    if (equity && (equity.band === 'skewed' || equity.band === 'polarized')) drivers.push('relief inequity');
    if (!drivers.length) drivers.push('governance resilience intact');

    rows.push({
      regionId: rid,
      decayScore: op10mA11Round(decayScore),
      band: resilienceBand(decayScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} governance resilience ${resilienceBand(decayScore)} (${op10mA11Round(decayScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.decayScore - a.decayScore), nationalIndex };
}

export function op10mA11RegionsWithGovernanceResilienceCollapse(
  rows: OP10M_A11_GovernanceResilienceRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'brittle' || r.band === 'collapsed').map((r) => r.regionId);
}

export function op10mA11GovernanceResilienceDecayEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}
