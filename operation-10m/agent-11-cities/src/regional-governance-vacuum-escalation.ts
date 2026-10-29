import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_FiscalPanicContagionRow,
  OP10M_A11_GovernanceVacuumEscalationBand,
  OP10M_A11_GovernanceVacuumEscalationRow,
  OP10M_A11_InstitutionalTrustErosionRow,
  OP10M_A11_RegionId,
  OP10M_A11_SettlementLegitimacyCollapseRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function vacuumBand(score: number): OP10M_A11_GovernanceVacuumEscalationBand {
  if (score < 25) return 'staffed';
  if (score < 43) return 'thinning';
  if (score < 60) return 'hollow';
  return 'vacuum';
}

export function op10mA11ComputeRegionalGovernanceVacuumEscalation(args: {
  settlementLegitimacyCollapse: OP10M_A11_SettlementLegitimacyCollapseRow[];
  fiscalPanicContagion: OP10M_A11_FiscalPanicContagionRow[];
  institutionalTrustErosion: OP10M_A11_InstitutionalTrustErosionRow[];
}): { rows: OP10M_A11_GovernanceVacuumEscalationRow[]; nationalIndex: number } {
  const legitimacyByRegion = new Map(args.settlementLegitimacyCollapse.map((l) => [l.regionId, l]));
  const contagionByRegion = new Map(args.fiscalPanicContagion.map((f) => [f.regionId, f]));
  const trustByRegion = new Map(args.institutionalTrustErosion.map((t) => [t.regionId, t]));

  const rows: OP10M_A11_GovernanceVacuumEscalationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const legitimacy = legitimacyByRegion.get(rid);
    const contagion = contagionByRegion.get(rid);
    const trust = trustByRegion.get(rid);

    const legitimacyDrag = legitimacy ? op10mA11Clamp(legitimacy.collapseScore * 0.41) : 12;
    const contagionDrag = contagion ? op10mA11Clamp(contagion.contagionScore * 0.4) : 11;
    const trustDrag = trust ? op10mA11Clamp(trust.erosionScore * 0.38) : 10;

    const vacuumScore = op10mA11Clamp(legitimacyDrag + contagionDrag + trustDrag * 0.5);
    weighted += vacuumScore;

    const drivers: string[] = [];
    if (legitimacy && (legitimacy.band === 'delegitimized' || legitimacy.band === 'collapsed')) {
      drivers.push('legitimacy void');
    }
    if (contagion && (contagion.band === 'contagion' || contagion.band === 'systemic')) {
      drivers.push('fiscal panic spillover');
    }
    if (trust && (trust.band === 'brittle' || trust.band === 'breakdown')) {
      drivers.push('institutional trust collapse');
    }
    if (!drivers.length) drivers.push('governance capacity');

    rows.push({
      regionId: rid,
      vacuumScore: op10mA11Round(vacuumScore),
      band: vacuumBand(vacuumScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} governance vacuum escalation ${vacuumBand(vacuumScore)} (${op10mA11Round(vacuumScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.vacuumScore - a.vacuumScore), nationalIndex };
}

export function op10mA11RegionsWithGovernanceVacuum(
  rows: OP10M_A11_GovernanceVacuumEscalationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'hollow' || r.band === 'vacuum').map((r) => r.regionId);
}

export function op10mA11GovernanceVacuumEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}
