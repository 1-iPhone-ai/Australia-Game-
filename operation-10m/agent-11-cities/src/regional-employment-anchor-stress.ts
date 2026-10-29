import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_DecentralizationShiftRow,
  OP10M_A11_EmploymentAnchorBand,
  OP10M_A11_EmploymentAnchorRow,
  OP10M_A11_LinkageHubProfile,
  OP10M_A11_RegionId,
  OP10M_A11_TalentRetentionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function anchorBand(score: number): OP10M_A11_EmploymentAnchorBand {
  if (score < 22) return 'anchored';
  if (score < 40) return 'softening';
  if (score < 58) return 'fragile';
  return 'collapsing';
}

export function op10mA11ComputeRegionalEmploymentAnchorStress(args: {
  decentralizationShift: OP10M_A11_DecentralizationShiftRow[];
  talentRetention: OP10M_A11_TalentRetentionRow[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
}): { rows: OP10M_A11_EmploymentAnchorRow[]; nationalIndex: number } {
  const decentralByRegion = new Map(args.decentralizationShift.map((d) => [d.regionId, d]));
  const talentByRegion = new Map(args.talentRetention.map((t) => [t.regionId, t]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_EmploymentAnchorRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const decentral = decentralByRegion.get(rid);
    const talent = talentByRegion.get(rid);
    const hub = hubByRegion.get(rid);

    const drainDrag = talent ? op10mA11Clamp(talent.drainScore * 0.48) : 14;
    const shiftDrag = decentral
      ? op10mA11Clamp(
          decentral.band === 'metro_locked' ? 18 : decentral.shiftScore * 0.32 + (decentral.band === 'accelerating' ? 6 : 0),
        )
      : 10;
    const hubDrag = hub
      ? op10mA11Clamp(hub.isolationScore * 0.35 + (hub.role === 'peripheral' ? 14 : hub.role === 'connector' ? 6 : 0))
      : 12;

    const stressScore = op10mA11Clamp(drainDrag + shiftDrag * 0.55 + hubDrag);
    weighted += stressScore;

    const drivers: string[] = [];
    if (talent && (talent.band === 'draining' || talent.band === 'collapse')) drivers.push('talent outflow');
    if (decentral && (decentral.band === 'partial_shift' || decentral.band === 'metro_locked')) {
      drivers.push('weak decentralization');
    }
    if (hub && (hub.role === 'peripheral' || hub.isolationScore >= 52)) drivers.push('hub isolation');
    if (!drivers.length) drivers.push('stable employment base');

    rows.push({
      regionId: rid,
      stressScore: op10mA11Round(stressScore),
      band: anchorBand(stressScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} employment anchor ${anchorBand(stressScore)} (${op10mA11Round(stressScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.stressScore - a.stressScore), nationalIndex };
}

export function op10mA11RegionsWithFragileEmploymentAnchors(
  rows: OP10M_A11_EmploymentAnchorRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fragile' || r.band === 'collapsing').map((r) => r.regionId);
}

export function op10mA11EmploymentAnchorStressEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 48;
  return currentIndex >= 42 && currentIndex > priorIndex + 5;
}
