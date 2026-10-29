import type {
  O10mChainAdvanceResult,
  O10mChainCarryBonus,
  O10mChainProgress,
  O10mRunSummary,
  O10mScenarioChain,
  O10mScenarioStartOverrides,
} from './types.js';

export const O10M_SCENARIO_CHAINS: O10mScenarioChain[] = [
  {
    id: 'o10m_chain_northern_corridor',
    title: 'Northern Corridor Arc',
    description:
      'Trade sprint into cyclone defense, then a decisive rival elimination finale across Queensland and the Top End.',
    completionBadgeId: 'badge_o10m_chain_northern_corridor',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_export_clock',
        title: 'Open the Export Window',
        narrativeBridge: 'Freight contracts flood the northern ports — prove you can bank cash before the cyclone season.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          startingMoneyDelta: 750,
          forcedSettingsPatch: { o10mChainNorthernExportComplete: true },
        },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_cyclone_corridor',
        title: 'Ride the Cyclone Season',
        narrativeBridge: 'The export windfall funds disaster relief — hold stability while rivals exploit the chaos.',
        requiresPrimaryVictory: true,
        requiresOptionalCount: 1,
        carryBonusOnComplete: {
          standingDelta: { QLD: 8, NT: 5 },
          forcedSettingsPatch: { o10mChainNorthernStabilityHeld: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_rival_elimination_classic',
        title: 'Sunshine Showdown',
        narrativeBridge: 'With corridors secured, eliminate the rival before they rebound in Queensland.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          forcedSettingsPatch: { o10mChainNorthernComplete: true },
        },
      },
    ],
  },
  {
    id: 'o10m_chain_diplomatic_arc',
    title: 'Diplomatic Arc',
    description: 'Warm up on challenges, win without sabotage, then prove the coalition model in team co-pilot play.',
    completionBadgeId: 'badge_o10m_chain_diplomatic_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_grand_tour_prologue',
        title: 'Tour Discipline',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 400 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_silent_diplomat',
        title: 'Silent Mandate',
        requiresPrimaryVictory: true,
        requiresOptionalCount: 1,
        carryBonusOnComplete: {
          standingDelta: { ACT: 5, NSW: 5 },
          forcedSettingsPatch: { o10mChainDiplomaticTrust: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_team_ledger',
        title: 'Coalition Ledger',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainDiplomaticComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_resource_pressure',
    title: 'Resource Pressure Spiral',
    description: 'Battery rush liquidity, wheatbelt debt squeeze, then cyclone corridor under combined economic and stability stress.',
    completionBadgeId: 'badge_o10m_chain_resource_pressure',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_tas_battery_rush',
        title: 'Grid Sprint',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 600 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_wheatbelt_squeeze',
        title: 'Debt Squeeze',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          forcedSettingsPatch: { o10mChainDebtLessons: true, advancedLoansEnabled: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_cyclone_corridor',
        title: 'Dual Stress Finale',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainResourcePressureComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_capital_to_coast',
    title: 'Capital to Coast',
    description: 'Markets week in the capital, island supply stress, then an export sprint on the eastern seaboard.',
    completionBadgeId: 'badge_o10m_chain_capital_to_coast',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_capital_markets_week',
        title: 'Policy Sprint',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 500 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_island_supply_line',
        title: 'Bass Strait Stress',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { standingDelta: { TAS: 10 } },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_export_clock',
        title: 'Coastal Export Push',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainCapitalToCoastComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_continuity_arc',
    title: 'Continuity Arc',
    description:
      'Validate save checkpoints, federation standing, then rebound trust after compound crises — round-4 campaign path.',
    completionBadgeId: 'badge_o10m_chain_continuity_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_continuity_drill',
        title: 'Checkpoint Discipline',
        narrativeBridge: 'Prove mid-campaign saves preserve chain and milestone state.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 350 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_federation_standing',
        title: 'Federation Mandate',
        requiresPrimaryVictory: true,
        requiresOptionalCount: 1,
        carryBonusOnComplete: {
          standingDelta: { NSW: 4, VIC: 4, SA: 4 },
          forcedSettingsPatch: { o10mChainContinuityFederationComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_standing_rebound',
        title: 'Trust Rebound',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainContinuityArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_marathon_sprint',
    title: 'Marathon Sprint',
    description:
      'Three-scenario gauntlet with save-safe marathon queue rotation — round-5 campaign path.',
    completionBadgeId: 'badge_o10m_chain_marathon_sprint',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_marathon_pace_setter',
        title: 'Pace Setter',
        narrativeBridge: 'Establish rhythm before the midfield hold.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 200 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_marathon_rhythm_hold',
        title: 'Rhythm Hold',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 6, SA: 6 },
          forcedSettingsPatch: { o10mMarathonMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_marathon_sprint_close',
        title: 'Sprint Close',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainMarathonSprintComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_iron_gauntlet',
    title: 'Iron Gauntlet',
    description:
      'Three-scenario lives-based gauntlet with ironman challenge lock-in — round-6 campaign path.',
    completionBadgeId: 'badge_o10m_chain_iron_gauntlet',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_gauntlet_opening_gate',
        title: 'Opening Gate',
        narrativeBridge: 'Prove the opening gate before the midfield press.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 250 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_gauntlet_midfield_press',
        title: 'Midfield Press',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { VIC: 5, NSW: 5 },
          forcedSettingsPatch: { o10mGauntletMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_gauntlet_iron_finish',
        title: 'Iron Finish',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainIronGauntletComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_relay_convoy',
    title: 'Relay Convoy',
    description:
      'Three-scenario relay with save-safe carry accumulation between legs — round-7 campaign path.',
    completionBadgeId: 'badge_o10m_chain_relay_convoy',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_relay_dust_corridor',
        title: 'Dust Corridor',
        narrativeBridge: 'Establish convoy rhythm before the coastal handoff.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 180 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_relay_coastal_handoff',
        title: 'Coastal Handoff',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { WA: 5, SA: 5 },
          forcedSettingsPatch: { o10mRelayMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_relay_terminal_sprint',
        title: 'Terminal Sprint',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainRelayConvoyComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_summit_circuit',
    title: 'Summit Circuit',
    description:
      'Three-phase summit circuit with momentum accrual between legs — round-8 campaign path.',
    completionBadgeId: 'badge_o10m_chain_summit_circuit',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_circuit_warmup_laps',
        title: 'Warmup Laps',
        narrativeBridge: 'Build circuit rhythm before the ridge climb.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 200 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_circuit_ridge_climb',
        title: 'Ridge Climb',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 6 },
          forcedSettingsPatch: { o10mCircuitMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_circuit_summit_push',
        title: 'Summit Push',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainSummitCircuitComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_expedition_arc',
    title: 'Expedition Arc',
    description:
      'Three-leg expedition with supply accrual between waypoints — round-9 campaign path.',
    completionBadgeId: 'badge_o10m_chain_expedition_arc',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_expedition_departure_dock',
        title: 'Departure Dock',
        narrativeBridge: 'Stage supplies before the transit pass.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 190 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_expedition_transit_pass',
        title: 'Transit Pass',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NT: 5, QLD: 5 },
          forcedSettingsPatch: { o10mExpeditionMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_expedition_arrival_haven',
        title: 'Arrival Haven',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainExpeditionArcComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_odyssey_route',
    title: 'Odyssey Route',
    description:
      'Three-act odyssey with renown accrual between chapters — round-10 campaign path.',
    completionBadgeId: 'badge_o10m_chain_odyssey_route',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_odyssey_opening_winds',
        title: 'Opening Winds',
        narrativeBridge: 'Build renown rhythm before the shelf crossing.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 210 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_odyssey_crossing_shelves',
        title: 'Crossing Shelves',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { SA: 6, NT: 6 },
          forcedSettingsPatch: { o10mOdysseyMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_odyssey_homecoming_harbor',
        title: 'Homecoming Harbor',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainOdysseyRouteComplete: true } },
      },
    ],
  },
  {
    id: 'o10m_chain_pilgrimage_path',
    title: 'Pilgrimage Path',
    description:
      'Three-stage pilgrimage with devotion accrual between shrines — round-11 campaign path.',
    completionBadgeId: 'badge_o10m_chain_pilgrimage_path',
    steps: [
      {
        stepIndex: 0,
        scenarioId: 'o10m_pilgrimage_setting_out',
        title: 'Setting Out',
        narrativeBridge: 'Gather devotion before the midway shrine.',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { startingMoneyDelta: 205 },
      },
      {
        stepIndex: 1,
        scenarioId: 'o10m_pilgrimage_midway_shrine',
        title: 'Midway Shrine',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: {
          standingDelta: { NSW: 6, ACT: 5 },
          forcedSettingsPatch: { o10mPilgrimageMidfieldComplete: true },
        },
      },
      {
        stepIndex: 2,
        scenarioId: 'o10m_pilgrimage_sanctuary_rest',
        title: 'Sanctuary Rest',
        requiresPrimaryVictory: true,
        carryBonusOnComplete: { forcedSettingsPatch: { o10mChainPilgrimagePathComplete: true } },
      },
    ],
  },
];

const CHAIN_BY_ID = new Map(O10M_SCENARIO_CHAINS.map(c => [c.id, c]));

export function getO10mScenarioChain(chainId: string): O10mScenarioChain | undefined {
  return CHAIN_BY_ID.get(chainId);
}

export function initializeChainProgress(chainId: string): O10mChainProgress | null {
  const chain = getO10mScenarioChain(chainId);
  if (!chain) return null;
  return {
    chainId,
    completedStepIndexes: [],
    activeStepIndex: 0,
    accumulatedCarry: {},
    chainCompleted: false,
  };
}

function mergeCarry(base: O10mChainCarryBonus, add: O10mChainCarryBonus): O10mChainCarryBonus {
  const standingDelta = { ...(base.standingDelta || {}) };
  for (const [k, v] of Object.entries(add.standingDelta || {})) {
    standingDelta[k] = (standingDelta[k] || 0) + v;
  }
  return {
    startingMoneyDelta: (base.startingMoneyDelta || 0) + (add.startingMoneyDelta || 0),
    standingDelta: Object.keys(standingDelta).length ? standingDelta : undefined,
    forcedSettingsPatch: { ...(base.forcedSettingsPatch || {}), ...(add.forcedSettingsPatch || {}) },
  };
}

export function isChainStepUnlocked(chain: O10mScenarioChain, progress: O10mChainProgress, stepIndex: number): boolean {
  if (progress.chainCompleted) return false;
  if (stepIndex === 0) return progress.completedStepIndexes.length === 0 || progress.activeStepIndex === 0;
  const prev = stepIndex - 1;
  return progress.completedStepIndexes.includes(prev);
}

export function validateChainStepSelection(
  chainId: string,
  progress: O10mChainProgress | null | undefined,
  scenarioId: string,
  stepIndex: number,
): { ok: boolean; errors: string[] } {
  const chain = getO10mScenarioChain(chainId);
  if (!chain) return { ok: false, errors: [`Unknown chain: ${chainId}`] };
  const step = chain.steps.find(s => s.stepIndex === stepIndex);
  if (!step) return { ok: false, errors: [`Invalid step index ${stepIndex} for chain ${chainId}`] };
  if (step.scenarioId !== scenarioId) {
    return { ok: false, errors: [`Step ${stepIndex} expects scenario ${step.scenarioId}, got ${scenarioId}`] };
  }
  const prog = progress ?? initializeChainProgress(chainId);
  if (!prog) return { ok: false, errors: ['Could not initialize chain progress.'] };
  if (!isChainStepUnlocked(chain, prog, stepIndex)) {
    return { ok: false, errors: [`Chain step ${stepIndex} is locked.`] };
  }
  return { ok: true, errors: [] };
}

function runMeetsStepRequirements(
  step: O10mScenarioChain['steps'][number],
  run: O10mRunSummary,
): boolean {
  if (step.requiresPrimaryVictory && !run.primaryVictory) return false;
  if (step.requiresOptionalCount != null && run.optionalObjectivesCompleted < step.requiresOptionalCount) {
    return false;
  }
  return true;
}

export function advanceChainAfterRun(
  chainId: string,
  progress: O10mChainProgress,
  run: O10mRunSummary,
): O10mChainAdvanceResult {
  const chain = getO10mScenarioChain(chainId);
  if (!chain) {
    return {
      progress,
      advanced: false,
      chainCompleted: progress.chainCompleted,
      unlockedNextScenarioId: null,
    };
  }

  const step = chain.steps.find(s => s.stepIndex === progress.activeStepIndex);
  if (!step || step.scenarioId !== run.scenarioId) {
    return {
      progress,
      advanced: false,
      chainCompleted: progress.chainCompleted,
      unlockedNextScenarioId: null,
    };
  }

  if (!runMeetsStepRequirements(step, run)) {
    return {
      progress,
      advanced: false,
      chainCompleted: false,
      unlockedNextScenarioId: null,
    };
  }

  const completed = Array.from(new Set([...progress.completedStepIndexes, step.stepIndex])).sort((a, b) => a - b);
  const carry = step.carryBonusOnComplete
    ? mergeCarry(progress.accumulatedCarry, step.carryBonusOnComplete)
    : progress.accumulatedCarry;

  const isLast = step.stepIndex === chain.steps[chain.steps.length - 1]!.stepIndex;
  if (isLast) {
    return {
      progress: {
        chainId,
        completedStepIndexes: completed,
        activeStepIndex: step.stepIndex,
        accumulatedCarry: carry,
        chainCompleted: true,
      },
      advanced: true,
      chainCompleted: true,
      unlockedNextScenarioId: null,
    };
  }

  const nextIndex = step.stepIndex + 1;
  const nextStep = chain.steps.find(s => s.stepIndex === nextIndex);
  return {
    progress: {
      chainId,
      completedStepIndexes: completed,
      activeStepIndex: nextIndex,
      accumulatedCarry: carry,
      chainCompleted: false,
    },
    advanced: true,
    chainCompleted: false,
    unlockedNextScenarioId: nextStep?.scenarioId ?? null,
  };
}

export function buildChainScenarioStartOverrides(progress: O10mChainProgress): O10mScenarioStartOverrides {
  const carry = progress.accumulatedCarry;
  return {
    startingMoneyMultiplier: 1,
    startingStandingDelta: carry.standingDelta ? { ...carry.standingDelta } : undefined,
  };
}

export function buildChainForcedSettingsPatch(progress: O10mChainProgress): Record<string, unknown> {
  const patch: Record<string, unknown> = {
    ...(progress.accumulatedCarry.forcedSettingsPatch || {}),
    o10mActiveChainId: progress.chainId,
    o10mActiveChainStep: progress.activeStepIndex,
  };
  if (progress.accumulatedCarry.startingMoneyDelta) {
    patch.o10mChainStartingMoneyBonus = progress.accumulatedCarry.startingMoneyDelta;
  }
  return patch;
}

export function listO10mScenarioChainIds(): string[] {
  return O10M_SCENARIO_CHAINS.map(c => c.id);
}
