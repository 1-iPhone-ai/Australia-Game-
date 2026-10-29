import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachReinstatementSessionToState,
  attachSetAsideSessionToState,
  buildSetAsideScenarioStartOverrides,
  createReinstatementSession,
  createSetAsideSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  setAsideScoreFromRun,
  unlockTokenForSetAsideId,
  type O10mChallengeModeId,
} from '../src/index.js';

const setAsideRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_setaside_filing_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 5400,
  playerNetWorth: 5600,
  regionsControlled: 2,
  maxRegionalStanding: 76,
  rivalNetWorth: 2500,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 38 set-aside schema', () => {
  it('migrates schema v37 blob to v38 with set-aside defaults', () => {
    const v37 = {
      schemaVersion: 37,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_reinstatement_filing_docket',
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
      paroleSession: null,
      probationSession: null,
      commutationSession: null,
      acquittalSession: null,
      exonerationSession: null,
      expungementSession: null,
      vacaturSession: null,
      remandSession: null,
      reversalSession: null,
      annulmentSession: null,
      reinstatementSession: null,
    };
    const v38 = migrateO10mModesPersistedState(v37);
    assert.equal(v38.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v38.setAsideSession, null);
  });

  it('attaches set-aside and planner prefers setaside_step with score hint', () => {
    const { session } = createSetAsideSession({
      setAsideId: 'o10m_setaside_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_setaside_filing_docket',
        'o10m_setaside_review_chamber',
        'o10m_setaside_relief_finale',
      ],
    });
    assert.ok(session);
    const state = attachSetAsideSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'setaside_step');
    assert.equal(plan.scenarioId, 'o10m_setaside_filing_docket');
    assert.equal(plan.setAsidePhase, 'filing');
    assert.equal(plan.setAsideScore, 0);
  });

  it('advances set-aside phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createSetAsideSession({
      setAsideId: 'o10m_setaside_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_setaside_filing_docket',
        'o10m_setaside_review_chamber',
        'o10m_setaside_relief_finale',
      ],
    });
    assert.ok(session);
    const score = setAsideScoreFromRun(setAsideRunBase);
    assert.ok(score > 0);

    let state = attachSetAsideSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...setAsideRunBase, scenarioId: 'o10m_setaside_filing_docket' },
      4,
    );
    assert.equal(state.setAsideSession?.cursor, 1);
    assert.equal(state.setAsideSession?.phaseTag, 'review');
    assert.ok((state.setAsideSession?.setAsideScore ?? 0) >= score);

    const overrides = buildSetAsideScenarioStartOverrides(state.setAsideSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveSetAsidePhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...setAsideRunBase, scenarioId: 'o10m_setaside_review_chamber' },
      5,
    );
    assert.equal(state.setAsideSession?.cursor, 2);
    assert.equal(state.setAsideSession?.phaseTag, 'setAside');

    state = applyPostRunPersistedUpdates(
      state,
      { ...setAsideRunBase, scenarioId: 'o10m_setaside_relief_finale' },
      6,
    );
    assert.equal(state.setAsideSession?.active, false);
    const token = unlockTokenForSetAsideId('o10m_setaside_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('set-aside attach clears an active reinstatement session', () => {
    const { session: reinstatement } = createReinstatementSession({
      reinstatementId: 'o10m_reinstatement_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_reinstatement_filing_docket'],
    });
    const { session: setAside } = createSetAsideSession({
      setAsideId: 'o10m_setaside_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_setaside_filing_docket'],
    });
    let state = attachReinstatementSessionToState(createEmptyO10mModesPersistedState(), reinstatement!);
    state = attachSetAsideSessionToState(state, setAside!);
    assert.equal(state.reinstatementSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'setaside_step');
  });

  it('importO10mModesProgressJson round-trips set-aside session', () => {
    const { session } = createSetAsideSession({
      setAsideId: 'o10m_setaside_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_setaside_filing_docket', 'o10m_setaside_review_chamber'],
    });
    const attached = attachSetAsideSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.setAsideSession?.setAsideId, 'o10m_setaside_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
