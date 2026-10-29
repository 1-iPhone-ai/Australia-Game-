import { TurnTimeSnapshot } from './types.js';
import { buildTurnTimeAuditReport, snapshotDigest, TurnTimeAuditReport } from './turn-audit.js';

export interface SnapshotCompareReport {
  digestA: string;
  digestB: string;
  digestMatch: boolean;
  auditDelta: Partial<Record<keyof TurnTimeAuditReport, { before: number | boolean; after: number | boolean }>>;
}

export function compareTurnTimeSnapshots(before: TurnTimeSnapshot, after: TurnTimeSnapshot): SnapshotCompareReport {
  const digestA = snapshotDigest(before);
  const digestB = snapshotDigest(after);
  const auditBefore = buildTurnTimeAuditReport(before);
  const auditAfter = buildTurnTimeAuditReport(after);
  const auditDelta: SnapshotCompareReport['auditDelta'] = {};

  (Object.keys(auditBefore) as (keyof TurnTimeAuditReport)[]).forEach((key) => {
    const b = auditBefore[key];
    const a = auditAfter[key];
    if (b !== a) {
      auditDelta[key] = { before: b, after: a };
    }
  });

  return {
    digestA,
    digestB,
    digestMatch: digestA === digestB,
    auditDelta,
  };
}
