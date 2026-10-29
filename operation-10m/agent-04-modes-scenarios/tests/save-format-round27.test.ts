import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachParoleSessionToState,
  attachReprieveSessionToState,
  buildParoleScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createParoleSession,
  createReprieveSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  paroleTrustScoreFromRun,
  unlockTokenForParoleId,
  type O10mChallengeModeId,
} from '../src/index.js';

const paroleRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_parole_intake_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4800,
  playerNetWorth: 5000,
  regionsControlled: 2,
  maxRegionalStanding: 68,
  rivalNetWorth: 2380,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 27 parole schema', () => {
  it('migrates schema v26 blob to v27 with parole defaults', () => {
    const v26 = {
      schemaVersion: 26,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_reprieve_filing_docket',
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
      escortSession: null,
      extractionSession: null,
      subjectSession: null,
      witnessSession: null,
      tribunalSession: null,
      indictmentSession: null,
      appealSession: null,
      clemencySession: null,
      pardonSession: null,
      amnestySession: null,
      reprieveSession: null,
    };
    const v27 = migrateO10mModesPersistedState(v26);
    assert.equal(v27.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v27.paroleSession, null);
  });

  it('attaches parole and planner prefers parole_step with trust hint', () => {
    const { session } = createParoleSession({
      paroleId: 'o10m_parole_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_parole_intake_docket',
        'o10m_parole_review_chamber',
        'o10m_parole_release_finale',
      ],
    });
    assert.ok(session);
    const state = attachParoleSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'parole_step');
    assert.equal(plan.scenarioId, 'o10m_parole_intake_docket');
    assert.equal(plan.parolePhase, 'intake');
    assert.equal(plan.paroleTrust, 0);
  });

  it('advances parole phases, accrues trust, and grants unlock token on completion', () => {
    const { session } = createParoleSession({
      paroleId: 'o10m_parole_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_parole_intake_docket',
        'o10m_parole_review_chamber',
        'o10m_parole_release_finale',
      ],
    });
    assert.ok(session);
    const trust = paroleTrustScoreFromRun(paroleRunBase);
    assert.ok(trust > 0);

    let state = attachParoleSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...paroleRunBase, scenarioId: 'o10m_parole_intake_docket' },
      4,
    );
    assert.equal(state.paroleSession?.cursor, 1);
    assert.equal(state.paroleSession?.phaseTag, 'review');
    assert.ok((state.paroleSession?.trustScore ?? 0) >= trust);

    const overrides = buildParoleScenarioStartOverrides(state.paroleSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveParolePhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...paroleRunBase, scenarioId: 'o10m_parole_review_chamber' },
      5,
    );
    assert.equal(state.paroleSession?.cursor, 2);
    assert.equal(state.paroleSession?.phaseTag, 'parole');

    state = applyPostRunPersistedUpdates(
      state,
      { ...paroleRunBase, scenarioId: 'o10m_parole_release_finale' },
      6,
    );
    assert.equal(state.paroleSession?.active, false);
    const token = unlockTokenForParoleId('o10m_parole_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('parole attach clears an active reprieve session', () => {
    const { session: reprieve } = createReprieveSession({
      reprieveId: 'o10m_reprieve_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_reprieve_filing_docket'],
    });
    const { session: parole } = createParoleSession({
      paroleId: 'o10m_parole_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_parole_intake_docket'],
    });
    let state = attachReprieveSessionToState(createEmptyO10mModesPersistedState(), reprieve!);
    state = attachParoleSessionToState(state, parole!);
    assert.equal(state.reprieveSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'parole_step');
  });

  it('importO10mModesProgressJson round-trips parole session', () => {
    const { session } = createParoleSession({
      paroleId: 'o10m_parole_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_parole_intake_docket', 'o10m_parole_review_chamber'],
    });
    const attached = attachParoleSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.paroleSession?.paroleId, 'o10m_parole_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
