import {
  v1014laborBandDemographic,
  v1014laborBandEmployment,
  v1014laborBandMigration,
  v1014laborBandWage,
  v1014laborClamp
} from './bands';
import {
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_LIMITS,
  V1014_LABOR_SCHEMA_VERSION,
  type LaborDemographicsInputs,
  type LaborDemographicsPersisted
} from './types';

export function createInitialLaborDemographicsPersisted(turn = 1): LaborDemographicsPersisted {
  return {
    schemaVersion: V1014_LABOR_SCHEMA_VERSION,
    revision: 1,
    initializedTurn: null,
    lastUpdatedTurn: Math.max(1, turn),
    lastInputHash: '',
    nationalHysteresis: {
      demographicStructure: 'stable',
      employmentLinkage: 'balanced',
      wagePressure: 'stable',
      migrationFlow: 'balanced',
      demographicScore: 52,
      employmentLinkageScore: 55,
      wagePressureScore: 50,
      migrationFlowScore: 50
    },
    regionalHysteresis: {},
    transitions: [],
    history: []
  };
}

export function sanitizeLaborDemographicsPersisted(raw: any, turn = 1): LaborDemographicsPersisted {
  const base = createInitialLaborDemographicsPersisted(turn);
  if (!raw || typeof raw !== 'object') return base;
  const nh = raw.nationalHysteresis && typeof raw.nationalHysteresis === 'object' ? raw.nationalHysteresis : {};
  return {
    ...base,
    schemaVersion: V1014_LABOR_SCHEMA_VERSION,
    revision: Math.max(1, Math.floor(Number(raw.revision) || base.revision)),
    initializedTurn: raw.initializedTurn == null ? null : Math.max(1, Math.floor(Number(raw.initializedTurn))),
    lastUpdatedTurn: Math.max(1, Math.floor(Number(raw.lastUpdatedTurn) || turn)),
    lastInputHash: typeof raw.lastInputHash === 'string' ? raw.lastInputHash.slice(0, 120) : '',
    nationalHysteresis: {
      demographicStructure: v1014laborBandDemographic(v1014laborClamp(Number(nh.demographicScore) || 52)),
      employmentLinkage: v1014laborBandEmployment(v1014laborClamp(Number(nh.employmentLinkageScore) || 55)),
      wagePressure: v1014laborBandWage(v1014laborClamp(Number(nh.wagePressureScore) || 50)),
      migrationFlow: v1014laborBandMigration(v1014laborClamp(Number(nh.migrationFlowScore) || 50)),
      demographicScore: v1014laborClamp(Number(nh.demographicScore) || 52),
      employmentLinkageScore: v1014laborClamp(Number(nh.employmentLinkageScore) || 55),
      wagePressureScore: v1014laborClamp(Number(nh.wagePressureScore) || 50),
      migrationFlowScore: v1014laborClamp(Number(nh.migrationFlowScore) || 50)
    },
    regionalHysteresis: typeof raw.regionalHysteresis === 'object' && raw.regionalHysteresis ? raw.regionalHysteresis : {},
    transitions: Array.isArray(raw.transitions) ? raw.transitions.slice(-V1014_LABOR_LIMITS.maxTransitions) : [],
    history: Array.isArray(raw.history) ? raw.history.slice(-V1014_LABOR_LIMITS.maxHistory) : []
  };
}

export function laborDemographicsInputHash(inputs: LaborDemographicsInputs): string {
  const turn = Math.floor(inputs.turn || 1);
  const ind = inputs.industries?.national?.output || {};
  const parts: string[] = [String(turn), inputs.enabled === false ? '0' : '1'];
  STRATEGIC_INDUSTRIES.forEach(k => parts.push(`${k}:${Math.round(Number((ind as any)[k] || 0))}`));
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    const reg = inputs.industries?.regions?.[c];
    if (!reg) return;
    STRATEGIC_INDUSTRIES.forEach(k => {
      const st = reg.industries?.[k];
      parts.push(`${c}:${k}:${Math.round(Number(st?.effectiveOutput || 0))}:${st?.condition || 'n'}`);
    });
  });
  const wf = inputs.workforce?.national?.effectivePressureRatio ?? inputs.workforce?.nationalPressureRatio;
  parts.push(`wf:${Math.round(Number(wf || 0) * 100)}`);
  const hh = inputs.households?.national?.employmentOpportunity;
  parts.push(`hh:${hh || 'n'}`);
  const autoCaps = (inputs.capabilities || [])
    .filter(c => c.active !== false)
    .map(c => `${c.id}:${Math.round(Number(c.automationShift) || 0)}`)
    .join(',');
  parts.push(`auto:${autoCaps}`);
  let h = 2166136261;
  const s = parts.join('|');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `v1014_${(h >>> 0).toString(16)}`;
}
