import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_GovernanceFrictionBand,
  OP10M_A11_GovernanceFrictionRow,
  OP10M_A11_NationalUrbanInputs,
  OP10M_A11_ReliefPlaybookItem,
  OP10M_A11_RegionId,
  OP10M_A11_ServiceEquityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

const DISTRIBUTION_FRICTION: Record<OP10M_A11_NationalUrbanInputs['distributionBand'], number> = {
  balanced: 8,
  mixed: 18,
  uneven: 32,
  highly_uneven: 44,
};

function frictionBand(score: number): OP10M_A11_GovernanceFrictionBand {
  if (score < 30) return 'aligned';
  if (score < 50) return 'strained';
  if (score < 68) return 'fragmented';
  return 'breakdown';
}

export function op10mA11ComputeMultiTierGovernanceFriction(args: {
  national: OP10M_A11_NationalUrbanInputs;
  reliefPlaybook: OP10M_A11_ReliefPlaybookItem[];
  serviceEquity: OP10M_A11_ServiceEquityRow[];
}): { rows: OP10M_A11_GovernanceFrictionRow[]; nationalIndex: number } {
  const playbookByRegion = new Map(args.reliefPlaybook.map((p) => [p.regionId, p]));
  const equityByRegion = new Map(args.serviceEquity.map((e) => [e.regionId, e]));
  const nationalDrag = DISTRIBUTION_FRICTION[args.national.distributionBand];

  const rows: OP10M_A11_GovernanceFrictionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const playbook = playbookByRegion.get(rid);
    const equity = equityByRegion.get(rid);
    const reliefUrgency =
      playbook?.priority === 'urgent' ? 38 : playbook?.priority === 'high' ? 26 : playbook?.priority === 'medium' ? 14 : 6;
    const equityGap = equity ? op10mA11Clamp(72 - equity.equityScore) : 20;

    const frictionScore = op10mA11Clamp(reliefUrgency * 0.55 + equityGap * 0.42 + nationalDrag * 0.35);
    weighted += frictionScore;

    const coordinationGaps: string[] = [];
    if (playbook && (playbook.priority === 'urgent' || playbook.priority === 'high')) {
      coordinationGaps.push('relief coordination lag');
    }
    if (equity && (equity.band === 'critical_gap' || equity.band === 'uneven')) {
      coordinationGaps.push('service tier mismatch');
    }
    if (nationalDrag >= 32) coordinationGaps.push('national distribution skew');
    if (!coordinationGaps.length) coordinationGaps.push('routine intergovernmental sync');

    rows.push({
      regionId: rid,
      frictionScore: op10mA11Round(frictionScore),
      band: frictionBand(frictionScore),
      coordinationGaps: coordinationGaps.slice(0, 3),
      narrative: `${rid} governance ${frictionBand(frictionScore)} (friction ${op10mA11Round(frictionScore)}); ${coordinationGaps.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.frictionScore - a.frictionScore), nationalIndex };
}

export function op10mA11RegionsWithGovernanceBreakdown(rows: OP10M_A11_GovernanceFrictionRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'breakdown' || r.band === 'fragmented').map((r) => r.regionId);
}

export function op10mA11GovernanceFrictionEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 58;
  return currentIndex >= 52 && currentIndex > priorIndex + 5;
}
