import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CascadingFailureRiskRow,
  OP10M_A11_IrrecoverableCollapseThresholdRow,
  OP10M_A11_RegionId,
  OP10M_A11_SocialContractFragilityRow,
  OP10M_A11_TerminalStateLockInBand,
  OP10M_A11_TerminalStateLockInRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function lockInBand(score: number): OP10M_A11_TerminalStateLockInBand {
  if (score < 26) return 'reversible';
  if (score < 44) return 'sticky';
  if (score < 61) return 'locked';
  return 'terminal';
}

export function op10mA11ComputeSettlementTerminalStateLockIn(args: {
  irrecoverableCollapseThreshold: OP10M_A11_IrrecoverableCollapseThresholdRow[];
  cascadingFailureRisk: OP10M_A11_CascadingFailureRiskRow[];
  socialContractFragility: OP10M_A11_SocialContractFragilityRow[];
}): { rows: OP10M_A11_TerminalStateLockInRow[]; nationalIndex: number } {
  const collapseByRegion = new Map(args.irrecoverableCollapseThreshold.map((i) => [i.regionId, i]));
  const cascadeByRegion = new Map(args.cascadingFailureRisk.map((c) => [c.regionId, c]));
  const contractByRegion = new Map(args.socialContractFragility.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_TerminalStateLockInRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const collapse = collapseByRegion.get(rid);
    const cascade = cascadeByRegion.get(rid);
    const contract = contractByRegion.get(rid);

    const collapseDrag = collapse ? op10mA11Clamp(collapse.thresholdScore * 0.45) : 14;
    const cascadeDrag = cascade ? op10mA11Clamp(cascade.cascadeScore * 0.42) : 12;
    const contractDrag = contract ? op10mA11Clamp(contract.fragilityScore * 0.34) : 10;

    const lockInScore = op10mA11Clamp(collapseDrag + cascadeDrag + contractDrag * 0.47);
    weighted += lockInScore;

    const markers: string[] = [];
    if (collapse && (collapse.band === 'terminal' || collapse.band === 'irrecoverable')) {
      markers.push('irrecoverable threshold');
    }
    if (cascade && (cascade.band === 'cascade_risk' || cascade.band === 'systemic')) {
      markers.push('cascade lock-in');
    }
    if (contract && (contract.band === 'fraying' || contract.band === 'ruptured')) {
      markers.push('contract rigidity');
    }
    if (!markers.length) markers.push('recovery path open');

    rows.push({
      regionId: rid,
      lockInScore: op10mA11Round(lockInScore),
      band: lockInBand(lockInScore),
      markers: markers.slice(0, 3),
      narrative: `${rid} terminal state lock-in ${lockInBand(lockInScore)} (${op10mA11Round(lockInScore)}); ${markers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.lockInScore - a.lockInScore), nationalIndex };
}

export function op10mA11RegionsWithTerminalStateLockIn(
  rows: OP10M_A11_TerminalStateLockInRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'locked' || r.band === 'terminal').map((r) => r.regionId);
}

export function op10mA11TerminalStateLockInEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 53;
  return currentIndex >= 47 && currentIndex > priorIndex + 6;
}
