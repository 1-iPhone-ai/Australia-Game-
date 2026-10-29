/**
 * Agent 03 self-tests + integration contract validation.
 * Run: npm run test:agent-03
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import {
  AGENT03_CATALOG,
  RESEARCH_BRANCH_NODES,
  RESEARCH_NODE_BY_ID,
  STRATEGY_HOOKS,
  STRATEGY_HOOK_BY_ID,
  V94_CAPABILITY_IDS,
  V94_MEGAPROJECT_KINDS,
  branchNodeTopologicalOrder,
  computeResearchProgress,
  computeResearchScaleWaveReport,
  createEmptyResearchProgressState,
  detectPrerequisiteCycle,
  evaluateNodePrerequisites,
  prepareResearchProgressForSave,
  migrateResearchProgressSave,
  assertResearchProgressSaveIntegrity,
  RESEARCH_PROGRESS_SCHEMA_VERSION,
  computeResearchProgressFromSave,
  applyResearchProgressSavePipeline,
  detectForeignSaveFields,
  emptyResearchProgressCore,
  validatePersistedCoreForWrite,
  setResearchBranchEmphasisOnCore,
  reconcileResearchProgressOnLoad,
  sealResearchProgressForSave,
  diffResearchPersistedCore,
  exportResearchProgressCheckpointJson,
  importResearchProgressCheckpointJson,
  computeResearchCommercializationReport,
  runResearchProgressRegressionHarness,
  projectResearchDiffusionHorizon,
  computeResearchSynergyOutlook,
  type Agent03SelfTestResult,
  type ResearchProgressInputs,
} from '../src/index.ts';

function assert(cond: boolean, detail?: string): void {
  if (!cond) throw new Error(detail || 'assertion failed');
}

function test(id: string, fn: () => void): Agent03SelfTestResult {
  try {
    fn();
    return { id, passed: true };
  } catch (e) {
    return { id, passed: false, detail: e instanceof Error ? e.message : String(e) };
  }
}

function baseInputs(overrides: Partial<ResearchProgressInputs> = {}): ResearchProgressInputs {
  return {
    turn: 10,
    regions: [
      { code: 'ACT', sectors: { research: 40, technology: 35 } },
      { code: 'VIC', sectors: { manufacturing: 45, technology: 30 } },
      { code: 'WA', sectors: { mining: 50, technology: 20 } },
      { code: 'NSW', sectors: { research: 25, agriculture: 30 } },
      { code: 'SA', sectors: { renewables: 40, energy: 35 } },
      { code: 'QLD', sectors: { mining: 30, renewables: 25 } },
      { code: 'TAS', sectors: { research: 15, technology: 10 } },
      { code: 'NT', sectors: { mining: 20 } },
      { code: 'AAT', sectors: { research: 5 } },
    ],
    capabilities: {},
    projects: [],
    completedContracts: [],
    megaprojects: {},
    factionStanding: {},
    ...overrides,
  };
}

const tests: Agent03SelfTestResult[] = [];

tests.push(
  test('catalog_no_prerequisite_cycles', () => {
    assert(detectPrerequisiteCycle() === null, detectPrerequisiteCycle() ?? undefined);
  })
);

tests.push(
  test('every_node_hook_id_registered', () => {
    for (const node of RESEARCH_BRANCH_NODES) {
      for (const hid of node.hookIds) {
        assert(!!STRATEGY_HOOK_BY_ID[hid], `missing hook ${hid} on ${node.id}`);
      }
    }
  })
);

tests.push(
  test('integration_contract_capability_ids', () => {
    for (const node of RESEARCH_BRANCH_NODES) {
      for (const ext of node.external) {
        if (ext.kind === 'capability') {
          assert(V94_CAPABILITY_IDS.includes(ext.capability), ext.capability);
        }
        if (ext.kind === 'megaproject_stage') {
          assert(V94_MEGAPROJECT_KINDS.includes(ext.program), ext.program);
        }
      }
    }
  })
);

tests.push(
  test('strategy_hooks_reference_valid_capabilities', () => {
    for (const hook of STRATEGY_HOOKS) {
      hook.targets.capabilities?.forEach(c => assert(V94_CAPABILITY_IDS.includes(c.id), c.id));
      hook.targets.megaprojects?.forEach(m => assert(V94_MEGAPROJECT_KINDS.includes(m), m));
    }
  })
);

tests.push(
  test('topological_order_respects_tiers', () => {
    for (const branch of AGENT03_CATALOG.branches) {
      const order = branchNodeTopologicalOrder(branch.id);
      const tierOf = (id: string) => RESEARCH_NODE_BY_ID[id].tier;
      for (let i = 1; i < order.length; i++) {
        assert(tierOf(order[i]) >= tierOf(order[i - 1]), branch.id);
      }
    }
  })
);

tests.push(
  test('prerequisites_block_until_external_met', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'planned' }],
    });
    const ev = evaluateNodePrerequisites(inputs, 'df_t1_campus_foundation', new Set());
    assert(!ev.satisfied, 'should block inactive project');
  })
);

tests.push(
  test('unlock_campus_when_project_active', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const state = computeResearchProgress(inputs, createEmptyResearchProgressState());
    assert(state.unlockedNodes.some(u => u.nodeId === 'df_t1_campus_foundation'));
    assert(state.activeHookIds.includes('hook_df_campus_online'));
  })
);

tests.push(
  test('diffusion_increases_after_unlock', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
      factionStanding: { csiro_ai_directorate: 45 },
    });
    const state = computeResearchProgress(inputs, null);
    const act = state.diffusion.find(d => d.regionId === 'ACT');
    assert(act != null && act.score > 0, `ACT score ${act?.score}`);
    assert(act!.level !== 'latent' || act!.score > 0);
  })
);

tests.push(
  test('monotonic_unlocks_preserved', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const s1 = computeResearchProgress(inputs, null);
    const s2 = computeResearchProgress({ ...inputs, turn: 11, projects: [] }, s1);
    assert(
      s2.unlockedNodes.some(u => u.nodeId === 'df_t1_campus_foundation'),
      'prior unlock must persist even if inputs regress'
    );
  })
);

tests.push(
  test('late_game_hook_requires_tier', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const state = computeResearchProgress(inputs, null);
    assert(!state.activeHookIds.includes('hook_endgame_digital_sovereignty'));
  })
);

tests.push(
  test('endgame_digital_unlock_chain', () => {
    const inputs = baseInputs({
      turn: 120,
      projects: [
        { id: 'c1', regionId: 'ACT', projectType: 'research_campus', status: 'active' },
        { id: 's1', regionId: 'NSW', projectType: 'subsea_cable_hub', status: 'active' },
        { id: 'd1', regionId: 'ACT', projectType: 'data_center', status: 'active' },
      ],
      capabilities: {
        ai_compute_infrastructure: { maturity: 'nationally_integrated', activeRegionIds: ['ACT', 'NSW'] },
      },
      megaprojects: {
        continental_digital_backbone: { completedStages: 3, status: 'under_construction' },
      },
      factionStanding: { csiro_ai_directorate: 60 },
    });
    const state = computeResearchProgress(inputs, null);
    assert(state.unlockedNodes.some(u => u.nodeId === 'df_t4_continental_integrated'));
    assert(state.activeHookIds.includes('hook_endgame_digital_sovereignty'));
  })
);

tests.push(
  test('readiness_reflects_institution_standing', () => {
    const low = computeResearchProgress(
      baseInputs({ factionStanding: { csiro_ai_directorate: 10 } }),
      null
    );
    const high = computeResearchProgress(
      baseInputs({ factionStanding: { csiro_ai_directorate: 55 } }),
      null
    );
    assert(high.readinessByBranch.digital_frontier > low.readinessByBranch.digital_frontier);
  })
);

tests.push(
  test('institution_upgrade_affiliate_at_standing', () => {
    const inputs = baseInputs({ factionStanding: { csiro_ai_directorate: 40 } });
    const state = computeResearchProgress(inputs, null);
    const csiro = state.institutionUpgrades.find(u => u.institutionId === 'csiro_ai_directorate');
    assert(csiro?.tier === 'affiliate', csiro?.tier);
  })
);

tests.push(
  test('institution_upgrade_partner_with_contract', () => {
    const inputs = baseInputs({
      factionStanding: { csiro_ai_directorate: 50 },
      completedContracts: [{ contractType: 'ai_research_center', regionId: 'ACT' }],
    });
    const state = computeResearchProgress(inputs, null);
    const csiro = state.institutionUpgrades.find(u => u.institutionId === 'csiro_ai_directorate');
    assert(csiro?.tier === 'partner', csiro?.tier);
  })
);

tests.push(
  test('institution_upgrade_monotonic_on_standing_drop', () => {
    const rich = baseInputs({
      factionStanding: { csiro_ai_directorate: 55 },
      completedContracts: [{ contractType: 'ai_research_center', regionId: 'ACT' }],
    });
    const s1 = computeResearchProgress(rich, null);
    const s2 = computeResearchProgress(
      baseInputs({ factionStanding: { csiro_ai_directorate: 10 } }),
      s1
    );
    const before = s1.institutionUpgrades.find(u => u.institutionId === 'csiro_ai_directorate')!;
    const after = s2.institutionUpgrades.find(u => u.institutionId === 'csiro_ai_directorate')!;
    assert(
      after.tier === before.tier || before.tier === 'dormant',
      `${before.tier} -> ${after.tier}`
    );
  })
);

tests.push(
  test('late_game_cascade_activates_on_tier4', () => {
    const inputs = baseInputs({
      turn: 120,
      projects: [
        { id: 'c1', regionId: 'ACT', projectType: 'research_campus', status: 'active' },
        { id: 's1', regionId: 'NSW', projectType: 'subsea_cable_hub', status: 'active' },
        { id: 'd1', regionId: 'ACT', projectType: 'data_center', status: 'active' },
      ],
      capabilities: {
        ai_compute_infrastructure: { maturity: 'nationally_integrated', activeRegionIds: ['ACT', 'NSW'] },
      },
      megaprojects: {
        continental_digital_backbone: { completedStages: 3, status: 'under_construction' },
      },
      factionStanding: { csiro_ai_directorate: 60 },
    });
    const state = computeResearchProgress(inputs, null);
    assert(state.lateGameDiffusion?.active === true, 'cascade inactive');
    assert((state.lateGameDiffusion?.tier4UnlockCount ?? 0) >= 1);
    const nt = state.diffusion.find(d => d.regionId === 'NT');
    assert(nt != null && (nt.cascadeBoost ?? 0) >= 0);
  })
);

tests.push(
  test('national_institution_boosts_readiness_over_affiliate', () => {
    const affiliate = computeResearchProgress(
      baseInputs({ factionStanding: { csiro_ai_directorate: 40 } }),
      null
    );
    const endgame = computeResearchProgress(
      baseInputs({
        turn: 120,
        projects: [
          { id: 'c1', regionId: 'ACT', projectType: 'research_campus', status: 'active' },
          { id: 's1', regionId: 'NSW', projectType: 'subsea_cable_hub', status: 'active' },
          { id: 'd1', regionId: 'ACT', projectType: 'data_center', status: 'active' },
        ],
        capabilities: {
          ai_compute_infrastructure: { maturity: 'nationally_integrated', activeRegionIds: ['ACT'] },
        },
        megaprojects: { continental_digital_backbone: { completedStages: 3, status: 'active' } },
        factionStanding: { csiro_ai_directorate: 75 },
        completedContracts: [{ contractType: 'ai_research_center', regionId: 'ACT' }],
      }),
      null
    );
    const aff = affiliate.institutionUpgrades.find(u => u.institutionId === 'csiro_ai_directorate');
    const nat = endgame.institutionUpgrades.find(u => u.institutionId === 'csiro_ai_directorate');
    assert((nat?.readinessMultiplier ?? 0) > (aff?.readinessMultiplier ?? 0));
    assert(endgame.readinessByBranch.digital_frontier >= affiliate.readinessByBranch.digital_frontier);
  })
);

tests.push(
  test('save_v2_migrates_to_v3_with_log', () => {
    const v2 = {
      schemaVersion: 'op10m-agent03-v2',
      turn: 9,
      revision: 2,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
    };
    const core = migrateResearchProgressSave(v2);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert((core?.migrationLog.length ?? 0) >= 1);
    assert(core?.migrationLog[0]?.fromVersion === 'op10m-agent03-v2');
    assert(typeof core?.coreFingerprint === 'string' && core.coreFingerprint.length > 0);
  })
);

tests.push(
  test('detect_foreign_save_fields', () => {
    const bad = { schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION, diffusion: [], readinessByBranch: {} };
    const foreign = detectForeignSaveFields(bad);
    assert(foreign.includes('diffusion'));
    assert(foreign.includes('readinessByBranch'));
  })
);

tests.push(
  test('validate_persisted_core_fingerprint', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const saved = prepareResearchProgressForSave(computeResearchProgress(inputs, null));
    assert(validatePersistedCoreForWrite(saved).length === 0);
    const tampered = { ...saved, revision: saved.revision + 99 };
    assert(validatePersistedCoreForWrite(tampered).includes('coreFingerprint mismatch'));
  })
);

tests.push(
  test('set_branch_emphasis_bumps_revision', () => {
    const core = emptyResearchProgressCore(1);
    const next = setResearchBranchEmphasisOnCore(core, 'digital_frontier', 'fundamental', 5);
    assert(next.emphasisRevision === 1);
    assert(next.branchEmphasis.find(e => e.branchId === 'digital_frontier')?.emphasis === 'fundamental');
  })
);

tests.push(
  test('save_pipeline_roundtrip', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const { state, persist } = applyResearchProgressSavePipeline(inputs, null);
    assert(state.unlockedNodes.length >= 1);
    assert(persist.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(detectForeignSaveFields(persist).length === 0);
  })
);

tests.push(
  test('save_v1_migrates_to_v2_core', () => {
    const legacy = {
      schemaVersion: 'op10m-agent03-v1',
      turn: 42,
      unlockedNodes: [
        { nodeId: 'df_t1_campus_foundation', branchId: 'digital_frontier', unlockedTurn: 5, anchorRegionId: 'ACT' },
      ],
      institutionUpgrades: [],
      diffusion: [{ regionId: 'ACT', score: 0.5, level: 'adopting', sourceNodeIds: ['x'] }],
      readinessByBranch: {},
    };
    const core = migrateResearchProgressSave(legacy);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.revision === 1);
    assert(core?.unlockedNodes.length === 1);
    assert(!('diffusion' in (core as object)));
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v1'));
  })
);

tests.push(
  test('prepare_save_strips_derived_fields', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const state = computeResearchProgress(inputs, null);
    const saved = prepareResearchProgressForSave(state);
    assert(saved.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(saved.branchEmphasis.length === 6);
    assert(assertResearchProgressSaveIntegrity(state).length === 0);
  })
);

tests.push(
  test('compute_from_save_roundtrip', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const s1 = computeResearchProgress(inputs, null);
    const saved = prepareResearchProgressForSave(s1);
    const s2 = computeResearchProgressFromSave(inputs, saved);
    assert(s2.unlockedNodes.some(u => u.nodeId === 'df_t1_campus_foundation'));
    assert(s2.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert((s2.diffusion?.[0]?.score ?? 0) >= 0);
  })
);

tests.push(
  test('save_v3_migrates_to_v6_with_lifecycle_fields', () => {
    const v3 = {
      schemaVersion: 'op10m-agent03-v3',
      turn: 12,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v2', toVersion: 'op10m-agent03-v3', turn: 5 }],
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v3);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.saveKind === 'manual');
    assert(typeof core?.sessionId === 'string');
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v3'));
    assert(Array.isArray(core?.unlockEventLog));
    assert(Array.isArray(core?.emphasisChangeLog));
    assert(core?.institutionTierSnapshot?.digest);
  })
);

tests.push(
  test('save_v4_migrates_to_v6_with_unlock_event_log', () => {
    const v4 = {
      schemaVersion: 'op10m-agent03-v4',
      turn: 8,
      revision: 2,
      unlockedNodes: [
        { nodeId: 'df_t1_campus_foundation', branchId: 'digital_frontier', unlockedTurn: 3, anchorRegionId: 'ACT' },
      ],
      institutionUpgrades: [],
      unlockSeq: 1,
      branchEmphasis: [],
      emphasisRevision: 0,
      migrationLog: [],
      saveKind: 'manual',
      updatedAtTurn: 8,
      sessionId: 'v4',
      persistRevision: 1,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v4);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.unlockEventLog.length === 1);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v4'));
  })
);

tests.push(
  test('save_v5_migrates_to_v6_with_emphasis_log_and_snapshot', () => {
    const v5 = {
      schemaVersion: 'op10m-agent03-v5',
      turn: 9,
      revision: 1,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 2,
      migrationLog: [{ fromVersion: 'op10m-agent03-v4', toVersion: 'op10m-agent03-v5', turn: 8 }],
      saveKind: 'manual',
      updatedAtTurn: 9,
      sessionId: 'v5',
      persistRevision: 3,
      unlockEventLog: [],
      lastReconciledAtTurn: 9,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v5);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v5'));
    assert(Array.isArray(core?.emphasisChangeLog));
    assert(typeof core?.institutionTierSnapshot?.digest === 'string');
  })
);

tests.push(
  test('emphasis_change_log_on_branch_update', () => {
    let core = emptyResearchProgressCore(5);
    core = setResearchBranchEmphasisOnCore(core, 'resource_innovation', 'commercial', 6);
    assert((core.emphasisChangeLog?.length ?? 0) === 1);
    assert(core.emphasisChangeLog?.[0]?.toEmphasis === 'commercial');
    assert(core.emphasisRevision === 1);
  })
);

tests.push(
  test('synergy_outlook_projects_multi_branch', () => {
    const inputs = baseInputs({ turn: 50 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.synergyOutlook ?? computeResearchSynergyOutlook(inputs, state);
    assert(typeof outlook.projectedSynergyScore === 'number');
    assert(outlook.horizonTurns >= 1);
  })
);

tests.push(
  test('seal_refreshes_institution_tier_snapshot', () => {
    const core = emptyResearchProgressCore(3);
    const sealed = sealResearchProgressForSave(core, { turn: 3 });
    assert(sealed.institutionTierSnapshot?.capturedAtTurn === 3);
    assert(typeof sealed.institutionTierSnapshot?.digest === 'string');
  })
);

tests.push(
  test('seal_increments_persist_revision', () => {
    const core = emptyResearchProgressCore(4);
    const sealed = sealResearchProgressForSave(core, { turn: 4, saveKind: 'autosave' });
    assert(sealed.persistRevision === 1);
    assert(sealed.saveKind === 'autosave');
    assert(sealed.updatedAtTurn === 4);
  })
);

tests.push(
  test('reconcile_merges_disk_unlocks', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const computed = computeResearchProgress(inputs, null);
    const disk = {
      schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
      turn: 10,
      revision: 0,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 0,
      migrationLog: [],
      saveKind: 'manual',
      updatedAtTurn: 10,
      sessionId: 'disk',
      persistRevision: 0,
      coreFingerprint: '',
    };
    const { state } = reconcileResearchProgressOnLoad({ turn: 10 }, disk, computed);
    assert(state.unlockedNodes.length >= 1);
  })
);

tests.push(
  test('commercialization_hints_when_tier2', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const state = computeResearchProgress(inputs, null);
    assert(state.commercialization?.hints.length >= 1);
  })
);

tests.push(
  test('regression_harness_monotonic_unlocks', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const result = runResearchProgressRegressionHarness(inputs, [10, 11, 12, 13]);
    assert(result.monotonicUnlocks);
    assert(result.steps.length === 4);
  })
);

tests.push(
  test('checkpoint_json_roundtrip', () => {
    const core = emptyResearchProgressCore(7);
    const json = exportResearchProgressCheckpointJson(core);
    const imported = importResearchProgressCheckpointJson(json);
    assert(imported?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(imported?.saveKind === 'checkpoint');
    const diff = diffResearchPersistedCore(core, imported!);
    assert(diff.some(d => d.path === 'persistRevision' || d.path === 'saveKind'));
  })
);

tests.push(
  test('save_pipeline_seals_persist_revision', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const { persist } = applyResearchProgressSavePipeline(inputs, null);
    assert(persist.persistRevision >= 1);
    assert(persist.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
  })
);

tests.push(
  test('unlock_event_log_appends_on_first_unlock', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const state = computeResearchProgress(inputs, null);
    assert((state.unlockEventLog?.length ?? 0) >= 1);
    assert(state.unlockEventLog?.[0]?.nodeId === 'df_t1_campus_foundation');
  })
);

tests.push(
  test('portfolio_balance_report_active_with_spread', () => {
    const inputs = baseInputs({
      regions: [{ code: 'ACT', sectors: { research: 80, technology: 70 } }],
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const state = computeResearchProgress(inputs, null);
    assert(state.portfolioBalance?.hints.length === 6);
    assert(typeof state.portfolioBalance?.nationalBalanceScore === 'number');
  })
);

tests.push(
  test('diffusion_forecast_projects_future_turns', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const state = computeResearchProgress(inputs, null);
    const forecast = state.diffusionForecast ?? projectResearchDiffusionHorizon(inputs, state, 4);
    assert(forecast.active);
    assert(forecast.projections.some(p => p.turn > inputs.turn));
    assert((forecast.peakProjectedScore ?? 0) >= 0);
  })
);

tests.push(
  test('reconcile_sets_last_reconciled_turn', () => {
    const inputs = baseInputs({
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const computed = computeResearchProgress(inputs, null);
    const { persist } = reconcileResearchProgressOnLoad({ turn: 15 }, null, computed);
    assert(persist.lastReconciledAtTurn === 15);
  })
);

tests.push(
  test('scale_wave_catalog_depth', () => {
    assert(RESEARCH_BRANCH_NODES.length === 30);
    assert(STRATEGY_HOOKS.length === 30);
    assert(RESEARCH_BRANCH_NODES.filter(n => n.tier === 5).length === 6);
  })
);

tests.push(
  test('branch_progress_prerequisite', () => {
    const inputs = baseInputs({
      projects: [{ id: 'c1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const partial = computeResearchProgress(inputs, null);
    const ev = evaluateNodePrerequisites(inputs, 'df_t5_scale_wave_mesh', new Set(partial.unlockedNodes.map(u => u.nodeId)));
    assert(!ev.satisfied, 'needs sovereign tier 4');
  })
);

tests.push(
  test('scale_wave_synergy_when_multi_branch_t3', () => {
    const inputs = baseInputs({ turn: 200 });
    const unlocked = [
      { nodeId: 'df_t3_compute_cluster', branchId: 'digital_frontier' as const, unlockedTurn: 1, anchorRegionId: 'ACT' as const },
      { nodeId: 'it_t3_commercialization', branchId: 'industrial_transformation' as const, unlockedTurn: 2, anchorRegionId: 'VIC' as const },
    ];
    const report = computeResearchScaleWaveReport(inputs, unlocked);
    assert(report.crossBranchSynergyScore > 0);
    assert(report.technologyTransferLinks.length > 0);
  })
);

tests.push(
  test('save_v11_migrates_to_v12_with_portfolio_balance_fields', () => {
    const v11 = {
      schemaVersion: 'op10m-agent03-v11',
      turn: 20,
      revision: 2,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v10', toVersion: 'op10m-agent03-v11', turn: 19 }],
      saveKind: 'manual',
      updatedAtTurn: 20,
      sessionId: 'v11',
      persistRevision: 9,
      unlockEventLog: [],
      lastReconciledAtTurn: 20,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 20, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v11);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v11'));
    assert(Array.isArray(core?.portfolioBalanceLog));
    assert(core?.portfolioBalanceSnapshot === null);
  })
);

tests.push(
  test('portfolio_balance_log_and_snapshot_on_compute', () => {
    const inputs = baseInputs({ turn: 28 });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.portfolioBalanceSnapshot?.digest === 'string');
    assert(Array.isArray(state.portfolioBalanceLog));
  })
);

tests.push(
  test('strategic_alignment_outlook_derived', () => {
    const inputs = baseInputs({ turn: 24 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.strategicAlignmentOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalAlignmentScore === 'number');
    assert(detectForeignSaveFields({ strategicAlignmentOutlook: outlook }).includes('strategicAlignmentOutlook'));
  })
);

tests.push(
  test('save_v10_migrates_to_v11_with_diffusion_integration_fields', () => {
    const v10 = {
      schemaVersion: 'op10m-agent03-v10',
      turn: 18,
      revision: 2,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v9', toVersion: 'op10m-agent03-v10', turn: 17 }],
      saveKind: 'manual',
      updatedAtTurn: 18,
      sessionId: 'v10',
      persistRevision: 8,
      unlockEventLog: [],
      lastReconciledAtTurn: 18,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 18, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v10);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v10'));
    assert(Array.isArray(core?.diffusionIntegrationLog));
    assert(core?.diffusionIntegrationSnapshot === null);
  })
);

tests.push(
  test('diffusion_integration_log_and_snapshot_on_compute', () => {
    const inputs = baseInputs({ turn: 26 });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.diffusionIntegrationSnapshot?.digest === 'string');
    assert(Array.isArray(state.diffusionIntegrationLog));
  })
);

tests.push(
  test('national_coherence_outlook_derived', () => {
    const inputs = baseInputs({ turn: 22 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.nationalCoherenceOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalCoherenceScore === 'number');
    assert(detectForeignSaveFields({ nationalCoherenceOutlook: outlook }).includes('nationalCoherenceOutlook'));
  })
);

tests.push(
  test('save_v9_migrates_to_v10_with_commercialization_fields', () => {
    const v9 = {
      schemaVersion: 'op10m-agent03-v9',
      turn: 16,
      revision: 2,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v8', toVersion: 'op10m-agent03-v9', turn: 15 }],
      saveKind: 'manual',
      updatedAtTurn: 16,
      sessionId: 'v9',
      persistRevision: 7,
      unlockEventLog: [],
      lastReconciledAtTurn: 16,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 16, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v9);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v9'));
    assert(Array.isArray(core?.commercializationMilestoneLog));
    assert(core?.commercializationSnapshot === null);
  })
);

tests.push(
  test('commercialization_milestone_log_and_snapshot_on_compute', () => {
    const inputs = baseInputs({ turn: 24 });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.commercializationSnapshot?.digest === 'string');
    assert(Array.isArray(state.commercializationMilestoneLog));
  })
);

tests.push(
  test('export_continuity_outlook_derived', () => {
    const inputs = baseInputs({ turn: 20 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.exportContinuityOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalContinuityScore === 'number');
    assert(detectForeignSaveFields({ exportContinuityOutlook: outlook }).includes('exportContinuityOutlook'));
  })
);

tests.push(
  test('save_v8_migrates_to_v9_with_synergy_fields', () => {
    const v8 = {
      schemaVersion: 'op10m-agent03-v8',
      turn: 14,
      revision: 2,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v7', toVersion: 'op10m-agent03-v8', turn: 13 }],
      saveKind: 'manual',
      updatedAtTurn: 14,
      sessionId: 'v8',
      persistRevision: 6,
      unlockEventLog: [],
      lastReconciledAtTurn: 14,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 14, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v8);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v8'));
    assert(Array.isArray(core?.synergyThresholdLog));
    assert(core?.synergySnapshot === null);
  })
);

tests.push(
  test('synergy_threshold_log_and_snapshot_on_compute', () => {
    const inputs = baseInputs({ turn: 22 });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.synergySnapshot?.digest === 'string');
    assert(Array.isArray(state.synergyThresholdLog));
  })
);

tests.push(
  test('portfolio_stabilization_outlook_derived', () => {
    const inputs = baseInputs({ turn: 18 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.portfolioStabilizationOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalStabilizationScore === 'number');
    assert(detectForeignSaveFields({ portfolioStabilizationOutlook: outlook }).includes('portfolioStabilizationOutlook'));
  })
);

tests.push(
  test('save_v7_migrates_to_v8_with_risk_and_scale_fields', () => {
    const v7 = {
      schemaVersion: 'op10m-agent03-v7',
      turn: 12,
      revision: 2,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v6', toVersion: 'op10m-agent03-v7', turn: 11 }],
      saveKind: 'manual',
      updatedAtTurn: 12,
      sessionId: 'v7',
      persistRevision: 5,
      unlockEventLog: [],
      lastReconciledAtTurn: 12,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 12, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v7);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v7'));
    assert(Array.isArray(core?.integrationRiskLog));
    assert(core?.scaleWaveSnapshot === null);
  })
);

tests.push(
  test('integration_risk_log_and_scale_snapshot_on_compute', () => {
    const inputs = baseInputs({ turn: 20 });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.integrationRiskSnapshot?.digest === 'string');
    assert(state.scaleWaveSnapshot === null || typeof state.scaleWaveSnapshot?.digest === 'string');
  })
);

tests.push(
  test('adoption_horizon_outlook_derived', () => {
    const inputs = baseInputs({ turn: 15 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.adoptionHorizonOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalAdoptionScore === 'number');
    assert(detectForeignSaveFields({ adoptionHorizonOutlook: outlook }).includes('adoptionHorizonOutlook'));
  })
);

tests.push(
  test('save_v12_migrates_to_v13_with_diffusion_forecast_fields', () => {
    const v12 = {
      schemaVersion: 'op10m-agent03-v12',
      turn: 22,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v11', toVersion: 'op10m-agent03-v12', turn: 21 }],
      saveKind: 'manual',
      updatedAtTurn: 22,
      sessionId: 'v12',
      persistRevision: 11,
      unlockEventLog: [],
      lastReconciledAtTurn: 22,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 22, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v12);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v12'));
    assert(Array.isArray(core?.diffusionForecastBandLog));
    assert(core?.diffusionForecastSnapshot === null);
  })
);

tests.push(
  test('diffusion_forecast_log_and_snapshot_on_compute', () => {
    const inputs = baseInputs({
      turn: 30,
      projects: [{ id: 'p1', regionId: 'ACT', projectType: 'research_campus', status: 'active' }],
    });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.diffusionForecastSnapshot?.digest === 'string');
    assert(Array.isArray(state.diffusionForecastBandLog));
  })
);

tests.push(
  test('horizon_convergence_outlook_derived', () => {
    const inputs = baseInputs({ turn: 26 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.horizonConvergenceOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalConvergenceScore === 'number');
    assert(detectForeignSaveFields({ horizonConvergenceOutlook: outlook }).includes('horizonConvergenceOutlook'));
  })
);

tests.push(
  test('save_v13_migrates_to_v14_with_horizon_convergence_fields', () => {
    const v13 = {
      schemaVersion: 'op10m-agent03-v13',
      turn: 24,
      revision: 2,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v12', toVersion: 'op10m-agent03-v13', turn: 23 }],
      saveKind: 'manual',
      updatedAtTurn: 24,
      sessionId: 'v13',
      persistRevision: 12,
      unlockEventLog: [],
      lastReconciledAtTurn: 24,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 24, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v13);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v13'));
    assert(Array.isArray(core?.horizonConvergenceBandLog));
    assert(core?.horizonConvergenceSnapshot === null);
  })
);

tests.push(
  test('horizon_convergence_log_and_snapshot_on_compute', () => {
    const inputs = baseInputs({ turn: 32 });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.horizonConvergenceSnapshot?.digest === 'string');
    assert(Array.isArray(state.horizonConvergenceBandLog));
  })
);

tests.push(
  test('research_execution_outlook_derived', () => {
    const inputs = baseInputs({ turn: 28 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.researchExecutionOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalExecutionScore === 'number');
    assert(detectForeignSaveFields({ researchExecutionOutlook: outlook }).includes('researchExecutionOutlook'));
  })
);

tests.push(
  test('save_v14_migrates_to_v15_with_research_execution_fields', () => {
    const v14 = {
      schemaVersion: 'op10m-agent03-v14',
      turn: 26,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v13', toVersion: 'op10m-agent03-v14', turn: 25 }],
      saveKind: 'manual',
      updatedAtTurn: 26,
      sessionId: 'v14',
      persistRevision: 13,
      unlockEventLog: [],
      lastReconciledAtTurn: 26,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 26, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v14);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v14'));
    assert(Array.isArray(core?.researchExecutionBandLog));
    assert(core?.researchExecutionSnapshot === null);
  })
);

tests.push(
  test('research_execution_log_and_snapshot_on_compute', () => {
    const inputs = baseInputs({ turn: 34 });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.researchExecutionSnapshot?.digest === 'string');
    assert(Array.isArray(state.researchExecutionBandLog));
  })
);

tests.push(
  test('strategic_delivery_outlook_derived', () => {
    const inputs = baseInputs({ turn: 30 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.strategicDeliveryOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalDeliveryScore === 'number');
    assert(detectForeignSaveFields({ strategicDeliveryOutlook: outlook }).includes('strategicDeliveryOutlook'));
  })
);

tests.push(
  test('save_v15_migrates_to_v16_with_strategic_delivery_fields', () => {
    const v15 = {
      schemaVersion: 'op10m-agent03-v15',
      turn: 28,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v14', toVersion: 'op10m-agent03-v15', turn: 27 }],
      saveKind: 'manual',
      updatedAtTurn: 28,
      sessionId: 'v15',
      persistRevision: 14,
      unlockEventLog: [],
      lastReconciledAtTurn: 28,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 28, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v15);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v15'));
    assert(Array.isArray(core?.strategicDeliveryBandLog));
    assert(core?.strategicDeliverySnapshot === null);
  })
);

tests.push(
  test('strategic_delivery_log_and_snapshot_on_compute', () => {
    const inputs = baseInputs({ turn: 36 });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.strategicDeliverySnapshot?.digest === 'string');
    assert(Array.isArray(state.strategicDeliveryBandLog));
  })
);

tests.push(
  test('scale_wave_maturity_outlook_derived', () => {
    const inputs = baseInputs({ turn: 32 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveMaturityOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalMaturityScore === 'number');
    assert(detectForeignSaveFields({ scaleWaveMaturityOutlook: outlook }).includes('scaleWaveMaturityOutlook'));
  })
);

tests.push(
  test('save_v16_migrates_to_v17_with_scale_wave_maturity_fields', () => {
    const v16 = {
      schemaVersion: 'op10m-agent03-v16',
      turn: 30,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v15', toVersion: 'op10m-agent03-v16', turn: 29 }],
      saveKind: 'manual',
      updatedAtTurn: 30,
      sessionId: 'v16',
      persistRevision: 16,
      unlockEventLog: [],
      lastReconciledAtTurn: 30,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 30, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      coreFingerprint: 'legacy',
    };
    const core = migrateResearchProgressSave(v16);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v16'));
    assert(Array.isArray(core?.scaleWaveMaturityBandLog));
    assert(core?.scaleWaveMaturitySnapshot === null);
  })
);

tests.push(
  test('scale_wave_maturity_log_and_snapshot_on_compute', () => {
    const inputs = baseInputs({ turn: 38 });
    const state = computeResearchProgress(inputs, null);
    assert(typeof state.scaleWaveMaturitySnapshot?.digest === 'string');
    assert(Array.isArray(state.scaleWaveMaturityBandLog));
  })
);

tests.push(
  test('national_integration_outlook_derived', () => {
    const inputs = baseInputs({ turn: 34 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.nationalIntegrationOutlook;
    assert(outlook != null);
    assert(typeof outlook?.nationalIntegrationScore === 'number');
    assert(detectForeignSaveFields({ nationalIntegrationOutlook: outlook }).includes('nationalIntegrationOutlook'));
  })
);

tests.push(
  test('scale_wave_projection_outlook_derived', () => {
    const inputs = baseInputs({ turn: 36 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveProjectionOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 18);
    assert(typeof outlook?.projectionReadinessScore === 'number');
    assert(detectForeignSaveFields({ scaleWaveProjectionOutlook: outlook }).includes('scaleWaveProjectionOutlook'));
  })
);

tests.push(
  test('save_v17_migrates_to_v18_with_national_integration_fields', () => {
    const v17 = {
      schemaVersion: 'op10m-agent03-v17',
      turn: 32,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v16', toVersion: 'op10m-agent03-v17', turn: 31 }],
      saveKind: 'manual',
      updatedAtTurn: 32,
      sessionId: 'v17',
      persistRevision: 17,
      unlockEventLog: [],
      lastReconciledAtTurn: 32,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 32, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
    };
    const core = migrateResearchProgressSave(v17);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v17'));
    assert(Array.isArray(core?.nationalIntegrationBandLog));
    assert(core?.nationalIntegrationSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 33 }), core);
    assert(typeof state.nationalIntegrationSnapshot?.digest === 'string');
    assert(Array.isArray(state.nationalIntegrationBandLog));
  })
);

tests.push(
  test('tranche_projection_readiness_outlook_derived', () => {
    const inputs = baseInputs({ turn: 38 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.trancheProjectionReadinessOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 19);
    assert(outlook?.integrationBaselineShaHint === '7bd7b1f3');
    assert(detectForeignSaveFields({ trancheProjectionReadinessOutlook: outlook }).includes('trancheProjectionReadinessOutlook'));
  })
);

tests.push(
  test('save_v18_migrates_to_v19_with_scale_wave_projection_fields', () => {
    const v18 = {
      schemaVersion: 'op10m-agent03-v18',
      turn: 34,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v17', toVersion: 'op10m-agent03-v18', turn: 33 }],
      saveKind: 'manual',
      updatedAtTurn: 34,
      sessionId: 'v18',
      persistRevision: 18,
      unlockEventLog: [],
      lastReconciledAtTurn: 34,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 34, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
    };
    const core = migrateResearchProgressSave(v18);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v18'));
    assert(Array.isArray(core?.scaleWaveProjectionBandLog));
    assert(core?.scaleWaveProjectionSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 35 }), core);
    assert(typeof state.scaleWaveProjectionSnapshot?.digest === 'string');
    assert(Array.isArray(state.scaleWaveProjectionBandLog));
  })
);

tests.push(
  test('scale_wave_integration_gate_outlook_derived', () => {
    const inputs = baseInputs({ turn: 40 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveIntegrationGateOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 20);
    assert(outlook?.integrationBaselineShaHint === '680b9954');
    assert(detectForeignSaveFields({ scaleWaveIntegrationGateOutlook: outlook }).includes('scaleWaveIntegrationGateOutlook'));
  })
);

tests.push(
  test('save_v19_migrates_to_v20_with_tranche_projection_fields', () => {
    const v19 = {
      schemaVersion: 'op10m-agent03-v19',
      turn: 36,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v18', toVersion: 'op10m-agent03-v19', turn: 35 }],
      saveKind: 'manual',
      updatedAtTurn: 36,
      sessionId: 'v19',
      persistRevision: 19,
      unlockEventLog: [],
      lastReconciledAtTurn: 36,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 36, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
    };
    const core = migrateResearchProgressSave(v19);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v19'));
    assert(Array.isArray(core?.trancheProjectionBandLog));
    assert(core?.trancheProjectionSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 37 }), core);
    assert(typeof state.trancheProjectionSnapshot?.digest === 'string');
    assert(Array.isArray(state.trancheProjectionBandLog));
  })
);

tests.push(
  test('tranche_dry_run_handoff_outlook_derived', () => {
    const inputs = baseInputs({ turn: 42 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.trancheDryRunHandoffOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 21);
    assert(outlook?.integrationBaselineShaHint === '99f2e72b');
    assert(detectForeignSaveFields({ trancheDryRunHandoffOutlook: outlook }).includes('trancheDryRunHandoffOutlook'));
  })
);

tests.push(
  test('save_v20_migrates_to_v21_with_integration_gate_fields', () => {
    const v20 = {
      schemaVersion: 'op10m-agent03-v20',
      turn: 38,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v19', toVersion: 'op10m-agent03-v20', turn: 37 }],
      saveKind: 'manual',
      updatedAtTurn: 38,
      sessionId: 'v20',
      persistRevision: 20,
      unlockEventLog: [],
      lastReconciledAtTurn: 38,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 38, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
    };
    const core = migrateResearchProgressSave(v20);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v20'));
    assert(Array.isArray(core?.integrationGateBandLog));
    assert(core?.integrationGateSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 39 }), core);
    assert(typeof state.integrationGateSnapshot?.digest === 'string');
    assert(Array.isArray(state.integrationGateBandLog));
  })
);

tests.push(
  test('save_v21_migrates_to_v22_with_dry_run_handoff_fields', () => {
    const v21 = {
      schemaVersion: 'op10m-agent03-v21',
      turn: 40,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v20', toVersion: 'op10m-agent03-v21', turn: 39 }],
      saveKind: 'manual',
      updatedAtTurn: 40,
      sessionId: 'v21',
      persistRevision: 21,
      unlockEventLog: [],
      lastReconciledAtTurn: 40,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 40, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
    };
    const core = migrateResearchProgressSave(v21);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v21'));
    assert(Array.isArray(core?.dryRunHandoffBandLog));
    assert(core?.dryRunHandoffSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 41 }), core);
    assert(typeof state.dryRunHandoffSnapshot?.digest === 'string');
    assert(Array.isArray(state.dryRunHandoffBandLog));
  })
);

tests.push(
  test('merged_integration_baseline_outlook_derived', () => {
    const inputs = baseInputs({ turn: 22 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.mergedIntegrationBaselineOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 22);
    assert(outlook?.integrationBaselineShaHint === '634656bb');
    assert(outlook?.projectedFunctionalHint === 1_401_419);
    assert(detectForeignSaveFields({ mergedIntegrationBaselineOutlook: outlook }).includes('mergedIntegrationBaselineOutlook'));
  })
);

tests.push(
  test('save_v22_migrates_to_v23_with_merged_baseline_fields', () => {
    const v22 = {
      schemaVersion: 'op10m-agent03-v22',
      turn: 43,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v21', toVersion: 'op10m-agent03-v22', turn: 42 }],
      saveKind: 'manual',
      updatedAtTurn: 43,
      sessionId: 'v22',
      persistRevision: 22,
      unlockEventLog: [],
      lastReconciledAtTurn: 43,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 43, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
    };
    const core = migrateResearchProgressSave(v22);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v22'));
    assert(Array.isArray(core?.mergedIntegrationBaselineBandLog));
    assert(core?.mergedIntegrationBaselineSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 44 }), core);
    assert(typeof state.mergedIntegrationBaselineSnapshot?.digest === 'string');
    assert(Array.isArray(state.mergedIntegrationBaselineBandLog));
  })
);

tests.push(
  test('scale_wave_post_integration_dry_run_outlook_derived', () => {
    const inputs = baseInputs({ turn: 23 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWavePostIntegrationDryRunOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 23);
    assert(outlook?.integrationBaselineShaHint === 'b23e1449');
    assert(outlook?.projectedFunctionalHint === 1_448_902);
    assert(detectForeignSaveFields({ scaleWavePostIntegrationDryRunOutlook: outlook }).includes('scaleWavePostIntegrationDryRunOutlook'));
  })
);

tests.push(
  test('save_v23_migrates_to_v24_with_post_integration_dry_run_fields', () => {
    const v23 = {
      schemaVersion: 'op10m-agent03-v23',
      turn: 45,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v22', toVersion: 'op10m-agent03-v23', turn: 44 }],
      saveKind: 'manual',
      updatedAtTurn: 45,
      sessionId: 'v23',
      persistRevision: 23,
      unlockEventLog: [],
      lastReconciledAtTurn: 45,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 45, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
    };
    const core = migrateResearchProgressSave(v23);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v23'));
    assert(Array.isArray(core?.postIntegrationDryRunBandLog));
    assert(core?.postIntegrationDryRunSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 46 }), core);
    assert(typeof state.postIntegrationDryRunSnapshot?.digest === 'string');
    assert(Array.isArray(state.postIntegrationDryRunBandLog));
  })
);

tests.push(
  test('scale_wave_integration_seal_outlook_derived', () => {
    const inputs = baseInputs({ turn: 24 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveIntegrationSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 24);
    assert(outlook?.integrationBaselineShaHint === 'b64a7aa8');
    assert(outlook?.projectedFunctionalHint === 1_487_095);
    assert(detectForeignSaveFields({ scaleWaveIntegrationSealOutlook: outlook }).includes('scaleWaveIntegrationSealOutlook'));
  })
);

tests.push(
  test('save_v24_migrates_to_v25_with_integration_seal_fields', () => {
    const v24 = {
      schemaVersion: 'op10m-agent03-v24',
      turn: 47,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v23', toVersion: 'op10m-agent03-v24', turn: 46 }],
      saveKind: 'manual',
      updatedAtTurn: 47,
      sessionId: 'v24',
      persistRevision: 24,
      unlockEventLog: [],
      lastReconciledAtTurn: 47,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 47, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
      postIntegrationDryRunBandLog: [],
      postIntegrationDryRunSnapshot: null,
    };
    const core = migrateResearchProgressSave(v24);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v24'));
    assert(Array.isArray(core?.integrationSealBandLog));
    assert(core?.integrationSealSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 48 }), core);
    assert(typeof state.integrationSealSnapshot?.digest === 'string');
    assert(Array.isArray(state.integrationSealBandLog));
  })
);

tests.push(
  test('scale_wave_post_seal_handoff_outlook_derived', () => {
    const inputs = baseInputs({ turn: 25 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWavePostSealHandoffOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 25);
    assert(outlook?.integrationBaselineShaHint === '8d741ac7');
    assert(outlook?.projectedFunctionalHint === 1_525_288);
    assert(detectForeignSaveFields({ scaleWavePostSealHandoffOutlook: outlook }).includes('scaleWavePostSealHandoffOutlook'));
  })
);

tests.push(
  test('save_v25_migrates_to_v26_with_post_seal_handoff_fields', () => {
    const v25 = {
      schemaVersion: 'op10m-agent03-v25',
      turn: 49,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v24', toVersion: 'op10m-agent03-v25', turn: 48 }],
      saveKind: 'manual',
      updatedAtTurn: 49,
      sessionId: 'v25',
      persistRevision: 25,
      unlockEventLog: [],
      lastReconciledAtTurn: 49,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 49, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
      postIntegrationDryRunBandLog: [],
      postIntegrationDryRunSnapshot: null,
      integrationSealBandLog: [],
      integrationSealSnapshot: null,
    };
    const core = migrateResearchProgressSave(v25);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v25'));
    assert(Array.isArray(core?.postSealHandoffBandLog));
    assert(core?.postSealHandoffSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 50 }), core);
    assert(typeof state.postSealHandoffSnapshot?.digest === 'string');
    assert(Array.isArray(state.postSealHandoffBandLog));
  })
);

tests.push(
  test('save_v26_migrates_to_v27_with_integration_continuity_fields', () => {
    const v26 = {
      schemaVersion: 'op10m-agent03-v26',
      turn: 50,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v25', toVersion: 'op10m-agent03-v26', turn: 49 }],
      saveKind: 'manual',
      updatedAtTurn: 50,
      sessionId: 'v26',
      persistRevision: 26,
      unlockEventLog: [],
      lastReconciledAtTurn: 50,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 50, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
      postIntegrationDryRunBandLog: [],
      postIntegrationDryRunSnapshot: null,
      integrationSealBandLog: [],
      integrationSealSnapshot: null,
      postSealHandoffBandLog: [],
      postSealHandoffSnapshot: null,
    };
    const core = migrateResearchProgressSave(v26);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v26'));
    assert(Array.isArray(core?.integrationContinuityBandLog));
    assert(core?.integrationContinuitySnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 51 }), core);
    assert(typeof state.integrationContinuitySnapshot?.digest === 'string');
    assert(Array.isArray(state.integrationContinuityBandLog));
  })
);

tests.push(
  test('save_v27_migrates_to_v28_with_continuity_handoff_fields', () => {
    const v27 = {
      schemaVersion: 'op10m-agent03-v27',
      turn: 52,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v26', toVersion: 'op10m-agent03-v27', turn: 51 }],
      saveKind: 'manual',
      updatedAtTurn: 52,
      sessionId: 'v27',
      persistRevision: 27,
      unlockEventLog: [],
      lastReconciledAtTurn: 52,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 52, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
      postIntegrationDryRunBandLog: [],
      postIntegrationDryRunSnapshot: null,
      integrationSealBandLog: [],
      integrationSealSnapshot: null,
      postSealHandoffBandLog: [],
      postSealHandoffSnapshot: null,
      integrationContinuityBandLog: [],
      integrationContinuitySnapshot: null,
    };
    const core = migrateResearchProgressSave(v27);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v27'));
    assert(Array.isArray(core?.continuityHandoffBandLog));
    assert(core?.continuityHandoffSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 53 }), core);
    assert(typeof state.continuityHandoffSnapshot?.digest === 'string');
    assert(Array.isArray(state.continuityHandoffBandLog));
  })
);

tests.push(
  test('save_v28_migrates_to_v29_with_handoff_integration_fields', () => {
    const v28 = {
      schemaVersion: 'op10m-agent03-v28',
      turn: 54,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v27', toVersion: 'op10m-agent03-v28', turn: 53 }],
      saveKind: 'manual',
      updatedAtTurn: 54,
      sessionId: 'v28',
      persistRevision: 28,
      unlockEventLog: [],
      lastReconciledAtTurn: 54,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 54, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
      postIntegrationDryRunBandLog: [],
      postIntegrationDryRunSnapshot: null,
      integrationSealBandLog: [],
      integrationSealSnapshot: null,
      postSealHandoffBandLog: [],
      postSealHandoffSnapshot: null,
      integrationContinuityBandLog: [],
      integrationContinuitySnapshot: null,
      continuityHandoffBandLog: [],
      continuityHandoffSnapshot: null,
    };
    const core = migrateResearchProgressSave(v28);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v28'));
    assert(Array.isArray(core?.handoffIntegrationBandLog));
    assert(core?.handoffIntegrationSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 55 }), core);
    assert(typeof state.handoffIntegrationSnapshot?.digest === 'string');
    assert(Array.isArray(state.handoffIntegrationBandLog));
  })
);

tests.push(
  test('save_v29_migrates_to_v30_with_handoff_integration_seal_fields', () => {
    const v29 = {
      schemaVersion: 'op10m-agent03-v29',
      turn: 56,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v28', toVersion: 'op10m-agent03-v29', turn: 55 }],
      saveKind: 'manual',
      updatedAtTurn: 56,
      sessionId: 'v29',
      persistRevision: 29,
      unlockEventLog: [],
      lastReconciledAtTurn: 56,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 56, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
      postIntegrationDryRunBandLog: [],
      postIntegrationDryRunSnapshot: null,
      integrationSealBandLog: [],
      integrationSealSnapshot: null,
      postSealHandoffBandLog: [],
      postSealHandoffSnapshot: null,
      integrationContinuityBandLog: [],
      integrationContinuitySnapshot: null,
      continuityHandoffBandLog: [],
      continuityHandoffSnapshot: null,
      handoffIntegrationBandLog: [],
      handoffIntegrationSnapshot: null,
    };
    const core = migrateResearchProgressSave(v29);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v29'));
    assert(Array.isArray(core?.handoffIntegrationSealBandLog));
    assert(core?.handoffIntegrationSealSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 57 }), core);
    assert(typeof state.handoffIntegrationSealSnapshot?.digest === 'string');
    assert(Array.isArray(state.handoffIntegrationSealBandLog));
  })
);

tests.push(
  test('save_v30_migrates_to_v31_with_integration_seal_handoff_fields', () => {
    const v30 = {
      schemaVersion: 'op10m-agent03-v30',
      turn: 58,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v29', toVersion: 'op10m-agent03-v30', turn: 57 }],
      saveKind: 'manual',
      updatedAtTurn: 58,
      sessionId: 'v30',
      persistRevision: 30,
      unlockEventLog: [],
      lastReconciledAtTurn: 58,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 58, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
      postIntegrationDryRunBandLog: [],
      postIntegrationDryRunSnapshot: null,
      integrationSealBandLog: [],
      integrationSealSnapshot: null,
      postSealHandoffBandLog: [],
      postSealHandoffSnapshot: null,
      integrationContinuityBandLog: [],
      integrationContinuitySnapshot: null,
      continuityHandoffBandLog: [],
      continuityHandoffSnapshot: null,
      handoffIntegrationBandLog: [],
      handoffIntegrationSnapshot: null,
      handoffIntegrationSealBandLog: [],
      handoffIntegrationSealSnapshot: null,
    };
    const core = migrateResearchProgressSave(v30);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v30'));
    assert(Array.isArray(core?.integrationSealHandoffBandLog));
    assert(core?.integrationSealHandoffSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 59 }), core);
    assert(typeof state.integrationSealHandoffSnapshot?.digest === 'string');
    assert(Array.isArray(state.integrationSealHandoffBandLog));
  })
);

tests.push(
  test('save_v31_migrates_to_v32_with_seal_handoff_continuity_fields', () => {
    const v31 = {
      schemaVersion: 'op10m-agent03-v31',
      turn: 60,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v30', toVersion: 'op10m-agent03-v31', turn: 59 }],
      saveKind: 'manual',
      updatedAtTurn: 60,
      sessionId: 'v31',
      persistRevision: 31,
      unlockEventLog: [],
      lastReconciledAtTurn: 60,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 60, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
      postIntegrationDryRunBandLog: [],
      postIntegrationDryRunSnapshot: null,
      integrationSealBandLog: [],
      integrationSealSnapshot: null,
      postSealHandoffBandLog: [],
      postSealHandoffSnapshot: null,
      integrationContinuityBandLog: [],
      integrationContinuitySnapshot: null,
      continuityHandoffBandLog: [],
      continuityHandoffSnapshot: null,
      handoffIntegrationBandLog: [],
      handoffIntegrationSnapshot: null,
      handoffIntegrationSealBandLog: [],
      handoffIntegrationSealSnapshot: null,
      integrationSealHandoffBandLog: [],
      integrationSealHandoffSnapshot: null,
    };
    const core = migrateResearchProgressSave(v31);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v31'));
    assert(Array.isArray(core?.sealHandoffContinuityBandLog));
    assert(core?.sealHandoffContinuitySnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 61 }), core);
    assert(typeof state.sealHandoffContinuitySnapshot?.digest === 'string');
    assert(Array.isArray(state.sealHandoffContinuityBandLog));
  })
);

tests.push(
  test('save_v32_migrates_to_v33_with_seal_handoff_integration_fields', () => {
    const v32 = {
      schemaVersion: 'op10m-agent03-v32',
      turn: 62,
      revision: 3,
      unlockedNodes: [],
      institutionUpgrades: [],
      unlockSeq: 0,
      branchEmphasis: [],
      emphasisRevision: 1,
      migrationLog: [{ fromVersion: 'op10m-agent03-v31', toVersion: 'op10m-agent03-v32', turn: 61 }],
      saveKind: 'manual',
      updatedAtTurn: 62,
      sessionId: 'v32',
      persistRevision: 32,
      unlockEventLog: [],
      lastReconciledAtTurn: 62,
      emphasisChangeLog: [],
      institutionTierSnapshot: { capturedAtTurn: 62, tiers: {}, digest: 'abc', nationalIntegrationCount: 0, strategicOrAboveCount: 0 },
      readinessMilestoneLog: [],
      readinessBranchSnapshot: null,
      integrationRiskLog: [],
      integrationRiskSnapshot: null,
      scaleWaveSnapshot: null,
      synergyThresholdLog: [],
      synergySnapshot: null,
      commercializationMilestoneLog: [],
      commercializationSnapshot: null,
      diffusionIntegrationLog: [],
      diffusionIntegrationSnapshot: null,
      portfolioBalanceLog: [],
      portfolioBalanceSnapshot: null,
      diffusionForecastBandLog: [],
      diffusionForecastSnapshot: null,
      horizonConvergenceBandLog: [],
      horizonConvergenceSnapshot: null,
      researchExecutionBandLog: [],
      researchExecutionSnapshot: null,
      strategicDeliveryBandLog: [],
      strategicDeliverySnapshot: null,
      scaleWaveMaturityBandLog: [],
      scaleWaveMaturitySnapshot: null,
      nationalIntegrationBandLog: [],
      nationalIntegrationSnapshot: null,
      scaleWaveProjectionBandLog: [],
      scaleWaveProjectionSnapshot: null,
      trancheProjectionBandLog: [],
      trancheProjectionSnapshot: null,
      integrationGateBandLog: [],
      integrationGateSnapshot: null,
      dryRunHandoffBandLog: [],
      dryRunHandoffSnapshot: null,
      mergedIntegrationBaselineBandLog: [],
      mergedIntegrationBaselineSnapshot: null,
      postIntegrationDryRunBandLog: [],
      postIntegrationDryRunSnapshot: null,
      integrationSealBandLog: [],
      integrationSealSnapshot: null,
      postSealHandoffBandLog: [],
      postSealHandoffSnapshot: null,
      integrationContinuityBandLog: [],
      integrationContinuitySnapshot: null,
      continuityHandoffBandLog: [],
      continuityHandoffSnapshot: null,
      handoffIntegrationBandLog: [],
      handoffIntegrationSnapshot: null,
      handoffIntegrationSealBandLog: [],
      handoffIntegrationSealSnapshot: null,
      integrationSealHandoffBandLog: [],
      integrationSealHandoffSnapshot: null,
      sealHandoffContinuityBandLog: [],
      sealHandoffContinuitySnapshot: null,
    };
    const core = migrateResearchProgressSave(v32);
    assert(core?.schemaVersion === RESEARCH_PROGRESS_SCHEMA_VERSION);
    assert(core?.migrationLog.some(m => m.fromVersion === 'op10m-agent03-v32'));
    assert(Array.isArray(core?.sealHandoffIntegrationBandLog));
    assert(core?.sealHandoffIntegrationSnapshot === null);
    const state = computeResearchProgress(baseInputs({ turn: 63 }), core);
    assert(typeof state.sealHandoffIntegrationSnapshot?.digest === 'string');
    assert(Array.isArray(state.sealHandoffIntegrationBandLog));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_outlook_derived_wave45', () => {
    const inputs = baseInputs({ turn: 45 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 45);
    assert(outlook?.integrationBaselineShaHint === '98bcd652');
    assert(outlook?.projectedFunctionalHint === 2_548_579);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_seal_seal_outlook_derived_wave47', () => {
    const inputs = baseInputs({ turn: 47 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 47);
    assert(outlook?.integrationBaselineShaHint === '456efb9');
    assert(outlook?.projectedFunctionalHint === 2_637_258);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_outlook_derived_wave46', () => {
    const inputs = baseInputs({ turn: 46 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 46);
    assert(outlook?.integrationBaselineShaHint === 'a9bb07e5');
    assert(outlook?.projectedFunctionalHint === 2_593_189);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_outlook_derived_wave44', () => {
    const inputs = baseInputs({ turn: 44 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 44);
    assert(outlook?.integrationBaselineShaHint === 'bca7e0a3');
    assert(outlook?.projectedFunctionalHint === 2_300_377);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_outlook_derived_wave43', () => {
    const inputs = baseInputs({ turn: 43 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 43);
    assert(outlook?.integrationBaselineShaHint === '641d7d16');
    assert(outlook?.projectedFunctionalHint === 2_253_960);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_continuity_outlook_derived_wave42', () => {
    const inputs = baseInputs({ turn: 42 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 42);
    assert(outlook?.integrationBaselineShaHint === '431df5d');
    assert(outlook?.projectedFunctionalHint === 2_207_543);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_seal_outlook_derived_wave41', () => {
    const inputs = baseInputs({ turn: 41 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 41);
    assert(outlook?.integrationBaselineShaHint === '875d6f3');
    assert(outlook?.projectedFunctionalHint === 2_153_824);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_integration_outlook_derived_wave40', () => {
    const inputs = baseInputs({ turn: 40 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 40);
    assert(outlook?.integrationBaselineShaHint === '6f7fa49');
    assert(outlook?.projectedFunctionalHint === 2_115_625);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_handoff_outlook_derived_wave39', () => {
    const inputs = baseInputs({ turn: 39 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 39);
    assert(outlook?.integrationBaselineShaHint === '6134c6a');
    assert(outlook?.projectedFunctionalHint === 2_077_426);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_continuity_outlook_derived_wave38', () => {
    const inputs = baseInputs({ turn: 38 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 38);
    assert(outlook?.integrationBaselineShaHint === 'b44b36f');
    assert(outlook?.projectedFunctionalHint === 2_039_227);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_seal_outlook_derived_wave37', () => {
    const inputs = baseInputs({ turn: 37 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 37);
    assert(outlook?.integrationBaselineShaHint === 'cfb4603');
    assert(outlook?.projectedFunctionalHint === 2_001_028);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_integration_outlook_derived_wave36', () => {
    const inputs = baseInputs({ turn: 36 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 36);
    assert(outlook?.integrationBaselineShaHint === 'ea2bb03');
    assert(outlook?.projectedFunctionalHint === 1_962_828);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_handoff_outlook_derived_wave35', () => {
    const inputs = baseInputs({ turn: 35 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 35);
    assert(outlook?.integrationBaselineShaHint === '1f7d25b');
    assert(outlook?.projectedFunctionalHint === 1_924_628);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_continuity_outlook_derived_wave34', () => {
    const inputs = baseInputs({ turn: 34 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealContinuityOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 34);
    assert(outlook?.integrationBaselineShaHint === '2187b54');
    assert(outlook?.projectedFunctionalHint === 1_886_428);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealContinuityOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealContinuityOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_seal_outlook_derived_wave33', () => {
    const inputs = baseInputs({ turn: 33 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 33);
    assert(outlook?.integrationBaselineShaHint === 'c5f6d0b');
    assert(outlook?.projectedFunctionalHint === 1_836_529);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationSealOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationSealOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_integration_outlook_derived_wave32', () => {
    const inputs = baseInputs({ turn: 32 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffIntegrationOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 32);
    assert(outlook?.integrationBaselineShaHint === 'aa70dac');
    assert(outlook?.projectedFunctionalHint === 1_798_330);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffIntegrationOutlook: outlook }).includes('scaleWaveSealHandoffIntegrationOutlook'));
  })
);

tests.push(
  test('scale_wave_seal_handoff_continuity_outlook_derived_wave31', () => {
    const inputs = baseInputs({ turn: 31 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveSealHandoffContinuityOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 31);
    assert(outlook?.integrationBaselineShaHint === '81b50b8');
    assert(outlook?.projectedFunctionalHint === 1_760_131);
    assert(detectForeignSaveFields({ scaleWaveSealHandoffContinuityOutlook: outlook }).includes('scaleWaveSealHandoffContinuityOutlook'));
  })
);

tests.push(
  test('scale_wave_integration_seal_handoff_outlook_derived_wave30', () => {
    const inputs = baseInputs({ turn: 30 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveIntegrationSealHandoffOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 30);
    assert(outlook?.integrationBaselineShaHint === '88fa570');
    assert(outlook?.projectedFunctionalHint === 1_721_932);
    assert(detectForeignSaveFields({ scaleWaveIntegrationSealHandoffOutlook: outlook }).includes('scaleWaveIntegrationSealHandoffOutlook'));
  })
);

tests.push(
  test('scale_wave_handoff_integration_seal_outlook_derived_wave29', () => {
    const inputs = baseInputs({ turn: 29 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveHandoffIntegrationSealOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 29);
    assert(outlook?.integrationBaselineShaHint === '70df4aee');
    assert(outlook?.projectedFunctionalHint === 1_683_733);
    assert(detectForeignSaveFields({ scaleWaveHandoffIntegrationSealOutlook: outlook }).includes('scaleWaveHandoffIntegrationSealOutlook'));
  })
);

tests.push(
  test('scale_wave_handoff_integration_outlook_derived_wave28', () => {
    const inputs = baseInputs({ turn: 28 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveHandoffIntegrationOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 28);
    assert(outlook?.integrationBaselineShaHint === 'b9e129bd');
    assert(outlook?.projectedFunctionalHint === 1_645_538);
    assert(detectForeignSaveFields({ scaleWaveHandoffIntegrationOutlook: outlook }).includes('scaleWaveHandoffIntegrationOutlook'));
  })
);

tests.push(
  test('scale_wave_continuity_handoff_outlook_derived_wave27', () => {
    const inputs = baseInputs({ turn: 27 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveContinuityHandoffOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 27);
    assert(outlook?.integrationBaselineShaHint === '7c1cfd89');
    assert(outlook?.projectedFunctionalHint === 1_601_674);
    assert(detectForeignSaveFields({ scaleWaveContinuityHandoffOutlook: outlook }).includes('scaleWaveContinuityHandoffOutlook'));
  })
);

tests.push(
  test('scale_wave_integration_continuity_outlook_derived_wave26', () => {
    const inputs = baseInputs({ turn: 26 });
    const state = computeResearchProgress(inputs, null);
    const outlook = state.scaleWaveIntegrationContinuityOutlook;
    assert(outlook != null);
    assert(outlook?.waveOrdinal === 26);
    assert(outlook?.integrationBaselineShaHint === 'de3079f9');
    assert(outlook?.projectedFunctionalHint === 1_563_481);
    assert(detectForeignSaveFields({ scaleWaveIntegrationContinuityOutlook: outlook }).includes('scaleWaveIntegrationContinuityOutlook'));
  })
);

tests.push(
  test('agent25_chunk_markers_and_hash', () => {
    const moduleId = 'agent-03-research-tech';
    const chunkPath = resolve(process.cwd(), 'operation-10m/modules/agent-03-research-tech/chunk.tsx');
    const manifestPath = resolve(process.cwd(), 'operation-10m/modules/agent-03-research-tech/module.manifest.json');
    const chunk = readFileSync(chunkPath, 'utf8');
    const begin = `// OP10M_MODULE_BEGIN ${moduleId}`;
    const end = `// OP10M_MODULE_END ${moduleId}`;
    assert(chunk.includes(begin) && chunk.includes(end));
    const bi = chunk.indexOf(begin);
    const ei = chunk.indexOf(end);
    const body = chunk.slice(bi + begin.length, ei).trim();
    const hash = createHash('sha256').update(body, 'utf8').digest('hex');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert(hash === manifest.contentSha256, `${hash} vs ${manifest.contentSha256}`);
    assert(manifest.slot === 'post-v10z');
  })
);

const passed = tests.filter(t => t.passed).length;
const failed = tests.filter(t => !t.passed);

console.log(`Agent 03 self-tests: ${passed}/${tests.length} passed`);
failed.forEach(t => console.error(`FAIL ${t.id}: ${t.detail}`));

process.exit(failed.length > 0 ? 1 : 0);
