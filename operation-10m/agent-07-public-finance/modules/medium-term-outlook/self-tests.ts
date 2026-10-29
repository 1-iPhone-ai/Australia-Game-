import { buildMediumTermFiscalOutlook } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 60,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'tight',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 9,
    debtLevel: partial.debtLevel ?? 35,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 6,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runMediumTermOutlookSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const outlook = buildMediumTermFiscalOutlook(snap({}), 4);
  record('MTO01', 'Horizon includes base plus four forwards', outlook.projections.length === 5, `n=${outlook.projections.length}`);
  record('MTO02', 'Headroom generally declines under debt path', outlook.projections[4]!.fiscalHeadroom < outlook.projections[0]!.fiscalHeadroom, `y0=${outlook.projections[0]!.fiscalHeadroom}, y4=${outlook.projections[4]!.fiscalHeadroom}`);

  const prudent = buildMediumTermFiscalOutlook(snap({ reservePolicy: 'prudent', fiscalHeadroom: 8 }), 3);
  const lean = buildMediumTermFiscalOutlook(snap({ reservePolicy: 'lean', fiscalHeadroom: 8 }), 3);
  record('MTO03', 'Prudent reserve policy improves average headroom', prudent.averageHeadroom >= lean.averageHeadroom, `prudent=${prudent.averageHeadroom}, lean=${lean.averageHeadroom}`);

  const heavy = buildMediumTermFiscalOutlook(snap({ debtLevel: 58, debtServiceLoad: 16 }), 4);
  record('MTO04', 'Heavy debt triggers risk flags', heavy.risks.length >= 1, `risks=${heavy.risks.length}`);

  record('MTO05', 'Trajectory band assigned', Boolean(outlook.trajectoryBand), `band=${outlook.trajectoryBand}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
