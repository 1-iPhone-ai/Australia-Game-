/**
 * In-memory contract adapters for unit tests and assembly stubs.
 * Agent 25 replaces these with bridges into canonical V9.4 state.
 */

import type {
  EconomyContract,
  EconomyPatch,
  EconomySnapshot,
} from '../contracts/economy.ts';
import type {
  GovernancePatch,
  GovernanceSnapshot,
  GovernmentContract,
} from '../contracts/government.ts';
import type {
  PopulationContract,
  PopulationPatch,
  PopulationSnapshot,
} from '../contracts/population.ts';
import type {
  TechContract,
  TechPatch,
  TechSnapshot,
  TechTrackId,
} from '../contracts/tech.ts';
import type {
  StrategicChoicePresentation,
  StrategicActionToast,
  UiContract,
} from '../contracts/ui.ts';
import type { StrategicGameplayContracts } from '../contracts/index.ts';

export interface MemoryAdapterOptions {
  economy?: Partial<EconomySnapshot>;
  government?: Partial<GovernanceSnapshot>;
  population?: Partial<PopulationSnapshot>;
  tech?: Partial<TechSnapshot>;
}

const defaultTechReadiness = (): Record<TechTrackId, number> => ({
  digital_infrastructure: 20,
  renewable_energy: 15,
  advanced_manufacturing: 10,
  biotech: 5,
  defence_dual_use: 8,
});

