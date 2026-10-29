import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachExtractionSessionToState,
  attachSubjectSessionToState,
  buildSubjectScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createExtractionSession,
  createSubjectSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  subjectFidelityFromRun,
  unlockTokenForSubjectId,
  type O10mChallengeModeId,
} from '../src/index.js';

const subjectRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_subject_intake_brief',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4200,
  playerNetWorth: 4400,
  regionsControlled: 2,
  maxRegionalStanding: 61,
  rivalNetWorth: 2100,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 18 subject schema', () => {
  it('migrates schema v17 blob to v18 with subject defaults', () => {
    const v17 = {
      schemaVersion: 17,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_extraction_intel_brief',
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
    };
    const v18 = migrateO10mModesPersistedState(v17);
    assert.equal(v18.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v18.subjectSession, null);
  });

  it('attaches subject and planner prefers subject_step with fidelity hint', () => {
    const { session } = createSubjectSession({
      subjectId: 'o10m_subject_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_subject_intake_brief',
        'o10m_subject_probe_field',
        'o10m_subject_verdict_finale',
      ],
    });
    assert.ok(session);
    const state = attachSubjectSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.extractionSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'subject_step');
    assert.equal(plan.scenarioId, 'o10m_subject_intake_brief');
    assert.equal(plan.subjectPhase, 'intake');
    assert.equal(plan.subjectFidelity, 0);
  });

  it('advances subject phases, accrues fidelity, and grants unlock token on completion', () => {
    const { session } = createSubjectSession({
      subjectId: 'o10m_subject_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_subject_intake_brief',
        'o10m_subject_probe_field',
        'o10m_subject_verdict_finale',
      ],
    });
    let state = attachSubjectSessionToState(createEmptyO10mModesPersistedState(), session!);
    const fidelity = subjectFidelityFromRun(subjectRunBase);
    assert.ok(fidelity > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...subjectRunBase, scenarioId: 'o10m_subject_intake_brief' },
      4,
    );
    assert.equal(state.subjectSession?.cursor, 1);
    assert.equal(state.subjectSession?.phaseTag, 'probe');
    assert.ok((state.subjectSession?.fidelityScore ?? 0) >= fidelity);

    const overrides = buildSubjectScenarioStartOverrides(state.subjectSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveSubjectPhase, 'probe');

    state = applyPostRunPersistedUpdates(
      state,
      { ...subjectRunBase, scenarioId: 'o10m_subject_probe_field' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...subjectRunBase, scenarioId: 'o10m_subject_verdict_finale' },
      6,
    );
    assert.equal(state.subjectSession?.active, false);
    const token = unlockTokenForSubjectId('o10m_subject_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('subject attach clears an active extraction session', () => {
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_extraction_intel_brief'],
    });
    const { session: subject } = createSubjectSession({
      subjectId: 'o10m_subject_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_subject_intake_brief'],
    });
    let state = attachExtractionSessionToState(createEmptyO10mModesPersistedState(), extraction!);
    state = attachSubjectSessionToState(state, subject!);
    assert.equal(state.extractionSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'subject_step');
  });

  it('importO10mModesProgressJson round-trips subject session', () => {
    const { session } = createSubjectSession({
      subjectId: 'o10m_subject_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_subject_intake_brief', 'o10m_subject_probe_field'],
    });
    const attached = attachSubjectSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.subjectSession?.subjectId, 'o10m_subject_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
