import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_REGIONAL_HOOK_CATALOG,
  OP10M_AGENT05_REGIONAL_HOOK_STATS,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateOp10mNarrativeTick,
  evaluateRegionalNarrativeHooks,
  findRegionalFollowUpChainId,
  getContagionLevel,
  hasArmedBypass,
  listNeighborRegions,
  phaseMeetsWatch,
  sanitizeRegionalContagionLedger,
} from '../src/index.ts';

describe('Regional hook catalog', () => {
  it('defines 120 region×theme hooks at rupture watch phase', () => {
    assert.equal(OP10M_AGENT05_REGIONAL_HOOK_CATALOG.length, 120);
    assert.equal(OP10M_AGENT05_REGIONAL_HOOK_STATS.hookCount, 120);
    assert.equal(new Set(OP10M_AGENT05_REGIONAL_HOOK_CATALOG.map((h) => h.hookId)).size, 120);
  });
});

describe('Regional graph', () => {
  it('lists neighbors for NSW', () => {
    const neighbors = listNeighborRegions('NSW');
    assert.ok(neighbors.includes('VIC'));
    assert.ok(neighbors.includes('ACT'));
  });
});

describe('Deep chain follow-up resolution', () => {
  it('finds v0 follow-up chain in adjacent region', () => {
    const source = OP10M_AGENT05_CHAIN_CATALOG.find(
      (c) => c.region === 'NSW' && c.theme === 'mining'
    )!;
    const targetId = findRegionalFollowUpChainId(OP10M_AGENT05_CHAIN_CATALOG, 'VIC', source.theme);
    assert.ok(targetId?.startsWith('op10m_vic_mining_v0_'));
  });
});

describe('Regional contagion tick', () => {
  it('fires hook when source chain at rupture and mutates neighbor stability', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG.find(
      (c) => c.region === 'NSW' && c.theme === 'water'
    )!;
    const hook = OP10M_AGENT05_REGIONAL_HOOK_CATALOG.find(
      (h) => h.sourceRegion === 'NSW' && h.theme === 'water'
    )!;

    const sim = createDefaultOp10mSimulationSlice({ day: 40 });
    const beforeVic = sim.regionalStability.VIC;
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[chain.chainId] = {
      chainId: chain.chainId,
      phase: 'rupture',
      startedDay: 35,
      lastAdvancedDay: 39,
      stageCooldownUntilDay: 0,
    };

    const result = evaluateRegionalNarrativeHooks(sim, narrative, OP10M_AGENT05_CHAIN_CATALOG, [hook]);
    assert.ok(result.log.some((l) => l.includes('regional hook')));
    assert.ok(result.simulation.regionalStability.VIC <= beforeVic);
    assert.ok(result.narrative.telemetry.regionalHooksFired >= 1);
    assert.ok((result.narrative.regional?.armedFollowUps.length ?? 0) >= 1);
  });

  it('sets contagion flags on targets', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG.find((c) => c.region === 'QLD' && c.theme === 'energy')!;
    const hook = OP10M_AGENT05_REGIONAL_HOOK_CATALOG.find(
      (h) => h.sourceRegion === 'QLD' && h.theme === 'energy'
    )!;
    const sim = createDefaultOp10mSimulationSlice({ day: 22 });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[chain.chainId] = {
      chainId: chain.chainId,
      phase: 'rupture',
      startedDay: 20,
      lastAdvancedDay: 21,
      stageCooldownUntilDay: 0,
    };
    const result = evaluateRegionalNarrativeHooks(sim, narrative, OP10M_AGENT05_CHAIN_CATALOG, [hook]);
    const neighbor = hook.targetRegions[0];
    assert.ok(getContagionLevel(result.simulation, neighbor, hook.theme) >= 1);
  });

  it('integrates with full narrative tick via regionalHooks option', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG[0];
    const hook = OP10M_AGENT05_REGIONAL_HOOK_CATALOG.find(
      (h) => h.sourceRegion === chain.region && h.theme === chain.theme
    )!;
    const sim = createDefaultOp10mSimulationSlice({ day: 15 });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[chain.chainId] = {
      chainId: chain.chainId,
      phase: 'rupture',
      startedDay: 10,
      lastAdvancedDay: 14,
      stageCooldownUntilDay: 0,
    };
    const tick = evaluateOp10mNarrativeTick(sim, narrative, OP10M_AGENT05_CHAIN_CATALOG, {
      regionalHooks: [hook],
    });
    assert.ok(tick.narrative.telemetry.regionalHooksFired >= 1);
  });

  it('armed bypass allows follow-up chain signal entry across seasons', () => {
    const source = OP10M_AGENT05_CHAIN_CATALOG.find(
      (c) => c.region === 'NSW' && c.theme === 'mining'
    )!;
    const targetId = findRegionalFollowUpChainId(OP10M_AGENT05_CHAIN_CATALOG, 'VIC', 'mining')!;
    const hook = OP10M_AGENT05_REGIONAL_HOOK_CATALOG.find(
      (h) => h.sourceRegion === 'NSW' && h.theme === 'mining'
    )!;

    let sim = createDefaultOp10mSimulationSlice({
      day: 30,
      season: 'Spring',
      sectorActivity: { mining: 50 },
    });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[source.chainId] = {
      chainId: source.chainId,
      phase: 'rupture',
      startedDay: 25,
      lastAdvancedDay: 29,
      stageCooldownUntilDay: 0,
    };
    const regional = evaluateRegionalNarrativeHooks(
      sim,
      narrative,
      OP10M_AGENT05_CHAIN_CATALOG,
      [hook]
    );
    sim = regional.simulation;
    narrative = regional.narrative;
    assert.ok(hasArmedBypass(narrative, targetId));

    const target = OP10M_AGENT05_CHAIN_CATALOG.find((c) => c.chainId === targetId)!;
    const tick = evaluateOp10mNarrativeTick(sim, narrative, [target], {
      maxNewResponsesPerTick: 1,
    });
    assert.ok(
      tick.log.some((l) => l.includes('chain entered') || l.includes('response opened')) ||
        Object.keys(tick.narrative.activeChains).includes(targetId)
    );
  });
});

describe('Regional ledger sanitize', () => {
  it('drops invalid armed follow-ups', () => {
    const cleaned = sanitizeRegionalContagionLedger({
      armedFollowUps: [{ id: 'ok', targetChainId: 'x' }],
    });
    assert.deepEqual(cleaned.armedFollowUps, []);
  });

  it('phaseMeetsWatch ranks rupture above pressure', () => {
    assert.equal(phaseMeetsWatch('rupture', 'pressure'), true);
    assert.equal(phaseMeetsWatch('signal', 'rupture'), false);
  });
});
