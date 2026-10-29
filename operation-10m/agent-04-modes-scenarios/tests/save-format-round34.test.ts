import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachVacaturSessionToState,
  attachRemandSessionToState,
  buildRemandScenarioStartOverrides,
  createVacaturSession,
  createRemandSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  remandWeightScoreFromRun,
  unlockTokenForRemandId,
  type O10mChallengeModeId,
} from '../src/index.js';

const remandRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_remand_order_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 5200,
  playerNetWorth: 5400,
  regionsControlled: 2,
  maxRegionalStanding: 72,
  rivalNetWorth: 2500,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 34 remand schema', () => {
  it('migrates schema v33 blob to v34 with remand defaults', () => {
    const v33 = {
      schemaVersion: 33,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_vacatur_petition_docket',
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
    };
    const v34 = migrateO10mModesPersistedState(v33);
    assert.equal(v34.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v34.remandSession, null);
  });

  it('attaches remand and planner prefers remand_step with weight hint', () => {
    const { session } = createRemandSession({
      remandId: 'o10m_remand_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_remand_order_docket',
        'o10m_remand_review_chamber',
        'o10m_remand_weight_finale',
      ],
    });
    assert.ok(session);
    const state = attachRemandSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'remand_step');
    assert.equal(plan.scenarioId, 'o10m_remand_order_docket');
    assert.equal(plan.remandPhase, 'order');
    assert.equal(plan.remandWeight, 0);
  });

  it('advances remand phases, accrues weight, and grants unlock token on completion', () => {
    const { session } = createRemandSession({
      remandId: 'o10m_remand_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_remand_order_docket',
        'o10m_remand_review_chamber',
        'o10m_remand_weight_finale',
      ],
    });
    assert.ok(session);
    const weight = remandWeightScoreFromRun(remandRunBase);
    assert.ok(weight > 0);

    let state = attachRemandSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...remandRunBase, scenarioId: 'o10m_remand_order_docket' },
      4,
    );
    assert.equal(state.remandSession?.cursor, 1);
    assert.equal(state.remandSession?.phaseTag, 'review');
    assert.ok((state.remandSession?.weightScore ?? 0) >= weight);

    const overrides = buildRemandScenarioStartOverrides(state.remandSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveRemandPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...remandRunBase, scenarioId: 'o10m_remand_review_chamber' },
      5,
    );
    assert.equal(state.remandSession?.cursor, 2);
    assert.equal(state.remandSession?.phaseTag, 'remand');

    state = applyPostRunPersistedUpdates(
      state,
      { ...remandRunBase, scenarioId: 'o10m_remand_weight_finale' },
      6,
    );
    assert.equal(state.remandSession?.active, false);
    const token = unlockTokenForRemandId('o10m_remand_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('remand attach clears an active vacatur session', () => {
    const { session: vacatur } = createVacaturSession({
      vacaturId: 'o10m_vacatur_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_vacatur_petition_docket'],
    });
    const { session: remand } = createRemandSession({
      remandId: 'o10m_remand_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_remand_order_docket'],
    });
    let state = attachVacaturSessionToState(createEmptyO10mModesPersistedState(), vacatur!);
    state = attachRemandSessionToState(state, remand!);
    assert.equal(state.vacaturSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'remand_step');
  });

  it('importO10mModesProgressJson round-trips remand session', () => {
    const { session } = createRemandSession({
      remandId: 'o10m_remand_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_remand_order_docket', 'o10m_remand_review_chamber'],
    });
    const attached = attachRemandSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.remandSession?.remandId, 'o10m_remand_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
