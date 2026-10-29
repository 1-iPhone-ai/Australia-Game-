import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachPardonSessionToState,
  attachAmnestySessionToState,
  buildAmnestyScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createPardonSession,
  createAmnestySession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  amnestyAbsolutionScoreFromRun,
  unlockTokenForAmnestyId,
  type O10mChallengeModeId,
} from '../src/index.js';

const amnestyRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_amnesty_warrant_docket',
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

describe('save format round 25 amnesty schema', () => {
  it('migrates schema v24 blob to v25 with amnesty defaults', () => {
    const v24 = {
      schemaVersion: 24,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_pardon_brief_docket',
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
    };
    const v25 = migrateO10mModesPersistedState(v24);
    assert.equal(v25.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v25.amnestySession, null);
  });

  it('attaches amnesty and planner prefers amnesty_step with absolution hint', () => {
    const { session } = createAmnestySession({
      amnestyId: 'o10m_amnesty_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_amnesty_warrant_docket',
        'o10m_amnesty_review_chamber',
        'o10m_amnesty_absolution_finale',
      ],
    });
    assert.ok(session);
    const state = attachAmnestySessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.pardonSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'amnesty_step');
    assert.equal(plan.scenarioId, 'o10m_amnesty_warrant_docket');
    assert.equal(plan.amnestyPhase, 'warrant');
    assert.equal(plan.amnestyAbsolution, 0);
  });

  it('advances amnesty phases, accrues absolution, and grants unlock token on completion', () => {
    const { session } = createAmnestySession({
      amnestyId: 'o10m_amnesty_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_amnesty_warrant_docket',
        'o10m_amnesty_review_chamber',
        'o10m_amnesty_absolution_finale',
      ],
    });
    let state = attachAmnestySessionToState(createEmptyO10mModesPersistedState(), session!);
    const absolution = amnestyAbsolutionScoreFromRun(amnestyRunBase);
    assert.ok(absolution > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...amnestyRunBase, scenarioId: 'o10m_amnesty_warrant_docket' },
      4,
    );
    assert.equal(state.amnestySession?.cursor, 1);
    assert.equal(state.amnestySession?.phaseTag, 'review');
    assert.ok((state.amnestySession?.absolutionScore ?? 0) >= absolution);

    const overrides = buildAmnestyScenarioStartOverrides(state.amnestySession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveAmnestyPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...amnestyRunBase, scenarioId: 'o10m_amnesty_review_chamber' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...amnestyRunBase, scenarioId: 'o10m_amnesty_absolution_finale' },
      6,
    );
    assert.equal(state.amnestySession?.active, false);
    const token = unlockTokenForAmnestyId('o10m_amnesty_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('amnesty attach clears an active pardon session', () => {
    const { session: pardon } = createPardonSession({
      pardonId: 'o10m_pardon_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_pardon_brief_docket'],
    });
    const { session: amnesty } = createAmnestySession({
      amnestyId: 'o10m_amnesty_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_amnesty_warrant_docket'],
    });
    let state = attachPardonSessionToState(createEmptyO10mModesPersistedState(), pardon!);
    state = attachAmnestySessionToState(state, amnesty!);
    assert.equal(state.pardonSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'amnesty_step');
  });

  it('importO10mModesProgressJson round-trips amnesty session', () => {
    const { session } = createAmnestySession({
      amnestyId: 'o10m_amnesty_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_amnesty_warrant_docket', 'o10m_amnesty_review_chamber'],
    });
    const attached = attachAmnestySessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.amnestySession?.amnestyId, 'o10m_amnesty_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
