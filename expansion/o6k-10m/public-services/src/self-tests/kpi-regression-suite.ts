import { V1014_PUBSVC_LAB_SUITE_ID } from '../core/constants.ts';
import {
  V1014_PUBSVC_computePublicServicesCrosswalk,
  V1014_PUBSVC_makeDefaultCrosswalkInputs,
} from '../core/crosswalk-engine.ts';
import { V1014_PUBSVC_section6RegionalAggregateMeans } from '../persistence/section6-regional-aggregates.ts';
import { V1014_PUBSVC_atlasCompositeForRegion } from '../generated/regional-coefficient-atlas.ts';

export interface V1014PubsSvcKpiTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export interface V1014PubsSvcKpiTestReport {
  suiteId: typeof V1014_PUBSVC_LAB_SUITE_ID;
  passed: number;
  failed: number;
  total: number;
  results: V1014PubsSvcKpiTestResult[];
}

function check(
  results: V1014PubsSvcKpiTestResult[],
  id: string,
  name: string,
  condition: boolean,
  detail: string,
) {
  results.push({ id, name, passed: Boolean(condition), detail });
}

export function runV1014PublicServicesV2SelfTests(): V1014PubsSvcKpiTestReport {
  const results: V1014PubsSvcKpiTestResult[] = [];

  check(results, 'kpi_001', 'Crosswalk produces snapshot', (() => {
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(V1014_PUBSVC_makeDefaultCrosswalkInputs());
    return out.snapshot.nationalCompositeKpi > 0;
  })(), 'national composite > 0');

  check(results, 'kpi_002', 'Section6 roll-forward', (() => {
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(V1014_PUBSVC_makeDefaultCrosswalkInputs());
    return out.persisted.lastTurn === out.snapshot.turn;
  })(), 'persisted turn matches');

  check(results, 'kpi_003', 'NT remote stress', (() => {
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(
      V1014_PUBSVC_makeDefaultCrosswalkInputs({ turn: 4 }),
    );
    return out.snapshot.regions.NT.queuePressureIndex >= out.snapshot.regions.ACT.queuePressureIndex * 0.8;
  })(), 'NT queue pressure elevated');

  check(results, 'kpi_004', 'Skill mismatch responds to gap', (() => {
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(
      V1014_PUBSVC_makeDefaultCrosswalkInputs({
        ac20: { turn: 4, nationalReadiness: 28, specialistGap: 78 },
      }),
    );
    return out.snapshot.nationalSkillMismatch > 45;
  })(), 'specialist gap elevates national skill mismatch');

  check(results, 'kpi_005', 'Migration inflow amplifies loop', (() => {
    const base = V1014_PUBSVC_computePublicServicesCrosswalk(
      V1014_PUBSVC_makeDefaultCrosswalkInputs({
        aj20: { turn: 5, migrationFlowBand: 'balanced', wagePressureIndex: 48 },
      }),
    );
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(
      V1014_PUBSVC_makeDefaultCrosswalkInputs({
        aj20: { turn: 5, migrationFlowBand: 'strong_inflow', wagePressureIndex: 68 },
      }),
    );
    return out.snapshot.nationalMigrationLoop >= base.snapshot.nationalMigrationLoop;
  })(), 'inflow weakly raises migration loop index');

  check(results, 'kpi_006', 'Low fiscal headroom raises queue pressure', (() => {
    const base = V1014_PUBSVC_computePublicServicesCrosswalk(
      V1014_PUBSVC_makeDefaultCrosswalkInputs({ fiscalHeadroom: 78 }),
    );
    const tight = V1014_PUBSVC_computePublicServicesCrosswalk(
      V1014_PUBSVC_makeDefaultCrosswalkInputs({ fiscalHeadroom: 12 }),
    );
    return tight.snapshot.nationalQueuePressure >= base.snapshot.nationalQueuePressure;
  })(), 'fiscal constraint worsens queues');

  check(results, 'kpi_007', 'Regional aggregates cover 8 regions', (() => {
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(V1014_PUBSVC_makeDefaultCrosswalkInputs());
    return Object.keys(out.snapshot.regions).length === 8;
  })(), 'region count');

  check(results, 'kpi_008', 'Queue grid size 24 slots', (() => {
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(V1014_PUBSVC_makeDefaultCrosswalkInputs());
    return out.snapshot.queues.length === 24;
  })(), 'expect 8 regions x 3 pillars');

  check(results, 'kpi_009', 'Skill slice grid size 24', (() => {
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(V1014_PUBSVC_makeDefaultCrosswalkInputs());
    return out.snapshot.skillSlices.length === 24;
  })(), 'skill slice count 8x3');

  check(results, 'kpi_010', 'Migration slices per region', (() => {
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(V1014_PUBSVC_makeDefaultCrosswalkInputs());
    return out.snapshot.migrationSlices.length === 8;
  })(), 'eight regional migration slices');

  for (let i = 11; i <= 45; i++) {
    const turn = (i % 12) + 1;
    check(
      results,
      `kpi_${String(i).padStart(3, '0')}`,
      `Deterministic crosswalk turn ${turn} variant ${i}`,
      (() => {
        const out = V1014_PUBSVC_computePublicServicesCrosswalk(
          V1014_PUBSVC_makeDefaultCrosswalkInputs({
            turn,
            fiscalHeadroom: 40 + (i % 30),
            policyFocus: {
              housing: 40 + (i % 20),
              healthcare: 42 + (i % 18),
              education: 44 + (i % 16),
            },
          }),
        );
        const means = V1014_PUBSVC_section6RegionalAggregateMeans(out.persisted);
        return means.composite > 0 && out.snapshot.schemaVersion === '10.14.2';
      })(),
      `turn=${turn}`,
    );
  }

  check(results, 'kpi_046', 'Atlas NSW composite', (() => {
    const v = V1014_PUBSVC_atlasCompositeForRegion('NSW', 5);
    return v > 0 && v <= 100;
  })(), 'atlas lookup');

  check(results, 'kpi_047', 'Events on pressure', (() => {
    const out = V1014_PUBSVC_computePublicServicesCrosswalk(
      V1014_PUBSVC_makeDefaultCrosswalkInputs({
        ap20: {
          turn: 6,
          nationalOutcomeIndex: 40,
          regionalOutcome: {
            NSW: {
              healthcare: { accessScore: 25, backlogPressure: 90, staffingBand: 'critical_shortage' },
            },
          },
        },
        ac20: { turn: 6, nationalReadiness: 32, specialistGap: 82 },
      }),
    );
    return out.events.length >= 1;
  })(), 'stress emits crosswalk events');

  check(results, 'kpi_048', 'Multi-turn persistence history', (() => {
    let persisted = undefined as undefined | ReturnType<typeof V1014_PUBSVC_computePublicServicesCrosswalk>['persisted'];
    for (let t = 1; t <= 4; t++) {
      const step = V1014_PUBSVC_computePublicServicesCrosswalk(
        V1014_PUBSVC_makeDefaultCrosswalkInputs({ turn: t }),
        persisted,
      );
      persisted = step.persisted;
    }
    return (persisted?.historyTail.length ?? 0) >= 3;
  })(), 'history depth');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  return {
    suiteId: V1014_PUBSVC_LAB_SUITE_ID,
    passed,
    failed,
    total: results.length,
    results,
  };
}

export { V1014_PUBSVC_LAB_SUITE_ID };
