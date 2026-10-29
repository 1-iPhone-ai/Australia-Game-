import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachParoleSessionToState,
  attachProbationSessionToState,
  buildProbationScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createParoleSession,
  createProbationSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  probationComplianceScoreFromRun,
  unlockTokenForProbationId,
  type O10mChallengeModeId,
} from '../src/index.js';

const probationRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_probation_enrollment_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4900,
  playerNetWorth: 5100,
  regionsControlled: 2,
  maxRegionalStanding: 69,
  rivalNetWorth: 2410,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 28 probation schema', () => {
  it('migrates schema v27 blob to v28 with probation defaults', () => {
    const v27 = {
      schemaVersion: 27,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_parole_intake_docket',
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
    };
    const v28 = migrateO10mModesPersistedState(v27);
    assert.equal(v28.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v28.probationSession, null);
  });

  it('attaches probation and planner prefers probation_step with compliance hint', () => {
    const { session } = createProbationSession({
      probationId: 'o10m_probation_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_probation_enrollment_docket',
        'o10m_probation_review_chamber',
        'o10m_probation_clearance_finale',
      ],
    });
    assert.ok(session);
    const state = attachProbationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'probation_step');
    assert.equal(plan.scenarioId, 'o10m_probation_enrollment_docket');
    assert.equal(plan.probationPhase, 'enrollment');
    assert.equal(plan.probationCompliance, 0);
  });

  it('advances probation phases, accrues compliance, and grants unlock token on completion', () => {
    const { session } = createProbationSession({
      probationId: 'o10m_probation_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_probation_enrollment_docket',
        'o10m_probation_review_chamber',
        'o10m_probation_clearance_finale',
      ],
    });
    assert.ok(session);
    const compliance = probationComplianceScoreFromRun(probationRunBase);
    assert.ok(compliance > 0);

    let state = attachProbationSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...probationRunBase, scenarioId: 'o10m_probation_enrollment_docket' },
      4,
    );
    assert.equal(state.probationSession?.cursor, 1);
    assert.equal(state.probationSession?.phaseTag, 'review');
    assert.ok((state.probationSession?.complianceScore ?? 0) >= compliance);

    const overrides = buildProbationScenarioStartOverrides(state.probationSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveProbationPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...probationRunBase, scenarioId: 'o10m_probation_review_chamber' },
      5,
    );
    assert.equal(state.probationSession?.cursor, 2);
    assert.equal(state.probationSession?.phaseTag, 'probation');

    state = applyPostRunPersistedUpdates(
      state,
      { ...probationRunBase, scenarioId: 'o10m_probation_clearance_finale' },
      6,
    );
    assert.equal(state.probationSession?.active, false);
    const token = unlockTokenForProbationId('o10m_probation_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('probation attach clears an active parole session', () => {
    const { session: parole } = createParoleSession({
      paroleId: 'o10m_parole_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_parole_intake_docket'],
    });
    const { session: probation } = createProbationSession({
      probationId: 'o10m_probation_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_probation_enrollment_docket'],
    });
    let state = attachParoleSessionToState(createEmptyO10mModesPersistedState(), parole!);
    state = attachProbationSessionToState(state, probation!);
    assert.equal(state.paroleSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'probation_step');
  });

  it('importO10mModesProgressJson round-trips probation session', () => {
    const { session } = createProbationSession({
      probationId: 'o10m_probation_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_probation_enrollment_docket', 'o10m_probation_review_chamber'],
    });
    const attached = attachProbationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.probationSession?.probationId, 'o10m_probation_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
