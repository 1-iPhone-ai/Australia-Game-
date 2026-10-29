export type {
  EconomyContract,
  EconomyDomainId,
  EconomyPatch,
  EconomySnapshot,
} from './economy.ts';
export type {
  GovernanceAuthorityMode,
  GovernancePatch,
  GovernanceSnapshot,
  GovernmentContract,
} from './government.ts';
export type {
  PopulationContract,
  PopulationPatch,
  PopulationSnapshot,
} from './population.ts';
export type {
  TechContract,
  TechPatch,
  TechSnapshot,
  TechTrackId,
} from './tech.ts';
export type {
  StrategicActionToast,
  StrategicChoicePresentation,
  UiContract,
} from './ui.ts';

export interface StrategicGameplayContracts {
  economy: import('./economy.ts').EconomyContract;
  government: import('./government.ts').GovernmentContract;
  population: import('./population.ts').PopulationContract;
  tech: import('./tech.ts').TechContract;
  ui: import('./ui.ts').UiContract;
}
