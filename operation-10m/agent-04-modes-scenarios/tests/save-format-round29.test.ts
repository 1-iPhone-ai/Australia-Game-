import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachCommutationSessionToState,
  attachProbationSessionToState,
  buildCommutationScenarioStartOverrides,
  createCommutationSession,
  createEmptyO10mModesPersistedState,
  createProbationSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  commutationLeniencyScoreFromRun,
  unlockTokenForCommutationId,
  type O10mChallengeModeId,
} from '../src/index.js';

const commutationRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_commutation_petition_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 5000,
  playerNetWorth: 5200,
  regionsControlled: 2,
  maxRegionalStanding: 70,
  rivalNetWorth: 2440,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 29 commutation schema', () => {
  it('migrates schema v28 blob to v29 with commutation defaults', () => {
    const v28 = {
      schemaVersion: 28,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_probation_enrollment_docket',
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
    };
    const v29 = migrateO10mModesPersistedState(v28);
    assert.equal(v29.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v29.commutationSession, null);
  });

  it('attaches commutation and planner prefers commutation_step with leniency hint', () => {
    const { session } = createCommutationSession({
      commutationId: 'o10m_commutation_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_commutation_petition_docket',
        'o10m_commutation_review_chamber',
        'o10m_commutation_grant_finale',
      ],
    });
    assert.ok(session);
    const state = attachCommutationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'commutation_step');
    assert.equal(plan.scenarioId, 'o10m_commutation_petition_docket');
    assert.equal(plan.commutationPhase, 'petition');
    assert.equal(plan.commutationLeniency, 0);
  });

  it('advances commutation phases, accrues leniency, and grants unlock token on completion', () => {
    const { session } = createCommutationSession({
      commutationId: 'o10m_commutation_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_commutation_petition_docket',
        'o10m_commutation_review_chamber',
        'o10m_commutation_grant_finale',
      ],
    });
    assert.ok(session);
    const leniency = commutationLeniencyScoreFromRun(commutationRunBase);
    assert.ok(leniency > 0);

    let state = attachCommutationSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...commutationRunBase, scenarioId: 'o10m_commutation_petition_docket' },
      4,
    );
    assert.equal(state.commutationSession?.cursor, 1);
    assert.equal(state.commutationSession?.phaseTag, 'review');
    assert.ok((state.commutationSession?.leniencyScore ?? 0) >= leniency);

    const overrides = buildCommutationScenarioStartOverrides(state.commutationSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveCommutationPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...commutationRunBase, scenarioId: 'o10m_commutation_review_chamber' },
      5,
    );
    assert.equal(state.commutationSession?.cursor, 2);
    assert.equal(state.commutationSession?.phaseTag, 'commutation');

    state = applyPostRunPersistedUpdates(
      state,
      { ...commutationRunBase, scenarioId: 'o10m_commutation_grant_finale' },
      6,
    );
    assert.equal(state.commutationSession?.active, false);
    const token = unlockTokenForCommutationId('o10m_commutation_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('commutation attach clears an active probation session', () => {
    const { session: probation } = createProbationSession({
      probationId: 'o10m_probation_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_probation_enrollment_docket'],
    });
    const { session: commutation } = createCommutationSession({
      commutationId: 'o10m_commutation_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_commutation_petition_docket'],
    });
    let state = attachProbationSessionToState(createEmptyO10mModesPersistedState(), probation!);
    state = attachCommutationSessionToState(state, commutation!);
    assert.equal(state.probationSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'commutation_step');
  });

  it('importO10mModesProgressJson round-trips commutation session', () => {
    const { session } = createCommutationSession({
      commutationId: 'o10m_commutation_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_commutation_petition_docket', 'o10m_commutation_review_chamber'],
    });
    const attached = attachCommutationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.commutationSession?.commutationId, 'o10m_commutation_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
