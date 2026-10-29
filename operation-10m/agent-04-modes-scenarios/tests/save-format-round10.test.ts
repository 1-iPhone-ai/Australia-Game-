import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachExpeditionSessionToState,
  attachOdysseySessionToState,
  buildOdysseyScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createExpeditionSession,
  createOdysseySession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  odysseyRenownFromRun,
  unlockTokenForOdysseyId,
  type O10mChallengeModeId,
} from '../src/index.js';

const odysseyRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_odyssey_opening_winds',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 3500,
  playerNetWorth: 3700,
  regionsControlled: 2,
  maxRegionalStanding: 54,
  rivalNetWorth: 1900,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 10 odyssey schema', () => {
  it('migrates schema v9 blob to v10 with odyssey defaults', () => {
    const v9 = {
      schemaVersion: 9,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_expedition_departure_dock',
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
    };
    const v10 = migrateO10mModesPersistedState(v9);
    assert.equal(v10.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v10.odysseySession, null);
  });

  it('attaches odyssey and planner prefers odyssey_step with renown hint', () => {
    const { session } = createOdysseySession({
      odysseyId: 'o10m_odyssey_coastal_saga',
      label: 'Coastal saga',
      scenarioIds: [
        'o10m_odyssey_opening_winds',
        'o10m_odyssey_crossing_shelves',
        'o10m_odyssey_homecoming_harbor',
      ],
    });
    assert.ok(session);
    const state = attachOdysseySessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.expeditionSession, null);
    assert.equal(state.circuitSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'odyssey_step');
    assert.equal(plan.scenarioId, 'o10m_odyssey_opening_winds');
    assert.equal(plan.odysseyAct, 'opening');
    assert.equal(plan.odysseyRenown, 0);
  });

  it('advances odyssey chapters, accrues renown, and grants unlock token on completion', () => {
    const { session } = createOdysseySession({
      odysseyId: 'o10m_odyssey_coastal_saga',
      label: 'Coastal saga',
      scenarioIds: [
        'o10m_odyssey_opening_winds',
        'o10m_odyssey_crossing_shelves',
        'o10m_odyssey_homecoming_harbor',
      ],
    });
    let state = attachOdysseySessionToState(createEmptyO10mModesPersistedState(), session!);
    const renown = odysseyRenownFromRun(odysseyRunBase);
    assert.ok(renown > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...odysseyRunBase, scenarioId: 'o10m_odyssey_opening_winds' },
      4,
    );
    assert.equal(state.odysseySession?.cursor, 1);
    assert.equal(state.odysseySession?.actTag, 'crossing');
    assert.ok((state.odysseySession?.renownScore ?? 0) >= renown);

    const overrides = buildOdysseyScenarioStartOverrides(state.odysseySession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveOdysseyAct, 'crossing');

    state = applyPostRunPersistedUpdates(
      state,
      { ...odysseyRunBase, scenarioId: 'o10m_odyssey_crossing_shelves' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...odysseyRunBase, scenarioId: 'o10m_odyssey_homecoming_harbor' },
      6,
    );
    assert.equal(state.odysseySession?.active, false);
    const token = unlockTokenForOdysseyId('o10m_odyssey_coastal_saga');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('odyssey attach clears an active expedition session', () => {
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_expedition_departure_dock'],
    });
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_odyssey_opening_winds'],
    });
    let state = attachExpeditionSessionToState(createEmptyO10mModesPersistedState(), expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    assert.equal(state.expeditionSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'odyssey_step');
  });

  it('importO10mModesProgressJson round-trips odyssey session', () => {
    const { session } = createOdysseySession({
      odysseyId: 'o10m_odyssey_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const attached = attachOdysseySessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.odysseySession?.odysseyId, 'o10m_odyssey_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
