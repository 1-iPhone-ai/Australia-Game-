import type { Op10mChainDescriptor, Op10mContentTheme, Op10mNarrativeEngineState, Op10mRegionId } from './types.ts';

/** Pick the canonical v0 follow-up chain for a region/theme (matches generated catalog ids). */
export function findRegionalFollowUpChainId(
  catalog: Op10mChainDescriptor[],
  targetRegion: Op10mRegionId,
  theme: Op10mContentTheme
): string | null {
  const needle = `op10m_${targetRegion.toLowerCase()}_${theme}_v0_`;
  const match = catalog.find((c) => c.chainId.startsWith(needle));
  return match?.chainId ?? null;
}

export function findChainDescriptor(
  catalog: Op10mChainDescriptor[],
  chainId: string
): Op10mChainDescriptor | undefined {
  return catalog.find((c) => c.chainId === chainId);
}

export function hasArmedBypass(narrative: Op10mNarrativeEngineState, chainId: string): boolean {
  return (narrative.regional?.armedBypassChainIds ?? []).includes(chainId);
}

export function activeChainsInRegion(
  catalog: Op10mChainDescriptor[],
  activeChainIds: string[],
  region: Op10mRegionId
): Op10mChainDescriptor[] {
  const set = new Set(activeChainIds);
  return catalog.filter((c) => c.region === region && set.has(c.chainId));
}
