import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_MODES_SAVE_SCHEMA_VERSION,
  applyPostRunPersistedUpdates,
  attachEscortSessionToState,
  attachExtractionSessionToState,
  buildExtractionScenarioStartOverrides,
  createEmptyO10mModesPersistedState,
  createEscortSession,
  createExtractionSession,
  extractionAssetFromRun,
  importO10mModesProgressJson,
  sealO10mModesPersistedState,
  migrateO10mModesPersistedState,
  planNextCampaignAction,
  unlockTokenForExtractionId,
  type O10mChallengeModeId,
} from '../src/index.js';

const extractionRunBase = {
  baseMode: 'scenario' as const,
  scenarioId: 'o10m_extraction_intel_brief',
  challengeModeIds: [] as O10mChallengeModeId[],
  primaryVictory: true,
  altVictoryRuleId: null,
  day: 5,
  playerMoney: 4150,
  playerNetWorth: 4350,
  regionsControlled: 2,
  maxRegionalStanding: 59,
  rivalNetWorth: 2050,
  optionalObjectivesCompleted: 0,
  totalObjectives: 1,
};

describe('save format round 17 extraction schema', () => {
  it('migrates schema v16 blob to v17 with extraction defaults', () => {
    const v16 = {
      schemaVersion: 16,
      updatedAtTurn: 3,
      baseMode: 'scenario',
      scenarioId: 'o10m_escort_briefing_yard',
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
    };
    const v17 = migrateO10mModesPersistedState(v16);
    assert.equal(v17.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
    assert.equal(v17.extractionSession, null);
  });

  it('attaches extraction and planner prefers extraction_step with asset hint', () => {
    const { session } = createExtractionSession({
      extractionId: 'o10m_extraction_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_extraction_intel_brief',
        'o10m_extraction_rescue_site',
        'o10m_extraction_exfil_finale',
      ],
    });
    assert.ok(session);
    const state = attachExtractionSessionToState(createEmptyO10mModesPersistedState(), session!);
    assert.equal(state.escortSession, null);
    const plan = planNextCampaignAction(state);
    assert.equal(plan.kind, 'extraction_step');
    assert.equal(plan.scenarioId, 'o10m_extraction_intel_brief');
    assert.equal(plan.extractionPhase, 'intel');
    assert.equal(plan.extractionAssets, 0);
  });

  it('advances extraction phases, accrues assets, and grants unlock token on completion', () => {
    const { session } = createExtractionSession({
      extractionId: 'o10m_extraction_capital_line',
      label: 'Capital line',
      scenarioIds: [
        'o10m_extraction_intel_brief',
        'o10m_extraction_rescue_site',
        'o10m_extraction_exfil_finale',
      ],
    });
    let state = attachExtractionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const assets = extractionAssetFromRun(extractionRunBase);
    assert.ok(assets > 0);

    state = applyPostRunPersistedUpdates(
      state,
      { ...extractionRunBase, scenarioId: 'o10m_extraction_intel_brief' },
      4,
    );
    assert.equal(state.extractionSession?.cursor, 1);
    assert.equal(state.extractionSession?.phaseTag, 'rescue');
    assert.ok((state.extractionSession?.assetScore ?? 0) >= assets);

    const overrides = buildExtractionScenarioStartOverrides(state.extractionSession);
    assert.ok(overrides.startingMoneyDelta > 0);
    assert.equal(overrides.forcedSettingsPatch.o10mActiveExtractionPhase, 'rescue');

    state = applyPostRunPersistedUpdates(
      state,
      { ...extractionRunBase, scenarioId: 'o10m_extraction_rescue_site' },
      5,
    );
    state = applyPostRunPersistedUpdates(
      state,
      { ...extractionRunBase, scenarioId: 'o10m_extraction_exfil_finale' },
      6,
    );
    assert.equal(state.extractionSession?.active, false);
    const token = unlockTokenForExtractionId('o10m_extraction_capital_line');
    assert.ok(token);
    assert.ok(state.catalogUnlockTokens?.includes(token!));
  });

  it('extraction attach clears an active escort session', () => {
    const { session: escort } = createEscortSession({
      escortId: 'o10m_escort_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_escort_briefing_yard'],
    });
    const { session: extraction } = createExtractionSession({
      extractionId: 'o10m_extraction_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_extraction_intel_brief'],
    });
    let state = attachEscortSessionToState(createEmptyO10mModesPersistedState(), escort!);
    state = attachExtractionSessionToState(state, extraction!);
    assert.equal(state.escortSession, null);
    assert.equal(planNextCampaignAction(state).kind, 'extraction_step');
  });

  it('importO10mModesProgressJson round-trips extraction session', () => {
    const { session } = createExtractionSession({
      extractionId: 'o10m_extraction_smoke',
      label: 'Smoke',
      scenarioIds: ['o10m_extraction_intel_brief', 'o10m_extraction_rescue_site'],
    });
    const attached = attachExtractionSessionToState(createEmptyO10mModesPersistedState(), session!);
    const imported = importO10mModesProgressJson(JSON.stringify(sealO10mModesPersistedState(attached)));
    assert.equal(imported.errors.length, 0);
    assert.ok(imported.state);
    assert.equal(imported.state!.extractionSession?.extractionId, 'o10m_extraction_smoke');
    assert.equal(imported.state!.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION);
  });
});
