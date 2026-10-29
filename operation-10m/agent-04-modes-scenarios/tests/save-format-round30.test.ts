import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachAcquittalSessionToState,
  attachCommutationSessionToState,
  buildAcquittalScenarioStartOverrides,
  createAcquittalSession,
  createCommutationSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  acquittalVerdictScoreFromRun,
  unlockTokenForAcquittalId,
  type O10mChallengeModeId,
} from '../src/index.js';

const acquittalRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_acquittal_brief_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 5100,
  playerNetWorth: 5300,
  regionsControlled: 2,
  maxRegionalStanding: 71,
  rivalNetWorth: 2470,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 30 acquittal schema', () => {
  it('migrates schema v29 blob to v30 with acquittal defaults', () => {
    const v29 = {
      schemaVersion: 29,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_commutation_petition_docket',
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
    };
    const v30 = migrateO10mModesPersistedState(v29);
    assert.equal(v30.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v30.acquittalSession, null);
  });

  it('attaches acquittal and planner prefers acquittal_step with verdict hint', () => {
    const { session } = createAcquittalSession({
      acquittalId: 'o10m_acquittal_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_acquittal_brief_docket',
        'o10m_acquittal_review_chamber',
        'o10m_acquittal_verdict_finale',
      ],
    });
    assert.ok(session);
    const state = attachAcquittalSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'acquittal_step');
    assert.equal(plan.scenarioId, 'o10m_acquittal_brief_docket');
    assert.equal(plan.acquittalPhase, 'brief');
    assert.equal(plan.acquittalVerdict, 0);
  });

  it('advances acquittal phases, accrues verdict, and grants unlock token on completion', () => {
    const { session } = createAcquittalSession({
      acquittalId: 'o10m_acquittal_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_acquittal_brief_docket',
        'o10m_acquittal_review_chamber',
        'o10m_acquittal_verdict_finale',
      ],
    });
    assert.ok(session);
    const verdict = acquittalVerdictScoreFromRun(acquittalRunBase);
    assert.ok(verdict > 0);

    let state = attachAcquittalSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...acquittalRunBase, scenarioId: 'o10m_acquittal_brief_docket' },
      4,
    );
    assert.equal(state.acquittalSession?.cursor, 1);
    assert.equal(state.acquittalSession?.phaseTag, 'review');
    assert.ok((state.acquittalSession?.verdictScore ?? 0) >= verdict);

    const overrides = buildAcquittalScenarioStartOverrides(state.acquittalSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveAcquittalPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...acquittalRunBase, scenarioId: 'o10m_acquittal_review_chamber' },
      5,
    );
    assert.equal(state.acquittalSession?.cursor, 2);
    assert.equal(state.acquittalSession?.phaseTag, 'acquittal');

    state = applyPostRunPersistedUpdates(
      state,
      { ...acquittalRunBase, scenarioId: 'o10m_acquittal_verdict_finale' },
      6,
    );
    assert.equal(state.acquittalSession?.active, false);
    const token = unlockTokenForAcquittalId('o10m_acquittal_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('acquittal attach clears an active commutation session', () => {
    const { session: commutation } = createCommutationSession({
      commutationId: 'o10m_commutation_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_commutation_petition_docket'],
    });
    const { session: acquittal } = createAcquittalSession({
      acquittalId: 'o10m_acquittal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_acquittal_brief_docket'],
    });
    let state = attachCommutationSessionToState(createEmptyO10mModesPersistedState(), commutation!);
    state = attachAcquittalSessionToState(state, acquittal!);
    assert.equal(state.commutationSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'acquittal_step');
  });

  it('importO10mModesProgressJson round-trips acquittal session', () => {
    const { session } = createAcquittalSession({
      acquittalId: 'o10m_acquittal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_acquittal_brief_docket', 'o10m_acquittal_review_chamber'],
    });
    const attached = attachAcquittalSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.acquittalSession?.acquittalId, 'o10m_acquittal_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
