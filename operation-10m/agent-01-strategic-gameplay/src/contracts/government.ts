/** Agent 01 — government / governance contract slice. */

export type GovernanceAuthorityMode = 'off' | 'shadow' | 'shared' | 'mandate';

export interface GovernanceSnapshot {
  day: number;
  approvalRating: number;
  directiveSlotsUsed: number;
  directiveSlotCap: number;
  authorityMode: GovernanceAuthorityMode;
  pendingReliefClaims: number;
  regulatoryBurden: number;
}

export interface GovernancePatch {
  approvalDelta?: number;
  directiveSlotsDelta?: number;
  regulatoryBurdenDelta?: number;
  reliefClaimsDelta?: number;
  authorityMode?: GovernanceAuthorityMode;
  issuedDirectiveId?: string;
  ledgerNote?: string;
}

export interface GovernmentContract {
  readonly moduleId: 'agent-01-government';
  snapshot(): GovernanceSnapshot;
  applyPatch(patch: GovernancePatch): GovernanceSnapshot;
  canIssueDirective(apCost: number): boolean;
}
