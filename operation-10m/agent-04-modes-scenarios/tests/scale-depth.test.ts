import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_OPERATION_SCENARIOS,
  O10M_SCENARIO_CHAINS,
  O10M_CHALLENGE_MODES,
  runO10mContentAudit,
  summarizeContentAudit,
  recommendScenariosForMode,
  evaluateModeScenarioFit,
  chainCoverageReport,
  resolveModeInteraction,
  advanceChainAfterRun,
  initializeChainProgress,
  evaluateMissionMilestones,
  getO10mChallengeMode,
} from '../src/index.js';

describe('content audit at scale', () => {
  it('catalog meets scale wave minimums', () => {
    assert.ok(O10M_OPERATION_SCENARIOS.length >= 46);
    assert.equal(O10M_SCENARIO_CHAINS.length, 34);
    assert.ok(O10M_CHALLENGE_MODES.length >= 5);
  });

  it('runO10mContentAudit is clean', () => {
    const report = runO10mContentAudit();
    assert.equal(report.isClean, true, summarizeContentAudit(report));
    assert.equal(report.issues.filter(i => i.severity === 'error').length, 0);
  });

  it('every chain step resolves to a preset scenario', () => {
    const report = runO10mContentAudit();
    assert.ok(!report.issues.some(i => i.problem === 'missing_scenario'));
  });
});

describe('mode mission registry', () => {
  it('recommends autoplay observatory only for team_ai_vs_ai', () => {
    const rec = recommendScenariosForMode('team_ai_vs_ai');
    assert.deepEqual(rec.map(s => s.id), ['o10m_autoplay_observatory']);
  });

  it('flags restricted scenario on team_ai_vs_ai', () => {
    const fit = evaluateModeScenarioFit('team_ai_vs_ai', 'o10m_rival_elimination_classic');
    assert.equal(fit.ok, false);
    assert.ok(fit.warnings.some(w => w.includes('restricted')));
  });

  it('reports chain region coverage', () => {
    const coverage = chainCoverageReport();
    assert.equal(coverage.length, 34);
    assert.ok(coverage.every(c => c.scenarioCount === 3));
  });
});

describe('mode interactions at depth', () => {
  it('allows team_ai_vs_ai with observatory and stability challenge', () => {
    const result = resolveModeInteraction({
      baseMode: 'team_ai_vs_ai',
      scenarioId: 'o10m_autoplay_observatory',
      challengeModeIds: ['o10m_stability_focus'],
      scenarioModeEnabled: true,
    });
    assert.equal(result.ok, true);
    assert.equal(result.forcedSettingsMerge.o10mAutoplayObservatoryScenario, true);
    assert.equal(result.forcedSettingsMerge.o10mStabilityFocus, true);
  });

  it('blocks rival elimination on team_ai_vs_ai', () => {
    const result = resolveModeInteraction({
      baseMode: 'team_ai_vs_ai',
      scenarioId: 'o10m_rival_elimination_classic',
      challengeModeIds: [],
    });
    assert.equal(result.ok, false);
  });

  it('stability focus challenge is registered', () => {
    const mode = getO10mChallengeMode('o10m_stability_focus');
    assert.equal(mode.forcedSettingsPatch.sabotageEnabled, false);
  });
});

describe('capital to coast chain', () => {
  it('completes full chain in three advances', () => {
    let progress = initializeChainProgress('o10m_chain_capital_to_coast')!;
    const runs = [
      { id: 'o10m_capital_markets_week', day: 10 },
      { id: 'o10m_island_supply_line', day: 14 },
      { id: 'o10m_export_clock', day: 16 },
    ];
    for (const r of runs) {
      const adv = advanceChainAfterRun('o10m_chain_capital_to_coast', progress, {
        baseMode: 'scenario',
        scenarioId: r.id,
        challengeModeIds: [],
        primaryVictory: true,
        altVictoryRuleId: null,
        day: r.day,
        playerMoney: 20000,
        playerNetWorth: 20000,
        regionsControlled: 2,
        maxRegionalStanding: 70,
        rivalNetWorth: 5000,
        optionalObjectivesCompleted: 0,
        totalObjectives: 2,
      });
      assert.equal(adv.advanced, true, r.id);
      progress = adv.progress;
    }
    assert.equal(progress.chainCompleted, true);

    const milestones = evaluateMissionMilestones([
      {
        baseMode: 'scenario',
        scenarioId: 'o10m_export_clock',
        challengeModeIds: [],
        primaryVictory: true,
        altVictoryRuleId: null,
        chainCompleted: true,
        day: 16,
        playerMoney: 15000,
        playerNetWorth: 18000,
        regionsControlled: 2,
        maxRegionalStanding: 65,
        rivalNetWorth: 4000,
        optionalObjectivesCompleted: 0,
        totalObjectives: 2,
      },
    ]);
    assert.equal(milestones.find(m => m.milestoneId === 'o10m_milestone_chain_complete')?.unlocked, true);
  });
});
