import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_FiscalUrbanCouplingRow,
  OP10M_A11_RegionId,
  OP10M_A11_ServiceEquityBand,
  OP10M_A11_ServiceEquityRow,
  OP10M_A11_SettlementVulnerabilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function serviceEquityBand(score: number): OP10M_A11_ServiceEquityBand {
  if (score >= 68) return 'equitable';
  if (score >= 48) return 'mixed';
  if (score >= 28) return 'uneven';
  return 'critical_gap';
}

export function op10mA11ComputeRegionalServiceEquity(args: {
  settlement: OP10M_A11_SettlementVulnerabilityRow[];
  fiscal: OP10M_A11_FiscalUrbanCouplingRow[];
}): { rows: OP10M_A11_ServiceEquityRow[]; nationalIndex: number } {
  const settlementByRegion = new Map(args.settlement.map((s) => [s.regionId, s]));
  const fiscalByRegion = new Map(args.fiscal.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_ServiceEquityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const settle = settlementByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);
    const vulnerabilityDrag = settle ? op10mA11Clamp(settle.vulnerabilityScore * 0.55) : 20;
    const fiscalLift = fiscal ? op10mA11Clamp(fiscal.couplingScore * 0.42) : 24;
    const catchUpBoost = fiscal ? op10mA11Clamp(fiscal.catchUpPotential * 0.18) : 0;

    const equityScore = op10mA11Clamp(58 + fiscalLift + catchUpBoost - vulnerabilityDrag);
    weighted += equityScore;

    const gapDrivers: string[] = [];
    if (settle && (settle.band === 'critical' || settle.band === 'fragile')) {
      gapDrivers.push('settlement exposure');
    }
    if (fiscal && (fiscal.band === 'misaligned' || fiscal.band === 'strained')) {
      gapDrivers.push('fiscal misalignment');
    }
    if (!gapDrivers.length) gapDrivers.push('balanced service delivery');

    rows.push({
      regionId: rid,
      equityScore: op10mA11Round(equityScore),
      band: serviceEquityBand(equityScore),
      gapDrivers: gapDrivers.slice(0, 3),
      narrative: `${rid} service equity ${serviceEquityBand(equityScore)} (${op10mA11Round(equityScore)}); ${gapDrivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => a.equityScore - b.equityScore), nationalIndex };
}

export function op10mA11RegionsWithServiceEquityGap(rows: OP10M_A11_ServiceEquityRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'critical_gap' || r.band === 'uneven').map((r) => r.regionId);
}
