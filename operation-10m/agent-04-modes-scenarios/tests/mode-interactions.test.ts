import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  CANONICAL_GAME_MODE_SELECTIONS,
  assertCanonicalModesPreserved,
  mergePlayableScenarioCatalog,
  O10M_OPERATION_SCENARIOS,
  O10M_CHALLENGE_MODES,
  resolveModeInteraction,
  evaluateO10mScenarioPrimaryOutcome,
  evaluateO10mAltVictory,
  evaluateMissionMilestones,
  findO10mScenario,
  listChallengeIncompatibilities,
} from '../src/index.js';

describe('canonical modes preserved', () => {
  it('exports the full GameModeSelection set', () => {
    assert.equal(CANONICAL_GAME_MODE_SELECTIONS.length, 6);
    assert.deepEqual(assertCanonicalModesPreserved([...CANONICAL_GAME_MODE_SELECTIONS]), []);
  });

  it('does not introduce duplicate scenario ids against stub canonical list', () => {
    const stubCanonical = [{ id: 'outback_siege' }, { id: 'mining_tycoon' }] as { id: string }[];
    const merged = mergePlayableScenarioCatalog(stubCanonical as never);
    assert.equal(merged.collisionIds.length, 0);
    assert.equal(merged.scenarios.length, stubCanonical.length + O10M_OPERATION_SCENARIOS.length);
    assert.ok(merged.o10mIds.every(id => id.startsWith('o10m_')));
  });
});

describe('mode interactions', () => {
  it('allows scenario + two compatible challenges', () => {
    const result = resolveModeInteraction({
      baseMode: 'scenario',
      scenarioId: 'o10m_silent_diplomat',
      challengeModeIds: ['o10m_ironman', 'o10m_rival_intensity'],
      scenarioModeEnabled: true,
    });
    assert.equal(result.ok, true);
    assert.equal(result.errors.length, 0);
    assert.equal(result.effectiveBaseMode, 'scenario');
    assert.equal(result.forcedSettingsMerge.sabotageEnabled, false);
    assert.equal(result.forcedSettingsMerge.o10mIronmanNoMidRunSave, true);
  });

  it('blocks single mode with structured scenario', () => {
    const result = resolveModeInteraction({
      baseMode: 'single',
      scenarioId: 'o10m_export_clock',
      challengeModeIds: [],
    });
    assert.equal(result.ok, false);
    assert.match(result.errors.join(' '), /Single-player sandbox/);
  });

  it('blocks ironman on team_ai_vs_ai', () => {
    const result = resolveModeInteraction({
      baseMode: 'team_ai_vs_ai',
      scenarioId: null,
      challengeModeIds: ['o10m_ironman'],
    });
    assert.equal(result.ok, false);
    assert.ok(result.errors.some(e => e.includes('Ironman')));
  });

  it('blocks incompatible challenge with base mode', () => {
    const result = resolveModeInteraction({
      baseMode: 'team_ai_vs_ai',
      scenarioId: 'o10m_team_ledger',
      challengeModeIds: ['o10m_ap_sprint'],
    });
    assert.equal(result.ok, false);
    assert.ok(result.errors.some(e => e.includes('o10m_ap_sprint')));
  });

  it('warns when grand tour hosts non-prologue scenario', () => {
    const result = resolveModeInteraction({
      baseMode: 'grand_tour',
      scenarioId: 'o10m_cyclone_corridor',
      challengeModeIds: [],
    });
    assert.equal(result.ok, true);
    assert.ok(result.warnings.some(w => w.includes('Grand tour')));
  });

  it('documents challenge incompatibilities for regression', () => {
    const pairs = listChallengeIncompatibilities();
    assert.ok(pairs.length >= O10M_CHALLENGE_MODES.length);
  });
});

describe('scenario objective and alt victory', () => {
  const silent = findO10mScenario('o10m_silent_diplomat');
  assert.ok(silent);

  it('evaluates primary victory on silent diplomat snapshot', () => {
    const context = {
      player: {
        money: 9000,
        regionalStanding: { ACT: 75, NSW: 70 },
        sabotageTargetedCount: 0,
      },
      aiPlayer: { money: 5000 },
      gameState: {
        day: 12,
        proposals: [{ status: 'passed' }, { status: 'passed' }],
        bankruptcyTracker: {},
      },
      gameSettings: { totalDays: 30 },
    };
    const primary = evaluateO10mScenarioPrimaryOutcome(silent!.objectives, context);
    assert.equal(primary.isVictory, true);
    assert.equal(primary.allPrimaryCompleted, true);

    const alt = evaluateO10mAltVictory('o10m_silent_diplomat', primary, context);
    assert.equal(alt.triggered, true);
    assert.equal(alt.ruleId, 'o10m_diplomatic_consensus');
  });

  it('evaluates economic dominance alt victory', () => {
    const exportScenario = findO10mScenario('o10m_export_clock');
    assert.ok(exportScenario);
    const context = {
      player: { money: 20000 },
      aiPlayer: { money: 8000 },
      gameState: { day: 10, bankruptcyTracker: {} },
      gameSettings: { totalDays: 18 },
    };
    const primary = evaluateO10mScenarioPrimaryOutcome(exportScenario!.objectives, context);
    assert.equal(primary.isVictory, true);
    const alt = evaluateO10mAltVictory('o10m_export_clock', primary, context);
    assert.equal(alt.ruleId, 'o10m_economic_dominance');
  });
});

describe('mission milestones', () => {
  it('unlocks stacked challenge milestone after qualifying run', () => {
    const progress = evaluateMissionMilestones([
      {
        baseMode: 'scenario',
        scenarioId: 'o10m_silent_diplomat',
        challengeModeIds: ['o10m_ironman', 'o10m_rival_intensity'],
        primaryVictory: true,
        altVictoryRuleId: 'o10m_diplomatic_consensus',
        day: 11,
        playerMoney: 5000,
        playerNetWorth: 12000,
        regionsControlled: 2,
        maxRegionalStanding: 75,
        rivalNetWorth: 4000,
        optionalObjectivesCompleted: 1,
        totalObjectives: 3,
      },
    ]);
    const stacked = progress.find(p => p.milestoneId === 'o10m_milestone_challenge_stack');
    const alt = progress.find(p => p.milestoneId === 'o10m_milestone_alt_victory');
    assert.equal(stacked?.unlocked, true);
    assert.equal(alt?.unlocked, true);
  });
});
