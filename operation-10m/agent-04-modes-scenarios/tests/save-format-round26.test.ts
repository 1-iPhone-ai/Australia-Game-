import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachPardonSessionToState,
  attachReprieveSessionToState,
  buildReprieveScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createPardonSession,
  createReprieveSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  reprieveReliefScoreFromRun,
  unlockTokenForReprieveId,
  type O10mChallengeModeId,
} from '../src/index.js';

const reprieveRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_reprieve_filing_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4700,
  playerNetWorth: 4900,
  regionsControlled: 2,
  maxRegionalStanding: 67,
  rivalNetWorth: 2320,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 26 reprieve schema', () => {
  it('migrates schema v25 blob to v26 with reprieve defaults', () => {
    const v25 = {
      schemaVersion: 25,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_amnesty_warrant_docket',
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
    };
    const v26 = migrateO10mModesPersistedState(v25);
    assert.equal(v26.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v26.reprieveSession, null);
  });

  it('attaches reprieve and planner prefers reprieve_step with relief hint', () => {
    const { session } = createReprieveSession({
      reprieveId: 'o10m_reprieve_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_reprieve_filing_docket',
        'o10m_reprieve_review_chamber',
        'o10m_reprieve_relief_finale',
      ],
    });
    assert.ok(session);
    const state = attachReprieveSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.amnestySession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'reprieve_step');
    assert.equal(plan.scenarioId, 'o10m_reprieve_filing_docket');
    assert.equal(plan.reprievePhase, 'filing');
    assert.equal(plan.reprieveRelief, 0);
  });

  it('advances reprieve phases, accrues relief, and grants unlock token on completion', () => {
    const { session } = createReprieveSession({
      reprieveId: 'o10m_reprieve_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_reprieve_filing_docket',
        'o10m_reprieve_review_chamber',
        'o10m_reprieve_relief_finale',
      ],
    });
    let state = attachReprieveSessionToState(createEmptyO10mModesPersistedState(), session!);
    const relief = reprieveReliefScoreFromRun(reprieveRunBase);
    assert.ok(relief > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...reprieveRunBase, scenarioId: 'o10m_reprieve_filing_docket' },
      4,
    );
    assert.equal(state.reprieveSession?.cursor, 1);
    assert.equal(state.reprieveSession?.phaseTag, 'review');
    assert.ok((state.reprieveSession?.reliefScore ?? 0) >= relief);

    const overrides = buildReprieveScenarioStartOverrides(state.reprieveSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveReprievePhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...reprieveRunBase, scenarioId: 'o10m_reprieve_review_chamber' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...reprieveRunBase, scenarioId: 'o10m_reprieve_relief_finale' },
      6,
    );
    assert.equal(state.reprieveSession?.active, false);
    const token = unlockTokenForReprieveId('o10m_reprieve_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('reprieve attach clears an active pardon session', () => {
    const { session: pardon } = createPardonSession({
      pardonId: 'o10m_pardon_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_pardon_brief_docket'],
    });
    const { session: reprieve } = createReprieveSession({
      reprieveId: 'o10m_reprieve_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_reprieve_filing_docket'],
    });
    let state = attachPardonSessionToState(createEmptyO10mModesPersistedState(), pardon!);
    state = attachReprieveSessionToState(state, reprieve!);
    assert.equal(state.pardonSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'reprieve_step');
  });

  it('importO10mModesProgressJson round-trips reprieve session', () => {
    const { session } = createReprieveSession({
      reprieveId: 'o10m_reprieve_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_reprieve_filing_docket', 'o10m_reprieve_review_chamber'],
    });
    const attached = attachReprieveSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.reprieveSession?.reprieveId, 'o10m_reprieve_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
