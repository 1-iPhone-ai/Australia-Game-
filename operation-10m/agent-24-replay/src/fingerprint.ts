/** Replay-safe fingerprint primitives (shared by causal/timeline modules). */

export function o6kAgent24Fnv1a32(input: string, seed = 0x811c9dc5): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

export function o6kAgent24StableStringify(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value === 'number' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(o6kAgent24StableStringify).join(',') + ']';
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj)
      .filter(k => k !== 'createdAtTimestamp' && k !== 'timestamp' && !k.endsWith('AtMs'))
      .sort();
    return '{' + keys.map(k => JSON.stringify(k) + ':' + o6kAgent24StableStringify(obj[k])).join(',') + '}';
  }
  return JSON.stringify(String(value));
}

export function o6kAgent24Fingerprint(label: string, payload: unknown): string {
  const body = o6kAgent24StableStringify(payload);
  const h = o6kAgent24Fnv1a32(label + '|' + body);
  return `o6k24_${label}_${h.toString(16).padStart(8, '0')}`;
}
