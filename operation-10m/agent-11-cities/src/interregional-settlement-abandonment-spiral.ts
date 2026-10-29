import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CapitalFlightPanicRow,
  OP10M_A11_IrrecoverableCollapseThresholdRow,
  OP10M_A11_RegionId,
  OP10M_A11_SettlementAbandonmentSpiralBand,
  OP10M_A11_SettlementAbandonmentSpiralRow,
  OP10M_A11_TerminalStateLockInRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function spiralBand(score: number): OP10M_A11_SettlementAbandonmentSpiralBand {
  if (score < 26) return 'anchored';
  if (score < 44) return 'drifting';
  if (score < 61) return 'exodus';
  return 'abandoned';
}

export function op10mA11ComputeInterregionalSettlementAbandonmentSpiral(args: {
  terminalStateLockIn: OP10M_A11_TerminalStateLockInRow[];
  irrecoverableCollapseThreshold: OP10M_A11_IrrecoverableCollapseThresholdRow[];
  capitalFlightPanic: OP10M_A11_CapitalFlightPanicRow[];
}): { rows: OP10M_A11_SettlementAbandonmentSpiralRow[]; nationalIndex: number } {
  const lockInByRegion = new Map(args.terminalStateLockIn.map((t) => [t.regionId, t]));
  const collapseByRegion = new Map(args.irrecoverableCollapseThreshold.map((i) => [i.regionId, i]));
  const flightByRegion = new Map(args.capitalFlightPanic.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_SettlementAbandonmentSpiralRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const lockIn = lockInByRegion.get(rid);
    const collapse = collapseByRegion.get(rid);
    const flight = flightByRegion.get(rid);

    const lockInDrag = lockIn ? op10mA11Clamp(lockIn.lockInScore * 0.44) : 13;
    const collapseDrag = collapse ? op10mA11Clamp(collapse.thresholdScore * 0.42) : 12;
    const flightDrag = flight ? op10mA11Clamp(flight.panicScore * 0.37) : 10;

    const spiralScore = op10mA11Clamp(lockInDrag + collapseDrag + flightDrag * 0.48);
    weighted += spiralScore;

    const signals: string[] = [];
    if (lockIn && (lockIn.band === 'locked' || lockIn.band === 'terminal')) {
      signals.push('terminal lock-in');
    }
    if (collapse && (collapse.band === 'terminal' || collapse.band === 'irrecoverable')) {
      signals.push('irrecoverable threshold');
    }
    if (flight && (flight.band === 'panicked' || flight.band === 'stampede')) {
      signals.push('capital flight');
    }
    if (!signals.length) signals.push('settlement retention');

    rows.push({
      regionId: rid,
      spiralScore: op10mA11Round(spiralScore),
      band: spiralBand(spiralScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} settlement abandonment spiral ${spiralBand(spiralScore)} (${op10mA11Round(spiralScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.spiralScore - a.spiralScore), nationalIndex };
}

export function op10mA11RegionsWithSettlementAbandonment(
  rows: OP10M_A11_SettlementAbandonmentSpiralRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'exodus' || r.band === 'abandoned').map((r) => r.regionId);
}

export function op10mA11SettlementAbandonmentSpiralEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 6;
}
