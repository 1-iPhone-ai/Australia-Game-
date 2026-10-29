/** Deterministic primitives — no wall-clock in fingerprints. */
export function V1014_REPLAY_fnv1a32(input: string, seed = 0x811c9dc5): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function V1014_REPLAY_stableStringify(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value === 'number' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(V1014_REPLAY_stableStringify).join(',') + ']';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj)
      .filter(k => k !== 'timestamp' && k !== 'createdAtTimestamp' && !k.endsWith('AtMs'))
      .sort();
    return '{' + keys.map(k => JSON.stringify(k) + ':' + V1014_REPLAY_stableStringify(obj[k])).join(',') + '}';
  }
  return JSON.stringify(String(value));
}

export function V1014_REPLAY_fingerprint(label: string, payload: unknown): string {
  const body = V1014_REPLAY_stableStringify(payload);
  const h = V1014_REPLAY_fnv1a32(label + '|' + body);
  return `v1014_replay_${label}_${h.toString(16).padStart(8, '0')}`;
}

export function V1014_REPLAY_clampTurn(n: unknown, fallback = 1): number {
  const v = Number(n);
  if (!Number.isFinite(v) || v < 1) return fallback;
  return Math.floor(v);
}
