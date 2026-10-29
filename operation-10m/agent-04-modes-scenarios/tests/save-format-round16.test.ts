import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachConvoySessionToState,
  attachEscortSessionToState,
  buildEscortScenarioStartOverrides,
  createConvoySession,
  createEmptyO10mModesPersistedState,
  createEscortSession,
  escortTrustFromRun,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  unlockTokenForEscortId,
  type O10mChallengeModeId,
} from '../src/index.js';

const escortRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_escort_briefing_yard',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4100,
  playerNetWorth: 4300,
  regionsControlled: 2,
  maxRegionalStanding: 58,
  rivalNetWorth: 2050,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 16 escort schema', () => {
  it('migrates schema v15 blob to v16 with escort defaults', () => {
    const v15 = {
      schemaVersion: 15,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_convoy_staging_depot',
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
      pilgrimageSession: null,
      caravanSession: null,
      voyageSession: null,
      siegeSession: null,
      convoySession: null,
    };
    const v16 = migrateO10mModesPersistedState(v15);
    assert.equal(v16.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v16.escortSession, null);
  });

  it('attaches escort and planner prefers escort_step with trust hint', () => {
    const { session } = createEscortSession({
      escortId: 'o10m_escort_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_escort_briefing_yard',
        'o10m_escort_corridor_patrol',
        'o10m_escort_handoff_finale',
      ],
    });
    assert.ok(session);
    const state = attachEscortSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.convoySession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'escort_step');
    assert.equal(plan.scenarioId, 'o10m_escort_briefing_yard');
    assert.equal(plan.escortPhase, 'briefing');
    assert.equal(plan.escortTrust, 0);
  });

  it('advances escort phases, accrues trust, and grants unlock token on completion', () => {
    const { session } = createEscortSession({
      escortId: 'o10m_escort_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_escort_briefing_yard',
        'o10m_escort_corridor_patrol',
        'o10m_escort_handoff_finale',
      ],
    });
    let state = attachEscortSessionToState(createEmptyO10mModesPersistedState(), session!);
    const trust = escortTrustFromRun(escortRunBase);
    assert.ok(trust > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...escortRunBase, scenarioId: 'o10m_escort_briefing_yard' },
      4,
    );
    assert.equal(state.escortSession?.cursor, 1);
    assert.equal(state.escortSession?.phaseTag, 'corridor');
    assert.ok((state.escortSession?.trustScore ?? 0) >= trust);

    const overrides = buildEscortScenarioStartOverrides(state.escortSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveEscortPhase, 'corridor');

    state = applyPostRunPersistedUpdates(
      state,
      { ...escortRunBase, scenarioId: 'o10m_escort_corridor_patrol' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...escortRunBase, scenarioId: 'o10m_escort_handoff_finale' },
      6,
    );
    assert.equal(state.escortSession?.active, false);
    const token = unlockTokenForEscortId('o10m_escort_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('escort attach clears an active convoy session', () => {
    const { session: convoy } = createConvoySession({
      convoyId: 'o10m_convoy_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_convoy_staging_depot'],
    });
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_escort_briefing_yard'],
    });
    let state = attachConvoySessionToState(createEmptyO10mModesPersistedState(), convoy!);
    state = attachEscortSessionToState(state, escort!);
    assert.equal(state.convoySession, null);
    assert.equal(planNextCampaignAction(state).kind, 'escort_step');
  });

  it('importO10mModesProgressJson round-trips escort session', () => {
    const { session } = createEscortSession({
      escortId: 'o10m_escort_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_escort_briefing_yard', 'o10m_escort_corridor_patrol'],
    });
    const attached = attachEscortSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.escortSession?.escortId, 'o10m_escort_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
