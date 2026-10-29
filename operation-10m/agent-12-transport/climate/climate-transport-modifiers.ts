export type ClimateTransportBand = 'mild' | 'warm' | 'hot' | 'extreme';

export const CLIMATE_BAND_UTILIZATION: Record<ClimateTransportBand, number> = {
  mild: 0,
  warm: 0.04,
  hot: 0.1,
  extreme: 0.18,
};

export const CLIMATE_BAND_CONDITION_PENALTY: Record<ClimateTransportBand, number> = {
  mild: 0,
  warm: 0,
  hot: 1,
  extreme: 1,
};

export function climateModifierFactor(band: ClimateTransportBand): number {
  return 1 - CLIMATE_BAND_UTILIZATION[band] * 0.15;
}

export function isClimateTransportBand(value: string): value is ClimateTransportBand {
  return value === 'mild' || value === 'warm' || value === 'hot' || value === 'extreme';
}
