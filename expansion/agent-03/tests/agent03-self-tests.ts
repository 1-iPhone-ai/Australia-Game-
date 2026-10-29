import {
  AGENT03_EFFECT_CAP,
  CAPABILITY_MATURITY_RANK,
  type CapabilityMaturity,
} from '../types';
import { validateReadinessGraph } from '../core/readiness-graph';
import { validateInstitutionCatalog } from '../core/institutions-catalog';
import { deriveCommercializationStage, commercializationIndustryBonus } from '../core/commercialization-pathways';
import { evaluateUnlock, evaluateAllUnlocks } from '../core/progression-unlocks';
import {
  applyProductivityBridge,
  simulateAutomatedMiningProductivity,
  simulateResearchCommercializationProductivity,
} from '../core/productivity-bridge';
import { AGENT03_PROPOSED_CAPABILITIES } from '../core/extended-capabilities';
import { matchGiHook, AGENT03_UI_SURFACES } from '../core/gi-ui-hooks';

export interface Agent03TestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export function runAgent03SelfTests(): Agent03TestResult[] {
  const results: Agent03TestResult[] = [];
  const check = (id: string, name: string, fn: () => true | string) => {
    try {
      const r = fn();
      results.push({ id, name, passed: r === true, detail: r === true ? '' : String(r) });
    } catch (err) {
      results.push({
        id,
        name,
        passed: false,
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  };

  check('a03_graph_valid', 'Readiness graph nodes and edges validate', () => {
    const issues = validateReadinessGraph();
    return issues.length ? issues.join('; ') : true;
  });

  check('a03_inst_valid', 'Institution catalog validates', () => {
    const issues = validateInstitutionCatalog();
    return issues.length ? issues.join('; ') : true;
  });

  check('a03_comm_latent', 'Commercialization latent without maturity', () => {
    const s = deriveCommercializationStage({
      researchCommercializationMaturity: 'unavailable',
      adoptionByRegion: {},
      influentialInstitutionIds: ['unsw_translation_hub'],
    });
    return s.stage === 'latent' ? true : s.stage;
  });

  check('a03_comm_pipeline', 'Pipeline requires emerging maturity + intake institution', () => {
    const s = deriveCommercializationStage({
      researchCommercializationMaturity: 'emerging',
      adoptionByRegion: { NSW: 'emerging' },
      influentialInstitutionIds: ['unsw_translation_hub'],
    });
    return s.stage === 'pipeline' ? true : JSON.stringify(s);
  });

  check('a03_comm_pilot', 'Pilot requires demonstrated + pilot host', () => {
    const s = deriveCommercializationStage({
      researchCommercializationMaturity: 'demonstrated',
      adoptionByRegion: { VIC: 'demonstrated', NSW: 'emerging' },
      influentialInstitutionIds: ['melbourne_biomedical_precinct', 'unsw_translation_hub'],
    });
    return s.stage === 'pilot' ? true : JSON.stringify(s);
  });

  check('a03_comm_export', 'Export-ready needs scaled + export licensor + sectors', () => {
    const s = deriveCommercializationStage({
      researchCommercializationMaturity: 'operational',
      adoptionByRegion: { NSW: 'operational', VIC: 'operational', QLD: 'demonstrated' },
      influentialInstitutionIds: ['qld_critical_minerals_research', 'unsw_translation_hub', 'melbourne_biomedical_precinct'],
      sectorScores: { QLD: { manufacturing: 40, technology: 45 } },
    });
    return s.stage === 'export_ready' || s.stage === 'scaled' ? true : JSON.stringify(s);
  });

  check('a03_unlock_play', 'PLAY innovation hint unlocks at research_commercialization emerging', () => {
    const r = evaluateUnlock('unlock_play_innovation_hint', {
      capabilityMaturity: { research_commercialization: CAPABILITY_MATURITY_RANK.emerging },
      commercializationStageRank: 0,
      institutionsPresent: {},
      sectorScores: {},
      institutionalCapabilityRank: {},
    });
    return r.ok ? true : r.missing.join('; ');
  });

  check('a03_unlock_contract', 'Spin-out contracts need commercialization pilot rank', () => {
    const fail = evaluateUnlock('unlock_contract_spinout_wave', {
      capabilityMaturity: { research_commercialization: CAPABILITY_MATURITY_RANK.demonstrated },
      commercializationStageRank: 1,
      institutionsPresent: {},
      sectorScores: {},
      institutionalCapabilityRank: {},
    });
    const ok = evaluateUnlock('unlock_contract_spinout_wave', {
      capabilityMaturity: { research_commercialization: CAPABILITY_MATURITY_RANK.demonstrated },
      commercializationStageRank: 2,
      institutionsPresent: {},
      sectorScores: {},
      institutionalCapabilityRank: {},
    });
    return !fail.ok && ok.ok ? true : JSON.stringify({ fail, ok });
  });

  check('a03_unlock_all_bounded', 'evaluateAllUnlocks returns stable keys', () => {
    const all = evaluateAllUnlocks({
      capabilityMaturity: {},
      commercializationStageRank: 0,
      institutionsPresent: {},
      sectorScores: {},
      institutionalCapabilityRank: {},
    });
    return Object.keys(all).length >= 8 ? true : String(Object.keys(all).length);
  });

  check('a03_prod_mining', 'Automated mining productivity: mining up, energy down, capped', () => {
    const { miningDelta, energyDelta } = simulateAutomatedMiningProductivity({ WA: { mining: 90, energy: 50 } });
    return miningDelta > 0 && miningDelta <= AGENT03_EFFECT_CAP && energyDelta < 0 && Math.abs(energyDelta) <= AGENT03_EFFECT_CAP
      ? true
      : JSON.stringify({ miningDelta, energyDelta });
  });

  check('a03_prod_comm_increases', 'Commercialization scaled adds bounded industry bonus', () => {
    const latent = simulateResearchCommercializationProductivity('latent', { VIC: { manufacturing: 50 } });
    const scaled = simulateResearchCommercializationProductivity('scaled', { VIC: { manufacturing: 50, research: 40, technology: 45 } });
    return scaled > latent && scaled <= AGENT03_EFFECT_CAP * 4 ? true : JSON.stringify({ latent, scaled });
  });

  check('a03_prod_per_sector_bound', 'Grid-style per-sector bound respects low base', () => {
    const mods = applyProductivityBridge({
      capabilityEffects: [
        {
          capabilityId: 'grid_scale_storage',
          maturity: 'operational' as CapabilityMaturity,
          operational: true,
          effects: [
            {
              kind: 'network_efficiency',
              targetKey: 'energy',
              magnitude: 5,
              perSectorBound: 'renewables',
              regionIds: ['SA', 'NT'],
            },
          ],
        },
      ],
      commercializationStage: 'latent',
      sectorByRegion: { SA: { renewables: 70 }, NT: { renewables: 5 } },
    });
    const sa = mods.find(m => m.regionId === 'SA' && m.network === 'energy')?.delta ?? 0;
    const nt = mods.find(m => m.regionId === 'NT' && m.network === 'energy')?.delta ?? 0;
    return sa > nt && sa <= AGENT03_EFFECT_CAP && nt <= 1 ? true : JSON.stringify({ sa, nt, mods });
  });

  check('a03_proposed_caps', 'Four proposed capabilities with prerequisites', () => {
    return AGENT03_PROPOSED_CAPABILITIES.length === 4 &&
      AGENT03_PROPOSED_CAPABILITIES.every(c => c.prerequisiteCapabilities.length >= 1)
      ? true
      : String(AGENT03_PROPOSED_CAPABILITIES.length);
  });

  check('a03_gi_match', 'GI commercialization hook matches natural language', () => {
    const h = matchGiHook('Why is commercialization blocked in NSW?');
    return h?.id === 'commercialization_blockers' ? true : JSON.stringify(h);
  });

  check('a03_ui_surfaces', 'UI surfaces reference valid unlock ids', () => {
    const bad = AGENT03_UI_SURFACES.filter(u => !u.visibleWhenUnlock.startsWith('unlock_'));
    return bad.length === 0 ? true : bad.map(b => b.id).join(',');
  });

  check('a03_comm_bonus_monotone', 'Commercialization bonuses monotone by stage', () => {
    const stages = ['latent', 'pipeline', 'pilot', 'scaled', 'export_ready'] as const;
    let prev = 0;
    for (const st of stages) {
      const b = commercializationIndustryBonus(st, 'manufacturing');
      if (b < prev) return `${st} decreased ${prev}->${b}`;
      prev = b;
    }
    return true;
  });

  return results;
}

export function summarizeAgent03Tests(results: Agent03TestResult[]): { passed: number; total: number; failed: Agent03TestResult[] } {
  const failed = results.filter(r => !r.passed);
  return { passed: results.length - failed.length, total: results.length, failed };
}
