import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachCircuitSessionToState,
  attachRelaySessionToState,
  buildCircuitScenarioStartOverrides,
  createCircuitSession,
  createEmptyO10mModesPersistedState,
  createRelaySession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  circuitMomentumFromRun,
  unlockTokenForCircuitId,
  type O10mChallengeModeId,
} from '../src/index.js';

const circuitRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_circuit_warmup_laps',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 3400,
  playerNetWorth: 3600,
  regionsControlled: 2,
  maxRegionalStanding: 52,
  rivalNetWorth: 1900,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 8 circuit schema', () => {
  it('migrates schema v7 blob to v8 with circuit defaults', () => {
    const v7 = {
      schemaVersion: 7,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_relay_dust_corridor',
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
    };
    const v8 = migrateO10mModesPersistedState(v7);
    assert.equal(v8.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v8.circuitSession, null);
  });

  it('attaches circuit and planner prefers circuit_step with momentum hint', () => {
    const { session } = createCircuitSession({
      circuitId: 'o10m_circuit_outback_lab',
      label: 'Outback lab',
      scenarioIds: [
        'o10m_circuit_warmup_laps',
        'o10m_circuit_ridge_climb',
        'o10m_circuit_summit_push',
      ],
    });
    assert.ok(session);
    const state = attachCircuitSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.relaySession, null);
    assert.equal(state.marathonQueue, null);
    assert.equal(state.gauntletSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'circuit_step');
    assert.equal(plan.scenarioId, 'o10m_circuit_warmup_laps');
    assert.equal(plan.circuitPhase, 'warmup');
    assert.equal(plan.circuitMomentum, 0);
  });

  it('advances circuit legs, accrues momentum, and grants unlock token on completion', () => {
    const { session } = createCircuitSession({
      circuitId: 'o10m_circuit_outback_lab',
      label: 'Outback lab',
      scenarioIds: [
        'o10m_circuit_warmup_laps',
        'o10m_circuit_ridge_climb',
        'o10m_circuit_summit_push',
      ],
    });
    let state = attachCircuitSessionToState(createEmptyO10mModesPersistedState(), session!);
    const momentum = circuitMomentumFromRun(circuitRunBase);
    assert.ok(momentum > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...circuitRunBase, scenarioId: 'o10m_circuit_warmup_laps' },
      4,
    );
    assert.equal(state.circuitSession?.cursor, 1);
    assert.equal(state.circuitSession?.phaseTag, 'ascent');
    assert.ok((state.circuitSession?.momentumScore ?? 0) >= momentum);

    const overrides = buildCircuitScenarioStartOverrides(state.circuitSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveCircuitPhase, 'ascent');

    state = applyPostRunPersistedUpdates(
      state,
      { ...circuitRunBase, scenarioId: 'o10m_circuit_ridge_climb' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...circuitRunBase, scenarioId: 'o10m_circuit_summit_push' },
      6,
    );
    assert.equal(state.circuitSession?.active, false);
    const token = unlockTokenForCircuitId('o10m_circuit_outback_lab');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('circuit attach clears an active relay session', () => {
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_smoke',
      label: 'Relay',
      scenarioIds: ['o10m_relay_dust_corridor'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_circuit_warmup_laps'],
    });
    let state = attachRelaySessionToState(createEmptyO10mModesPersistedState(), relay!);
    state = attachCircuitSessionToState(state, circuit!);
    assert.equal(state.relaySession, null);
    assert.equal(planNextCampaignAction(state).kind, 'circuit_step');
  });

  it('importO10mModesProgressJson round-trips circuit session', () => {
    const { session } = createCircuitSession({
      circuitId: 'o10m_circuit_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const attached = attachCircuitSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.circuitSession?.circuitId, 'o10m_circuit_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
