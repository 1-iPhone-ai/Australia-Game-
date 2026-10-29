import { op10mA11HashInputs, op10mA11Clamp } from './constants.ts';
import { op10mA11DetectRegionalBottlenecks, op10mA11SummarizeBottlenecks } from './infrastructure-bottlenecks.ts';
import {
  op10mA11BuildIntercityDependencies,
  op10mA11CorridorStressIndex,
  op10mA11SummarizeDependencies,
} from './intercity-dependencies.ts';
import {
  OP10M_A11_CORE_REGIONS,
  OP10M_A11_INFRA_SCHEMA_VERSION,
  type OP10M_A11_InfraDerivedEvent,
  type OP10M_A11_InfraInputs,
  type OP10M_A11_InfraPersisted,
  type OP10M_A11_InfraState,
  type OP10M_A11_RegionId,
} from './types.ts';

export function createEmptyOP10M_A11_InfraPersisted(): OP10M_A11_InfraPersisted {
  return {
    schemaVersion: OP10M_A11_INFRA_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: null,
    lastStressIndex: 0,
    stressedLinkIds: [],
    inputHash: '',
  };
}

export function validateOP10M_A11_InfraState(state: OP10M_A11_InfraState | null): string[] {
  if (!state) return ['null infra state'];
  const errs: string[] = [];
  if (state.schemaVersion !== OP10M_A11_INFRA_SCHEMA_VERSION) errs.push('infra schema mismatch');
  if (state.corridorStressIndex < 0 || state.corridorStressIndex > 100) errs.push('stress out of range');
  for (const b of state.bottlenecks) {
    if (b.bindScore < 0 || b.bindScore > 100) errs.push(`bind score ${b.regionId}`);
  }
  return errs;
}

function pushInfraDerived(
  list: Omit<OP10M_A11_InfraDerivedEvent, 'id'>[],
  turn: number,
  kind: OP10M_A11_InfraDerivedEvent['kind'],
  regionIds: OP10M_A11_RegionId[],
  linkId: string | null,
  text: string,
  significance: OP10M_A11_InfraDerivedEvent['significance'] = 'meaningful',
) {
  if (list.length >= 16) return;
  list.push({ turn, kind, regionIds, linkId, text, significance });
}

export function buildOP10M_A11_InfraInputsFromFixtures(
  partial: Partial<OP10M_A11_InfraInputs> & { turn: number },
): OP10M_A11_InfraInputs {
  return {
    turn: partial.turn,
    links: partial.links ?? [],
    cities: partial.cities ?? [],
    transportNeeds: partial.transportNeeds ?? [],
    regions: partial.regions ?? {},
    networkFreight: partial.networkFreight ?? 50,
    networkDigital: partial.networkDigital ?? 50,
  };
}

export function recomputeOP10M_A11_IntercityInfraLayer(
  inputs: OP10M_A11_InfraInputs,
  persisted: OP10M_A11_InfraPersisted | null,
): {
  state: OP10M_A11_InfraState;
  derived: OP10M_A11_InfraDerivedEvent[];
  persisted: OP10M_A11_InfraPersisted;
} {
  const base = persisted ? { ...persisted, stressedLinkIds: [...persisted.stressedLinkIds] } : createEmptyOP10M_A11_InfraPersisted();
  if (base.initializedTurn === null) base.initializedTurn = inputs.turn;

  const infraByRegion = {} as Partial<Record<OP10M_A11_RegionId, number>>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    infraByRegion[rid] = inputs.regions[rid]?.infrastructureQuality ?? 45;
  }

  const bottlenecks = op10mA11DetectRegionalBottlenecks({
    cities: inputs.cities,
    transportNeeds: inputs.transportNeeds,
    infraByRegion,
  });
  const dependencies = op10mA11BuildIntercityDependencies(
    inputs.links,
    inputs.networkFreight,
    inputs.networkDigital,
  );
  const corridorStressIndex = op10mA11CorridorStressIndex(inputs.links);

  const derivedRaw: Omit<OP10M_A11_InfraDerivedEvent, 'id'>[] = [];
  if (base.revision > 0) {
    for (const b of bottlenecks) {
      if (b.severity === 'critical' || b.severity === 'meaningful') {
        pushInfraDerived(
          derivedRaw,
          inputs.turn,
          'regional_bottleneck_emerged',
          [b.regionId],
          null,
          b.explanation,
          b.severity === 'critical' ? 'major' : 'meaningful',
        );
      }
    }
    if (corridorStressIndex + 4 < base.lastStressIndex) {
      pushInfraDerived(
        derivedRaw,
        inputs.turn,
        'regional_bottleneck_eased',
        OP10M_A11_CORE_REGIONS,
        null,
        'Corridor stress eased vs prior turn.',
        'minor',
      );
    }
  }

  for (const dep of dependencies) {
    if (dep.chokePoint) {
      pushInfraDerived(
        derivedRaw,
        inputs.turn,
        'intercity_chokepoint',
        dep.dependentRegions,
        dep.linkId,
        dep.explanation,
        'major',
      );
    } else if (dep.criticality === 'essential' || dep.criticality === 'high') {
      pushInfraDerived(
        derivedRaw,
        inputs.turn,
        'intercity_dependency_critical',
        dep.dependentRegions,
        dep.linkId,
        dep.explanation,
      );
    }
  }

  const stressedNow = inputs.links.filter((l) => l.utilization >= 75 || l.health === 'degraded').map((l) => l.linkId);
  base.revision += 1;
  base.lastStressIndex = corridorStressIndex;
  base.stressedLinkIds = stressedNow.slice(0, 32);
  base.inputHash = op10mA11HashInputs({
    turn: inputs.turn,
    cityCount: inputs.cities.length,
    regionKeys: Object.keys(inputs.regions).sort().join(','),
    nationalGrowth: `${inputs.links.length}:${inputs.networkFreight}`,
  });

  const state: OP10M_A11_InfraState = {
    schemaVersion: OP10M_A11_INFRA_SCHEMA_VERSION,
    revision: base.revision,
    turn: inputs.turn,
    bottlenecks,
    dependencies,
    corridorStressIndex,
    summary: `${op10mA11SummarizeBottlenecks(bottlenecks)} ${op10mA11SummarizeDependencies(dependencies, corridorStressIndex)}`,
    inputHash: base.inputHash,
  };

  const derived: OP10M_A11_InfraDerivedEvent[] = derivedRaw.map((d, i) => ({
    ...d,
    id: `a11i_${inputs.turn}_${i}_${d.kind}`,
  }));

  return { state, derived, persisted: base };
}

export function op10mA11InfraBindPenalty(state: OP10M_A11_InfraState | null, regionId: OP10M_A11_RegionId): number {
  if (!state) return 0;
  const row = state.bottlenecks.find((b) => b.regionId === regionId);
  if (!row) return 0;
  return op10mA11Clamp(row.bindScore * 0.12, 0, 10);
}
