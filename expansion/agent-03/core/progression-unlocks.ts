/**
 * Progression unlock registry — connects economy, industry, AI/GI, and UI surfaces.
 */

import type { ProgressionUnlockDefinition } from '../types';

export const AGENT03_PROGRESSION_UNLOCKS: ProgressionUnlockDefinition[] = [
  {
    id: 'unlock_play_innovation_hint',
    label: 'PLAY shows active capability momentum',
    target: 'ui_panel',
    targetRef: 'play.innovationCapabilityStrip',
    requires: [{ kind: 'capability_maturity', id: 'research_commercialization', minRank: 1 }],
    productivityNote: 'Presentation-only (V9.4); never persists stats.',
  },
  {
    id: 'unlock_gi_commercialization_blocker',
    label: 'GI answers commercialization blockers',
    target: 'gi_query',
    targetRef: 'innovation.commercialization_blockers',
    requires: [
      { kind: 'capability_maturity', id: 'research_commercialization', minRank: 1 },
      { kind: 'institution_present', id: 'unsw_translation_hub', region: 'NSW' },
    ],
  },
  {
    id: 'unlock_contract_spinout_wave',
    label: 'Advanced spin-out contracts',
    target: 'contract_pool',
    targetRef: 'cap_research_spinout_wave',
    requires: [
      { kind: 'commercialization_stage', minRank: 2 },
      { kind: 'capability_maturity', id: 'research_commercialization', minRank: 2 },
    ],
    productivityNote: 'Eligibility only; payouts still via contract engine.',
  },
  {
    id: 'unlock_ai_sovereign_platform_brief',
    label: 'Riley sovereign platform strategic brief',
    target: 'ai_directive',
    targetRef: 'rival.ai_sovereign_platform_pressure',
    requires: [
      { kind: 'capability_maturity', id: 'ai_compute_infrastructure', minRank: 3 },
      { kind: 'institution_present', id: 'act_sovereign_ai_council', region: 'ACT' },
    ],
  },
  {
    id: 'unlock_industry_mfg_commercialization_hook',
    label: 'Manufacturing productivity hook from commercialization',
    target: 'industry_hook',
    targetRef: 'v10.1.manufacturing.commercialization_bonus',
    requires: [
      { kind: 'commercialization_stage', minRank: 3 },
      { kind: 'sector_min', id: 'manufacturing', region: 'VIC', min: 35 },
    ],
    productivityNote: 'Bounded +3.5 via Agent03 productivity bridge.',
  },
  {
    id: 'unlock_megaproject_ai_compute_alignment',
    label: 'Australian AI Compute Network alignment hints',
    target: 'megaproject_eligibility',
    targetRef: 'megaproject.australian_ai_compute_network.soft_prereq',
    requires: [
      { kind: 'capability_maturity', id: 'ai_compute_infrastructure', minRank: 2 },
      { kind: 'institutional_capability', id: 'innovation_coordination', minRank: 2 },
    ],
  },
  {
    id: 'unlock_lab_institution_tab',
    label: 'LAB institution acceleration tab',
    target: 'ui_panel',
    targetRef: 'lab.innovationInspector.institutions',
    requires: [{ kind: 'institution_present', id: 'melbourne_biomedical_precinct', region: 'VIC' }],
  },
  {
    id: 'unlock_gi_quantum_sensing',
    label: 'GI quantum sensing readiness Q&A',
    target: 'gi_query',
    targetRef: 'innovation.quantum_sensing_blockers',
    requires: [{ kind: 'capability_maturity', id: 'quantum_sensing_industry', minRank: 1 }],
  },
  {
    id: 'unlock_contract_clinical_pilot',
    label: 'Clinical translation pilot contracts',
    target: 'contract_pool',
    targetRef: 'cap_clinical_translation_pilot',
    requires: [
      { kind: 'capability_maturity', id: 'clinical_translation_network', minRank: 2 },
      { kind: 'commercialization_stage', minRank: 2 },
    ],
  },
  {
    id: 'unlock_ai_automation_backlash',
    label: 'AI notes automation stakeholder risk when scaling commercialization',
    target: 'ai_directive',
    targetRef: 'ai.stakeholder.automation_commercialization',
    requires: [
      { kind: 'commercialization_stage', minRank: 3 },
      { kind: 'capability_maturity', id: 'advanced_manufacturing', minRank: 3 },
    ],
  },
];

export const AGENT03_UNLOCK_BY_ID: Record<string, ProgressionUnlockDefinition> = Object.fromEntries(
  AGENT03_PROGRESSION_UNLOCKS.map(u => [u.id, u]),
);

export interface UnlockEvaluationContext {
  capabilityMaturity: Record<string, number>;
  commercializationStageRank: number;
  institutionsPresent: Partial<Record<string, Partial<Record<string, boolean>>>>;
  sectorScores: Partial<Record<string, Partial<Record<string, number>>>>;
  institutionalCapabilityRank: Partial<Record<string, number>>;
}

export function evaluateUnlock(unlockId: string, ctx: UnlockEvaluationContext): { ok: boolean; missing: string[] } {
  const def = AGENT03_UNLOCK_BY_ID[unlockId];
  if (!def) return { ok: false, missing: [`unknown unlock ${unlockId}`] };
  const missing: string[] = [];
  def.requires.forEach(req => {
    switch (req.kind) {
      case 'capability_maturity': {
        const rank = ctx.capabilityMaturity[req.id || ''] ?? 0;
        if (rank < (req.minRank ?? 0)) missing.push(`${req.id} maturity ${rank} < ${req.minRank}`);
        break;
      }
      case 'commercialization_stage':
        if (ctx.commercializationStageRank < (req.minRank ?? 0)) missing.push(`commercialization rank ${ctx.commercializationStageRank} < ${req.minRank}`);
        break;
      case 'institution_present': {
        const region = req.region || 'national';
        const present = ctx.institutionsPresent[region]?.[req.id || ''];
        if (!present) missing.push(`institution ${req.id} not present in ${region}`);
        break;
      }
      case 'sector_min': {
        const region = req.region || 'NSW';
        const sector = req.id || 'research';
        const score = ctx.sectorScores[region]?.[sector] ?? 0;
        if (score < (req.min ?? 0)) missing.push(`${region}.${sector} ${score} < ${req.min}`);
        break;
      }
      case 'institutional_capability': {
        const rank = ctx.institutionalCapabilityRank[req.id || ''] ?? 0;
        if (rank < (req.minRank ?? 0)) missing.push(`institutional ${req.id} rank ${rank} < ${req.minRank}`);
        break;
      }
      default:
        missing.push(`unsupported req kind`);
    }
  });
  return { ok: missing.length === 0, missing };
}

export function evaluateAllUnlocks(ctx: UnlockEvaluationContext): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  AGENT03_PROGRESSION_UNLOCKS.forEach(u => {
    out[u.id] = evaluateUnlock(u.id, ctx).ok;
  });
  return out;
}
