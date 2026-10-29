import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachTribunalSessionToState,
  attachIndictmentSessionToState,
  buildIndictmentScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createTribunalSession,
  createIndictmentSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  indictmentCaseWeightFromRun,
  unlockTokenForIndictmentId,
  type O10mChallengeModeId,
} from '../src/index.js';

const indictmentRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_indictment_charge_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4300,
  playerNetWorth: 4500,
  regionsControlled: 2,
  maxRegionalStanding: 63,
  rivalNetWorth: 2200,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 21 indictment schema', () => {
  it('migrates schema v20 blob to v21 with indictment defaults', () => {
    const v20 = {
      schemaVersion: 20,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_tribunal_docket_brief',
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
    };
    const v21 = migrateO10mModesPersistedState(v20);
    assert.equal(v21.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v21.indictmentSession, null);
  });

  it('attaches indictment and planner prefers indictment_step with case-weight hint', () => {
    const { session } = createIndictmentSession({
      indictmentId: 'o10m_indictment_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_indictment_charge_docket',
        'o10m_indictment_arraign_bench',
        'o10m_indictment_bind_finale',
      ],
    });
    assert.ok(session);
    const state = attachIndictmentSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.tribunalSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'indictment_step');
    assert.equal(plan.scenarioId, 'o10m_indictment_charge_docket');
    assert.equal(plan.indictmentPhase, 'charge');
    assert.equal(plan.indictmentCaseWeight, 0);
  });

  it('advances indictment phases, accrues case weight, and grants unlock token on completion', () => {
    const { session } = createIndictmentSession({
      indictmentId: 'o10m_indictment_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_indictment_charge_docket',
        'o10m_indictment_arraign_bench',
        'o10m_indictment_bind_finale',
      ],
    });
    let state = attachIndictmentSessionToState(createEmptyO10mModesPersistedState(), session!);
    const weight = indictmentCaseWeightFromRun(indictmentRunBase);
    assert.ok(weight > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...indictmentRunBase, scenarioId: 'o10m_indictment_charge_docket' },
      4,
    );
    assert.equal(state.indictmentSession?.cursor, 1);
    assert.equal(state.indictmentSession?.phaseTag, 'arraign');
    assert.ok((state.indictmentSession?.caseWeightScore ?? 0) >= weight);

    const overrides = buildIndictmentScenarioStartOverrides(state.indictmentSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveIndictmentPhase, 'arraign');

    state = applyPostRunPersistedUpdates(
      state,
      { ...indictmentRunBase, scenarioId: 'o10m_indictment_arraign_bench' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...indictmentRunBase, scenarioId: 'o10m_indictment_bind_finale' },
      6,
    );
    assert.equal(state.indictmentSession?.active, false);
    const token = unlockTokenForIndictmentId('o10m_indictment_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('indictment attach clears an active tribunal session', () => {
    const { session: tribunal } = createTribunalSession({
      tribunalId: 'o10m_tribunal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_tribunal_docket_brief'],
    });
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_indictment_charge_docket'],
    });
    let state = attachTribunalSessionToState(createEmptyO10mModesPersistedState(), tribunal!);
    state = attachIndictmentSessionToState(state, indictment!);
    assert.equal(state.tribunalSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'indictment_step');
  });

  it('importO10mModesProgressJson round-trips indictment session', () => {
    const { session } = createIndictmentSession({
      indictmentId: 'o10m_indictment_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_indictment_charge_docket', 'o10m_indictment_arraign_bench'],
    });
    const attached = attachIndictmentSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.indictmentSession?.indictmentId, 'o10m_indictment_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
