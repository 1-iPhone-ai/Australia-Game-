import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CATALOG_STATS,
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3,
  OP10M_CROSS_SYSTEM_SYNERGIES,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  crossSystemCouplingFlagKey,
  evaluateCrossSystemCouplings,
  evaluateOp10mNarrativeTick,
  evaluateRequirements,
  getCrossSystemCouplingLevel,
  hasPeerChainAtPhase,
} from '../src/index.ts';

const moduleRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

describe('Tranche 3 cross-system catalog', () => {
  it('adds 360 synergy chains', () => {
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3.length, 360);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.totalChains, 3720);
  });

  it('uses unique op10m_t3 ids', () => {
    const ids = new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId));
    assert.equal(ids.size, 3720);
    for (const c of OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3) {
      assert.match(c.chainId, /^op10m_t3_/);
    }
  });

  it('pressure stage requires cross-system coupling flag', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3.find((c) =>
      c.chainId.includes('mining_water')
    )!;
    const pressure = chain.phases.find((p) => p.phase === 'pressure')!;
    const runtime = {
      chainId: chain.chainId,
      phase: 'pressure' as const,
      startedDay: 30,
      lastAdvancedDay: 35,
      stageCooldownUntilDay: 0,
    };
    const sim = createDefaultOp10mSimulationSlice({ day: 40, activeCrisisCount: 2 });
    assert.equal(evaluateRequirements(pressure.requires, sim, runtime).ok, false);
    sim.flags[crossSystemCouplingFlagKey(chain.region, 'mining_water')] = 2;
    assert.equal(evaluateRequirements(pressure.requires, sim, runtime).ok, true);
  });
});

describe('Cross-system orchestrator', () => {
  it('raises coupling when primary rupture and secondary pressure co-exist', () => {
    const synergy = OP10M_CROSS_SYSTEM_SYNERGIES[0];
    const primary = OP10M_AGENT05_CHAIN_CATALOG.find(
      (c) => c.region === 'NSW' && c.theme === synergy.primaryTheme
    )!;
    const secondary = OP10M_AGENT05_CHAIN_CATALOG.find(
      (c) => c.region === 'NSW' && c.theme === synergy.secondaryTheme && c !== primary
    )!;

    let sim = createDefaultOp10mSimulationSlice({ day: 50 });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[primary.chainId] = {
      chainId: primary.chainId,
      phase: 'rupture',
      startedDay: 40,
      lastAdvancedDay: 49,
      stageCooldownUntilDay: 0,
    };
    narrative.activeChains[secondary.chainId] = {
      chainId: secondary.chainId,
      phase: 'pressure',
      startedDay: 42,
      lastAdvancedDay: 49,
      stageCooldownUntilDay: 0,
    };

    const out = evaluateCrossSystemCouplings(sim, narrative, OP10M_AGENT05_CHAIN_CATALOG);
    assert.ok(out.log.some((l) => l.includes('cross-system')));
    assert.ok(
      getCrossSystemCouplingLevel(out.simulation, 'NSW', synergy.synergyId) >= 1
    );
    assert.ok(out.narrative.telemetry.crossSystemCouplings >= 1);
  });

  it('peer_chain_phase trigger respects active runtime', () => {
    const catalog = OP10M_AGENT05_CHAIN_CATALOG;
    const peer = catalog.find((c) => c.region === 'VIC' && c.theme === 'trade')!;
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[peer.chainId] = {
      chainId: peer.chainId,
      phase: 'pressure',
      startedDay: 10,
      lastAdvancedDay: 15,
      stageCooldownUntilDay: 0,
    };
    assert.equal(
      hasPeerChainAtPhase(narrative, catalog, 'VIC', 'trade', 'pressure'),
      true
    );
    assert.equal(
      hasPeerChainAtPhase(narrative, catalog, 'VIC', 'trade', 'rupture'),
      false
    );
  });

  it('runs during narrative tick by default', () => {
    const synergy = OP10M_CROSS_SYSTEM_SYNERGIES.find((s) => s.synergyId === 'energy_trade')!;
    const primary = OP10M_AGENT05_CHAIN_CATALOG.find(
      (c) => c.region === 'QLD' && c.theme === synergy.primaryTheme
    )!;
    const secondary = OP10M_AGENT05_CHAIN_CATALOG.find(
      (c) => c.region === 'QLD' && c.theme === synergy.secondaryTheme && c.chainId !== primary.chainId
    )!;
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[primary.chainId] = {
      chainId: primary.chainId,
      phase: 'rupture',
      startedDay: 5,
      lastAdvancedDay: 9,
      stageCooldownUntilDay: 0,
    };
    narrative.activeChains[secondary.chainId] = {
      chainId: secondary.chainId,
      phase: 'pressure',
      startedDay: 6,
      lastAdvancedDay: 9,
      stageCooldownUntilDay: 0,
    };
    const tick = evaluateOp10mNarrativeTick(
      createDefaultOp10mSimulationSlice({ day: 10 }),
      narrative,
      OP10M_AGENT05_CHAIN_CATALOG,
      { crossSystemCouplings: true }
    );
    assert.ok(tick.narrative.telemetry.crossSystemCouplings >= 1);
  });
});

describe('Assembly manifest', () => {
  it('matches chunk line count after bundle', () => {
    const manifest = JSON.parse(
      readFileSync(resolve(moduleRoot, 'module.manifest.json'), 'utf8')
    ) as { chainCount: number; chunkLineCount: number; contentSha256: string };
    assert.equal(manifest.chainCount, 3720);
    assert.ok(manifest.chunkLineCount > 195000);
    assert.match(manifest.contentSha256, /^[a-f0-9]{64}$/);
  });
});
