import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_GAME_STATE_KEY,
  O10M_MODES_SAVE_SCHEMA_VERSION,
  appendRunToPersistedLog,
  attachO10mModesProgressToGameState,
  buildO10mModesPersistedSnapshot,
  createEmptyO10mModesPersistedState,
  migrateO10mModesPersistedState,
  readO10mModesProgressFromGameState,
  restoreModeInteractionFromPersisted,
  runO10mContentAudit,
  sanitizeO10mModesPersistedState,
  validateO10mModesPersistedForLoad,
  resolveModeInteraction,
  advanceChainAfterRun,
  initializeChainProgress,
  evaluateMissionMilestones,
  O10M_OPERATION_SCENARIOS,
} from '../src/index.js';

describe('save format round 2', () => {
  it('uses stable gameState key and schema version', () => {
    assert.equal(O10M_MODES_GAME_STATE_KEY, 'o10mModesProgress');
    assert.equal(O10M_MODES_SAVE_SCHEMA_VERSION, 33);
  });

  it('sanitizes and validates a persisted mid-chain snapshot', () => {
    let chain = initializeChainProgress('o10m_chain_northern_corridor')!;
    chain = advanceChainAfterRun('o10m_chain_northern_corridor', chain, {
      baseMode: 'scenario',
      scenarioId: 'o10m_export_clock',
      challengeModeIds: ['o10m_ironman'],
      primaryVictory: true,
      altVictoryRuleId: null,
      day: 11,
      playerMoney: 14000,
      playerNetWorth: 14000,
      regionsControlled: 2,
      maxRegionalStanding: 50,
      rivalNetWorth: 5000,
      optionalObjectivesCompleted: 0,
      totalObjectives: 2,
    }).progress;

    const milestones = evaluateMissionMilestones([
      {
        baseMode: 'scenario',
        scenarioId: 'o10m_export_clock',
        challengeModeIds: ['o10m_ironman'],
        primaryVictory: true,
        altVictoryRuleId: null,
        day: 11,
        playerMoney: 14000,
        playerNetWorth: 14000,
        regionsControlled: 2,
        maxRegionalStanding: 50,
        rivalNetWorth: 5000,
        optionalObjectivesCompleted: 0,
        totalObjectives: 2,
      },
    ]);

    const snapshot = buildO10mModesPersistedSnapshot({
      turn: 42,
      baseMode: 'scenario',
      scenarioId: 'o10m_cyclone_corridor',
      chainProgress: chain,
      challengeModeIds: ['o10m_ironman', 'o10m_stability_focus'],
      sandboxProfileId: 'o10m_sandbox_chain_friendly',
      milestones,
    });

    const raw = JSON.parse(JSON.stringify(snapshot));
    raw.challengeModeIds = [...raw.challengeModeIds, 'bogus_challenge'];
    const sanitized = sanitizeO10mModesPersistedState(raw)!;
    assert.equal(sanitized.challengeModeIds.length, 2);

    const validation = validateO10mModesPersistedForLoad(sanitized);
    assert.equal(validation.ok, true);

    const restored = restoreModeInteractionFromPersisted(sanitized);
    const interaction = resolveModeInteraction(restored);
    assert.equal(interaction.ok, true);
    assert.equal(interaction.forcedSettingsMerge.o10mChainStartingMoneyBonus, 750);
  });

  it('migrates legacy v1 blob and round-trips through gameState attach/read', () => {
    const legacy = {
      schemaVersion: 1,
      baseMode: 'scenario',
      scenarioId: 'o10m_continuity_drill',
      challengeModeIds: ['o10m_contract_focus'],
    };
    const migrated = migrateO10mModesPersistedState(legacy);
    assert.equal(migrated.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.ok(Array.isArray(migrated.recentRuns));

    const gs = attachO10mModesProgressToGameState({ day: 3, turn: 9 }, migrated);
    const read = readO10mModesProgressFromGameState(gs);
    assert.equal(read?.scenarioId, 'o10m_continuity_drill');
    assert.equal(readO10mModesProgressFromGameState(gs)?.challengeModeIds[0], 'o10m_contract_focus');
  });

  it('appendRunToPersistedLog caps history and records chain completion', () => {
    let state = createEmptyO10mModesPersistedState('scenario');
    state = {
      ...state,
      chainProgress: initializeChainProgress('o10m_chain_capital_to_coast'),
    };
    state = appendRunToPersistedLog(
      state,
      {
        baseMode: 'scenario',
        scenarioId: 'o10m_export_clock',
        challengeModeIds: [],
        primaryVictory: true,
        altVictoryRuleId: null,
        chainCompleted: true,
        day: 16,
        playerMoney: 15000,
        playerNetWorth: 18000,
        regionsControlled: 2,
        maxRegionalStanding: 60,
        rivalNetWorth: 4000,
        optionalObjectivesCompleted: 0,
        totalObjectives: 2,
      },
      99,
    );
    assert.equal(state.updatedAtTurn, 99);
    assert.ok(state.completedChainIds.includes('o10m_chain_capital_to_coast'));
  });

  it('catalog still clean after round-2 scenarios', () => {
    assert.ok(O10M_OPERATION_SCENARIOS.length >= 14);
    const audit = runO10mContentAudit();
    assert.equal(audit.isClean, true);
  });
});
