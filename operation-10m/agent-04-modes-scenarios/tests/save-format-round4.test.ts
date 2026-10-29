import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  captureObjectiveProgressFromContext,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  mergeO10mModesPersistedStates,
  migrateO10mModesPersistedState,
  pinCampaignSlot,
  sealO10mModesPersistedState,
  updateChallengeStreakAfterRun,
  verifyO10mModesIntegrity,
  applyCampaignSlotToState,
} from '../src/index.js';

describe('save format round 4 campaign schema', () => {
  it('migrates schema v3 blob to v4 with campaign defaults', () => {
    const v3 = {
      schemaVersion: 3,
      updatedAtTurn: 12,
      baseMode: 'scenario',
      scenarioId: 'o10m_continuity_drill',
      challengeModeIds: [],
      sandboxProfileId: null,
      sandboxKnobs: {},
      milestones: [],
      completedChainIds: [],
      recentRuns: [],
      chainProgress: null,
      saveKind: 'manual',
    };
    const v4 = migrateO10mModesPersistedState(v3);
    assert.equal(v4.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.deepEqual(v4.campaignSlots, []);
    assert.equal(v4.activeCampaignSlotId, null);
    assert.equal(v4.challengeStreak?.current, 0);
  });

  it('pins campaign slot and applies to active session', () => {
    let state = createEmptyO10mModesPersistedState('scenario');
    state = {
      ...state,
      scenarioId: 'o10m_slot_rotation_lab',
      chainProgress: null,
    };
    const pinned = pinCampaignSlot(state, {
      slotId: 'o10m_slot_quick',
      label: 'Quick lab',
      turn: 7,
    });
    assert.equal(pinned.state.campaignSlots?.length, 1);
    assert.equal(pinned.state.activeCampaignSlotId, 'o10m_slot_quick');

    const applied = applyCampaignSlotToState(pinned.state, 'o10m_slot_quick');
    assert.equal(applied.state.scenarioId, 'o10m_slot_rotation_lab');
  });

  it('captures objective progress and round-trips through sealed import', () => {
    let state = sealO10mModesPersistedState({
      ...createEmptyO10mModesPersistedState(),
      scenarioId: 'o10m_continuity_drill',
    });
    state = captureObjectiveProgressFromContext(
      state,
      'o10m_continuity_drill',
      {
        player: { money: 5000 },
        aiPlayer: {},
        gameState: { day: 6 },
        gameSettings: { totalDays: 10 },
      },
      15,
    );
    state = sealO10mModesPersistedState(state);
    assert.ok((state.objectiveProgress ?? []).some(r => r.objectiveId === 'o10m_cd_obj_survive'));
    assert.equal(verifyO10mModesIntegrity(state), true);

    const imported = importO10mModesProgressJson(JSON.stringify(state));
    assert.equal(imported.errors.length, 0);
    assert.equal(imported.state?.objectiveProgress?.length, state.objectiveProgress?.length);
  });

  it('updates challenge streak on overlay victories', () => {
    let state = createEmptyO10mModesPersistedState();
    state = updateChallengeStreakAfterRun(state, {
      baseMode: 'scenario',
      scenarioId: 'o10m_silent_diplomat',
      challengeModeIds: ['o10m_ironman'],
      primaryVictory: true,
      altVictoryRuleId: null,
      day: 10,
      playerMoney: 1000,
      playerNetWorth: 2000,
      regionsControlled: 2,
      maxRegionalStanding: 50,
      rivalNetWorth: 500,
      optionalObjectivesCompleted: 0,
      totalObjectives: 2,
    });
    assert.equal(state.challengeStreak?.current, 1);
    state = updateChallengeStreakAfterRun(state, {
      baseMode: 'scenario',
      scenarioId: 'o10m_silent_diplomat',
      challengeModeIds: ['o10m_ironman'],
      primaryVictory: false,
      altVictoryRuleId: null,
      day: 8,
      playerMoney: 100,
      playerNetWorth: 100,
      regionsControlled: 1,
      maxRegionalStanding: 20,
      rivalNetWorth: 5000,
      optionalObjectivesCompleted: 0,
      totalObjectives: 2,
    });
    assert.equal(state.challengeStreak?.current, 0);
    assert.equal(state.challengeStreak?.best, 1);
  });

  it('union_milestones merge combines objective progress rows', () => {
    const a = sealO10mModesPersistedState({
      ...createEmptyO10mModesPersistedState(),
      updatedAtTurn: 3,
      objectiveProgress: [
        {
          objectiveId: 'o10m_cd_obj_survive',
          currentValue: 3,
          targetValue: 5,
          completed: false,
          lastUpdatedTurn: 3,
        },
      ],
    });
    const b = sealO10mModesPersistedState({
      ...createEmptyO10mModesPersistedState(),
      updatedAtTurn: 9,
      objectiveProgress: [
        {
          objectiveId: 'o10m_cd_obj_survive',
          currentValue: 5,
          targetValue: 5,
          completed: true,
          lastUpdatedTurn: 9,
        },
      ],
    });
    const { merged } = mergeO10mModesPersistedStates(a, b, 'union_milestones');
    assert.equal(merged.objectiveProgress?.length, 1);
    assert.equal(merged.objectiveProgress?.[0]?.completed, true);
    assert.equal(merged.objectiveProgress?.[0]?.lastUpdatedTurn, 9);
  });
});
