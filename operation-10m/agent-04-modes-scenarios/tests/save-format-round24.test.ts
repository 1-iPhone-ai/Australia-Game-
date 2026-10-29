import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachClemencySessionToState,
  attachPardonSessionToState,
  buildPardonScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createClemencySession,
  createPardonSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  pardonGraceScoreFromRun,
  unlockTokenForPardonId,
  type O10mChallengeModeId,
} from '../src/index.js';

const pardonRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_pardon_brief_docket',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4600,
  playerNetWorth: 4800,
  regionsControlled: 2,
  maxRegionalStanding: 66,
  rivalNetWorth: 2300,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 24 pardon schema', () => {
  it('migrates schema v23 blob to v24 with pardon defaults', () => {
    const v23 = {
      schemaVersion: 23,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_clemency_plea_docket',
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
    };
    const v24 = migrateO10mModesPersistedState(v23);
    assert.equal(v24.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v24.pardonSession, null);
  });

  it('attaches pardon and planner prefers pardon_step with grace hint', () => {
    const { session } = createPardonSession({
      pardonId: 'o10m_pardon_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_pardon_brief_docket',
        'o10m_pardon_review_chamber',
        'o10m_pardon_grace_finale',
      ],
    });
    assert.ok(session);
    const state = attachPardonSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.clemencySession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'pardon_step');
    assert.equal(plan.scenarioId, 'o10m_pardon_brief_docket');
    assert.equal(plan.pardonPhase, 'brief');
    assert.equal(plan.pardonGrace, 0);
  });

  it('advances pardon phases, accrues grace, and grants unlock token on completion', () => {
    const { session } = createPardonSession({
      pardonId: 'o10m_pardon_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_pardon_brief_docket',
        'o10m_pardon_review_chamber',
        'o10m_pardon_grace_finale',
      ],
    });
    let state = attachPardonSessionToState(createEmptyO10mModesPersistedState(), session!);
    const grace = pardonGraceScoreFromRun(pardonRunBase);
    assert.ok(grace > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...pardonRunBase, scenarioId: 'o10m_pardon_brief_docket' },
      4,
    );
    assert.equal(state.pardonSession?.cursor, 1);
    assert.equal(state.pardonSession?.phaseTag, 'review');
    assert.ok((state.pardonSession?.graceScore ?? 0) >= grace);

    const overrides = buildPardonScenarioStartOverrides(state.pardonSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActivePardonPhase, 'review');

    state = applyPostRunPersistedUpdates(
      state,
      { ...pardonRunBase, scenarioId: 'o10m_pardon_review_chamber' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...pardonRunBase, scenarioId: 'o10m_pardon_grace_finale' },
      6,
    );
    assert.equal(state.pardonSession?.active, false);
    const token = unlockTokenForPardonId('o10m_pardon_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('pardon attach clears an active clemency session', () => {
    const { session: clemency } = createClemencySession({
      clemencyId: 'o10m_clemency_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_clemency_plea_docket'],
    });
    const { session: pardon } = createPardonSession({
      pardonId: 'o10m_pardon_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_pardon_brief_docket'],
    });
    let state = attachClemencySessionToState(createEmptyO10mModesPersistedState(), clemency!);
    state = attachPardonSessionToState(state, pardon!);
    assert.equal(state.clemencySession, null);
    assert.equal(planNextCampaignAction(state).kind, 'pardon_step');
  });

  it('importO10mModesProgressJson round-trips pardon session', () => {
    const { session } = createPardonSession({
      pardonId: 'o10m_pardon_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_pardon_brief_docket', 'o10m_pardon_review_chamber'],
    });
    const attached = attachPardonSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.pardonSession?.pardonId, 'o10m_pardon_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
