/**
 * Integrated technology / research readiness graph — NOT a player-facing tech tree.
 * Nodes are derived-capability and institution anchors; edges are evidence dependencies
 * aligned with V10.5 hardRequirements + Agent 03 commercialization stages.
 */

import type { BaselineEmergingCapabilityId, EmergingCapabilityId, RegionCode } from '../types';

export type ReadinessNodeKind =
  | 'capability'
  | 'institution'
  | 'commercialization_gate'
  | 'ui_surface'
  | 'industry_cluster';

export interface ReadinessGraphNode {
  id: string;
  kind: ReadinessNodeKind;
  label: string;
  /** Canonical capability id when kind === capability */
  capabilityId?: EmergingCapabilityId;
  regionHints?: RegionCode[];
  description: string;
}

export interface ReadinessGraphEdge {
  from: string;
  to: string;
  relation: 'requires_evidence' | 'accelerates' | 'unlocks_play' | 'feeds_commercialization';
  weight: number;
}

export interface IntegratedReadinessGraph {
  version: 'agent03-1';
  nodes: ReadinessGraphNode[];
  edges: ReadinessGraphEdge[];
}

const cap = (
  id: EmergingCapabilityId,
  label: string,
  description: string,
  regionHints?: RegionCode[],
): ReadinessGraphNode => ({
  id: `cap:${id}`,
  kind: 'capability',
  capabilityId: id,
  label,
  regionHints,
  description,
});

const inst = (id: string, label: string, description: string, regionHints?: RegionCode[]): ReadinessGraphNode => ({
  id: `inst:${id}`,
  kind: 'institution',
  label,
  regionHints,
  description,
});

const gate = (id: string, label: string, description: string): ReadinessGraphNode => ({
  id: `gate:${id}`,
  kind: 'commercialization_gate',
  label,
  description,
});

const ui = (id: string, label: string, description: string): ReadinessGraphNode => ({
  id: `ui:${id}`,
  kind: 'ui_surface',
  label,
  description,
});

