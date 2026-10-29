import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachSetAsideSessionToState,
  attachQuashSessionToState,
  buildQuashScenarioStartOverrides,
  createSetAsideSession,
  createQuashSession,
  createEmptyO10mModesPersistedState,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  quashScoreFromRun,
  unlockTokenForQuashId,
  type O10mChallengeModeId,
} from '../src/index.js';

const quashRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_quash_filing_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 5500,
  playerNetWorth: 5700,
  regionsControlled: 2,
  maxRegionalStanding: 78,
  rivalNetWorth: 2500,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 39 quash schema', () => {
  it('migrates schema v38 blob to v39 with quash defaults', () => {
    const v38 = {
      schemaVersion: 38,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_setaside_filing_docket',
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
    };
    const v39 = migrateO10mModesPersistedState(v38);
    assert.equal(v39.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v39.quashSession, null);
  });

  it('attaches quash and planner prefers quash_step with score hint', () => {
    const { session } = createQuashSession({
      quashId: 'o10m_quash_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_quash_filing_docket',
        'o10m_quash_review_chamber',
        'o10m_quash_vacate_finale',
      ],
    });
    assert.ok(session);
    const state = attachQuashSessionToState(createEmptyO10mModesPersistedState(), session!);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'quash_step');
    assert.equal(plan.scenarioId, 'o10m_quash_filing_docket');
    assert.equal(plan.quashPhase, 'filing');
    assert.equal(plan.quashScore, 0);
  });

  it('advances quash phases, accrues score, and grants unlock token on completion', () => {
    const { session } = createQuashSession({
      quashId: 'o10m_quash_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_quash_filing_docket',
        'o10m_quash_review_chamber',
        'o10m_quash_vacate_finale',
      ],
    });
    assert.ok(session);
    const score = quashScoreFromRun(quashRunBase);
    assert.ok(score > 0);

    let state = attachQuashSessionToState(createEmptyO10mModesPersistedState(), session!);
    state = applyPostRunPersistedUpdates(
      state,
      { ...quashRunBase, scenarioId: 'o10m_quash_filing_docket' },
      4,
    );
    assert.equal(state.quashSession?.cursor, 1);
    assert.equal(state.quashSession?.phaseTag, 'review');
    assert.ok((state.quashSession?.quashScore ?? 0) >= score);

    const overrides = buildQuashScenarioStartOverrides(state.quashSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveQuashPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...quashRunBase, scenarioId: 'o10m_quash_review_chamber' },
      5,
    );
    assert.equal(state.quashSession?.cursor, 2);
    assert.equal(state.quashSession?.phaseTag, 'quash');

    state = applyPostRunPersistedUpdates(
      state,
      { ...quashRunBase, scenarioId: 'o10m_quash_vacate_finale' },
      6,
    );
    assert.equal(state.quashSession?.active, false);
    const token = unlockTokenForQuashId('o10m_quash_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('quash attach clears an active set-aside session', () => {
    const { session: setAside } = createSetAsideSession({
      setAsideId: 'o10m_setaside_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_setaside_filing_docket'],
    });
    const { session: quash } = createQuashSession({
      quashId: 'o10m_quash_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_quash_filing_docket'],
    });
    let state = attachSetAsideSessionToState(createEmptyO10mModesPersistedState(), setAside!);
    state = attachQuashSessionToState(state, quash!);
    assert.equal(state.setAsideSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'quash_step');
  });

  it('importO10mModesProgressJson round-trips quash session', () => {
    const { session } = createQuashSession({
      quashId: 'o10m_quash_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_quash_filing_docket', 'o10m_quash_review_chamber'],
    });
    const attached = attachQuashSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.quashSession?.quashId, 'o10m_quash_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
