import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CapitalFlightPanicRow,
  OP10M_A11_IrrecoverableCollapseThresholdRow,
  OP10M_A11_RegionId,
  OP10M_A11_SettlementLegitimacyCollapseBand,
  OP10M_A11_SettlementLegitimacyCollapseRow,
  OP10M_A11_SocialContractFragilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function legitimacyBand(score: number): OP10M_A11_SettlementLegitimacyCollapseBand {
  if (score < 23) return 'legitimate';
  if (score < 41) return 'contested';
  if (score < 58) return 'delegitimized';
  return 'collapsed';
}

export function op10mA11ComputeRegionalSettlementLegitimacyCollapse(args: {
  socialContractFragility: OP10M_A11_SocialContractFragilityRow[];
  capitalFlightPanic: OP10M_A11_CapitalFlightPanicRow[];
  irrecoverableCollapseThreshold: OP10M_A11_IrrecoverableCollapseThresholdRow[];
}): { rows: OP10M_A11_SettlementLegitimacyCollapseRow[]; nationalIndex: number } {
  const contractByRegion = new Map(args.socialContractFragility.map((s) => [s.regionId, s]));
  const flightByRegion = new Map(args.capitalFlightPanic.map((c) => [c.regionId, c]));
  const collapseByRegion = new Map(args.irrecoverableCollapseThreshold.map((i) => [i.regionId, i]));

  const rows: OP10M_A11_SettlementLegitimacyCollapseRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const contract = contractByRegion.get(rid);
    const flight = flightByRegion.get(rid);
    const collapse = collapseByRegion.get(rid);

    const contractDrag = contract ? op10mA11Clamp(contract.fragilityScore * 0.42) : 12;
    const flightDrag = flight ? op10mA11Clamp(flight.panicScore * 0.4) : 11;
    const collapseDrag = collapse ? op10mA11Clamp(collapse.thresholdScore * 0.39) : 10;

    const collapseScore = op10mA11Clamp(contractDrag + flightDrag + collapseDrag * 0.51);
    weighted += collapseScore;

    const signals: string[] = [];
    if (contract && (contract.band === 'fraying' || contract.band === 'ruptured')) {
      signals.push('social contract rupture');
    }
    if (flight && (flight.band === 'panicked' || flight.band === 'stampede')) {
      signals.push('capital flight stampede');
    }
    if (collapse && (collapse.band === 'terminal' || collapse.band === 'irrecoverable')) {
      signals.push('collapse threshold breach');
    }
    if (!signals.length) signals.push('settlement legitimacy');

    rows.push({
      regionId: rid,
      collapseScore: op10mA11Round(collapseScore),
      band: legitimacyBand(collapseScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} settlement legitimacy collapse ${legitimacyBand(collapseScore)} (${op10mA11Round(collapseScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.collapseScore - a.collapseScore), nationalIndex };
}

export function op10mA11RegionsWithCollapsedSettlementLegitimacy(
  rows: OP10M_A11_SettlementLegitimacyCollapseRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'delegitimized' || r.band === 'collapsed').map((r) => r.regionId);
}

export function op10mA11SettlementLegitimacyCollapseEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 5;
}
