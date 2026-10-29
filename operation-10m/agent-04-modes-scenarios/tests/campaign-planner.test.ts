import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_SCENARIO_CHAINS,
  attachCircuitSessionToState,
  attachExpeditionSessionToState,
  attachOdysseySessionToState,
  attachGauntletSessionToState,
  attachMarathonQueueToState,
  attachRelaySessionToState,
  campaignProgressSummary,
  createEmptyO10mModesPersistedState,
  createCircuitSession,
  createExpeditionSession,
  createOdysseySession,
  createGauntletSession,
  createMarathonQueue,
  createRelaySession,
  initializeChainProgress,
  pinCampaignSlot,
  planNextCampaignAction,
  rankCampaignSlotsByRecency,
} from '../src/index.js';

describe('scenario campaign planner round 4', () => {
  it('registers continuity arc chain with rebound finale', () => {
    const chain = O10M_SCENARIO_CHAINS.find(c => c.id === 'o10m_chain_continuity_arc');
    assert.ok(chain);
    assert.equal(chain!.steps[2]?.scenarioId, 'o10m_standing_rebound');
  });

  it('plans chain step when chain progress is active', () => {
    const progress = initializeChainProgress('o10m_chain_continuity_arc');
    assert.ok(progress);
    const state = {
      ...createEmptyO10mModesPersistedState(),
      chainProgress: progress,
    };
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'chain_step');
    assert.equal(plan.scenarioId, 'o10m_continuity_drill');
    assert.equal(plan.chainId, 'o10m_chain_continuity_arc');
  });

  it('prefers active odyssey over expedition, circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: odyssey } = createOdysseySession({
      odysseyId: 'o10m_odyssey_priority',
      label: 'Priority',
      scenarioIds: ['o10m_odyssey_opening_winds', 'o10m_odyssey_crossing_shelves'],
    });
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    state = attachOdysseySessionToState(state, odyssey!);
    assert.equal(planNextCampaignAction(state).kind, 'odyssey_step');
  });

  it('prefers active expedition over circuit, relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: expedition } = createExpeditionSession({
      expeditionId: 'o10m_expedition_priority',
      label: 'Priority',
      scenarioIds: ['o10m_expedition_departure_dock', 'o10m_expedition_transit_pass'],
    });
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_priority',
      label: 'Priority',
      scenarioIds: ['o10m_gauntlet_opening_gate', 'o10m_gauntlet_midfield_press'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter'],
    });
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    state = attachExpeditionSessionToState(state, expedition!);
    assert.equal(planNextCampaignAction(state).kind, 'expedition_step');
  });

  it('prefers active circuit over relay, gauntlet, marathon queue, and campaign slot', () => {
    const { session: circuit } = createCircuitSession({
      circuitId: 'o10m_circuit_priority',
      label: 'Priority',
      scenarioIds: ['o10m_circuit_warmup_laps', 'o10m_circuit_ridge_climb'],
    });
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_top',
      label: 'Top',
      scenarioIds: ['o10m_gauntlet_opening_gate'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_rhythm_hold'],
    });
    let state = pinCampaignSlot(createEmptyO10mModesPersistedState(), {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    state = attachCircuitSessionToState(state, circuit!);
    assert.equal(planNextCampaignAction(state).kind, 'circuit_step');
  });

  it('prefers active relay over gauntlet, marathon queue, and campaign slot', () => {
    const { session: relay } = createRelaySession({
      relayId: 'o10m_relay_priority',
      label: 'Priority',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    const { session: gauntlet } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_top',
      label: 'Top',
      scenarioIds: ['o10m_gauntlet_opening_gate'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_rhythm_hold'],
    });
    let state = pinCampaignSlot(createEmptyO10mModesPersistedState(), {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, gauntlet!);
    state = attachRelaySessionToState(state, relay!);
    assert.equal(planNextCampaignAction(state).kind, 'relay_step');
  });

  it('prefers active gauntlet over marathon queue and campaign slot when no relay', () => {
    const { session } = createGauntletSession({
      gauntletId: 'o10m_gauntlet_top',
      label: 'Top',
      scenarioIds: ['o10m_gauntlet_opening_gate'],
    });
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_rhythm_hold'],
    });
    let state = pinCampaignSlot(createEmptyO10mModesPersistedState(), {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    state = attachGauntletSessionToState(state, session!);
    assert.equal(planNextCampaignAction(state).kind, 'gauntlet_step');
  });

  it('prefers active marathon queue over campaign slot when no gauntlet', () => {
    const { queue } = createMarathonQueue({
      queueId: 'o10m_marathon_priority',
      label: 'Priority',
      scenarioIds: ['o10m_marathon_pace_setter', 'o10m_marathon_rhythm_hold'],
    });
    let state = pinCampaignSlot(createEmptyO10mModesPersistedState(), {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    state = attachMarathonQueueToState(state, queue!);
    assert.equal(planNextCampaignAction(state).kind, 'marathon_step');
  });

  it('prefers active campaign slot over chain when no marathon', () => {
    const base = {
      ...createEmptyO10mModesPersistedState(),
      chainProgress: initializeChainProgress('o10m_chain_continuity_arc'),
      scenarioId: 'o10m_slot_rotation_lab' as string | null,
    };
    const state = pinCampaignSlot(base, {
      slotId: 'o10m_slot_lab',
      scenarioId: 'o10m_slot_rotation_lab',
      turn: 4,
    }).state;
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'slot_resume');
    assert.equal(plan.slotId, 'o10m_slot_lab');
  });

  it('ranks slots by pinned turn and summarizes campaign', () => {
    let state = createEmptyO10mModesPersistedState();
    state = pinCampaignSlot(state, { slotId: 'o10m_slot_a', scenarioId: 'o10m_slot_rotation_lab', turn: 2 }).state;
    state = pinCampaignSlot(state, { slotId: 'o10m_slot_b', scenarioId: 'o10m_continuity_drill', turn: 9 }).state;
    const order = rankCampaignSlotsByRecency(state);
    assert.deepEqual(order.slice(0, 2), ['o10m_slot_b', 'o10m_slot_a']);
    const summary = campaignProgressSummary(state);
    assert.equal(summary.nextPlan.kind, 'slot_resume');
  });
});
