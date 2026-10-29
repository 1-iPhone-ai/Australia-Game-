import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachQuashSessionToState,
  attachSupersedeSessionToState,
  buildSupersedeScenarioStartOverrides,
  createQuashSession,
  createSupersedeSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  supersedeScoreFromRun,
  unlockTokenForSupersedeId,
  type O10mChallengeModeId,
} from '../src/index.js';

const supersedeRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_supersede_filing_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 5600,
  playerNetWorth: 5800,
  regionsControlled: 2,
  maxRegionalStanding: 80,
  rivalNetWorth: 2500,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 40 supersede schema', () => {
  it('migrates schema v39 blob to v40 with supersede defaults', () => {
    const v39 = {
      schemaVersion: 39,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_quash_filing_docket',
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
      vacaturSession: null,
      remandSession: null,
      reversalSession: null,
      annulmentSession: null,
      reinstatementSession: null,
      setAsideSession: null,
      quashSession: null,
    };
    const v40 = migrateO10mModesPersistedState(v39);
    assert.equal(v40.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v40.supersedeSession, null);
  });

  it('attaches supersede and planner prefers supersede_step with score hint', () => {
    const { session } = createSupersedeSession({
      supersedeId: 'o10m_supersede_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_supersede_filing_docket',
        'o10m_supersede_review_chamber',
        'o10m_supersede_stay_finale',
      ],
    });
    assert.ok(session);
    const state = attachSupersedeSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'supersede_step');
    assert.equal(plan.scenarioId, 'o10m_supersede_filing_docket');
    assert.equal(plan.supersedePhase, 'filing');
    assert.equal(plan.supersedeScore, 0);
  });

  it('advances supersede phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createSupersedeSession({
      supersedeId: 'o10m_supersede_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_supersede_filing_docket',
        'o10m_supersede_review_chamber',
        'o10m_supersede_stay_finale',
      ],
    });
    assert.ok(session);
    const score = supersedeScoreFromRun(supersedeRunBase);
    assert.ok(score > 0);

    let state = attachSupersedeSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...supersedeRunBase, scenarioId: 'o10m_supersede_filing_docket' },
      4,
    );
    assert.equal(state.supersedeSession?.cursor, 1);
    assert.equal(state.supersedeSession?.phaseTag, 'review');
    assert.ok((state.supersedeSession?.supersedeScore ?? 0) >= score);

    const overrides = buildSupersedeScenarioStartOverrides(state.supersedeSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveSupersedePhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...supersedeRunBase, scenarioId: 'o10m_supersede_review_chamber' },
      5,
    );
    assert.equal(state.supersedeSession?.cursor, 2);
    assert.equal(state.supersedeSession?.phaseTag, 'supersede');

    state = applyPostRunPersistedUpdates(
      state,
      { ...supersedeRunBase, scenarioId: 'o10m_supersede_stay_finale' },
      6,
    );
    assert.equal(state.supersedeSession?.active, false);
    const token = unlockTokenForSupersedeId('o10m_supersede_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('supersede attach clears an active quash session', () => {
    const { session: quash } = createQuashSession({
      quashId: 'o10m_quash_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_quash_filing_docket'],
    });
    const { session: supersede } = createSupersedeSession({
      supersedeId: 'o10m_supersede_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_supersede_filing_docket'],
    });
    let state = attachQuashSessionToState(createEmptyO10mModesPersistedState(), quash!);
    state = attachSupersedeSessionToState(state, supersede!);
    assert.equal(state.quashSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'supersede_step');
  });

  it('importO10mModesProgressJson round-trips supersede session', () => {
    const { session } = createSupersedeSession({
      supersedeId: 'o10m_supersede_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_supersede_filing_docket', 'o10m_supersede_review_chamber'],
    });
    const attached = attachSupersedeSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.supersedeSession?.supersedeId, 'o10m_supersede_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
