import type { ClimateTransportBand, TransportProductivityInputs } from '../types.ts';
import { CLIMATE_BAND_UTILIZATION, climateModifierFactor } from './climate-transport-modifiers.ts';
import { worsenCondition } from '../operations/maintenance-backlog.ts';

export function applyClimateBandToInputs(
  inputs: TransportProductivityInputs,
  band: ClimateTransportBand | undefined,
): { inputs: TransportProductivityInputs; climateModifierFactor: number } {
  if (!band || band === 'mild') {
    return { inputs, climateModifierFactor: 1 };
  }

  const add = CLIMATE_BAND_UTILIZATION[band];
  const networkUtilization = {
    ...(inputs.networkUtilization ?? {}),
    freight: Math.min(1.25, (inputs.networkUtilization?.freight ?? 0) + add),
    mobility: Math.min(1.25, (inputs.networkUtilization?.mobility ?? 0) + add * 0.5),
  };

  const conditionByAssetId = new Map(inputs.conditionByAssetId ?? []);
  if (band === 'hot' || band === 'extreme') {
    for (const asset of inputs.assets) {
      if (!inputs.operationalAssetIds.has(asset.id)) continue;
      if (asset.category !== 'road' && asset.category !== 'rail') continue;
      const prior = conditionByAssetId.get(asset.id) ?? 'good';
      conditionByAssetId.set(asset.id, worsenCondition(prior, 1));
    }
  }

  return {
    inputs: { ...inputs, networkUtilization, conditionByAssetId },
    climateModifierFactor: climateModifierFactor(band),
  };
}