export function createMemoryStrategicContracts(
  opts: MemoryAdapterOptions = {},
): StrategicGameplayContracts & {
  uiLog: { choices: StrategicChoicePresentation[]; toasts: StrategicActionToast[] };
} {
  let economy: EconomySnapshot = {
    day: 1,
    cashOnHand: 500_000,
    treasuryReserve: 1_000_000,
    debtOutstanding: 0,
    inflationIndex: 1,
    priceMultiplier: 1,
    investmentLockout: false,
    netWorthEstimate: 2_000_000,
    ...opts.economy,
  };

  let government: GovernanceSnapshot = {
    day: 1,
    approvalRating: 55,
    directiveSlotsUsed: 0,
    directiveSlotCap: 3,
    authorityMode: 'shared',
    pendingReliefClaims: 0,
    regulatoryBurden: 10,
    ...opts.government,
  };

  let population: PopulationSnapshot = {
    day: 1,
    totalPopulation: 26_000_000,
    migrationBalance: 0,
    essentialAccessIndex: 70,
    affordabilityStress: 35,
    publicStability: 72,
    ...opts.population,
  };

  let tech: TechSnapshot = {
    day: 1,
    researchPoints: 0,
    unlockedTracks: ['digital_infrastructure'],
    readinessByTrack: defaultTechReadiness(),
    innovationMomentum: 10,
    ...opts.tech,
  };

  const uiLog = { choices: [] as StrategicChoicePresentation[], toasts: [] as StrategicActionToast[] };
  let hud = { used: 0, max: 3, pending: 0 };

  const economyContract: EconomyContract = {
    moduleId: 'agent-01-economy',
    snapshot: () => economy,
    applyPatch(patch: EconomyPatch) {
      economy = {
        ...economy,
        cashOnHand: economy.cashOnHand + (patch.cashDelta ?? 0),
        treasuryReserve: economy.treasuryReserve + (patch.treasuryDelta ?? 0),
        debtOutstanding: economy.debtOutstanding + (patch.debtDelta ?? 0),
        inflationIndex: economy.inflationIndex + (patch.inflationDelta ?? 0),
        priceMultiplier: patch.priceMultiplierFactor
          ? economy.priceMultiplier * patch.priceMultiplierFactor
          : economy.priceMultiplier,
        investmentLockout: patch.investmentLockout ?? economy.investmentLockout,
        netWorthEstimate: patch.netWorthMultiplier
          ? economy.netWorthEstimate * patch.netWorthMultiplier
          : economy.netWorthEstimate,
      };
      return economy;
    },
    canAfford(cashCost, treasuryCost = 0) {
      return (
        economy.cashOnHand >= cashCost && economy.treasuryReserve >= treasuryCost
      );
    },
  };

  const governmentContract: GovernmentContract = {
    moduleId: 'agent-01-government',
    snapshot: () => government,
    applyPatch(patch: GovernancePatch) {
      government = {
        ...government,
        approvalRating: Math.max(
          0,
          Math.min(100, government.approvalRating + (patch.approvalDelta ?? 0)),
        ),
        directiveSlotsUsed:
          government.directiveSlotsUsed + (patch.directiveSlotsDelta ?? 0),
        regulatoryBurden: government.regulatoryBurden + (patch.regulatoryBurdenDelta ?? 0),
        pendingReliefClaims:
          government.pendingReliefClaims + (patch.reliefClaimsDelta ?? 0),
        authorityMode: patch.authorityMode ?? government.authorityMode,
      };
      return government;
    },
    canIssueDirective() {
      return government.directiveSlotsUsed < government.directiveSlotCap;
    },
  };

  const populationContract: PopulationContract = {
    moduleId: 'agent-01-population',
    snapshot: () => population,
    applyPatch(patch: PopulationPatch) {
      population = {
        ...population,
        totalPopulation: population.totalPopulation + (patch.populationDelta ?? 0),
        migrationBalance: population.migrationBalance + (patch.migrationDelta ?? 0),
        essentialAccessIndex: Math.max(
          0,
          Math.min(100, population.essentialAccessIndex + (patch.essentialAccessDelta ?? 0)),
        ),
        affordabilityStress: Math.max(
          0,
          Math.min(100, population.affordabilityStress + (patch.affordabilityStressDelta ?? 0)),
        ),
        publicStability: Math.max(
          0,
          Math.min(100, population.publicStability + (patch.publicStabilityDelta ?? 0)),
        ),
      };
      return population;
    },
    stressBand() {
      if (population.affordabilityStress >= 80) return 'critical';
      if (population.affordabilityStress >= 55) return 'strained';
      return 'stable';
    },
  };

  const techContract: TechContract = {
    moduleId: 'agent-01-tech',
    snapshot: () => tech,
    applyPatch(patch: TechPatch) {
      const readiness = { ...tech.readinessByTrack };
      if (patch.readinessDelta) {
        for (const [track, delta] of Object.entries(patch.readinessDelta)) {
          const id = track as TechTrackId;
          readiness[id] = Math.max(0, Math.min(100, (readiness[id] ?? 0) + (delta ?? 0)));
        }
      }
      const unlocked = [...tech.unlockedTracks];
      if (patch.unlockTrack && !unlocked.includes(patch.unlockTrack)) {
        unlocked.push(patch.unlockTrack);
      }
      tech = {
        ...tech,
        researchPoints: tech.researchPoints + (patch.researchDelta ?? 0),
        unlockedTracks: unlocked,
        readinessByTrack: readiness,
        innovationMomentum: tech.innovationMomentum + (patch.momentumDelta ?? 0),
      };
      return tech;
    },
    meetsPrerequisite(track, minReadiness) {
      return (tech.readinessByTrack[track] ?? 0) >= minReadiness;
    },
  };

  const uiContract: UiContract = {
    moduleId: 'agent-01-ui',
    presentChoice(model) {
      uiLog.choices.push(model);
    },
    pushToast(toast) {
      uiLog.toasts.push(toast);
    },
    setActionHudSummary(actionsUsed, actionsMax, pendingDelayed) {
      hud = { used: actionsUsed, max: actionsMax, pending: pendingDelayed };
    },
  };

  return {
    economy: economyContract,
    government: governmentContract,
    population: populationContract,
    tech: techContract,
    ui: uiContract,
    uiLog,
  };
}
