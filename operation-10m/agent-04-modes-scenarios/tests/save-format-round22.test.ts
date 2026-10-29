import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachIndictmentSessionToState,
  attachAppealSessionToState,
  buildAppealScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createIndictmentSession,
  createAppealSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  appealMeritScoreFromRun,
  unlockTokenForAppealId,
  type O10mChallengeModeId,
} from '../src/index.js';

const appealRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_appeal_petition_filing',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4400,
  playerNetWorth: 4600,
  regionsControlled: 2,
  maxRegionalStanding: 64,
  rivalNetWorth: 2250,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 22 appeal schema', () => {
  it('migrates schema v21 blob to v22 with appeal defaults', () => {
    const v21 = {
      schemaVersion: 21,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_indictment_charge_docket',
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
    };
    const v22 = migrateO10mModesPersistedState(v21);
    assert.equal(v22.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v22.appealSession, null);
  });

  it('attaches appeal and planner prefers appeal_step with merit hint', () => {
    const { session } = createAppealSession({
      appealId: 'o10m_appeal_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_appeal_petition_filing',
        'o10m_appeal_review_chamber',
        'o10m_appeal_grant_finale',
      ],
    });
    assert.ok(session);
    const state = attachAppealSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.indictmentSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'appeal_step');
    assert.equal(plan.scenarioId, 'o10m_appeal_petition_filing');
    assert.equal(plan.appealPhase, 'petition');
    assert.equal(plan.appealMerit, 0);
  });

  it('advances appeal phases, accrues merit, and grants unlock token on completion', () => {
    const { session } = createAppealSession({
      appealId: 'o10m_appeal_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_appeal_petition_filing',
        'o10m_appeal_review_chamber',
        'o10m_appeal_grant_finale',
      ],
    });
    let state = attachAppealSessionToState(createEmptyO10mModesPersistedState(), session!);
    const merit = appealMeritScoreFromRun(appealRunBase);
    assert.ok(merit > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...appealRunBase, scenarioId: 'o10m_appeal_petition_filing' },
      4,
    );
    assert.equal(state.appealSession?.cursor, 1);
    assert.equal(state.appealSession?.phaseTag, 'review');
    assert.ok((state.appealSession?.meritScore ?? 0) >= merit);

    const overrides = buildAppealScenarioStartOverrides(state.appealSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveAppealPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...appealRunBase, scenarioId: 'o10m_appeal_review_chamber' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...appealRunBase, scenarioId: 'o10m_appeal_grant_finale' },
      6,
    );
    assert.equal(state.appealSession?.active, false);
    const token = unlockTokenForAppealId('o10m_appeal_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('appeal attach clears an active indictment session', () => {
    const { session: indictment } = createIndictmentSession({
      indictmentId: 'o10m_indictment_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_indictment_charge_docket'],
    });
    const { session: appeal } = createAppealSession({
      appealId: 'o10m_appeal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_appeal_petition_filing'],
    });
    let state = attachIndictmentSessionToState(createEmptyO10mModesPersistedState(), indictment!);
    state = attachAppealSessionToState(state, appeal!);
    assert.equal(state.indictmentSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'appeal_step');
  });

  it('importO10mModesProgressJson round-trips appeal session', () => {
    const { session } = createAppealSession({
      appealId: 'o10m_appeal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_appeal_petition_filing', 'o10m_appeal_review_chamber'],
    });
    const attached = attachAppealSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.appealSession?.appealId, 'o10m_appeal_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
