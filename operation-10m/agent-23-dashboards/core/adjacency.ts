/** Land adjacency for strategic map overlays (canonical V9.4 COMM graph). */
export const AGENT23_ADJACENT_REGIONS: Record<string, string[]> = {
  QLD: ['NT', 'NSW', 'SA'],
  NSW: ['QLD', 'VIC', 'SA', 'ACT'],
  VIC: ['NSW', 'SA', 'TAS'],
  TAS: ['VIC'],
  SA: ['WA', 'NT', 'QLD', 'NSW', 'VIC'],
  WA: ['SA', 'NT'],
  NT: ['WA', 'SA', 'QLD'],
  ACT: ['NSW'],
};

export function agent23NormalizeCorridor(a: string, b: string): string {
  return [a, b].sort().join('-');
}

/** Unique undirected adjacency pairs for map link layer. */
export function agent23ListAdjacencyPairs(): Array<{ a: string; b: string; key: string }> {
  const seen = new Set<string>();
  const out: Array<{ a: string; b: string; key: string }> = [];
  Object.entries(AGENT23_ADJACENT_REGIONS).forEach(([a, list]) => {
    (list || []).forEach(b => {
      const key = agent23NormalizeCorridor(a, b);
      if (seen.has(key)) return;
      seen.add(key);
      const [x, y] = [a, b].sort();
      out.push({ a: x, b: y, key });
    });
  });
  return out.sort((p, q) => p.key.localeCompare(q.key));
}
