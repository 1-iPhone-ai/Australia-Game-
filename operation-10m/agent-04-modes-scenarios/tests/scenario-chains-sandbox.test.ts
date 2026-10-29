import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  O10M_SCENARIO_CHAINS,
  advanceChainAfterRun,
  initializeChainProgress,
  validateChainStepSelection,
  validateSandboxKnobs,
  resolveSandboxKnobValues,
  applySandboxKnobsToForcedSettings,
  resolveModeInteraction,
  computeEffectiveScenarioStartingMoney,
  findO10mScenario,
} from '../src/index.js';

describe('scenario chains', () => {
  it('defines ten multi-step chains with unique ids', () => {
    assert.equal(O10M_SCENARIO_CHAINS.length, 10);
    const ids = O10M_SCENARIO_CHAINS.map(c => c.id);
    assert.equal(new Set(ids).size, 10);
    for (const chain of O10M_SCENARIO_CHAINS) {
      assert.ok(chain.steps.length >= 3);
    }
  });

  it('advances northern corridor after export clock primary win', () => {
    let progress = initializeChainProgress('o10m_chain_northern_corridor')!;
    const run = {
      baseMode: 'scenario' as const,
      scenarioId: 'o10m_export_clock',
      challengeModeIds: [],
      primaryVictory: true,
      altVictoryRuleId: null,
      day: 12,
      playerMoney: 15000,
      playerNetWorth: 15000,
      regionsControlled: 2,
      maxRegionalStanding: 50,
      rivalNetWorth: 5000,
      optionalObjectivesCompleted: 0,
      totalObjectives: 2,
    };
    const result = advanceChainAfterRun('o10m_chain_northern_corridor', progress, run);
    assert.equal(result.advanced, true);
    assert.equal(result.unlockedNextScenarioId, 'o10m_cyclone_corridor');
    progress = result.progress;
    assert.ok(progress.accumulatedCarry.startingMoneyDelta! >= 750);

    const step1Ok = validateChainStepSelection(
      'o10m_chain_northern_corridor',
      progress,
      'o10m_cyclone_corridor',
      1,
    );
    assert.equal(step1Ok.ok, true);
  });

  it('blocks cyclone step until export clock is complete', () => {
    const progress = initializeChainProgress('o10m_chain_northern_corridor')!;
    const locked = validateChainStepSelection(
      'o10m_chain_northern_corridor',
      progress,
      'o10m_cyclone_corridor',
      1,
    );
    assert.equal(locked.ok, false);
  });

  it('requires optional objectives for northern corridor step 1 carry', () => {
    let progress = initializeChainProgress('o10m_chain_northern_corridor')!;
    progress = advanceChainAfterRun('o10m_chain_northern_corridor', progress, {
      baseMode: 'scenario',
      scenarioId: 'o10m_export_clock',
      challengeModeIds: [],
      primaryVictory: true,
      altVictoryRuleId: null,
      day: 10,
      playerMoney: 14000,
      playerNetWorth: 14000,
      regionsControlled: 1,
      maxRegionalStanding: 40,
      rivalNetWorth: 4000,
      optionalObjectivesCompleted: 0,
      totalObjectives: 2,
    }).progress;

    const withoutOptional = advanceChainAfterRun('o10m_chain_northern_corridor', progress, {
      baseMode: 'scenario',
      scenarioId: 'o10m_cyclone_corridor',
      challengeModeIds: [],
      primaryVictory: true,
      altVictoryRuleId: null,
      day: 18,
      playerMoney: 20000,
      playerNetWorth: 22000,
      regionsControlled: 3,
      maxRegionalStanding: 70,
      rivalNetWorth: 8000,
      optionalObjectivesCompleted: 0,
      totalObjectives: 3,
    });
    assert.equal(withoutOptional.advanced, false);
  });
});

describe('sandbox knobs', () => {
  it('rejects out-of-range multipliers', () => {
    const v = validateSandboxKnobs({ economicStartingCashMultiplier: 5 });
    assert.equal(v.ok, false);
  });

  it('merges profile and overrides', () => {
    const resolved = resolveSandboxKnobValues('o10m_sandbox_relaxed', {
      totalDaysMultiplier: 1.5,
    });
    assert.equal(resolved.ok, true);
    assert.equal(resolved.knobs.economicStartingCashMultiplier, 1.25);
    assert.equal(resolved.knobs.totalDaysMultiplier, 1.5);
  });

  it('applies gauntlet profile to forced settings via mode resolver', () => {
    const scenario = findO10mScenario('o10m_export_clock');
    assert.ok(scenario);
    const result = resolveModeInteraction({
      baseMode: 'scenario',
      scenarioId: 'o10m_export_clock',
      challengeModeIds: [],
      scenarioModeEnabled: true,
      sandboxProfileId: 'o10m_sandbox_gauntlet',
    });
    assert.equal(result.ok, true);
    assert.equal(result.forcedSettingsMerge.v93ContractAbundance, 'scarce');
    assert.equal(result.forcedSettingsMerge.v93CrisisIntensity, 'high');
    const baseDays = scenario!.forcedSettings.totalDays as number;
    assert.ok((result.forcedSettingsMerge.totalDays as number) < baseDays);
  });
});

describe('chain + sandbox mode interaction', () => {
  it('merges chain carry, sandbox, and starting money helper', () => {
    const progress = advanceChainAfterRun(
      'o10m_chain_diplomatic_arc',
      initializeChainProgress('o10m_chain_diplomatic_arc')!,
      {
        baseMode: 'grand_tour',
        scenarioId: 'o10m_grand_tour_prologue',
        challengeModeIds: [],
        primaryVictory: true,
        altVictoryRuleId: null,
        day: 8,
        playerMoney: 9000,
        playerNetWorth: 9000,
        regionsControlled: 1,
        maxRegionalStanding: 50,
        rivalNetWorth: 4000,
        optionalObjectivesCompleted: 0,
        totalObjectives: 2,
      },
    ).progress;

    const result = resolveModeInteraction({
      baseMode: 'scenario',
      scenarioId: 'o10m_silent_diplomat',
      challengeModeIds: ['o10m_ironman'],
      scenarioModeEnabled: true,
      chainId: 'o10m_chain_diplomatic_arc',
      chainStepIndex: 1,
      chainProgress: progress,
      sandboxProfileId: 'o10m_sandbox_chain_friendly',
    });
    assert.equal(result.ok, true);
    assert.equal(result.forcedSettingsMerge.o10mChainStartingMoneyBonus, 400);
    assert.ok(result.scenarioStartOverrides?.startingMoneyMultiplier! > 1);

    const scenario = findO10mScenario('o10m_silent_diplomat')!;
    const startMoney = computeEffectiveScenarioStartingMoney(
      scenario.startingMoney,
      result.scenarioStartOverrides,
      result.forcedSettingsMerge.o10mChainStartingMoneyBonus as number,
    );
    assert.ok(startMoney > scenario.startingMoney + 400);
  });
});
