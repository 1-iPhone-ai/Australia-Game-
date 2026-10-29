import type {
  O10mSandboxKnobDefinition,
  O10mSandboxKnobKey,
  O10mSandboxKnobProfile,
  O10mScenarioStartOverrides,
} from './types.js';

export const O10M_SANDBOX_KNOB_DEFINITIONS: O10mSandboxKnobDefinition[] = [
  {
    key: 'economicStartingCashMultiplier',
    label: 'Starting cash multiplier',
    description: 'Scales scenario starting money after chain bonuses.',
    min: 0.5,
    max: 2,
    defaultValue: 1,
  },
  {
    key: 'totalDaysMultiplier',
    label: 'Day limit multiplier',
    description: 'Scales scenario totalDays in forced settings.',
    min: 0.5,
    max: 2,
    defaultValue: 1,
  },
  {
    key: 'rivalFairnessDelta',
    label: 'Rival fairness delta',
    description: 'Added to aiFairnessLevel (clamped 0.7–0.98).',
    min: -0.1,
    max: 0.1,
    defaultValue: 0,
  },
  {
    key: 'contractAbundanceOverride',
    label: 'Contract abundance',
    description: 'Overrides v93ContractAbundance when set.',
    allowedStringValues: ['scarce', 'normal', 'abundant'],
    defaultValue: 'normal',
  },
  {
    key: 'crisisIntensityOverride',
    label: 'Crisis intensity',
    description: 'Overrides v93CrisisIntensity when set.',
    allowedStringValues: ['low', 'normal', 'high'],
    defaultValue: 'normal',
  },
  {
    key: 'deterministicSeedOffset',
    label: 'Deterministic seed offset',
    description: 'Added to scenario forcedSeed/world seeds for lab replays.',
    min: -9999,
    max: 9999,
    defaultValue: 0,
  },
];

const DEF_BY_KEY = new Map(O10M_SANDBOX_KNOB_DEFINITIONS.map(d => [d.key, d]));

export const O10M_SANDBOX_KNOB_PROFILES: O10mSandboxKnobProfile[] = [
  {
    id: 'o10m_sandbox_relaxed',
    title: 'Relaxed Economy',
    description: 'More starting cash and longer day limits for learning a scenario.',
    knobs: {
      economicStartingCashMultiplier: 1.25,
      totalDaysMultiplier: 1.2,
      rivalFairnessDelta: -0.04,
      contractAbundanceOverride: 'abundant',
      crisisIntensityOverride: 'low',
    },
  },
  {
    id: 'o10m_sandbox_gauntlet',
    title: 'Gauntlet',
    description: 'Tighter economy, shorter days, hotter rival pressure.',
    knobs: {
      economicStartingCashMultiplier: 0.85,
      totalDaysMultiplier: 0.85,
      rivalFairnessDelta: 0.05,
      contractAbundanceOverride: 'scarce',
      crisisIntensityOverride: 'high',
    },
  },
  {
    id: 'o10m_sandbox_lab_deterministic',
    title: 'Deterministic Lab',
    description: 'Fixed seed offset for regression replays without changing scenario ids.',
    knobs: {
      deterministicSeedOffset: 9001,
      economicStartingCashMultiplier: 1,
      totalDaysMultiplier: 1,
    },
  },
  {
    id: 'o10m_sandbox_chain_friendly',
    title: 'Chain Friendly',
    description: 'Mild boosts intended for multi-step chain progression tests.',
    knobs: {
      economicStartingCashMultiplier: 1.1,
      totalDaysMultiplier: 1.1,
      rivalFairnessDelta: -0.02,
      crisisIntensityOverride: 'normal',
    },
  },
];

const PROFILE_BY_ID = new Map(O10M_SANDBOX_KNOB_PROFILES.map(p => [p.id, p]));

