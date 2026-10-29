import { AGENT14_CORE_REGIONS } from './constants.ts';
import type {
  AGENT14_WELLBEING_SCHEMA_VERSION,
  NationalHousingWellbeingSnapshot,
  NationalServiceAccessLens,
  RegionalWellbeingMemoryPersisted,
  RegionalWellbeingMemoryRow,
  RegionalWellbeingMemorySnapshot,
} from './types.ts';

const DEFAULT_EMA_ALPHA = 0.35;

export function createInitialRegionalWellbeingMemory(): RegionalWellbeingMemoryPersisted {
  return {
    schemaVersion: '10.14.10-scale-wave-10' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    affordabilityEma: {},
    accessEma: {},
  };
}

export function sanitizeRegionalWellbeingMemory(
  raw?: RegionalWellbeingMemoryPersisted | null
): RegionalWellbeingMemoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialRegionalWellbeingMemory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  return {
    schemaVersion: '10.14.10-scale-wave-10' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    affordabilityEma:
      raw.affordabilityEma && typeof raw.affordabilityEma === 'object' ? { ...raw.affordabilityEma } : {},
    accessEma: raw.accessEma && typeof raw.accessEma === 'object' ? { ...raw.accessEma } : {},
  };
}

function trend(current: number, previous: number, epsilon = 0.4): 'improving' | 'flat' | 'deteriorating' {
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function emaUpdate(prev: number | undefined, sample: number, alpha: number): number {
  if (prev === undefined) return sample;
  return Math.round((alpha * sample + (1 - alpha) * prev) * 10) / 10;
}

export function advanceRegionalWellbeingMemory(
  turn: number,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens,
  persisted?: RegionalWellbeingMemoryPersisted | null
): { snapshot: RegionalWellbeingMemorySnapshot; persisted: RegionalWellbeingMemoryPersisted } {
  const base = sanitizeRegionalWellbeingMemory(persisted);
  const alpha = base.emaAlpha;
  const regions: Record<string, RegionalWellbeingMemoryRow> = {};
  const affordabilityEma = { ...base.affordabilityEma };
  const accessEma = { ...base.accessEma };

  for (const regionId of AGENT14_CORE_REGIONS) {
    const h = housing.regions[regionId];
    const a = access.regions[regionId];
    const affSample = h?.affordabilityIndex ?? housing.nationalAffordabilityIndex;
    const accessSample = a?.compositeIndex ?? access.nationalComposite;
    const prevAff = affordabilityEma[regionId];
    const prevAccess = accessEma[regionId];
    affordabilityEma[regionId] = emaUpdate(prevAff, affSample, alpha);
    accessEma[regionId] = emaUpdate(prevAccess, accessSample, alpha);
    regions[regionId] = {
      regionId,
      turnsRecorded: (prevAff !== undefined ? 1 : 0) + (base.lastTurn > 0 ? 1 : 0) + turn,
      rollingAffordability: affordabilityEma[regionId]!,
      rollingAccessComposite: accessEma[regionId]!,
      affordabilityTrend: trend(affordabilityEma[regionId]!, prevAff ?? affSample),
      accessTrend: trend(accessEma[regionId]!, prevAccess ?? accessSample),
    };
  }

  return {
    snapshot: { turn, regions },
    persisted: {
      ...base,
      lastTurn: turn,
      affordabilityEma,
      accessEma,
    },
  };
}
