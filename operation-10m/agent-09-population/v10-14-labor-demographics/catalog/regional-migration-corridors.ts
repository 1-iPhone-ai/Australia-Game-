import { v1014laborClamp } from '../bands';
import type { NationalLaborDemographicsState } from '../types';

export interface RegionalMigrationCorridor {
  id: string;
  fromRegionId: string;
  toRegionId: string;
  strength: number;
  label: string;
  industryTheme: string;
}

export const REGIONAL_MIGRATION_CORRIDORS: RegionalMigrationCorridor[] = [
  { id: 'cor_nsw_vic', fromRegionId: 'NSW', toRegionId: 'VIC', strength: 0.72, label: 'Sydney–Melbourne corridor', industryTheme: 'services' },
  { id: 'cor_vic_nsw', fromRegionId: 'VIC', toRegionId: 'NSW', strength: 0.68, label: 'Melbourne–Sydney return flow', industryTheme: 'technology' },
  { id: 'cor_qld_wa', fromRegionId: 'QLD', toRegionId: 'WA', strength: 0.55, label: 'East–west resource rotation', industryTheme: 'mining' },
  { id: 'cor_wa_qld', fromRegionId: 'WA', toRegionId: 'QLD', strength: 0.48, label: 'Resource coast reciprocal', industryTheme: 'mining' },
  { id: 'cor_nsw_qld', fromRegionId: 'NSW', toRegionId: 'QLD', strength: 0.61, label: 'Northern migration arc', industryTheme: 'tourism' },
  { id: 'cor_sa_vic', fromRegionId: 'SA', toRegionId: 'VIC', strength: 0.42, label: 'Adelaide–Melbourne drift', industryTheme: 'manufacturing' },
  { id: 'cor_tas_vic', fromRegionId: 'TAS', toRegionId: 'VIC', strength: 0.38, label: 'Bass Strait opportunity seek', industryTheme: 'tourism' },
  { id: 'cor_nt_qld', fromRegionId: 'NT', toRegionId: 'QLD', strength: 0.52, label: 'Top End–Queensland link', industryTheme: 'energy' },
  { id: 'cor_act_nsw', fromRegionId: 'ACT', toRegionId: 'NSW', strength: 0.45, label: 'Capital region spill', industryTheme: 'research' }
];

export function corridorsFromRegion(regionId: string): RegionalMigrationCorridor[] {
  return REGIONAL_MIGRATION_CORRIDORS.filter(c => c.fromRegionId === regionId);
}

/** Adjust destination region migration score from corridor pull (bounded). */
export function applyCorridorPullToRegions(
  regions: Record<string, { migrationFlowScore: number; employmentLinkageScore: number }>
): string[] {
  const notes: string[] = [];
  REGIONAL_MIGRATION_CORRIDORS.forEach(c => {
    const from = regions[c.fromRegionId];
    const to = regions[c.toRegionId];
    if (!from || !to) return;
    const pull = (from.employmentLinkageScore - to.employmentLinkageScore) * 0.08 * c.strength;
    if (Math.abs(pull) < 0.4) return;
    to.migrationFlowScore = v1014laborClamp(to.migrationFlowScore + pull);
    from.migrationFlowScore = v1014laborClamp(from.migrationFlowScore - pull * 0.35);
    notes.push(`${c.label}: pull ${pull.toFixed(1)}`);
  });
  return notes.slice(0, 4);
}

export function summarizeCorridorExposure(state: NationalLaborDemographicsState | null): string {
  if (!state?.enabled) return 'Corridor exposure unavailable.';
  const hot = REGIONAL_MIGRATION_CORRIDORS.filter(c => (state.regions[c.toRegionId]?.migrationFlowScore ?? 0) >= 58)
    .slice(0, 3)
    .map(c => c.label);
  return hot.length ? `Active corridor pull: ${hot.join('; ')}` : 'Corridor pull balanced nationally.';
}
