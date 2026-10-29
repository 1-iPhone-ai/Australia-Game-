import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachRelaySessionToState,
  buildRelayScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createRelaySession,
  importO10mModesProgressJson,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  relayLegCarryFromRun,
  unlockTokenForRelayId,
  type O10mChallengeModeId,
} from '../src/index.js';

const relayRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_relay_dust_corridor',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 6,
  playerMoney: 3600,
  playerNetWorth: 3800,
  regionsControlled: 2,
  maxRegionalStanding: 50,
  rivalNetWorth: 1800,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 7 relay schema', () => {
  it('migrates schema v6 blob to v7 with relay defaults', () => {
    const v6 = {
      schemaVersion: 6,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_gauntlet_opening_gate',
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
    };
    const v7 = migrateO10mModesPersistedState(v6);
    assert.equal(v7.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v7.relaySession, null);
  });

  it('attaches relay and planner prefers relay_step with carry hint', () => {
    const { session } = createRelaySession({
      relayId: 'o10m_relay_outback_lab',
      label: 'Outback lab',
      scenarioIds: [
        'o10m_relay_dust_corridor',
        'o10m_relay_coastal_handoff',
        'o10m_relay_terminal_sprint',
      ],
    });
    assert.ok(session);
    const state = attachRelaySessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.marathonQueue, null);
    assert.equal(state.gauntletSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'relay_step');
    assert.equal(plan.scenarioId, 'o10m_relay_dust_corridor');
    assert.equal(plan.relayCarryMoney, 0);
  });

  it('accumulates carry and advances relay legs on primary victory', () => {
    const { session } = createRelaySession({
      relayId: 'o10m_relay_outback_lab',
      label: 'Outback lab',
      scenarioIds: ['o10m_relay_dust_corridor', 'o10m_relay_coastal_handoff'],
    });
    let state = attachRelaySessionToState(createEmptyO10mModesPersistedState(), session!);
    const legBonus = relayLegCarryFromRun(relayRunBase);
    assert.ok((legBonus.startingMoneyDelta ?? 0) > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...relayRunBase, scenarioId: 'o10m_relay_dust_corridor' },
      4,
    );
    assert.equal(state.relaySession?.cursor, 1);
    assert.ok((state.relaySession?.legCarry.startingMoneyDelta ?? 0) >= legBonus.startingMoneyDelta!);
    const overrides = buildRelayScenarioStartOverrides(state.relaySession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(planNextCampaignAction(state).scenarioId, 'o10m_relay_coastal_handoff');
  });

  it('grants unlock token when relay convoy completes', () => {
    const { session } = createRelaySession({
      relayId: 'o10m_relay_finale_only',
      label: 'Finale',
      scenarioIds: ['o10m_relay_terminal_sprint'],
    });
    let state = attachRelaySessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(unlockTokenForRelayId('o10m_relay_finale_only'), 'o10m_unlock_finale_only');
    state = applyPostRunPersistedUpdates(
      state,
      { ...relayRunBase, scenarioId: 'o10m_relay_terminal_sprint' },
      9,
    );
    assert.equal(state.relaySession?.active, false);
    assert.ok((state.catalogUnlockTokens ?? []).includes('o10m_unlock_finale_only'));
  });

  it('round-trips v7 save through import', () => {
    const state = attachRelaySessionToState(
      createEmptyO10mModesPersistedState(),
      createRelaySession({
        relayId: 'o10m_relay_import_smoke',
        label: 'Import',
        scenarioIds: ['o10m_relay_dust_corridor'],
      }).session!,
    );
    const imported = importO10mModesProgressJson(JSON.stringify(state));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.relaySession?.relayId, 'o10m_relay_import_smoke');
  });
});
