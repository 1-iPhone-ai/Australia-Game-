import type { V1014EnergyDepthInputs } from '../types';
import { V1014_ENERGY_DEPTH_clamp } from '../primitives';

/** Cross-wire SECTION 20U — corridor spare capacity improves reserve absorption. */
export function V1014_ENERGY_DEPTH_adaptInfrastructureSpare(
  infrastructure: V1014EnergyDepthInputs['infrastructure'],
): number {
  const nets = infrastructure?.networks ?? {};
  const energy = nets.energy?.spareCapacity ?? 0.35;
  const trade = nets.trade?.spareCapacity ?? 0.2;
  return V1014_ENERGY_DEPTH_clamp(energy * 0.7 + trade * 0.15, 0, 1);
}

export function V1014_ENERGY_DEPTH_infraHeadroomPenalty(
  infrastructure: V1014EnergyDepthInputs['infrastructure'],
): number {
  const util = infrastructure?.networks?.energy?.utilization ?? 0.6;
  return V1014_ENERGY_DEPTH_clamp((util - 0.55) * 12, 0, 8);
}
