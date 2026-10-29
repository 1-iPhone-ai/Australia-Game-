import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  buildO10mModesPersistedSnapshot,
  createEmptyO10mModesPersistedState,
  diffO10mModesPersisted,
  exportO10mModesProgressJson,
  importO10mModesProgressJson,
  mergeO10mModesPersistedStates,
  migrateO10mModesPersistedState,
  prepareO10mModesCheckpoint,
  reconcileO10mModesOnGameLoad,
  sealO10mModesPersistedState,
  verifyO10mModesIntegrity,
  evaluateMissionMilestones,
} from '../src/index.js';

describe('save format round 3 lifecycle', () => {
  it('migrates schema v2 blob to v3 with saveKind', () => {
    const v2 = {
      schemaVersion: 2,
      updatedAtTurn: 10,
      baseMode: 'scenario',
      scenarioId: 'o10m_federation_standing',
      challengeModeIds: [],
      sandboxProfileId: null,
      sandboxKnobs: {},
      milestones: [],
      completedChainIds: [],
      recentRuns: [],
      chainProgress: null,
    };
    const v3 = migrateO10mModesPersistedState(v2);
    assert.equal(v3.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v3.saveKind, 'manual');
  });

  it('seals and verifies integrity fingerprint', () => {
    const sealed = sealO10mModesPersistedState(createEmptyO10mModesPersistedState('ai'));
    assert.ok(sealed.integrityFingerprint);
    assert.equal(verifyO10mModesIntegrity(sealed), true);
    const tampered = { ...sealed, scenarioId: 'o10m_export_clock' };
    assert.equal(verifyO10mModesIntegrity(tampered), false);
  });

  it('exports and imports JSON with integrity check', () => {
    const snap = sealO10mModesPersistedState(
      buildO10mModesPersistedSnapshot({
        turn: 20,
        baseMode: 'scenario',
        scenarioId: 'o10m_continuity_drill',
        chainProgress: null,
        challengeModeIds: ['o10m_contract_focus'],
        milestones: evaluateMissionMilestones([]),
      }),
    );
    const json = exportO10mModesProgressJson(snap);
    const imported = importO10mModesProgressJson(json);
    assert.equal(imported.errors.length, 0);
    assert.equal(imported.state?.scenarioId, 'o10m_continuity_drill');
    assert.equal(verifyO10mModesIntegrity(imported.state!), true);
  });

  it('merge union_milestones combines unlock progress', () => {
    const a = sealO10mModesPersistedState({
      ...createEmptyO10mModesPersistedState(),
      updatedAtTurn: 5,
      milestones: [{ milestoneId: 'o10m_milestone_alt_victory', unlocked: true, unlockedAtRunCount: 2 }],
    });
    const b = sealO10mModesPersistedState({
      ...createEmptyO10mModesPersistedState(),
      updatedAtTurn: 8,
      milestones: [{ milestoneId: 'o10m_milestone_chain_complete', unlocked: true, unlockedAtRunCount: 1 }],
    });
    const { merged } = mergeO10mModesPersistedStates(a, b, 'union_milestones');
    assert.equal(merged.milestones.length, 2);
    assert.equal(merged.updatedAtTurn, 8);
  });

  it('reconcile updates turn/day and warns on scenario drift', () => {
    const base = sealO10mModesPersistedState({
      ...createEmptyO10mModesPersistedState('scenario'),
      updatedAtTurn: 12,
      scenarioId: 'o10m_silent_diplomat',
    });
    const { state, warnings } = reconcileO10mModesOnGameLoad(base, {
      turn: 15,
      day: 7,
      liveScenarioId: 'o10m_team_ledger',
    });
    assert.equal(state.updatedAtTurn, 15);
    assert.equal(state.updatedAtDay, 7);
    assert.equal(state.scenarioId, 'o10m_team_ledger');
    assert.ok(warnings.some(w => w.includes('scenarioId')));
  });

  it('checkpoint and autosave helpers set saveKind', () => {
    const base = createEmptyO10mModesPersistedState();
    assert.equal(prepareO10mModesCheckpoint(base, 3, 2).saveKind, 'checkpoint');
  });

  it('diff highlights changed fields after reconcile', () => {
    const before = createEmptyO10mModesPersistedState();
    const after = prepareO10mModesCheckpoint(before, 1, 1);
    const diff = diffO10mModesPersisted(before, after);
    assert.ok(diff.changedFields.includes('saveKind'));
    assert.ok(diff.changedFields.includes('integrityFingerprint'));
  });
});
