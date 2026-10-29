import { nrDashBuildPeripheralCorridorGap } from './peripheral-corridor-gap.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashHubPeripheralSaturationShare {
  hubRegionId: string | null;
  hubMeanStress: number;
  peripheralMeanStress: number;
  saturationShare: number;
}

/** Peripheral corridor mean stress relative to hub-touching corridor stress. */
export function nrDashBuildHubPeripheralSaturationShare(
  ns: NationalSystemsState | null
): NrDashHubPeripheralSaturationShare | null {
  const gap = nrDashBuildPeripheralCorridorGap(ns);
  if (!gap || gap.hubMeanStress <= 0 || gap.peripheralLinkCount <= 0) return null;
  const peakStress = Math.max(gap.hubMeanStress, gap.peripheralMeanStress);
  if (peakStress <= 0) return null;
  const meanStress = Math.min(gap.hubMeanStress, gap.peripheralMeanStress);
  return {
    hubRegionId: gap.hubRegionId,
    hubMeanStress: gap.hubMeanStress,
    peripheralMeanStress: gap.peripheralMeanStress,
    saturationShare: Math.round((meanStress / peakStress) * 1000) / 1000,
  };
}
