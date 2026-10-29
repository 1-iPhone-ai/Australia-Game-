import type { StateFiscalProfile } from './types';

export const STATE_FISCAL_PROFILES: StateFiscalProfile[] = [
  { stateCode: 'NSW', populationWeight: 0.32, fiscalCapacityIndex: 1.05, remoteLoadFactor: 0.02 },
  { stateCode: 'VIC', populationWeight: 0.26, fiscalCapacityIndex: 1.02, remoteLoadFactor: 0.02 },
  { stateCode: 'QLD', populationWeight: 0.2, fiscalCapacityIndex: 0.92, remoteLoadFactor: 0.08 },
  { stateCode: 'WA', populationWeight: 0.11, fiscalCapacityIndex: 1.12, remoteLoadFactor: 0.12 },
  { stateCode: 'SA', populationWeight: 0.07, fiscalCapacityIndex: 0.88, remoteLoadFactor: 0.05 },
  { stateCode: 'TAS', populationWeight: 0.02, fiscalCapacityIndex: 0.78, remoteLoadFactor: 0.06 },
  { stateCode: 'ACT', populationWeight: 0.017, fiscalCapacityIndex: 1.15, remoteLoadFactor: 0.01 },
  { stateCode: 'NT', populationWeight: 0.013, fiscalCapacityIndex: 0.65, remoteLoadFactor: 0.35 }
];

export function profileFor(stateCode: StateFiscalProfile['stateCode']): StateFiscalProfile {
  const p = STATE_FISCAL_PROFILES.find(s => s.stateCode === stateCode);
  if (!p) throw new Error(`Unknown state ${stateCode}`);
  return p;
}