/** Research → industry spine (commercialization hub). */
export const AGENT03_READINESS_GRAPH: IntegratedReadinessGraph = {
  version: 'agent03-1',
  nodes: [
    cap('research_commercialization', 'Research Commercialization', 'Research and technology linked to manufacturing, trade and finance.', ['ACT', 'VIC', 'NSW']),
    cap('ai_compute_infrastructure', 'AI Compute Infrastructure', 'Sovereign compute from data centres, energy and digital networks.', ['ACT', 'NSW', 'VIC']),
    cap('advanced_manufacturing', 'Advanced Manufacturing', 'Value-chain depth from minerals, energy and research.', ['VIC', 'SA', 'NSW']),
    cap('automated_mining', 'Automated Mining', 'Remote mining automation evidence anchor.', ['WA', 'QLD']),
    cap('sovereign_ai_platforms', 'Sovereign AI Platforms', 'Proposed: national AI platform layer atop compute + commercialization.', ['ACT', 'NSW']),
    cap('clinical_translation_network', 'Clinical Translation Network', 'Proposed: research hospitals + biomanufacturing pathways.', ['NSW', 'VIC', 'QLD']),
    cap('quantum_sensing_industry', 'Quantum Sensing Industry', 'Proposed: precision instruments for mining, defence, agriculture.', ['ACT', 'SA', 'WA']),
    cap('defence_dual_use_pipeline', 'Defence Dual-Use Pipeline', 'Proposed: controlled dual-use from research + manufacturing.', ['ACT', 'SA', 'NSW']),
    inst('csiro_ai_directorate', 'CSIRO AI Directorate', 'National research directorate for AI and advanced technology.', ['ACT']),
    inst('unsw_translation_hub', 'UNSW Translation Hub', 'University–industry translation for deep tech spin-outs.', ['NSW']),
    inst('melbourne_biomedical_precinct', 'Melbourne Biomedical Precinct', 'Clinical trials and med-tech commercialization cluster.', ['VIC']),
    inst('wa_pawsey_extension', 'Pawsey Extension Consortium', 'HPC and quantum sensing for resources sector.', ['WA']),
    inst('qld_critical_minerals_research', 'QLD Critical Minerals Research Office', 'Downstream processing research tied to export corridors.', ['QLD']),
    gate('comm_pipeline', 'Commercialization Pipeline', 'Institutional intake of demos — requires research_commercialization emerging+.',),
    gate('comm_pilot', 'Pilot Markets', 'Regional pilots — requires demonstrated commercialization + industry base.',),
    gate('comm_export', 'Export-Ready IP', 'Export-facing contracts — requires operational commercialization in ≥2 regions.',),
    ui('play_innovation_strip', 'PLAY Innovation Strip', 'Compact capability line in PLAY (V9.4 presentation-only).'),
    ui('lab_innovation_inspector', 'LAB Innovation Inspector', 'V10.5 inspector tabs for maturity and productivity hooks.'),
    ui('gi_capability_queries', 'GI Capability Queries', 'Game Intelligence answers for capability blockers and productivity.'),
  ],
  edges: [
    { from: 'inst:csiro_ai_directorate', to: 'cap:ai_compute_infrastructure', relation: 'accelerates', weight: 0.35 },
    { from: 'inst:csiro_ai_directorate', to: 'cap:sovereign_ai_platforms', relation: 'requires_evidence', weight: 0.5 },
    { from: 'cap:ai_compute_infrastructure', to: 'cap:sovereign_ai_platforms', relation: 'requires_evidence', weight: 0.7 },
    { from: 'cap:research_commercialization', to: 'cap:sovereign_ai_platforms', relation: 'requires_evidence', weight: 0.55 },
    { from: 'inst:unsw_translation_hub', to: 'cap:research_commercialization', relation: 'accelerates', weight: 0.4 },
    { from: 'inst:melbourne_biomedical_precinct', to: 'cap:clinical_translation_network', relation: 'requires_evidence', weight: 0.6 },
    { from: 'cap:research_commercialization', to: 'cap:clinical_translation_network', relation: 'requires_evidence', weight: 0.5 },
    { from: 'inst:wa_pawsey_extension', to: 'cap:quantum_sensing_industry', relation: 'requires_evidence', weight: 0.45 },
    { from: 'cap:automated_mining', to: 'cap:quantum_sensing_industry', relation: 'accelerates', weight: 0.25 },
    { from: 'cap:advanced_manufacturing', to: 'cap:defence_dual_use_pipeline', relation: 'requires_evidence', weight: 0.5 },
    { from: 'cap:research_commercialization', to: 'gate:comm_pipeline', relation: 'feeds_commercialization', weight: 1 },
    { from: 'gate:comm_pipeline', to: 'gate:comm_pilot', relation: 'feeds_commercialization', weight: 1 },
    { from: 'gate:comm_pilot', to: 'gate:comm_export', relation: 'feeds_commercialization', weight: 1 },
    { from: 'cap:research_commercialization', to: 'ui:play_innovation_strip', relation: 'unlocks_play', weight: 0.3 },
    { from: 'cap:research_commercialization', to: 'ui:lab_innovation_inspector', relation: 'unlocks_play', weight: 0.2 },
    { from: 'cap:ai_compute_infrastructure', to: 'ui:gi_capability_queries', relation: 'unlocks_play', weight: 0.25 },
  ],
};

export function graphNeighbors(nodeId: string): ReadinessGraphEdge[] {
  return AGENT03_READINESS_GRAPH.edges.filter(e => e.from === nodeId || e.to === nodeId);
}

export function capabilityUpstreamBaseline(id: BaselineEmergingCapabilityId): BaselineEmergingCapabilityId[] {
  const map: Partial<Record<BaselineEmergingCapabilityId, BaselineEmergingCapabilityId[]>> = {
    research_commercialization: ['ai_compute_infrastructure', 'advanced_manufacturing'],
    ai_compute_infrastructure: [],
    advanced_manufacturing: ['research_commercialization'],
    automated_mining: ['ai_compute_infrastructure'],
    precision_agriculture: ['research_commercialization'],
  };
  return map[id] || [];
}

export function validateReadinessGraph(): string[] {
  const issues: string[] = [];
  const nodeIds = new Set(AGENT03_READINESS_GRAPH.nodes.map(n => n.id));
  AGENT03_READINESS_GRAPH.edges.forEach(e => {
    if (!nodeIds.has(e.from)) issues.push(`edge missing from node: ${e.from}`);
    if (!nodeIds.has(e.to)) issues.push(`edge missing to node: ${e.to}`);
    if (e.weight < 0 || e.weight > 1) issues.push(`edge weight out of range: ${e.from}->${e.to}`);
  });
  return issues;
}
