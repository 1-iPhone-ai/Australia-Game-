import {
  OP10M_A11_LIMITS,
  OP10M_A11_THRESHOLDS,
  op10mA11HashInputs,
  op10mA11InequalityBand,
  op10mA11InequalityIndex,
} from './constants.ts';
import {
  op10mA11LeadingLaggingFlags,
  op10mA11RelativeStanding,
  op10mA11SummarizeInequality,
} from './regional-inequality.ts';
import {
  OP10M_A11_CORE_REGIONS,
  OP10M_A11_SCHEMA_VERSION,
  type OP10M_A11_DerivedEvent,
  type OP10M_A11_Inputs,
  type OP10M_A11_Persisted,
  type OP10M_A11_RegionId,
  type OP10M_A11_State,
} from './types.ts';
import {
  op10mA11AggregateUrbanGrowthByRegion,
  op10mA11BlendRegionalUrbanScore,
  op10mA11MetroRegionalGap,
} from './urban-growth-dynamics.ts';
import {
  op10mA11BuildRegionInequalityRow,
  op10mA11NationalLocalCoupling,
} from './urban-national-links.ts';

export function createEmptyOP10M_A11_Persisted(): OP10M_A11_Persisted {
  return {
    schemaVersion: OP10M_A11_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: null,
    lastInequalityIndex: 0,
    lastInequalityBand: 'balanced',
    history: [],
    inputHash: '',
  };
}

export function validateOP10M_A11_State(state: OP10M_A11_State | null): string[] {
  if (!state) return ['null state'];
  const errs: string[] = [];
  if (state.schemaVersion !== OP10M_A11_SCHEMA_VERSION) errs.push('schema mismatch');
  if (state.inequalityIndex < 0 || state.inequalityIndex > OP10M_A11_LIMITS.inequalityIndexCap) {
    errs.push('inequality index out of range');
  }
  for (const rid of OP10M_A11_CORE_REGIONS) {
    if (!state.regions[rid]) errs.push(`missing region row ${rid}`);
  }
  return errs;
}

function pushDerived(
  list: Omit<OP10M_A11_DerivedEvent, 'id'>[],
  turn: number,
  kind: OP10M_A11_DerivedEvent['kind'],
  regionIds: OP10M_A11_RegionId[],
  text: string,
  significance: OP10M_A11_DerivedEvent['significance'] = 'meaningful',
) {
  if (list.length >= OP10M_A11_LIMITS.derivedPerTurn) return;
  list.push({ turn, kind, regionIds, text, significance });
}

