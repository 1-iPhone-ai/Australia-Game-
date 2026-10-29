export interface CoordinationEscalationInputs {
  coordinationCompositeScore: number;
  auditErrors: number;
  auditWarnings: number;
  directiveCollisionIndex?: number;
  handoffIntegrityScore?: number;
}

export interface CoordinationEscalationReport {
  tier: 0 | 1 | 2 | 3;
  label: string;
  notes: string[];
}

const TIER_LABELS: Record<CoordinationEscalationReport['tier'], string> = {
  0: 'nominal',
  1: 'watch',
  2: 'elevated',
  3: 'critical',
};

/**
 * Operator escalation ladder from composite health, audit pressure, and round-7 integrity signals.
 */
export function computeCoordinationEscalationTier(
  inputs: CoordinationEscalationInputs,
): CoordinationEscalationReport {
  const composite = inputs.coordinationCompositeScore;
  const collision = inputs.directiveCollisionIndex ?? 0;
  const integrity = inputs.handoffIntegrityScore ?? 100;
  const notes: string[] = [];

  let tier: CoordinationEscalationReport['tier'] = 0;

  if (inputs.auditErrors > 0 || composite < 45 || integrity < 50) {
    tier = 3;
    notes.push('Critical coordination escalation — errors or severe health collapse');
  } else if (composite < 60 || collision >= 50 || inputs.auditWarnings >= 4) {
    tier = 2;
    notes.push('Elevated coordination escalation');
  } else if (composite < 75 || collision >= 25 || inputs.auditWarnings >= 2) {
    tier = 1;
    notes.push('Watch-tier coordination escalation');
  }

  return {
    tier,
    label: TIER_LABELS[tier],
    notes: notes.slice(0, 4),
  };
}

export function combineDualTeamEscalationTier(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