export function getSandboxKnobProfile(id: string): O10mSandboxKnobProfile | undefined {
  return PROFILE_BY_ID.get(id);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function validateSandboxKnobs(
  knobs: Partial<Record<O10mSandboxKnobKey, number | string>>,
): { ok: boolean; errors: string[]; normalized: Partial<Record<O10mSandboxKnobKey, number | string>> } {
  const errors: string[] = [];
  const normalized: Partial<Record<O10mSandboxKnobKey, number | string>> = {};

  for (const [rawKey, rawValue] of Object.entries(knobs)) {
    const key = rawKey as O10mSandboxKnobKey;
    const def = DEF_BY_KEY.get(key);
    if (!def) {
      errors.push(`Unknown sandbox knob: ${rawKey}`);
      continue;
    }
    if (def.allowedStringValues) {
      if (typeof rawValue !== 'string' || !def.allowedStringValues.includes(rawValue)) {
        errors.push(`${key} must be one of ${def.allowedStringValues.join(', ')}`);
        continue;
      }
      normalized[key] = rawValue;
      continue;
    }
    const num = typeof rawValue === 'number' ? rawValue : Number(rawValue);
    if (Number.isNaN(num)) {
      errors.push(`${key} must be numeric`);
      continue;
    }
    if (def.min != null && def.max != null) {
      if (num < def.min || num > def.max) {
        errors.push(`${key} must be between ${def.min} and ${def.max}`);
        continue;
      }
      normalized[key] = num;
    } else {
      normalized[key] = num;
    }
  }

  return { ok: errors.length === 0, errors, normalized };
}

export function resolveSandboxKnobValues(
  profileId?: string | null,
  overrides?: Partial<Record<O10mSandboxKnobKey, number | string>>,
): { ok: boolean; errors: string[]; knobs: Partial<Record<O10mSandboxKnobKey, number | string>> } {
  const profile = profileId ? getSandboxKnobProfile(profileId) : undefined;
  if (profileId && !profile) {
    return { ok: false, errors: [`Unknown sandbox profile: ${profileId}`], knobs: {} };
  }
  const merged = { ...(profile?.knobs || {}), ...(overrides || {}) };
  const validated = validateSandboxKnobs(merged);
  return { ok: validated.ok, errors: validated.errors, knobs: validated.normalized };
}

export function applySandboxKnobsToForcedSettings(
  forcedSettings: Record<string, unknown>,
  knobs: Partial<Record<O10mSandboxKnobKey, number | string>>,
): Record<string, unknown> {
  const out = { ...forcedSettings };
  const dayMult = Number(knobs.totalDaysMultiplier ?? 1);
  if (typeof out.totalDays === 'number') {
    out.totalDays = Math.max(5, Math.round(out.totalDays * dayMult));
  } else if (dayMult !== 1) {
    out.totalDays = Math.max(5, Math.round(30 * dayMult));
  }

  const fairnessBase = typeof out.aiFairnessLevel === 'number' ? out.aiFairnessLevel : 0.88;
  const fairness = fairnessBase + Number(knobs.rivalFairnessDelta ?? 0);
  out.aiFairnessLevel = clamp(fairness, 0.7, 0.98);

  if (knobs.contractAbundanceOverride) {
    out.v93ContractAbundance = knobs.contractAbundanceOverride;
  }
  if (knobs.crisisIntensityOverride) {
    out.v93CrisisIntensity = knobs.crisisIntensityOverride;
  }

  const seedOffset = Number(knobs.deterministicSeedOffset ?? 0);
  if (seedOffset !== 0) {
    for (const key of ['forcedSeed', 'worldRngSeed', 'aiDeterministicSeed'] as const) {
      if (typeof out[key] === 'number') {
        out[key] = (out[key] as number) + seedOffset;
      }
    }
    out.o10mSandboxSeedOffset = seedOffset;
  }

  out.o10mSandboxKnobsApplied = { ...knobs };
  return out;
}

export function applySandboxKnobsToScenarioStart(
  overrides: O10mScenarioStartOverrides,
  knobs: Partial<Record<O10mSandboxKnobKey, number | string>>,
): O10mScenarioStartOverrides {
  const mult = Number(knobs.economicStartingCashMultiplier ?? 1);
  return {
    ...overrides,
    startingMoneyMultiplier: (overrides.startingMoneyMultiplier ?? 1) * mult,
  };
}

export function listSandboxKnobProfileIds(): string[] {
  return O10M_SANDBOX_KNOB_PROFILES.map(p => p.id);
}
