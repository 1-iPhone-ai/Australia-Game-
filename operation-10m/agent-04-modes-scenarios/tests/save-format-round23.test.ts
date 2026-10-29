import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachAppealSessionToState,
  attachClemencySessionToState,
  buildClemencyScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createAppealSession,
  createClemencySession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  clemencyMercyScoreFromRun,
  unlockTokenForClemencyId,
  type O10mChallengeModeId,
} from '../src/index.js';

const clemencyRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_clemency_plea_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4500,
  playerNetWorth: 4700,
  regionsControlled: 2,
  maxRegionalStanding: 65,
  rivalNetWorth: 2280,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 23 clemency schema', () => {
  it('migrates schema v22 blob to v23 with clemency defaults', () => {
    const v22 = {
      schemaVersion: 22,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_appeal_petition_filing',
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
    };
    const v23 = migrateO10mModesPersistedState(v22);
    assert.equal(v23.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v23.clemencySession, null);
  });

  it('attaches clemency and planner prefers clemency_step with mercy hint', () => {
    const { session } = createClemencySession({
      clemencyId: 'o10m_clemency_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_clemency_plea_docket',
        'o10m_clemency_review_chamber',
        'o10m_clemency_mercy_finale',
      ],
    });
    assert.ok(session);
    const state = attachClemencySessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.appealSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'clemency_step');
    assert.equal(plan.scenarioId, 'o10m_clemency_plea_docket');
    assert.equal(plan.clemencyPhase, 'plea');
    assert.equal(plan.clemencyMercy, 0);
  });

  it('advances clemency phases, accrues mercy, and grants unlock token on completion', () => {
    const { session } = createClemencySession({
      clemencyId: 'o10m_clemency_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_clemency_plea_docket',
        'o10m_clemency_review_chamber',
        'o10m_clemency_mercy_finale',
      ],
    });
    let state = attachClemencySessionToState(createEmptyO10mModesPersistedState(), session!);
    const mercy = clemencyMercyScoreFromRun(clemencyRunBase);
    assert.ok(mercy > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...clemencyRunBase, scenarioId: 'o10m_clemency_plea_docket' },
      4,
    );
    assert.equal(state.clemencySession?.cursor, 1);
    assert.equal(state.clemencySession?.phaseTag, 'review');
    assert.ok((state.clemencySession?.mercyScore ?? 0) >= mercy);

    const overrides = buildClemencyScenarioStartOverrides(state.clemencySession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveClemencyPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...clemencyRunBase, scenarioId: 'o10m_clemency_review_chamber' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...clemencyRunBase, scenarioId: 'o10m_clemency_mercy_finale' },
      6,
    );
    assert.equal(state.clemencySession?.active, false);
    const token = unlockTokenForClemencyId('o10m_clemency_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('clemency attach clears an active appeal session', () => {
    const { session: appeal } = createAppealSession({
      appealId: 'o10m_appeal_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_appeal_petition_filing'],
    });
    const { session: clemency } = createClemencySession({
      clemencyId: 'o10m_clemency_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_clemency_plea_docket'],
    });
    let state = attachAppealSessionToState(createEmptyO10mModesPersistedState(), appeal!);
    state = attachClemencySessionToState(state, clemency!);
    assert.equal(state.appealSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'clemency_step');
  });

  it('importO10mModesProgressJson round-trips clemency session', () => {
    const { session } = createClemencySession({
      clemencyId: 'o10m_clemency_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_clemency_plea_docket', 'o10m_clemency_review_chamber'],
    });
    const attached = attachClemencySessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.clemencySession?.clemencyId, 'o10m_clemency_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
