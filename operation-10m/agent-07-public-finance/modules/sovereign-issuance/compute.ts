import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { IssuanceProgramLine, SovereignIssuanceCalendar } from './types';
import { SOVEREIGN_ISSUANCE_SCHEMA } from './types';

const TENOR_YEARS: Record<IssuanceProgramLine['tenor'], number> = {
  short: 2,
  medium: 7,
  long: 15,
  index_linked: 10
};

export function defaultIssuanceProgram(baseTurn: number): Omit<IssuanceProgramLine, 'actualBidToCover' | 'issuedVolumePoints' | 'deferred' | 'explanation'>[] {
  return [
    { id: 'iss_tbill', tenor: 'short', scheduledTurn: baseTurn, targetVolumePoints: 6, minimumBidToCover: 2.2 },
    { id: 'iss_nom_7y', tenor: 'medium', scheduledTurn: baseTurn + 1, targetVolumePoints: 10, minimumBidToCover: 2.5 },
    { id: 'iss_nom_15y', tenor: 'long', scheduledTurn: baseTurn + 1, targetVolumePoints: 14, minimumBidToCover: 2.3 },
    { id: 'iss_link_10y', tenor: 'index_linked', scheduledTurn: baseTurn + 2, targetVolumePoints: 5, minimumBidToCover: 2.0 }
  ];
}

export function executeIssuanceCalendar(turn: number, v1012: V1012FiscalSnapshot): SovereignIssuanceCalendar {
  const program = defaultIssuanceProgram(turn);
  const warnings: string[] = [];
  let liquidityShortfall = false;

  const lines: IssuanceProgramLine[] = program.map(row => {
    if (!v1012.debtEnabled) {
      return {
        ...row,
        actualBidToCover: null,
        issuedVolumePoints: 0,
        deferred: true,
        explanation: 'Debt program disabled — auction deferred.'
      };
    }
    if (row.scheduledTurn > turn) {
      return {
        ...row,
        actualBidToCover: null,
        issuedVolumePoints: 0,
        deferred: true,
        explanation: `Scheduled turn ${row.scheduledTurn} not reached.`
      };
    }

    const marketStress = v1012.pressure === 'critical' ? 0.75 : v1012.pressure === 'strained' ? 0.88 : 1;
    const actualBidToCover = Math.round((row.minimumBidToCover * marketStress + 0.4) * 10) / 10;
    const covered = actualBidToCover >= row.minimumBidToCover;
    const issuedVolumePoints = covered
      ? row.targetVolumePoints
      : Math.round(row.targetVolumePoints * (actualBidToCover / row.minimumBidToCover) * 10) / 10;

    if (!covered) {
      liquidityShortfall = true;
      warnings.push(`${row.id}: bid-to-cover ${actualBidToCover} below minimum ${row.minimumBidToCover}.`);
    }
    if (v1012.fiscalHeadroom < -8 && row.tenor === 'long') {
      warnings.push(`${row.id}: long issuance under negative headroom — tenor mix skew risk.`);
    }

    return {
      ...row,
      actualBidToCover,
      issuedVolumePoints,
      deferred: false,
      explanation: covered ? 'Auction cleared at or above minimum coverage.' : 'Partial issuance due to weak coverage.'
    };
  });

  const issued = lines.filter(l => !l.deferred);
  const totalScheduled = lines.reduce((s, l) => s + l.targetVolumePoints, 0);
  const totalIssued = lines.reduce((s, l) => s + l.issuedVolumePoints, 0);
  const weightedAverageTenorYears =
    totalIssued > 0
      ? Math.round(
          (issued.reduce((s, l) => s + TENOR_YEARS[l.tenor] * l.issuedVolumePoints, 0) / totalIssued) * 10
        ) / 10
      : 0;

  return {
    schemaVersion: SOVEREIGN_ISSUANCE_SCHEMA,
    turn,
    lines,
    totalScheduled,
    totalIssued,
    weightedAverageTenorYears,
    liquidityShortfall,
    warnings
  };
}
