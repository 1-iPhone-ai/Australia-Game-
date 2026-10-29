import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_TRANCHE2_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE1,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2,
  contagionFlagKey,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateOp10mNarrativeTick,
  evaluateRequirements,
  evaluateRegionalNarrativeHooks,
  OP10M_AGENT05_REGIONAL_HOOK_CATALOG,
} from '../src/index.ts';

describe('Tranche 2 catalog', () => {
  it('adds 240 deterministic archetype chains', () => {
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE2_STATS.chainCount, 240);
    assert.equal(OP10M_AGENT05_CATALOG_TRANCHE2_STATS.archetypes, 6);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2.length, 240);
  });

  it('does not overlap tranche 1 ids', () => {
    const t1 = new Set(OP10M_AGENT05_CHAIN_CATALOG_TRANCHE1.map((c) => c.chainId));
    for (const chain of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2) {
      assert.match(chain.chainId, /^op10m_t2_/);
      assert.equal(t1.has(chain.chainId), false);
    }
  });

  it('pressure stage requires regional contagion flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2.find(
      (c) => c.region === 'SA' && c.chainId.includes('supply_shock')
    )!;
    const pressure = chain.phases.find((p) => p.phase === 'pressure')!;
    const simLow = createDefaultOp10mSimulationSlice({ day: 40 });
    const runtime = {
      chainId: chain.chainId,
      phase: 'pressure' as const,
      startedDay: 30,
      lastAdvancedDay: 39,
      stageCooldownUntilDay: 0,
    };
    assert.equal(
      evaluateRequirements(pressure.requires, simLow, runtime).ok,
      false
    );
    simLow.flags[contagionFlagKey('SA', chain.theme)] = 2;
    assert.equal(
      evaluateRequirements(pressure.requires, simLow, runtime).ok,
      true
    );
  });

  it('rupture stage enforces money and stability ceilings', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2.find((c) =>
      c.chainId.includes('credit_tightening')
    )!;
    const rupture = chain.phases.find((p) => p.phase === 'rupture')!;
    const runtime = {
      chainId: chain.chainId,
      phase: 'rupture' as const,
      startedDay: 20,
      lastAdvancedDay: 25,
      stageCooldownUntilDay: 0,
    };
    const broke = createDefaultOp10mSimulationSlice({ day: 30, money: 500, nationalStability: 40 });
    assert.equal(evaluateRequirements(rupture.requires, broke, runtime).ok, false);
    const ok = createDefaultOp10mSimulationSlice({ day: 30, money: 20000, nationalStability: 40 });
    assert.equal(evaluateRequirements(rupture.requires, ok, runtime).ok, true);
  });

  it('enters tranche2 signal when season and sector gates pass', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2[0];
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sectorReq = signal.requires.find((r) => r.k === 'sector');
    const sector = sectorReq && sectorReq.k === 'sector' ? sectorReq.sector : 'trade';
    const sim = createDefaultOp10mSimulationSlice({
      day: 25,
      season: 'Winter',
      sectorActivity: { [sector]: 40 },
    });
    const tick = evaluateOp10mNarrativeTick(sim, createDefaultOp10mNarrativeEngineState(), [chain], {
      maxNewResponsesPerTick: 1,
    });
    assert.ok(
      tick.log.some((l) => l.includes('chain entered') || l.includes('response opened')) ||
        tick.narrative.activeChains[chain.chainId]
    );
  });

  it('combines with regional hooks using full merged catalog', () => {
    const t1 = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE1[0];
    const hook = OP10M_AGENT05_REGIONAL_HOOK_CATALOG.find(
      (h) => h.sourceRegion === t1.region && h.theme === t1.theme
    )!;
    const sim = createDefaultOp10mSimulationSlice({ day: 30, season: 'Winter' });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[t1.chainId] = {
      chainId: t1.chainId,
      phase: 'rupture',
      startedDay: 22,
      lastAdvancedDay: 29,
      stageCooldownUntilDay: 0,
    };
    const out = evaluateRegionalNarrativeHooks(
      sim,
      narrative,
      OP10M_AGENT05_CHAIN_CATALOG,
      [hook]
    );
    assert.ok(out.narrative.telemetry.regionalHooksFired >= 1);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 9800);
  });
});
