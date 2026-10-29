import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachOdysseySessionToState,
  attachPilgrimageSessionToState,
  buildPilgrimageScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createOdysseySession,
  createPilgrimageSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  pilgrimageDevotionFromRun,
  unlockTokenForPilgrimageId,
  type O10mChallengeModeId,
} from '../src/index.js';

const pilgrimageRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_pilgrimage_setting_out',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 3600,
  playerNetWorth: 3800,
  regionsControlled: 2,
  maxRegionalStanding: 52,
  rivalNetWorth: 1900,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 11 pilgrimage schema', () => {
  it('migrates schema v10 blob to v11 with pilgrimage defaults', () => {
    const v10 = {
      schemaVersion: 10,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_odyssey_opening_winds',
      challengeModeIds: [],
      sandboxProfileId: null,
      sandboxKnobs: {},
      milestones: [],
      completedChainIds: [],
      recentRuns: [],
      chainProgress: null,
      objectiveProgress: [],
      campaignSlots: [],
      activeCampaignSlotId: null,
      challengeStreak: { current: 0, best: 0, lastScenarioId: null },
      marathonQueue: null,
      replayLedger: [],
      gauntletSession: null,
      catalogUnlockTokens: [],
      relaySession: null,
      circuitSession: null,
      expeditionSession: null,
      odysseySession: null,
    };
    const v11 = migrateO10mModesPersistedState(v10);
    assert.equal(v11.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v11.pilgrimageSession, null);
  });

  it('attaches pilgrimage and planner prefers pilgrimage_step with devotion hint', () => {
    const { session } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_inland_trail',
      label: 'Inland trail',
      scenarioIds: [
        'o10m_pilgrimage_setting_out',
        'o10m_pilgrimage_midway_shrine',
        'o10m_pilgrimage_sanctuary_rest',
      ],
    });
    assert.ok(session);
    const state = attachPilgrimageSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.odysseySession, null);
    assert.equal(state.expeditionSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'pilgrimage_step');
    assert.equal(plan.scenarioId, 'o10m_pilgrimage_setting_out');
    assert.equal(plan.pilgrimageStage, 'setting_out');
    assert.equal(plan.pilgrimageDevotion, 0);
  });

  it('advances pilgrimage stops, accrues devotion, and grants unlock token on completion', () => {
    const { session } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_inland_trail',
      label: 'Inland trail',
      scenarioIds: [
        'o10m_pilgrimage_setting_out',
        'o10m_pilgrimage_midway_shrine',
        'o10m_pilgrimage_sanctuary_rest',
      ],
    });
    let state = attachPilgrimageSessionToState(createEmptyO10mModesPersistedState(), session!);
    const devotion = pilgrimageDevotionFromRun(pilgrimageRunBase);
    assert.ok(devotion > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...pilgrimageRunBase, scenarioId: 'o10m_pilgrimage_setting_out' },
      4,
    );
    assert.equal(state.pilgrimageSession?.cursor, 1);
    assert.equal(state.pilgrimageSession?.stageTag, 'midway');
    assert.ok((state.pilgrimageSession?.devotionScore ?? 0) >= devotion);

    const overrides = buildPilgrimageScenarioStartOverrides(state.pilgrimageSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActivePilgrimageStage, 'midway');

    state = applyPostRunPersistedUpdates(
      state,
      { ...pilgrimageRunBase, scenarioId: 'o10m_pilgrimage_midway_shrine' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...pilgrimageRunBase, scenarioId: 'o10m_pilgrimage_sanctuary_rest' },
      6,
    );
    assert.equal(state.pilgrimageSession?.active, false);
    const token = unlockTokenForPilgrimageId('o10m_pilgrimage_inland_trail');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('pilgrimage attach clears an active odyssey session', () => {
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_odyssey_opening_winds'],
    });
    const { session: pilgrimage } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_pilgrimage_setting_out'],
    });
    let state = attachOdysseySessionToState(createEmptyO10mModesPersistedState(), odyssey!);
    state = attachPilgrimageSessionToState(state, pilgrimage!);
    assert.equal(state.odysseySession, null);
    assert.equal(planNextCampaignAction(state).kind, 'pilgrimage_step');
  });

  it('importO10mModesProgressJson round-trips pilgrimage session', () => {
    const { session } = createPilgrimageSession({
      pilgrimageId: 'o10m_pilgrimage_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_pilgrimage_setting_out', 'o10m_pilgrimage_midway_shrine'],
    });
    const attached = attachPilgrimageSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.pilgrimageSession?.pilgrimageId, 'o10m_pilgrimage_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
