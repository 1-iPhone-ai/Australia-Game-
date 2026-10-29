import type { AuRegionCode } from '../types.ts';

export interface TransportPipelineStage {
  id: string;
  label: string;
  regionId: AuRegionCode;
  requiredFunding: number;
  productivityUnlock: number;
  logisticsRelief: number;
}

export const TRANSPORT_INVESTMENT_PIPELINE: TransportPipelineStage[] = [
  {
    id: 'pipe_nsw_botany_rail',
    label: 'Port Botany Rail Duplication',
    regionId: 'NSW',
    requiredFunding: 120_000,
    productivityUnlock: 4.5,
    logisticsRelief: 0.025,
  },
  {
    id: 'pipe_vic_inland_port_shuttle',
    label: 'Melbourne Port Rail Shuttle Expansion',
    regionId: 'VIC',
    requiredFunding: 95_000,
    productivityUnlock: 3.8,
    logisticsRelief: 0.022,
  },
  {
    id: 'pipe_qld_inland_rail_stage',
    label: 'Inland Rail Stage Completion',
    regionId: 'QLD',
    requiredFunding: 200_000,
    productivityUnlock: 6.2,
    logisticsRelief: 0.035,
  },
  {
    id: 'pipe_wa_hedland_road',
    label: 'Pilbara Last-Mile Road Hardening',
    regionId: 'WA',
    requiredFunding: 80_000,
    productivityUnlock: 3.2,
    logisticsRelief: 0.02,
  },
  {
    id: 'pipe_sa_gillman_upgrade',
    label: 'Gillman Intermodal Upgrade',
    regionId: 'SA',
    requiredFunding: 65_000,
    productivityUnlock: 2.8,
    logisticsRelief: 0.018,
  },
];

export function computePipelineUnlocks(
  fundedStageIds: ReadonlySet<string> | undefined,
): { productivityPoints: number; logisticsRelief: number; activeStageIds: string[] } {
  if (!fundedStageIds || fundedStageIds.size === 0) {
    return { productivityPoints: 0, logisticsRelief: 0, activeStageIds: [] };
  }
  let productivityPoints = 0;
  let logisticsRelief = 0;
  const activeStageIds: string[] = [];
  for (const stage of TRANSPORT_INVESTMENT_PIPELINE) {
    if (!fundedStageIds.has(stage.id)) continue;
    activeStageIds.push(stage.id);
    productivityPoints += stage.productivityUnlock;
    logisticsRelief += stage.logisticsRelief;
  }
  return {
    productivityPoints,
    logisticsRelief: Math.min(0.12, logisticsRelief),
    activeStageIds,
  };
}
