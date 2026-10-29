import type { FleetCapacitySnapshot, TransportAsset } from '../types.ts';
import { assetFreightCapacityIndex } from './formulas.ts';

export function computeFleetCapacitySnapshot(operationalAssets: TransportAsset[]): FleetCapacitySnapshot {
  let roadIndex = 0;
  let railIndex = 0;
  let portIndex = 0;
  let logisticsIndex = 0;

  for (const asset of operationalAssets) {
    const idx = assetFreightCapacityIndex(asset);
    switch (asset.category) {
      case 'road':
        roadIndex += idx;
        break;
      case 'rail':
        railIndex += idx;
        break;
      case 'port':
        portIndex += idx;
        break;
      case 'logistics':
        logisticsIndex += idx;
        break;
    }
  }

  const nationalComposite = (roadIndex + railIndex + portIndex + logisticsIndex) / Math.max(1, operationalAssets.length);

  return {
    roadIndex: Math.round(roadIndex * 10) / 10,
    railIndex: Math.round(railIndex * 10) / 10,
    portIndex: Math.round(portIndex * 10) / 10,
    logisticsIndex: Math.round(logisticsIndex * 10) / 10,
    nationalComposite: Math.round(nationalComposite * 10) / 10,
  };
}
