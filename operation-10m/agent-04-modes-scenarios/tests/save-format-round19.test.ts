import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachExtractionSessionToState,
  attachWitnessSessionToState,
  buildWitnessScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createExtractionSession,
  createWitnessSession,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  witnessCredibilityFromRun,
  unlockTokenForWitnessId,
  type O10mChallengeModeId,
} from '../src/index.js';

const witnessRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_witness_brief_room',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4200,
  playerNetWorth: 4400,
  regionsControlled: 2,
  maxRegionalStanding: 61,
  rivalNetWorth: 2100,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 19 witness schema', () => {
  it('migrates schema v18 blob to v19 with witness defaults', () => {
    const v18 = {
      schemaVersion: 18,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_subject_intake_brief',
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
    };
    const v19 = migrateO10mModesPersistedState(v18);
    assert.equal(v19.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v19.witnessSession, null);
  });

  it('attaches witness and planner prefers witness_step with credibility hint', () => {
    const { session } = createWitnessSession({
      witnessId: 'o10m_witness_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_witness_brief_room',
        'o10m_witness_testimony_floor',
        'o10m_witness_affirm_finale',
      ],
    });
    assert.ok(session);
    const state = attachWitnessSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.subjectSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'witness_step');
    assert.equal(plan.scenarioId, 'o10m_witness_brief_room');
    assert.equal(plan.witnessPhase, 'brief');
    assert.equal(plan.witnessCredibility, 0);
  });

  it('advances witness phases, accrues credibility, and grants unlock token on completion', () => {
    const { session } = createWitnessSession({
      witnessId: 'o10m_witness_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_witness_brief_room',
        'o10m_witness_testimony_floor',
        'o10m_witness_affirm_finale',
      ],
    });
    let state = attachWitnessSessionToState(createEmptyO10mModesPersistedState(), session!);
    const credibility = witnessCredibilityFromRun(witnessRunBase);
    assert.ok(credibility > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...witnessRunBase, scenarioId: 'o10m_witness_brief_room' },
      4,
    );
    assert.equal(state.witnessSession?.cursor, 1);
    assert.equal(state.witnessSession?.phaseTag, 'testimony');
    assert.ok((state.witnessSession?.credibilityScore ?? 0) >= credibility);

    const overrides = buildWitnessScenarioStartOverrides(state.witnessSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveWitnessPhase, 'testimony');

    state = applyPostRunPersistedUpdates(
      state,
      { ...witnessRunBase, scenarioId: 'o10m_witness_testimony_floor' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...witnessRunBase, scenarioId: 'o10m_witness_affirm_finale' },
      6,
    );
    assert.equal(state.witnessSession?.active, false);
    const token = unlockTokenForWitnessId('o10m_witness_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('witness attach clears an active extraction session', () => {
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_extraction_intel_brief'],
    });
    const { session: witness } = createWitnessSession({
      witnessId: 'o10m_witness_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_witness_brief_room'],
    });
    let state = attachExtractionSessionToState(createEmptyO10mModesPersistedState(), extraction!);
    state = attachWitnessSessionToState(state, witness!);
    assert.equal(state.extractionSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'witness_step');
  });

  it('importO10mModesProgressJson round-trips witness session', () => {
    const { session } = createWitnessSession({
      witnessId: 'o10m_witness_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_witness_brief_room', 'o10m_witness_testimony_floor'],
    });
    const attached = attachWitnessSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.witnessSession?.witnessId, 'o10m_witness_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
