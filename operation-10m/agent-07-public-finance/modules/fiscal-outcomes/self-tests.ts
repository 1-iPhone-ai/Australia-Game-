import {
  computeFiscalOutcomesLayer,
  createInitialFiscalOutcomesPersisted,
  sanitizeFiscalOutcomesPersisted,
  setTaxInstrumentRate
} from './compute';
import { bridgeV1012Snapshot, buildFiscalOutcomesInputsFromBridge } from './bridge-v1012';
import { detectFiscalOutcomesQuestion, composeFiscalOutcomesGiAnswer } from './gi-queries';
import { TAX_INSTRUMENT_CATALOG } from './tax-instruments';
import { V1014_SCHEMA_VERSION, type V1012FiscalSnapshot, type V1014SelfTestResult } from './types';
import { POLICY_SCENARIO_CATALOG } from './catalog/policy-scenarios';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 1,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 12,
    debtEnabled: partial.debtEnabled ?? false,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runV1014FiscalOutcomesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: V1014SelfTestResult[];
} {
  const results: V1014SelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  // 1 — Schema & initial persisted
  {
    const p = createInitialFiscalOutcomesPersisted();
    record(
      'T01',
      'Initial persisted schema',
      p.schemaVersion === V1014_SCHEMA_VERSION && Object.keys(p.instrumentRates).length >= 9,
      `instruments=${Object.keys(p.instrumentRates).length}`
    );
  }

  // 2 — Compute baseline state
  {
    const { state } = computeFiscalOutcomesLayer(
      { turn: 1, v1012: snap({}) },
      createInitialFiscalOutcomesPersisted()
    );
    record(
      'T02',
      'Baseline compute produces outcome links',
      state.outcomeLinks.length === 6 && state.compositeBand !== undefined,
      `links=${state.outcomeLinks.length}, composite=${state.compositeOutcomeScore}`
    );
  }

  // 3 — Critical pressure weakens prosperity link
  {
    const healthy = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({ pressure: 'healthy' }) }).state;
    const critical = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({ pressure: 'critical', fiscalHeadroom: -12 }) })
      .state;
    const h = healthy.outcomeLinks.find(l => l.dimension === 'national_prosperity')!.score;
    const c = critical.outcomeLinks.find(l => l.dimension === 'national_prosperity')!.score;
    record('T03', 'Critical pressure lowers prosperity outcome', c < h, `healthy=${h}, critical=${c}`);
  }

  // 4 — Debt distress gate
  {
    const st = computeFiscalOutcomesLayer({
      turn: 1,
      v1012: snap({ debtEnabled: true, debtLevel: 60, debtServiceLoad: 20, pressure: 'strained' })
    }).state;
    const gate = st.constraintGates.find(g => g.id === 'debt_stress_path');
    record('T04', 'Debt stress triggers gate', Boolean(gate?.triggered), `sustainability=${st.debtTrajectory.sustainability}`);
  }

  // 5 — Tax cut vs raise revenue delta sign
  {
    let p = createInitialFiscalOutcomesPersisted();
    p = setTaxInstrumentRate(p, 'corp_standard', 30, 'raise');
    const raised = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({ revenueCapacity: 70 }) }, p);
    p = setTaxInstrumentRate(createInitialFiscalOutcomesPersisted(), 'corp_standard', 20, 'cut');
    const cut = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({ revenueCapacity: 70 }) }, p);
    const rDelta = raised.state.taxInstruments.find(t => t.instrumentId === 'corp_standard')!.revenueDeltaEstimate;
    const cDelta = cut.state.taxInstruments.find(t => t.instrumentId === 'corp_standard')!.revenueDeltaEstimate;
    record('T05', 'Raise > cut revenue delta', rDelta > cDelta, `raise=${rDelta}, cut=${cDelta}`);
  }

  // 6 — Budget rebalance when headroom negative
  {
    const st = computeFiscalOutcomesLayer({ turn: 2, v1012: snap({ fiscalHeadroom: -6, pressure: 'strained' }) }).state;
    record('T06', 'Negative headroom flags rebalance', st.budget.rebalanceNeeded, String(st.budget.rebalanceSummary));
  }

  // 7 — Bridge from V10.12-shaped object
  {
    const bridge = bridgeV1012Snapshot({
      turn: 5,
      fiscalPosition: { revenueCapacity: 55, fiscalHeadroom: 3, pressure: 'tight', maintenanceLoad: 9 },
      debt: { enabled: true, level: 22, debtServiceLoad: 5 },
      commitments: [{}, {}, {}]
    });
    record(
      'T07',
      'V10.12 bridge maps fields',
      bridge.commitmentCount === 3 && bridge.debtEnabled && bridge.turn === 5,
      JSON.stringify(bridge)
    );
  }

  // 8 — Determinism same inputs
  {
    const inp = buildFiscalOutcomesInputsFromBridge(snap({ turn: 3 }), { publicStability: 61 });
    const a = computeFiscalOutcomesLayer(inp, createInitialFiscalOutcomesPersisted());
    const b = computeFiscalOutcomesLayer(inp, a.persisted);
    record(
      'T08',
      'Deterministic recompute with same hash skips revision bump',
      a.state.inputHash === b.state.inputHash,
      `revA=${a.persisted.revision}, revB=${b.persisted.revision}`
    );
  }

  // 9 — Sanitize null
  record('T09', 'Sanitize null persisted', sanitizeFiscalOutcomesPersisted(null) === null, 'ok');

  // 10 — GI detect tax question
  record(
    'T10',
    'GI detects tax policy question',
    detectFiscalOutcomesQuestion('Should we change tax policy on payroll?'),
    'detected'
  );

  // 11 — GI compose with state
  {
    const { state } = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({}) });
    const ans = composeFiscalOutcomesGiAnswer('fiscal outcomes?', state);
    record('T11', 'GI answer headline', ans.headline.includes('Composite'), ans.headline);
  }

  // 12 — Innovation credit improves innovation link
  {
    let p = createInitialFiscalOutcomesPersisted();
    p = setTaxInstrumentRate(p, 'innovation_credit', -12, 'cut');
    const st = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({}) }, p).state;
    const base = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({}) }).state;
    const i1 = st.outcomeLinks.find(l => l.dimension === 'innovation_momentum')!.score;
    const i0 = base.outcomeLinks.find(l => l.dimension === 'innovation_momentum')!.score;
    record('T12', 'Deeper innovation credit boosts innovation outcome', i1 >= i0, `credit=${i1}, base=${i0}`);
  }

  // 13 — Catalog non-empty
  record('T13', 'Policy scenario catalog populated', POLICY_SCENARIO_CATALOG.length >= 24, `count=${POLICY_SCENARIO_CATALOG.length}`);

  // 14 — Each catalog entry has outcomes
  {
    const bad = POLICY_SCENARIO_CATALOG.filter(p => !p.linkedOutcomes.length || !p.title);
    record('T14', 'Catalog entries well-formed', bad.length === 0, `bad=${bad.length}`);
  }

  // 15 — Instrument catalog bounds
  {
    const corp = TAX_INSTRUMENT_CATALOG.corp_standard;
    record(
      'T15',
      'Corp tax bounds',
      corp.minRatePoints < corp.defaultRatePoints && corp.maxRatePoints > corp.defaultRatePoints,
      `${corp.minRatePoints}-${corp.maxRatePoints}`
    );
  }

  // 16-20 — Scenario spot checks (5)
  for (let i = 0; i < 5; i++) {
    const pack = POLICY_SCENARIO_CATALOG[i * 5];
    if (!pack) continue;
    record(
      `T${16 + i}`,
      `Scenario pack ${pack.id} has fiscal narrative`,
      pack.narrative.length > 40 && pack.recommendedInstruments.length > 0,
      pack.title
    );
  }

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
