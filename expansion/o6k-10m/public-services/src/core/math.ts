export function V1014_PUBSVC_clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function V1014_PUBSVC_lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function V1014_PUBSVC_deadband(prev: number, next: number, band: number): number {
  if (Math.abs(next - prev) < band) return prev;
  return next;
}

export function V1014_PUBSVC_weightedMean(pairs: Array<{ weight: number; value: number }>): number {
  let wSum = 0;
  let vSum = 0;
  for (const p of pairs) {
    wSum += p.weight;
    vSum += p.weight * p.value;
  }
  if (wSum <= 0) return 0;
  return vSum / wSum;
}

export function V1014_PUBSVC_deterministicJitter(seed: number, amplitude: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  const frac = x - Math.floor(x);
  return (frac - 0.5) * 2 * amplitude;
}

export function V1014_PUBSVC_bandFromThresholds(
  value: number,
  thresholds: readonly number[],
  labels: readonly string[],
): string {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (value >= thresholds[i]) return labels[i + 1] ?? labels[labels.length - 1];
  }
  return labels[0];
}