export function recomputeOP10M_A11_RegionalUrbanLayer(
  inputs: OP10M_A11_Inputs,
  persisted: OP10M_A11_Persisted | null,
): {
  state: OP10M_A11_State;
  derived: OP10M_A11_DerivedEvent[];
  persisted: OP10M_A11_Persisted;
} {
  const base = persisted
    ? {
        ...persisted,
        history: [...persisted.history],
      }
    : createEmptyOP10M_A11_Persisted();

  if (base.initializedTurn === null) base.initializedTurn = inputs.turn;

  const urbanByRegion = op10mA11AggregateUrbanGrowthByRegion(inputs.cities);
  const rawScores = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    rawScores[rid] = op10mA11BlendRegionalUrbanScore(urbanByRegion[rid], inputs.regions[rid]);
  }

  const relative = op10mA11RelativeStanding(rawScores);
  const flags = op10mA11LeadingLaggingFlags(relative);
  const scoreList = OP10M_A11_CORE_REGIONS.map((r) => rawScores[r]);
  const inequalityIndex = op10mA11InequalityIndex(scoreList);
  const inequalityBand = op10mA11InequalityBand(inequalityIndex);
  const metroGap = op10mA11MetroRegionalGap(urbanByRegion);
  const coupling = op10mA11NationalLocalCoupling(inputs.national);

  const regions = {} as OP10M_A11_State['regions'];
  for (const rid of OP10M_A11_CORE_REGIONS) {
    regions[rid] = op10mA11BuildRegionInequalityRow({
      regionId: rid,
      urbanIndex: rawScores[rid],
      relativeStanding: relative[rid],
      coupling,
      national: inputs.national,
      leading: flags[rid].leading,
      lagging: flags[rid].lagging,
    });
  }

  const derivedRaw: Omit<OP10M_A11_DerivedEvent, 'id'>[] = [];
  const delta = inequalityIndex - base.lastInequalityIndex;
  if (base.revision > 0) {
    if (delta >= OP10M_A11_THRESHOLDS.widenDelta) {
      pushDerived(
        derivedRaw,
        inputs.turn,
        'inequality_widened',
        OP10M_A11_CORE_REGIONS.filter((r) => flags[r].lagging),
        `Regional inequality widened to ${inequalityBand}.`,
        inequalityBand === 'polarized' ? 'major' : 'meaningful',
      );
    } else if (delta <= -OP10M_A11_THRESHOLDS.widenDelta) {
      pushDerived(
        derivedRaw,
        inputs.turn,
        'inequality_narrowed',
        OP10M_A11_CORE_REGIONS.filter((r) => flags[r].leading),
        `Regional inequality narrowed toward ${inequalityBand}.`,
      );
    }
  }

  if (metroGap >= OP10M_A11_THRESHOLDS.metroGapMeaningful) {
    pushDerived(
      derivedRaw,
      inputs.turn,
      'metro_regional_divergence',
      OP10M_A11_CORE_REGIONS,
      `Metro–regional growth divergence elevated (gap ${metroGap.toFixed(1)}).`,
    );
  }

  if (coupling >= OP10M_A11_THRESHOLDS.spilloverConnected) {
    pushDerived(
      derivedRaw,
      inputs.turn,
      'national_spillover_boost',
      OP10M_A11_CORE_REGIONS.filter((r) => flags[r].lagging),
      'National corridor/network strength is transmitting growth spillovers to lagging regions.',
    );
  } else if (coupling < OP10M_A11_THRESHOLDS.spilloverWeak) {
    pushDerived(
      derivedRaw,
      inputs.turn,
      'national_spillover_drag',
      OP10M_A11_CORE_REGIONS,
      'Weak national–local coupling is isolating regions from aggregate momentum.',
      'minor',
    );
  }

  for (const rid of OP10M_A11_CORE_REGIONS) {
    if (!flags[rid].lagging) continue;
    if (regions[rid].urbanGrowthIndex - rawScores[rid] >= OP10M_A11_THRESHOLDS.catchUpDelta) {
      pushDerived(
        derivedRaw,
        inputs.turn,
        'lagging_region_catch_up',
        [rid],
        `${rid} received catch-up spillover from national–local links.`,
      );
    }
  }

  base.revision += 1;
  base.lastInequalityIndex = inequalityIndex;
  base.lastInequalityBand = inequalityBand;
  base.history.push({ turn: inputs.turn, inequalityIndex, band: inequalityBand });
  if (base.history.length > OP10M_A11_LIMITS.history) base.history.shift();
  base.inputHash = op10mA11HashInputs({
    turn: inputs.turn,
    cityCount: inputs.cities.length,
    regionKeys: Object.keys(inputs.regions).sort().join(','),
    nationalGrowth: inputs.national.nationalGrowthBand,
  });

  const leading = OP10M_A11_CORE_REGIONS.filter((r) => flags[r].leading);
  const lagging = OP10M_A11_CORE_REGIONS.filter((r) => flags[r].lagging);

  const state: OP10M_A11_State = {
    schemaVersion: OP10M_A11_SCHEMA_VERSION,
    revision: base.revision,
    turn: inputs.turn,
    inequalityIndex,
    inequalityBand,
    metroRegionalGap: metroGap,
    nationalLocalCoupling: coupling,
    regions,
    summary: op10mA11SummarizeInequality({
      inequalityIndex,
      inequalityBand,
      metroGap,
      leading,
      lagging,
    }),
    inputHash: base.inputHash,
  };

  const derived: OP10M_A11_DerivedEvent[] = derivedRaw.map((d, i) => ({
    ...d,
    id: `a11_${inputs.turn}_${i}_${d.kind}`,
  }));

  return { state, derived, persisted: base };
}

export function buildOP10M_A11_InputsFromFixtures(
  partial: Partial<OP10M_A11_Inputs> & { turn: number },
): OP10M_A11_Inputs {
  return {
    turn: partial.turn,
    cities: partial.cities ?? [],
    regions: partial.regions ?? {},
    national: {
      turn: partial.turn,
      nationalGrowthBand: partial.national?.nationalGrowthBand ?? 'steady',
      distributionBand: partial.national?.distributionBand ?? 'mixed',
      networkFreight: partial.national?.networkFreight ?? 50,
      networkDigital: partial.national?.networkDigital ?? 50,
      capitalCityBias: partial.national?.capitalCityBias ?? 12,
    },
  };
}
