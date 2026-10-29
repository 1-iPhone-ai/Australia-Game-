/**
 * Agent 03 — shared types for branch expansion (Operation 600K).
 * Mirrors canonical V10.5 / Living Regions / V10.11 vocabulary without importing the monolith at runtime here.
 */

export type RegionCode =
  | 'ACT'
  | 'NSW'
  | 'VIC'
  | 'QLD'
  | 'SA'
  | 'WA'
  | 'TAS'
  | 'NT';

export type LRSector =
  | 'mining'
  | 'agriculture'
  | 'technology'
  | 'finance'
  | 'manufacturing'
  | 'energy'
  | 'renewables'
  | 'tourism'
  | 'trade'
  | 'logistics'
  | 'research'
  | 'defense'
  | 'infrastructure';

/** Canonical V10.5 capability ids (baseline V9.4). */
export type BaselineEmergingCapabilityId =
  | 'advanced_logistics'
  | 'automated_mining'
  | 'advanced_manufacturing'
  | 'grid_scale_storage'
  | 'advanced_water_systems'
  | 'ai_compute_infrastructure'
  | 'precision_agriculture'
  | 'research_commercialization';

/** Proposed extensions (Agent 03 merge — Agent 25 splices into EmergingCapabilityId). */
export type Agent03EmergingCapabilityId =
  | 'sovereign_ai_platforms'
  | 'clinical_translation_network'
  | 'quantum_sensing_industry'
  | 'defence_dual_use_pipeline';

export type EmergingCapabilityId = BaselineEmergingCapabilityId | Agent03EmergingCapabilityId;

export type CapabilityMaturity =
  | 'unavailable'
  | 'emerging'
  | 'demonstrated'
  | 'operational'
  | 'scaled'
  | 'nationally_integrated';

export const CAPABILITY_MATURITY_RANK: Record<CapabilityMaturity, number> = {
  unavailable: 0,
  emerging: 1,
  demonstrated: 2,
  operational: 3,
  scaled: 4,
  nationally_integrated: 5,
};

export type CapabilityAdoptionLevel = 'none' | 'emerging' | 'demonstrated' | 'operational';

export const CAPABILITY_ADOPTION_RANK: Record<CapabilityAdoptionLevel, number> = {
  none: 0,
  emerging: 1,
  demonstrated: 2,
  operational: 3,
};

export type InstitutionalCapabilityId =
  | 'national_project_coordination'
  | 'interregional_delivery'
  | 'emergency_coordination'
  | 'infrastructure_planning'
  | 'digital_administration'
  | 'innovation_coordination'
  | 'adaptive_recovery';

export type CommercializationStage =
  | 'latent'
  | 'pipeline'
  | 'pilot'
  | 'scaled'
  | 'export_ready';

export const COMMERCIALIZATION_STAGE_RANK: Record<CommercializationStage, number> = {
  latent: 0,
  pipeline: 1,
  pilot: 2,
  scaled: 3,
  export_ready: 4,
};

export type ProgressionUnlockTarget =
  | 'ui_panel'
  | 'gi_query'
  | 'contract_pool'
  | 'ai_directive'
  | 'industry_hook'
  | 'megaproject_eligibility';

export interface ProgressionUnlockRequirement {
  kind:
    | 'capability_maturity'
    | 'commercialization_stage'
    | 'institution_present'
    | 'sector_min'
    | 'institutional_capability';
  id?: string;
  region?: RegionCode | 'national';
  minRank?: number;
  min?: number;
}

export interface ProgressionUnlockDefinition {
  id: string;
  label: string;
  target: ProgressionUnlockTarget;
  targetRef: string;
  requires: ProgressionUnlockRequirement[];
  productivityNote?: string;
}

export interface ProductivityModifier {
  regionId: RegionCode;
  industry?: LRSector;
  network?: 'energy' | 'digital' | 'freight' | 'water' | 'trade';
  delta: number;
  source: string;
  bounded: boolean;
}

export const AGENT03_EFFECT_CAP = 6;
