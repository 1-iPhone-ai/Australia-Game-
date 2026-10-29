/**
 * Proposed V10.5 capability definitions (data-only) for Agent 25 merge.
 * Structure mirrors EmergingCapabilityDefinition in canonical SECTION 20X.
 */

import type { Agent03EmergingCapabilityId } from '../types';

export interface Agent03CapabilityProposal {
  id: Agent03EmergingCapabilityId;
  label: string;
  short: string;
  icon: string;
  category: 'digital' | 'research' | 'industrial' | 'infrastructure';
  description: string;
  /** ids of baseline capabilities that must reach demonstrated before emerge */
  prerequisiteCapabilities: string[];
  relevantInstitutions: string[];
  hardRequirementLabels: string[];
  effectSummary: string[];
  contentTags: string[];
  giTopics: string[];
  tradeoffs: string[];
}

export const AGENT03_PROPOSED_CAPABILITIES: Agent03CapabilityProposal[] = [
  {
    id: 'sovereign_ai_platforms',
    label: 'Sovereign AI Platforms',
    short: 'Sov. AI Platforms',
    icon: '🛡️',
    category: 'digital',
    description:
      'National AI platform layer atop compute, research commercialization and digital administration — not a free AI buff.',
    prerequisiteCapabilities: ['ai_compute_infrastructure', 'research_commercialization'],
    relevantInstitutions: ['act_sovereign_ai_council', 'csiro_ai_directorate', 'unsw_translation_hub'],
    hardRequirementLabels: ['Operational AI compute', 'Demonstrated research commercialization', 'Digital administration capacity'],
    effectSummary: [
      'Small bounded digital network efficiency when operational',
      'Unlocks sovereign platform contracts and GI governance Q&A',
      'Increases rival AI pressure scenarios (content, not cheat buffs)',
    ],
    contentTags: ['ai', 'sovereignty', 'technology'],
    giTopics: ['sovereign_platform_blockers', 'compute_allocation', 'rival_ai_pressure'],
    tradeoffs: ['Higher digital dependence', 'Stakeholder scrutiny on automation'],
  },
  {
    id: 'clinical_translation_network',
    label: 'Clinical Translation Network',
    short: 'Clinical Translation',
    icon: '🏥',
    category: 'research',
    description: 'Hospital-university-industry pathways for regulated med-tech and biomanufacturing pilots.',
    prerequisiteCapabilities: ['research_commercialization', 'advanced_manufacturing'],
    relevantInstitutions: ['melbourne_biomedical_precinct', 'unsw_translation_hub'],
    hardRequirementLabels: ['Research-commercialization demonstrated', 'Manufacturing base', 'Clinical precinct institution'],
    effectSummary: [
      'Bounded research and manufacturing industry hooks in pilot regions',
      'Clinical pilot contract pool eligibility',
    ],
    contentTags: ['research', 'health', 'manufacturing'],
    giTopics: ['clinical_pilot_blockers', 'regulatory_pathway'],
    tradeoffs: ['Longer stakeholder coordination', 'Higher state capacity load for approvals'],
  },
  {
    id: 'quantum_sensing_industry',
    label: 'Quantum Sensing Industry',
    short: 'Quantum Sensing',
    icon: '📡',
    category: 'industrial',
    description: 'Precision instruments for mining, defence and agriculture — requires HPC and research depth.',
    prerequisiteCapabilities: ['ai_compute_infrastructure', 'automated_mining'],
    relevantInstitutions: ['wa_pawsey_extension', 'csiro_ai_directorate'],
    hardRequirementLabels: ['Compute + research knowledge', 'Mining or defence industry anchor region'],
    effectSummary: [
      'Bounded mining/manufacturing productivity in adopting regions',
      'Improves what-if accuracy for resource projects (GI hook)',
    ],
    contentTags: ['mining', 'defense', 'technology'],
    giTopics: ['quantum_sensing_readiness', 'instrument_supply_chain'],
    tradeoffs: ['Export control dilemmas', 'Energy draw from compute'],
  },
  {
    id: 'defence_dual_use_pipeline',
    label: 'Defence Dual-Use Pipeline',
    short: 'Dual-Use Pipeline',
    icon: '⚙️',
    category: 'industrial',
    description: 'Controlled dual-use commercialization — manufacturing plus research with governance tradeoffs.',
    prerequisiteCapabilities: ['advanced_manufacturing', 'research_commercialization'],
    relevantInstitutions: ['sa_defence_innovation_alliance', 'act_sovereign_ai_council'],
    hardRequirementLabels: ['Advanced manufacturing operational', 'Innovation coordination institutional capacity'],
    effectSummary: [
      'Defence logistics and manufacturing hooks (bounded)',
      'Unlocks dual-use contracts with faction tension',
    ],
    contentTags: ['defense', 'manufacturing', 'research'],
    giTopics: ['dual_use_governance', 'export_controls'],
    tradeoffs: ['Diplomatic scrutiny', 'Labour and community stakeholder pressure'],
  },
];

export const AGENT03_PROPOSED_BY_ID = Object.fromEntries(AGENT03_PROPOSED_CAPABILITIES.map(c => [c.id, c]));
