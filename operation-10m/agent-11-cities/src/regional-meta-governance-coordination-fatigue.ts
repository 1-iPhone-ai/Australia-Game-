import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_FiscalGovernanceCouplingRow,
  OP10M_A11_GovernanceFrictionRow,
  OP10M_A11_MetaGovernanceFatigueBand,
  OP10M_A11_MetaGovernanceFatigueRow,
  OP10M_A11_RegionId,
  OP10M_A11_ReliefOverheadRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function fatigueBand(score: number): OP10M_A11_MetaGovernanceFatigueBand {
  if (score < 24) return 'rested';
  if (score < 42) return 'tiring';
  if (score < 58) return 'fatigued';
  return 'exhausted';
}

export function op10mA11ComputeRegionalMetaGovernanceCoordinationFatigue(args: {
  fiscalGovernanceCoupling: OP10M_A11_FiscalGovernanceCouplingRow[];
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  reliefOverhead: OP10M_A11_ReliefOverheadRow[];
}): { rows: OP10M_A11_MetaGovernanceFatigueRow[]; nationalIndex: number } {
  const couplingByRegion = new Map(args.fiscalGovernanceCoupling.map((f) => [f.regionId, f]));
  const frictionByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const overheadByRegion = new Map(args.reliefOverhead.map((r) => [r.regionId, r]));

  const rows: OP10M_A11_MetaGovernanceFatigueRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const coupling = couplingByRegion.get(rid);
    const friction = frictionByRegion.get(rid);
    const overhead = overheadByRegion.get(rid);

    const couplingDrag = coupling ? op10mA11Clamp(coupling.strainScore * 0.44) : 14;
    const frictionDrag = friction ? op10mA11Clamp(friction.frictionScore * 0.38) : 12;
    const overheadDrag = overhead ? op10mA11Clamp(overhead.overheadScore * 0.36) : 10;

    const fatigueScore = op10mA11Clamp(couplingDrag + frictionDrag + overheadDrag * 0.5);
    weighted += fatigueScore;

    const signals: string[] = [];
    if (coupling && (coupling.band === 'misaligned' || coupling.band === 'ruptured')) {
      signals.push('fiscal–governance rupture');
    }
    if (friction && (friction.band === 'fragmented' || friction.band === 'breakdown')) {
      signals.push('coordination breakdown');
    }
    if (overhead && (overhead.band === 'overloaded' || overhead.band === 'paralytic')) {
      signals.push('relief overhead');
    }
    if (!signals.length) signals.push('coordination headroom');

    rows.push({
      regionId: rid,
      fatigueScore: op10mA11Round(fatigueScore),
      band: fatigueBand(fatigueScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} meta-governance coordination ${fatigueBand(fatigueScore)} (${op10mA11Round(fatigueScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.fatigueScore - a.fatigueScore), nationalIndex };
}

export function op10mA11RegionsWithMetaGovernanceExhaustion(
  rows: OP10M_A11_MetaGovernanceFatigueRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fatigued' || r.band === 'exhausted').map((r) => r.regionId);
}

export function op10mA11MetaGovernanceFatigueEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}
