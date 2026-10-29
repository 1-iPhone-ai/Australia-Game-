import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_SCENARIO_CHAINS,
  campaignProgressSummary,
  createEmptyO10mModesPersistedState,
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

  it('prefers active campaign slot over chain', () => {
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
