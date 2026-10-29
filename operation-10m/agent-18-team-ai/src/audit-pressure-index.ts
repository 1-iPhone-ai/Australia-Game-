import { CoordinationAuditFinding } from './types.ts';

export interface AuditPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Aggregate audit finding severity into a single pressure score.
 */
export function computeAuditPressureIndex(findings: CoordinationAuditFinding[]): AuditPressureReport {
  const notes: string[] = [];
  const errors = findings.filter(f => f.severity === 'error').length;
  const warnings = findings.filter(f => f.severity === 'warning').length;

  if (errors > 0) notes.push(`${errors} coordination audit error(s)`);
  if (warnings >= 3) notes.push(`${warnings} coordination audit warnings`);

  const pressureIndex = Math.round(Math.min(100, errors * 28 + warnings * 9));

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamAuditPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
