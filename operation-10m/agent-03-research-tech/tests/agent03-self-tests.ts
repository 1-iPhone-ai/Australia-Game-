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
  test('save_v3_migrates_to_v4_with_lifecycle_fields', () => {
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
