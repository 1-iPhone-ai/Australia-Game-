/**
 * Agent 21 — isolation primitives for forecast / policy lab work.
 * Counterfactual and policy experiments MUST run on deep copies; authoritative snapshots stay read-only.
 */

export type Ag21UncertaintyBand = 'low' | 'moderate' | 'high' | 'speculative';

export interface Ag21ForecastProvenance {
  authoritative: false;
  label: 'projection' | 'policy_experiment' | 'stress_scenario' | 'counterfactual_fork';
  sourceSystems: string[];
  isolatedCopyVerified: boolean;
  fingerprintBefore: string;
  fingerprintAfter: string;
  disclaimer: string;
}

export interface Ag21UncertaintyLabel {
  band: Ag21UncertaintyBand;
  headline: string;
  factors: string[];
  playerFacing: string;
}

const AG21_UNCERTAINTY_COPY: Record<Ag21UncertaintyBand, { headline: string; disclaimer: string }> = {
  low: { headline: 'Low uncertainty', disclaimer: 'Grounded in observable canonical state with a single forward path.' },
  moderate: { headline: 'Moderate uncertainty', disclaimer: 'Uses partial observability or stable heuristics; treat as directional.' },
  high: { headline: 'High uncertainty', disclaimer: 'Multiple branches or weak signals; ranges are illustrative only.' },
  speculative: { headline: 'Speculative', disclaimer: 'Hypothesis-only; not calibrated to live mechanics and must not drive auto-actions.' }
};

export function ag21LabelUncertainty(band: Ag21UncertaintyBand, factors: string[] = []): Ag21UncertaintyLabel {
  const base = AG21_UNCERTAINTY_COPY[band];
  const factorLine = factors.length ? ` Drivers: ${factors.slice(0, 4).join('; ')}.` : '';
  return {
    band,
    headline: base.headline,
    factors: factors.slice(0, 8),
    playerFacing: `${base.disclaimer}${factorLine} (Non-authoritative forecast.)`
  };
}

/** Matches canonical `fnv1aHashString` in V9.4 for fingerprint parity after assembly. */
export function ag21Fnv1aHashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

export function ag21FingerprintSnapshot(value: unknown): string {
  try {
    return ag21Fnv1aHashString(JSON.stringify(value));
  } catch {
    return ag21Fnv1aHashString(String(value));
  }
}

function ag21DeepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      /* fall through */
    }
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export function ag21VerifyIsolatedExperiment<T>(
  subject: T,
  mutateCopy: (copy: T) => unknown
): { ok: boolean; before: string; after: string; result: unknown } {
  const before = ag21FingerprintSnapshot(subject);
  const copy = ag21DeepClone(subject);
  const result = mutateCopy(copy);
  const after = ag21FingerprintSnapshot(subject);
  return { ok: before === after, before, after, result };
}

export function ag21Provenance(
  before: string,
  after: string,
  label: Ag21ForecastProvenance['label'],
  systems: string[]
): Ag21ForecastProvenance {
  return {
    authoritative: false,
    label,
    sourceSystems: systems,
    isolatedCopyVerified: before === after,
    fingerprintBefore: before,
    fingerprintAfter: after,
    disclaimer: 'This output is a non-authoritative projection. Canonical match state is unchanged.'
  };
}

export const O10M_AGENT21_MODULE_VERSION = '2.0.0';
export const O10M_AGENT21_MODULE_ID = 'forecasting_policy_lab';
