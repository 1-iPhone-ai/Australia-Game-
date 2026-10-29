/**
 * Money & actor boundary reminders for V10.14 (mirrors V10.12 Section 20AE audit).
 * Used in validation messages and GI answers — not enforced against live actor wallets here.
 */

export const V1014_BOUNDARY_RULES: readonly { id: string; rule: string }[] = [
  {
    id: 'actor_cash',
    rule: 'Actor money (player/AI wallets) is private cash — never merged into national revenue or tax receipts.'
  },
  {
    id: 'actor_loans',
    rule: 'Actor loans are private debt — never counted as sovereign debt service or fiscal headroom.'
  },
  {
    id: 'team_treasury',
    rule: 'Team treasury is tactical shared cash — never taxed, borrowed from, or fiscal headroom.'
  },
  {
    id: 'auto_modifiers',
    rule: 'Auto Mode tax relief / income subsidy modifiers are balance settings — not national policy levers.'
  },
  {
    id: 'grants_resource',
    rule: 'Government Grants as a tradable resource are not the federal treasury balance.'
  },
  {
    id: 'normalized_capacity',
    rule: 'V10.12 normalized fiscal capacity (0..100 scale) remains authoritative for headroom; V10.14 adds policy-outcome interpretation only.'
  }
] as const;

export function summarizeBoundariesForGi(): string[] {
  return V1014_BOUNDARY_RULES.map(r => r.rule);
}
