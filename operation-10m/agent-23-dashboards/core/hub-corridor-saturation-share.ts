import { nrDashBuildHubCorridorLoad } from './hub-corridor-load.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashHubCorridorSaturationShare {
  hubRegionId: string | null;
  touchingLinkCount: number;
  meanLinkStress: number;
  peakLinkStress: number;
  saturationShare: number;
}

/** Mean hub-touching link stress relative to the peak stressed hub corridor. */
export function nrDashBuildHubCorridorSaturationShare(
  ns: NationalSystemsState | null
): NrDashHubCorridorSaturationShare | null {
  const load = nrDashBuildHubCorridorLoad(ns);
  if (!load || load.touchingLinkCount <= 0 || load.peakLinkStress <= 0) return null;
  return {
    hubRegionId: load.hubRegionId,
    touchingLinkCount: load.touchingLinkCount,
    meanLinkStress: load.meanLinkStress,
    peakLinkStress: load.peakLinkStress,
    saturationShare: Math.round((load.meanLinkStress / load.peakLinkStress) * 1000) / 1000,
  };
}
