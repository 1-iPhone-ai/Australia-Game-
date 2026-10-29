import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachAcquittalSessionToState,
  attachExonerationSessionToState,
  buildExonerationScenarioStartOverrides,
  createAcquittalSession,
  createExonerationSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  exonerationRestitutionScoreFromRun,
  unlockTokenForExonerationId,
  type O10mChallengeModeId,
} from '../src/index.js';

const exonerationRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_exoneration_claim_docket',
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

describe('save format round 31 exoneration schema', () => {
  it('migrates schema v30 blob to v31 with exoneration defaults', () => {
    const v30 = {
      schemaVersion: 30,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_acquittal_brief_docket',
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
    };
    const v31 = migrateO10mModesPersistedState(v30);
    assert.equal(v31.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v31.exonerationSession, null);
  });

  it('attaches exoneration and planner prefers exoneration_step with restitution hint', () => {
    const { session } = createExonerationSession({
      exonerationId: 'o10m_exoneration_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_exoneration_claim_docket',
        'o10m_exoneration_review_chamber',
        'o10m_exoneration_clearance_finale',
      ],
    });
    assert.ok(session);
    const state = attachExonerationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'exoneration_step');
    assert.equal(plan.scenarioId, 'o10m_exoneration_claim_docket');
    assert.equal(plan.exonerationPhase, 'claim');
    assert.equal(plan.exonerationRestitution, 0);
  });

  it('advances exoneration phases, accrues restitution, and grants unlock token on completion', () => {
    const { session } = createExonerationSession({
      exonerationId: 'o10m_exoneration_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_exoneration_claim_docket',
        'o10m_exoneration_review_chamber',
        'o10m_exoneration_clearance_finale',
      ],
    });
    assert.ok(session);
    const restitution = exonerationRestitutionScoreFromRun(exonerationRunBase);
    assert.ok(restitution > 0);

    let state = attachExonerationSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...exonerationRunBase, scenarioId: 'o10m_exoneration_claim_docket' },
      4,
    );
    assert.equal(state.exonerationSession?.cursor, 1);
    assert.equal(state.exonerationSession?.phaseTag, 'review');
    assert.ok((state.exonerationSession?.restitutionScore ?? 0) >= restitution);

    const overrides = buildExonerationScenarioStartOverrides(state.exonerationSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveExonerationPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...exonerationRunBase, scenarioId: 'o10m_exoneration_review_chamber' },
      5,
    );
    assert.equal(state.exonerationSession?.cursor, 2);
    assert.equal(state.exonerationSession?.phaseTag, 'exoneration');

    state = applyPostRunPersistedUpdates(
      state,
      { ...exonerationRunBase, scenarioId: 'o10m_exoneration_clearance_finale' },
      6,
    );
    assert.equal(state.exonerationSession?.active, false);
    const token = unlockTokenForExonerationId('o10m_exoneration_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('exoneration attach clears an active acquittal session', () => {
    const { session: acquittal } = createAcquittalSession({
      acquittalId: 'o10m_acquittal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_acquittal_brief_docket'],
    });
    const { session: exoneration } = createExonerationSession({
      exonerationId: 'o10m_exoneration_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_exoneration_claim_docket'],
    });
    let state = attachAcquittalSessionToState(createEmptyO10mModesPersistedState(), acquittal!);
    state = attachExonerationSessionToState(state, exoneration!);
    assert.equal(state.acquittalSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'exoneration_step');
  });

  it('importO10mModesProgressJson round-trips exoneration session', () => {
    const { session } = createExonerationSession({
      exonerationId: 'o10m_exoneration_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_exoneration_claim_docket', 'o10m_exoneration_review_chamber'],
    });
    const attached = attachExonerationSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.exonerationSession?.exonerationId, 'o10m_exoneration_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
