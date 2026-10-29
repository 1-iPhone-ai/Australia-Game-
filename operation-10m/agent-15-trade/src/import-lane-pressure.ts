import type {
  GTELImportDependencySnapshot,
  GTELLogisticsStress,
  GTELPersisted,
  GTELImportLanePressureSnapshot,
  GTELTradeEnforcementSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELImportLanePressureBand = GTELImportLanePressureSnapshot['band'];

function lanePressureBand(load: number): GTELImportLanePressureBand {
  if (load >= 0.72) return 'gridlocked';
  if (load >= 0.52) return 'congested';
  if (load >= 0.32) return 'busy';
  return 'fluid';
}

export function sanitizeImportLanePressureSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.38), 0.12, 0.88);
}

export function createEmptyImportLanePressureSnapshot(): GTELImportLanePressureSnapshot {
  return {
    load: 0.38,
    band: 'busy',
    clearanceBacklog: 0.12,
    consumerPricePassThrough: 0.06,
    summary: 'Import arrival lanes are busy but clearing within normal windows.',
  };
}

export function advanceImportLanePressureSmoothing(
  persisted: GTELPersisted,
  rawLoad: number,
): GTELPersisted {
  const prev = sanitizeImportLanePressureSmoothing(persisted.importLanePressureSmoothing);
  const next = gtelClamp(prev * 0.71 + gtelClamp(rawLoad, 0.12, 0.88) * 0.29, 0.12, 0.88);
  return { ...persisted, importLanePressureSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeImportLanePressureSnapshot(input: {
  importDependency: GTELImportDependencySnapshot;
  logistics: GTELLogisticsStress;
  tradeEnforcement: GTELTradeEnforcementSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELImportLanePressureSnapshot; persisted: GTELPersisted } {
  const dependencyLoad =
    input.importDependency.band === 'critical'
      ? 0.24
      : input.importDependency.band === 'elevated'
        ? 0.16
        : input.importDependency.band === 'moderate'
          ? 0.08
          : 0.04;
  const logisticsLoad =
    input.logistics.band === 'congested'
      ? 0.22
      : input.logistics.band === 'tight'
        ? 0.14
        : input.logistics.band === 'watch'
          ? 0.06
          : 0.02;
  const enforcementLoad = gtelClamp(input.tradeEnforcement.probeLoad * 0.45 + input.tradeEnforcement.clearanceDelayTurns * 0.04, 0, 0.18);
  const rawLoad = gtelClamp(dependencyLoad + logisticsLoad + enforcementLoad + 0.08, 0.12, 0.88);
  const persisted = advanceImportLanePressureSmoothing(input.persisted, rawLoad);
  const load = sanitizeImportLanePressureSmoothing(persisted.importLanePressureSmoothing);
  const band = lanePressureBand(load);
  const clearanceBacklog = gtelClamp(load * 0.22 + enforcementLoad * 0.15, 0.06, 0.38);
  const consumerPricePassThrough = gtelClamp(
    load * 0.12 + (input.importDependency.band === 'critical' ? 0.06 : 0.02),
    0.02,
    0.22,
  );

  const summary =
    band === 'gridlocked'
      ? 'Import arrival lanes are gridlocked — clearance backlogs are feeding domestic price pressure.'
      : band === 'congested'
        ? 'Port import slots are congested; consumer goods pass-through is elevated.'
        : band === 'fluid'
          ? 'Import lanes are fluid with minimal clearance backlog.'
          : 'Import arrival lanes are busy but clearing within normal windows.';

  return {
    snapshot: {
      load: Math.round(load * 1000) / 1000,
      band,
      clearanceBacklog: Math.round(clearanceBacklog * 1000) / 1000,
      consumerPricePassThrough: Math.round(consumerPricePassThrough * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function importLanePressureDomesticStress(snapshot: GTELImportLanePressureSnapshot): number {
  if (snapshot.band === 'gridlocked') return gtelClamp(snapshot.consumerPricePassThrough * 0.35, 0.04, 0.1);
  if (snapshot.band === 'congested') return gtelClamp(snapshot.consumerPricePassThrough * 0.25, 0.02, 0.07);
  if (snapshot.band === 'busy') return gtelClamp(snapshot.consumerPricePassThrough * 0.12, 0, 0.04);
  return 0;
}

export function importLanePressureExportScale(snapshot: GTELImportLanePressureSnapshot): number {
  if (snapshot.band === 'gridlocked') return gtelClamp(0.9 + (1 - snapshot.load) * 0.06, 0.86, 0.94);
  if (snapshot.band === 'congested') return gtelClamp(0.94 + (1 - snapshot.load) * 0.04, 0.9, 0.98);
  return gtelClamp(0.98 + (1 - snapshot.load) * 0.02, 0.96, 1.01);
}

export function importLanePressureWorldEvent(
  snapshot: GTELImportLanePressureSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'congested' && snapshot.band !== 'gridlocked') return null;
  if (snapshot.load < 0.5) return null;
  return {
    id: `gtel_import_lane_${turn}`,
    turn,
    kind: 'domestic',
    title: 'Import lane congestion',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'SA'],
  };
}

export function importLanePressureGiNotes(
  pressure: GTELImportLanePressureSnapshot | null | undefined,
): string[] {
  if (!pressure) return [];
  return [
    `Import lane pressure: ${pressure.band} (${Math.round(pressure.load * 100)}% load).`,
    pressure.summary,
  ];
}
