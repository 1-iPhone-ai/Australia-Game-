import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachCircuitSessionToState,
  attachExpeditionSessionToState,
  buildExpeditionScenarioStartOverrides,
  createCircuitSession,
  createEmptyO10mModesPersistedState,
  createExpeditionSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  expeditionSupplyFromRun,
  unlockTokenForExpeditionId,
  type O10mChallengeModeId,
} from '../src/index.js';

const expeditionRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_expedition_departure_dock',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 3200,
  playerNetWorth: 3400,
  regionsControlled: 2,
  maxRegionalStanding: 50,
  rivalNetWorth: 1800,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 9 expedition schema', () => {
  it('migrates schema v8 blob to v9 with expedition defaults', () => {
    const v8 = {
      schemaVersion: 8,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_circuit_warmup_laps',
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
    };
    const v9 = migrateO10mModesPersistedState(v8);
    assert.equal(v9.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v9.expeditionSession, null);
  });

  it('attaches expedition and planner prefers expedition_step with supply hint', () => {
    const { session } = createExpeditionSession({
      expeditionId: 'o10m_expedition_outback_mail',
      label: 'Outback mail',
      scenarioIds: [
        'o10m_expedition_departure_dock',
        'o10m_expedition_transit_pass',
        'o10m_expedition_arrival_haven',
      ],
    });
    assert.ok(session);
    const state = attachExpeditionSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.circuitSession, null);
    assert.equal(state.relaySession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'expedition_step');
    assert.equal(plan.scenarioId, 'o10m_expedition_departure_dock');
    assert.equal(plan.expeditionLeg, 'departure');
    assert.equal(plan.expeditionSupply, 0);
  });

  it('advances expedition legs, accrues supply, and grants unlock token on completion', () => {
    const { session } = createExpeditionSession({
      expeditionId: 'o10m_expedition_outback_mail',
      label: 'Outback mail',
      scenarioIds: [
        'o10m_expedition_departure_dock',
        'o10m_expedition_transit_pass',
        'o10m_expedition_arrival_haven',
      ],
    });
    let state = attachExpeditionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const supply = expeditionSupplyFromRun(expeditionRunBase);
    assert.ok(supply > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...expeditionRunBase, scenarioId: 'o10m_expedition_departure_dock' },
      4,
    );
    assert.equal(state.expeditionSession?.cursor, 1);
    assert.equal(state.expeditionSession?.legTag, 'transit');
    assert.ok((state.expeditionSession?.supplyScore ?? 0) >= supply);

    const overrides = buildExpeditionScenarioStartOverrides(state.expeditionSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveExpeditionLeg, 'transit');

    state = applyPostRunPersistedUpdates(
      state,
      { ...expeditionRunBase, scenarioId: 'o10m_expedition_transit_pass' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...expeditionRunBase, scenarioId: 'o10m_expedition_arrival_haven' },
      6,
    );
    assert.equal(state.expeditionSession?.active, false);
    const token = unlockTokenForExpeditionId('o10m_expedition_outback_mail');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('expedition attach clears an active circuit session', () => {
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_circuit_warmup_laps'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_expedition_departure_dock'],
    });
    let state = attachCircuitSessionToState(createEmptyO10mModesPersistedState(), circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    assert.equal(state.circuitSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'expedition_step');
  });

  it('importO10mModesProgressJson round-trips expedition session', () => {
    const { session } = createExpeditionSession({
      expeditionId: 'o10m_expedition_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const attached = attachExpeditionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.expeditionSession?.expeditionId, 'o10m_expedition_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
