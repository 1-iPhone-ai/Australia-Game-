import type { GameModeSelection, PresetScenario, ScenarioDifficulty } from './types.js';
import { O10M_OPERATION_SCENARIOS, findO10mScenario } from './scenarios/o10m-presets.js';
import { O10M_SCENARIO_CHAINS } from './scenario-chains.js';
import { isSoloRivalMode } from './canonical-modes.js';

export type O10mMissionFocus =
  | 'solo_rival'
  | 'grand_tour_arc'
  | 'team_coop'
  | 'autoplay_lab'
  | 'scenario_sandbox';

export interface O10mModeMissionProfile {
  baseMode: GameModeSelection;
  missionFocus: O10mMissionFocus;
  title: string;
  description: string;
  recommendedScenarioIds: string[];
  /** Scenario ids that should warn when selected outside this mode. */
  restrictedScenarioIds?: string[];
}

const DIFFICULTY_RANK: Record<ScenarioDifficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Expert: 4,
};

export const O10M_MODE_MISSION_PROFILES: O10mModeMissionProfile[] = [
  {
    baseMode: 'ai',
    missionFocus: 'solo_rival',
    title: 'Solo Rival Missions',
    description: 'Standard human vs AI scenario progression with optional challenge overlays.',
    recommendedScenarioIds: [
      'o10m_silent_diplomat',
      'o10m_export_clock',
      'o10m_cyclone_corridor',
      'o10m_rival_elimination_classic',
    ],
  },
  {
    baseMode: 'grand_tour',
    missionFocus: 'grand_tour_arc',
    title: 'Grand Tour Bridge',
    description: 'Challenge-heavy scenarios that complement regional tour pacing.',
    recommendedScenarioIds: ['o10m_grand_tour_prologue', 'o10m_outback_relay', 'o10m_tas_battery_rush'],
  },
  {
    baseMode: 'scenario',
    missionFocus: 'scenario_sandbox',
    title: 'Scenario Campaign',
    description: 'Full scenario engine with chains, milestones, and sandbox knobs.',
    recommendedScenarioIds: O10M_OPERATION_SCENARIOS.map(s => s.id),
  },
  {
    baseMode: 'team_human_ai_vs_ai_ai',
    missionFocus: 'team_coop',
    title: 'Co-Pilot Coalition',
    description: 'Standing-average and governance scenarios tuned for human+AI teams.',
    recommendedScenarioIds: ['o10m_team_ledger', 'o10m_capital_markets_week', 'o10m_silent_diplomat'],
  },
  {
    baseMode: 'team_ai_vs_ai',
    missionFocus: 'autoplay_lab',
    title: 'Autoplay Laboratory',
    description: 'Observation scenarios for AI vs AI balance and contract pacing.',
    recommendedScenarioIds: ['o10m_autoplay_observatory'],
    restrictedScenarioIds: ['o10m_rival_elimination_classic'],
  },
  {
    baseMode: 'single',
    missionFocus: 'scenario_sandbox',
    title: 'Sandbox (Unstructured)',
    description: 'No structured scenario objectives — sandbox knobs only.',
    recommendedScenarioIds: [],
  },
];

export function getModeMissionProfile(mode: GameModeSelection): O10mModeMissionProfile | undefined {
  return O10M_MODE_MISSION_PROFILES.find(p => p.baseMode === mode);
}

export function recommendScenariosForMode(mode: GameModeSelection): PresetScenario[] {
  const profile = getModeMissionProfile(mode);
  if (!profile) return [];
  return profile.recommendedScenarioIds
    .map(id => findO10mScenario(id))
    .filter((s): s is PresetScenario => Boolean(s));
}

export function rankScenarioDifficulty(scenario: PresetScenario): number {
  return DIFFICULTY_RANK[scenario.difficulty] ?? 2;
}

export function listScenariosByDifficulty(mode?: GameModeSelection): PresetScenario[] {
  const pool = mode ? recommendScenariosForMode(mode) : [...O10M_OPERATION_SCENARIOS];
  return [...pool].sort(
    (a, b) => rankScenarioDifficulty(a) - rankScenarioDifficulty(b) || a.id.localeCompare(b.id),
  );
}

export interface O10mModeScenarioFitResult {
  ok: boolean;
  warnings: string[];
  missionFocus: O10mMissionFocus | null;
}

export function evaluateModeScenarioFit(baseMode: GameModeSelection, scenarioId: string): O10mModeScenarioFitResult {
  const profile = getModeMissionProfile(baseMode);
  const warnings: string[] = [];
  if (!profile) return { ok: false, warnings: ['Unknown base mode'], missionFocus: null };

  if (profile.restrictedScenarioIds?.includes(scenarioId)) {
    warnings.push(`Scenario ${scenarioId} is restricted for mode ${baseMode}.`);
  }

  if (baseMode === 'single' && scenarioId.startsWith('o10m_')) {
    warnings.push('Structured O10M scenarios require a rival or scenario base mode.');
  }

  if (baseMode === 'team_ai_vs_ai' && scenarioId !== 'o10m_autoplay_observatory' && scenarioId.startsWith('o10m_')) {
    warnings.push('Only o10m_autoplay_observatory is tuned for team_ai_vs_ai structured play.');
  }

  if (isSoloRivalMode(baseMode) && !profile.recommendedScenarioIds.includes(scenarioId)) {
    warnings.push(`Scenario ${scenarioId} is not in the recommended list for ${baseMode}.`);
  }

  const ok = !profile.restrictedScenarioIds?.includes(scenarioId) && baseMode !== 'single';
  return { ok, warnings, missionFocus: profile.missionFocus };
}

export function scenariosReferencedByChains(): string[] {
  const ids = new Set<string>();
  for (const chain of O10M_SCENARIO_CHAINS) {
    for (const step of chain.steps) ids.add(step.scenarioId);
  }
  return [...ids].sort();
}

export function chainCoverageReport(): Array<{ chainId: string; scenarioCount: number; uniqueRegions: string[] }> {
  return O10M_SCENARIO_CHAINS.map(chain => {
    const regions = new Set<string>();
    for (const step of chain.steps) {
      const sc = findO10mScenario(step.scenarioId);
      sc?.startingRegions.forEach(r => regions.add(r));
    }
    return { chainId: chain.id, scenarioCount: chain.steps.length, uniqueRegions: [...regions].sort() };
  });
}
