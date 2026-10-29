import type {
  V1014EnergyDepthInputs,
  V1014EnergyDepthPersisted,
  V1014EnergyDepthRegionId,
  V1014EnergyDepthState,
} from './types';
import { V1014_ENERGY_DEPTH_REGIONS, V1014_ENERGY_DEPTH_SCHEMA_VERSION } from './types';
import {
  V1014_ENERGY_DEPTH_applyHysteresisGrid,
  V1014_ENERGY_DEPTH_inputHash,
  V1014_ENERGY_DEPTH_modifierFromBands,
} from './primitives';
import {
  V1014_ENERGY_DEPTH_extractionPressureFromIndustrial,
  V1014_ENERGY_DEPTH_renewableBoostFromIndustrial,
} from './adapters/adapter-20al';
import { V1014_ENERGY_DEPTH_adaptCrisisTriggers } from './adapters/adapter-20as';
import {
  V1014_ENERGY_DEPTH_adaptInfrastructureSpare,
} from './adapters/adapter-20u';
import { V1014_ENERGY_DEPTH_intermittencyReservePenalty } from './engine-renewable-intermittency';
import { V1014_ENERGY_DEPTH_applyContingencyOverlay } from './engine-contingency';
import { V1014_ENERGY_DEPTH_adaptSystemicRiskEnergyExposure } from './adapters/adapter-20y';
import {
  V1014_ENERGY_DEPTH_aggregateNationalGridBand,
  V1014_ENERGY_DEPTH_computeRegionalGridBalance,
} from './engine-grid-stability';
import {
  V1014_ENERGY_DEPTH_depletionEvidence,
  V1014_ENERGY_DEPTH_tickExtractionDepletion,
} from './engine-extraction-depletion';
import { V1014_ENERGY_DEPTH_computeIntermittency } from './engine-renewable-intermittency';
import {
  V1014_ENERGY_DEPTH_regionalEmissionIncrement,
  V1014_ENERGY_DEPTH_rollForwardCarbon,
} from './engine-carbon-budgets';
import { V1014_ENERGY_DEPTH_persistSlice, sanitizeV1014EnergyDepthPersisted } from './persistence';

export function buildV1014EnergyDepthInputs(params: {
  turn: number;
  enabled: boolean;
  hourBucket?: number;
  gameState: Record<string, unknown>;
  industrialEnergyState?: V1014EnergyDepthInputs['industrialEnergy'];
  industriesState?: V1014EnergyDepthInputs['industries'];
  infrastructureState?: V1014EnergyDepthInputs['infrastructure'];
  systemicRiskState?: V1014EnergyDepthInputs['systemicRisk'];
}): V1014EnergyDepthInputs {
  const gs = params.gameState || {};
  const crisesRaw = (gs.crisisChainState as { activeCrises?: unknown })?.activeCrises ?? gs.activeCrises ?? [];
  const crises = (Array.isArray(crisesRaw) ? crisesRaw : Object.values(crisesRaw as object)).filter(Boolean).map(
    (c: Record<string, unknown>) => ({
      id: String(c.id || c.crisisId || 'crisis'),
      category: String(c.category || ''),
      status: String(c.status || 'active'),
      affectedRegions: Array.isArray(c.affectedRegions) ? (c.affectedRegions as string[]) : [],
    }),
  );
  return {
    turn: params.turn,
    enabled: params.enabled,
    hourBucket: params.hourBucket ?? params.turn % 24,
    industrialEnergy: params.industrialEnergyState ?? null,
    industries: params.industriesState ?? null,
    infrastructure: params.infrastructureState ?? null,
    systemicRisk: params.systemicRiskState ?? null,
    activeCrises: crises,
  };
}

