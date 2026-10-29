import type { InstitutionUpgradeState, ResearchInstitutionTierSnapshot } from './types.ts';
import { RESEARCH_INSTITUTIONS } from './institutions.ts';
import { INSTITUTION_UPGRADE_TIER_RANK } from './institution-upgrades.ts';

/** Compact persisted digest of institution tiers for replay / merge guards (round 6). */
export function computeInstitutionTierSnapshot(
  upgrades: InstitutionUpgradeState[],
  turn: number
): ResearchInstitutionTierSnapshot {
  const byId = Object.fromEntries(upgrades.map(u => [u.institutionId, u]));
  const tiers: ResearchInstitutionTierSnapshot['tiers'] = {};
  for (const inst of RESEARCH_INSTITUTIONS) {
    const u = byId[inst.id];
    tiers[inst.id] = u?.tier ?? 'dormant';
  }
  const payload = RESEARCH_INSTITUTIONS.map(i => `${i.id}:${tiers[i.id] ?? 'dormant'}`).join('|');
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  const nationalIntegrationCount = Object.values(tiers).filter(t => t === 'national_integration').length;
  const strategicOrAbove = Object.values(tiers).filter(
    t => INSTITUTION_UPGRADE_TIER_RANK[t] >= INSTITUTION_UPGRADE_TIER_RANK.strategic
  ).length;
  return {
    capturedAtTurn: turn,
    tiers,
    digest: h.toString(36),
    nationalIntegrationCount,
    strategicOrAboveCount: strategicOrAbove,
  };
}

export function mergeInstitutionTierSnapshots(
  local: ResearchInstitutionTierSnapshot | undefined,
  remote: ResearchInstitutionTierSnapshot | undefined
): ResearchInstitutionTierSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
