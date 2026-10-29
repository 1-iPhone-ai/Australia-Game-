import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachWitnessSessionToState,
  attachTribunalSessionToState,
  buildTribunalScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createWitnessSession,
  createTribunalSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  tribunalGravitasFromRun,
  unlockTokenForTribunalId,
  type O10mChallengeModeId,
} from '../src/index.js';

const tribunalRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_tribunal_docket_brief',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4250,
  playerNetWorth: 4450,
  regionsControlled: 2,
  maxRegionalStanding: 62,
  rivalNetWorth: 2150,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 20 tribunal schema', () => {
  it('migrates schema v19 blob to v20 with tribunal defaults', () => {
    const v19 = {
      schemaVersion: 19,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_witness_brief_room',
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
    };
    const v20 = migrateO10mModesPersistedState(v19);
    assert.equal(v20.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v20.tribunalSession, null);
  });

  it('attaches tribunal and planner prefers tribunal_step with gravitas hint', () => {
    const { session } = createTribunalSession({
      tribunalId: 'o10m_tribunal_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_tribunal_docket_brief',
        'o10m_tribunal_hearing_chamber',
        'o10m_tribunal_seal_finale',
      ],
    });
    assert.ok(session);
    const state = attachTribunalSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.witnessSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'tribunal_step');
    assert.equal(plan.scenarioId, 'o10m_tribunal_docket_brief');
    assert.equal(plan.tribunalPhase, 'docket');
    assert.equal(plan.tribunalGravitas, 0);
  });

  it('advances tribunal phases, accrues gravitas, and grants unlock token on completion', () => {
    const { session } = createTribunalSession({
      tribunalId: 'o10m_tribunal_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_tribunal_docket_brief',
        'o10m_tribunal_hearing_chamber',
        'o10m_tribunal_seal_finale',
      ],
    });
    let state = attachTribunalSessionToState(createEmptyO10mModesPersistedState(), session!);
    const gravitas = tribunalGravitasFromRun(tribunalRunBase);
    assert.ok(gravitas > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...tribunalRunBase, scenarioId: 'o10m_tribunal_docket_brief' },
      4,
    );
    assert.equal(state.tribunalSession?.cursor, 1);
    assert.equal(state.tribunalSession?.phaseTag, 'hearing');
    assert.ok((state.tribunalSession?.gravitasScore ?? 0) >= gravitas);

    const overrides = buildTribunalScenarioStartOverrides(state.tribunalSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveTribunalPhase, 'hearing');

    state = applyPostRunPersistedUpdates(
      state,
      { ...tribunalRunBase, scenarioId: 'o10m_tribunal_hearing_chamber' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...tribunalRunBase, scenarioId: 'o10m_tribunal_seal_finale' },
      6,
    );
    assert.equal(state.tribunalSession?.active, false);
    const token = unlockTokenForTribunalId('o10m_tribunal_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('tribunal attach clears an active witness session', () => {
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_witness_brief_room'],
    });
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_tribunal_docket_brief'],
    });
    let state = attachWitnessSessionToState(createEmptyO10mModesPersistedState(), witness!);
    state = attachTribunalSessionToState(state, tribunal!);
    assert.equal(state.witnessSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'tribunal_step');
  });

  it('importO10mModesProgressJson round-trips tribunal session', () => {
    const { session } = createTribunalSession({
      tribunalId: 'o10m_tribunal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_tribunal_docket_brief', 'o10m_tribunal_hearing_chamber'],
    });
    const attached = attachTribunalSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.tribunalSession?.tribunalId, 'o10m_tribunal_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