export function computeV1014EnergyDepthState(
  inputs: V1014EnergyDepthInputs,
  rawPersisted?: V1014EnergyDepthPersisted | null,
  prev?: V1014EnergyDepthState | null,
): { state: V1014EnergyDepthState; persisted: V1014EnergyDepthPersisted } {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  let persisted = sanitizeV1014EnergyDepthPersisted(rawPersisted, inputs.turn);
  const hash = V1014_ENERGY_DEPTH_inputHash(inputs);

  if (!inputs.enabled) {
    const emptyRegions = {} as V1014EnergyDepthState['regions'];
    for (const rid of V1014_ENERGY_DEPTH_REGIONS) {
      emptyRegions[rid] = {
        regionId: rid,
        gridBand: 'comfortable',
        reserveMarginPct: 15,
        loadMw: 0,
        generationMw: 0,
        intermittencyBand: 'stable',
        depletionBand: 'pristine',
        carbonBand: 'within_budget',
        cumulativeEmissionsMt: 0,
        extractionPressure: 0,
        renewableShare: 0,
        modifierEnergy: 0,
        modifierMining: 0,
        evidence: ['disabled'],
      };
    }
    return {
      state: {
        schemaVersion: V1014_ENERGY_DEPTH_SCHEMA_VERSION,
        revision: (prev?.revision ?? 0) + 1,
        turn: inputs.turn,
        enabled: false,
        nationalGridBand: 'comfortable',
        nationalCarbonBand: 'within_budget',
        regions: emptyRegions,
        inputHash: hash,
        computeMs: 0,
        crisisHints: [],
      },
      persisted,
    };
  }

  const infraSpare = V1014_ENERGY_DEPTH_adaptInfrastructureSpare(inputs.infrastructure);
  const renewBoost = V1014_ENERGY_DEPTH_renewableBoostFromIndustrial(inputs.industrialEnergy);
  const regions = {} as V1014EnergyDepthState['regions'];
  let cumulativeBySite = { ...persisted.cumulativeExtractionBySite };
  const regionalEmissions: Partial<Record<V1014EnergyDepthRegionId, number>> = {};

  for (const rid of V1014_ENERGY_DEPTH_REGIONS) {
    const grid = V1014_ENERGY_DEPTH_computeRegionalGridBalance(
      rid,
      inputs.hourBucket,
      renewBoost,
      infraSpare,
    );
    const intermittency = V1014_ENERGY_DEPTH_computeIntermittency(rid, inputs.hourBucket, grid.renewableShare);
    const reservePenalty = V1014_ENERGY_DEPTH_intermittencyReservePenalty(intermittency.band);
    const extractionPressure = V1014_ENERGY_DEPTH_extractionPressureFromIndustrial(rid, inputs.industrialEnergy);
    const depletion = V1014_ENERGY_DEPTH_tickExtractionDepletion(rid, extractionPressure, cumulativeBySite, 1);
    cumulativeBySite = depletion.cumulativeBySite;
    const marginAdj = V1014_ENERGY_DEPTH_applyContingencyOverlay(
      rid,
      grid.reserveMarginPct - reservePenalty,
      'heat',
    );
    const gridBand = V1014_ENERGY_DEPTH_applyHysteresisGrid(
      persisted.gridHysteresis?.[rid],
      marginAdj >= 14 ? 'comfortable' : marginAdj >= 6 ? 'strained' : marginAdj >= 1 ? 'critical' : 'blackout_risk',
    );
    persisted.gridHysteresis = { ...persisted.gridHysteresis, [rid]: gridBand };
    regionalEmissions[rid] = V1014_ENERGY_DEPTH_regionalEmissionIncrement(
      rid,
      grid.loadMw,
      depletion.pressure,
      grid.renewableShare,
    );
    const mods = V1014_ENERGY_DEPTH_modifierFromBands(
      gridBand,
      persisted.cumulativeEmissionsMt > 0 ? 'within_budget' : 'within_budget',
      depletion.band,
    );
    regions[rid] = {
      regionId: rid,
      gridBand,
      reserveMarginPct: marginAdj,
      loadMw: grid.loadMw,
      generationMw: grid.generationMw,
      intermittencyBand: intermittency.band,
      depletionBand: depletion.band,
      carbonBand: 'within_budget',
      cumulativeEmissionsMt: regionalEmissions[rid] ?? 0,
      extractionPressure: depletion.pressure,
      renewableShare: grid.renewableShare,
      modifierEnergy: mods.energy,
      modifierMining: mods.mining,
      evidence: [
        ...V1014_ENERGY_DEPTH_depletionEvidence(depletion.band, rid),
        `intermittency:${intermittency.band}`,
        `infra_spare:${infraSpare.toFixed(2)}`,
      ],
    };
  }

  const carbonNational = V1014_ENERGY_DEPTH_rollForwardCarbon(
    persisted.carbonPathwayId,
    persisted.cumulativeEmissionsMt,
    regionalEmissions,
    1,
  );
  persisted.cumulativeEmissionsMt = carbonNational.cumulativeMt;
  persisted.cumulativeExtractionBySite = cumulativeBySite;
  for (const rid of V1014_ENERGY_DEPTH_REGIONS) {
    regions[rid].carbonBand = carbonNational.band;
    regions[rid].cumulativeEmissionsMt = carbonNational.cumulativeMt;
  }

  const nationalGridBand = V1014_ENERGY_DEPTH_aggregateNationalGridBand(regions);
  const _exposure = V1014_ENERGY_DEPTH_adaptSystemicRiskEnergyExposure(inputs.systemicRisk, nationalGridBand);
  void _exposure;

  const crisisHints = V1014_ENERGY_DEPTH_adaptCrisisTriggers(
    regions,
    nationalGridBand,
    carbonNational.band,
    inputs.activeCrises,
  );

  persisted = V1014_ENERGY_DEPTH_persistSlice(persisted, inputs.turn, hash, nationalGridBand);

  const t1 = typeof performance !== 'undefined' ? performance.now() : 0;
  return {
    state: {
      schemaVersion: V1014_ENERGY_DEPTH_SCHEMA_VERSION,
      revision: persisted.revision,
      turn: inputs.turn,
      enabled: true,
      nationalGridBand,
      nationalCarbonBand: carbonNational.band,
      regions,
      inputHash: hash,
      computeMs: Math.round((t1 - t0) * 100) / 100,
      crisisHints,
    },
    persisted,
  };
}

export function V1014_ENERGY_DEPTH_turnHook(params: {
  inputs: V1014EnergyDepthInputs;
  persisted: V1014EnergyDepthPersisted | null;
  prevState: V1014EnergyDepthState | null;
}): { state: V1014EnergyDepthState; persisted: V1014EnergyDepthPersisted } {
  return computeV1014EnergyDepthState(params.inputs, params.persisted, params.prevState);
}
