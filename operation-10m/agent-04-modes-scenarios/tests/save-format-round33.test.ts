import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachExpungementSessionToState,
  attachVacaturSessionToState,
  buildVacaturScenarioStartOverrides,
  createExpungementSession,
  createVacaturSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  vacaturMeritScoreFromRun,
  unlockTokenForVacaturId,
  type O10mChallengeModeId,
} from '../src/index.js';

const vacaturRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_vacatur_petition_docket',
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

describe('save format round 33 vacatur schema', () => {
  it('migrates schema v32 blob to v33 with vacatur defaults', () => {
    const v32 = {
      schemaVersion: 32,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_expungement_filing_docket',
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
    };
    const v33 = migrateO10mModesPersistedState(v32);
    assert.equal(v33.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v33.vacaturSession, null);
  });

  it('attaches vacatur and planner prefers vacatur_step with merit hint', () => {
    const { session } = createVacaturSession({
      vacaturId: 'o10m_vacatur_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_vacatur_petition_docket',
        'o10m_vacatur_review_chamber',
        'o10m_vacatur_merit_finale',
      ],
    });
    assert.ok(session);
    const state = attachVacaturSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'vacatur_step');
    assert.equal(plan.scenarioId, 'o10m_vacatur_petition_docket');
    assert.equal(plan.vacaturPhase, 'petition');
    assert.equal(plan.vacaturMerit, 0);
  });

  it('advances vacatur phases, accrues merit, and grants unlock token on completion', () => {
    const { session } = createVacaturSession({
      vacaturId: 'o10m_vacatur_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_vacatur_petition_docket',
        'o10m_vacatur_review_chamber',
        'o10m_vacatur_merit_finale',
      ],
    });
    assert.ok(session);
    const merit = vacaturMeritScoreFromRun(vacaturRunBase);
    assert.ok(merit > 0);

    let state = attachVacaturSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...vacaturRunBase, scenarioId: 'o10m_vacatur_petition_docket' },
      4,
    );
    assert.equal(state.vacaturSession?.cursor, 1);
    assert.equal(state.vacaturSession?.phaseTag, 'review');
    assert.ok((state.vacaturSession?.meritScore ?? 0) >= merit);

    const overrides = buildVacaturScenarioStartOverrides(state.vacaturSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveVacaturPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...vacaturRunBase, scenarioId: 'o10m_vacatur_review_chamber' },
      5,
    );
    assert.equal(state.vacaturSession?.cursor, 2);
    assert.equal(state.vacaturSession?.phaseTag, 'vacatur');

    state = applyPostRunPersistedUpdates(
      state,
      { ...vacaturRunBase, scenarioId: 'o10m_vacatur_merit_finale' },
      6,
    );
    assert.equal(state.vacaturSession?.active, false);
    const token = unlockTokenForVacaturId('o10m_vacatur_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('vacatur attach clears an active expungement session', () => {
    const { session: expungement } = createExpungementSession({
      expungementId: 'o10m_expungement_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_expungement_filing_docket'],
    });
    const { session: vacatur } = createVacaturSession({
      vacaturId: 'o10m_vacatur_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_vacatur_petition_docket'],
    });
    let state = attachExpungementSessionToState(createEmptyO10mModesPersistedState(), expungement!);
    state = attachVacaturSessionToState(state, vacatur!);
    assert.equal(state.expungementSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'vacatur_step');
  });

  it('importO10mModesProgressJson round-trips vacatur session', () => {
    const { session } = createVacaturSession({
      vacaturId: 'o10m_vacatur_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_vacatur_petition_docket', 'o10m_vacatur_review_chamber'],
    });
    const attached = attachVacaturSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.vacaturSession?.vacaturId, 'o10m_vacatur_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
