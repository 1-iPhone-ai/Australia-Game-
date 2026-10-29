/**
 * Commercialization pathways — stages derived from research_commercialization maturity + regional adoption.
 * No science points; stages gate content and productivity hooks only.
 */

import {
  CAPABILITY_ADOPTION_RANK,
  CAPABILITY_MATURITY_RANK,
  type CapabilityAdoptionLevel,
  type CapabilityMaturity,
  type CommercializationStage,
  type RegionCode,
} from '../types';
import { AGENT03_INSTITUTION_BY_ID, type Agent03ResearchInstitution } from './institutions-catalog';

export interface CommercializationState {
  stage: CommercializationStage;
  leadingRegions: RegionCode[];
  activeInstitutions: string[];
  blockers: string[];
}

export interface CommercializationInputs {
  researchCommercializationMaturity: CapabilityMaturity;
  adoptionByRegion: Partial<Record<RegionCode, CapabilityAdoptionLevel>>;
  influentialInstitutionIds: string[];
  /** Optional sector floor for pilot/export gates */
  sectorScores?: Partial<Record<RegionCode, { research?: number; technology?: number; manufacturing?: number }>>;
}

const STAGE_ORDER: CommercializationStage[] = ['latent', 'pipeline', 'pilot', 'scaled', 'export_ready'];

export function commercializationStageRank(stage: CommercializationStage): number {
  return STAGE_ORDER.indexOf(stage);
}

function adoptionCount(adoption: CommercializationInputs['adoptionByRegion'], min: CapabilityAdoptionLevel): number {
  return Object.values(adoption).filter(l => l && CAPABILITY_ADOPTION_RANK[l] >= CAPABILITY_ADOPTION_RANK[min]).length;
}

function institutionRoles(ids: string[]): Agent03ResearchInstitution['commercializationRole'][] {
  return ids.map(id => AGENT03_INSTITUTION_BY_ID[id]?.commercializationRole).filter(Boolean) as Agent03ResearchInstitution['commercializationRole'][];
}

/**
 * Derives commercialization stage from V10.5-like signals + Agent 03 institutions.
 */
export function deriveCommercializationStage(input: CommercializationInputs): CommercializationState {
  const blockers: string[] = [];
  const mat = CAPABILITY_MATURITY_RANK[input.researchCommercializationMaturity];
  const roles = institutionRoles(input.influentialInstitutionIds);
  const hasIntake = roles.includes('intake') || roles.includes('platform_operator');
  const hasPilotHost = roles.includes('pilot_host');
  const hasExport = roles.includes('export_licensing');

  let stage: CommercializationStage = 'latent';
  if (mat >= 1 && hasIntake) stage = 'pipeline';
  else if (mat >= 1 && !hasIntake) blockers.push('Need a translation or platform institution for pipeline intake');

  if (stage === 'pipeline' && mat >= 2 && adoptionCount(input.adoptionByRegion, 'demonstrated') >= 1 && hasPilotHost) {
    stage = 'pilot';
  } else if (mat >= 2 && stage === 'pipeline') {
    if (!hasPilotHost) blockers.push('Pilot host institution required for pilot stage');
    if (adoptionCount(input.adoptionByRegion, 'demonstrated') < 1) blockers.push('Need demonstrated regional adoption');
  }

  if (stage === 'pilot' && mat >= 3 && adoptionCount(input.adoptionByRegion, 'operational') >= 2) {
    stage = 'scaled';
  } else if (mat >= 3 && stage === 'pilot' && adoptionCount(input.adoptionByRegion, 'operational') < 2) {
    blockers.push('Scaled stage needs operational adoption in at least two regions');
  }

  if (stage === 'scaled' && mat >= 3 && hasExport && adoptionCount(input.adoptionByRegion, 'operational') >= 2) {
    const mfgOk = Object.entries(input.sectorScores || {}).some(([, s]) => (s?.manufacturing || 0) >= 35 || (s?.technology || 0) >= 40);
    if (mfgOk) stage = 'export_ready';
    else blockers.push('Export-ready requires manufacturing or technology base in at least one leading region');
  }

  const leadingRegions = (Object.entries(input.adoptionByRegion) as [RegionCode, CapabilityAdoptionLevel][])
    .filter(([, l]) => CAPABILITY_ADOPTION_RANK[l] >= CAPABILITY_ADOPTION_RANK.demonstrated)
    .map(([r]) => r)
    .slice(0, 4);

  return {
    stage,
    leadingRegions,
    activeInstitutions: input.influentialInstitutionIds.filter(id => AGENT03_INSTITUTION_BY_ID[id]),
    blockers,
  };
}

export interface CommercializationProductivityGate {
  stageMin: CommercializationStage;
  industrySector?: 'research' | 'technology' | 'manufacturing' | 'finance';
  maxBonus: number;
  label: string;
}

/** Bounded bonuses routed through V10.1 industry hooks when merged (mirrors V105 effect caps). */
export const COMMERCIALIZATION_PRODUCTIVITY_GATES: CommercializationProductivityGate[] = [
  { stageMin: 'pipeline', industrySector: 'research', maxBonus: 1.5, label: 'Pipeline grants improve research throughput' },
  { stageMin: 'pilot', industrySector: 'technology', maxBonus: 2.5, label: 'Pilot markets lift technology effectiveness' },
  { stageMin: 'scaled', industrySector: 'manufacturing', maxBonus: 3.5, label: 'Scaled commercialization deepens manufacturing' },
  { stageMin: 'export_ready', industrySector: 'finance', maxBonus: 2, label: 'Export-ready IP improves finance/trade facilitation' },
];

export function commercializationIndustryBonus(
  stage: CommercializationStage,
  sector: CommercializationProductivityGate['industrySector'],
): number {
  const rank = commercializationStageRank(stage);
  let bonus = 0;
  COMMERCIALIZATION_PRODUCTIVITY_GATES.forEach(g => {
    if (commercializationStageRank(g.stageMin) <= rank && g.industrySector === sector) {
      bonus = Math.max(bonus, g.maxBonus);
    }
  });
  return bonus;
}
