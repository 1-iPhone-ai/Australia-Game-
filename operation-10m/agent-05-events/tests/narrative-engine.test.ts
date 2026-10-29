import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  OP10M_AGENT05_CHAIN_CATALOG,
  OP10M_AGENT05_CATALOG_STATS,
  createDefaultOp10mNarrativeEngineState,
  createDefaultOp10mSimulationSlice,
  evaluateOp10mNarrativeTick,
  evaluateRequirements,
  isCooldownReady,
  recordCooldown,
  resolveOp10mNarrativeResponse,
  runOp10mNarrativeSelfTests,
  sanitizeOp10mNarrativeEngineState,
} from '../src/index.ts';

describe('Agent 05 catalog integrity', () => {
  it('has 14920 chains across forty-six tranches', () => {
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche1Chains, 600);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche2Chains, 240);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche3Chains, 360);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche4Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche5Chains, 280);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche6Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche7Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche8Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche9Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche10Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche11Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche12Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche13Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche14Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche15Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche16Chains, 320);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.tranche17Chains, 320);
    assert.equal(OP10M_AGENT05_CHAIN_CATALOG.length, 14920);
    assert.equal(new Set(OP10M_AGENT05_CHAIN_CATALOG.map((c) => c.chainId)).size, 14920);
    assert.equal(OP10M_AGENT05_CATALOG_STATS.regions, 8);
  });

  it('each chain defines four phases', () => {
    for (const chain of OP10M_AGENT05_CHAIN_CATALOG.slice(0, 20)) {
      assert.equal(chain.phases.length, 4);
    }
  });
});

describe('Cooldown registry', () => {
  it('blocks refire until cooldown elapses', () => {
    const narrative = createDefaultOp10mNarrativeEngineState();
    const withCd = {
      ...narrative,
      cooldowns: recordCooldown(narrative, 'chain:signal', 10, 4),
    };
    assert.equal(isCooldownReady(withCd.cooldowns, 'chain:signal', 12), false);
    assert.equal(isCooldownReady(withCd.cooldowns, 'chain:signal', 14), true);
  });
});

describe('State-triggered tick + resolve', () => {
  it('opens a pending response when gates pass', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG[0];
    const signal = chain.phases.find((p) => p.phase === 'signal')!;
    const sectorReq = signal.requires.find((r) => r.k === 'sector');
    const sector = sectorReq && sectorReq.k === 'sector' ? sectorReq.sector : 'mining';

    const sim = createDefaultOp10mSimulationSlice({
      day: 20,
      season: 'Winter',
      sectorActivity: { [sector]: 50 },
    });
    let narrative = createDefaultOp10mNarrativeEngineState();
    const tick = evaluateOp10mNarrativeTick(sim, narrative, [chain], { maxNewResponsesPerTick: 1 });
    narrative = tick.narrative;
    assert.ok(tick.log.some((l) => l.includes('chain entered') || l.includes('response opened')));
    assert.ok(narrative.pendingResponses.length >= 1 || Object.keys(narrative.activeChains).includes(chain.chainId));
  });

  it('mutates simulation money/stability on resolve', () => {
    const chain = OP10M_AGENT05_CHAIN_CATALOG[1];
    const sim0 = createDefaultOp10mSimulationSlice({ day: 30, money: 20000 });
    let narrative = createDefaultOp10mNarrativeEngineState();
    narrative.activeChains[chain.chainId] = {
      chainId: chain.chainId,
      phase: 'recovery',
      startedDay: 25,
      lastAdvancedDay: 29,
      stageCooldownUntilDay: 0,
    };
    narrative.pendingResponses.push({
      id: 'resolve_me',
      chainId: chain.chainId,
      stagePhase: 'recovery',
      regionId: chain.region,
      choiceIds: ['commit', 'defer'],
      openedDay: 30,
      expiresDay: 33,
      snapshot: {
        day: 30,
        money: sim0.money,
        nationalStability: sim0.nationalStability,
        activeCrisisCount: 1,
      },
    });

    const beforeMoney = sim0.money;
    const resolved = resolveOp10mNarrativeResponse(sim0, narrative, OP10M_AGENT05_CHAIN_CATALOG, 'resolve_me', 'commit');
    assert.equal(resolved.error, null);
    assert.ok(resolved.simulation.money !== beforeMoney || resolved.simulation.nationalStability !== sim0.nationalStability);
    assert.ok(resolved.narrative.resolvedChainIds.includes(chain.chainId));
    assert.ok(resolved.simulation.flags[chain.exitFlag]);
  });

  it('sanitize recovers from malformed persisted state', () => {
    const cleaned = sanitizeOp10mNarrativeEngineState({ activeChains: { x: { phase: 'nope' } } });
    assert.equal(cleaned.version, 1);
    assert.deepEqual(cleaned.activeChains, {});
  });
});

describe('Trigger engine', () => {
  it('evaluates season and stability gates', () => {
    const sim = createDefaultOp10mSimulationSlice({ day: 5, season: 'Winter', nationalStability: 40 });
    const result = evaluateRequirements(
      [{ k: 'season', seasons: ['Winter'] }, { k: 'stability', max: 50 }],
      sim,
      null
    );
    assert.equal(result.ok, true);
  });
});

describe('Self-test harness', () => {
  it('passes bundled self tests', () => {
    const report = runOp10mNarrativeSelfTests(OP10M_AGENT05_CHAIN_CATALOG);
    assert.equal(report.failures.length, 0, report.failures.join('; '));
    assert.equal(report.passed, report.total);
  });
});
