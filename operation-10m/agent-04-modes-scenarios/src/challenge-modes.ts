import type { O10mChallengeMode, O10mChallengeModeId } from './types.js';

export const O10M_CHALLENGE_MODES: O10mChallengeMode[] = [
  {
    id: 'o10m_ap_sprint',
    title: 'Action Sprint',
    description: 'Tighter action economy — shared AP costs increase by one for deposit and travel actions.',
    compatibleBaseModes: ['ai', 'grand_tour', 'scenario', 'team_human_ai_vs_ai_ai'],
    incompatibleBaseModes: ['single', 'team_ai_vs_ai'],
    forcedSettingsPatch: {
      actionLimitsEnabled: true,
      o10mChallengeApSprint: true,
    },
    modifiers: [
      {
        id: 'o10m_ap_sprint_deposit',
        name: 'Sprint Deposit Tax',
        description: 'Region deposit actions cost +1 AP.',
        domain: 'turn_limits',
        targetKey: 'actionCosts.region_deposit',
        value: 2,
        isGlobal: true,
      },
    ],
  },
  {
    id: 'o10m_ironman',
    title: 'Ironman Ledger',
    description: 'Disables mid-run save intent flags used by scenario recovery flows.',
    compatibleBaseModes: ['ai', 'scenario', 'grand_tour'],
    incompatibleBaseModes: ['team_ai_vs_ai'],
    forcedSettingsPatch: {
      o10mIronmanNoMidRunSave: true,
      quickSaveEnabled: false,
    },
    modifiers: [],
  },
  {
    id: 'o10m_rival_intensity',
    title: 'Rival Intensity',
    description: 'Raises AI fairness pressure slightly for solo and team human-AI modes.',
    compatibleBaseModes: ['ai', 'grand_tour', 'scenario', 'team_human_ai_vs_ai_ai'],
    incompatibleBaseModes: ['single'],
    forcedSettingsPatch: {
      aiFairnessLevel: 0.93,
      o10mRivalIntensity: true,
    },
    modifiers: [
      {
        id: 'o10m_rival_market',
        name: 'Hot Market Response',
        description: 'AI market reaction bias increases.',
        domain: 'ai_behavior',
        targetKey: 'aiUsesMarketModifiers',
        value: true,
        isGlobal: true,
      },
    ],
  },
  {
    id: 'o10m_contract_focus',
    title: 'Contract Focus',
    description: 'Forces regional contracts on and increases abundance for scenario grinds.',
    compatibleBaseModes: ['scenario', 'ai'],
    incompatibleBaseModes: ['grand_tour', 'team_ai_vs_ai', 'single'],
    forcedSettingsPatch: {
      regionalContractsEnabled: true,
      v93ContractAbundance: 'abundant',
      o10mContractFocus: true,
    },
    modifiers: [],
  },
];

const CHALLENGE_BY_ID: Record<O10mChallengeModeId, O10mChallengeMode> = O10M_CHALLENGE_MODES.reduce(
  (acc, mode) => {
    acc[mode.id] = mode;
    return acc;
  },
  {} as Record<O10mChallengeModeId, O10mChallengeMode>,
);

export function getO10mChallengeMode(id: O10mChallengeModeId): O10mChallengeMode {
  return CHALLENGE_BY_ID[id];
}

export function listO10mChallengeModeIds(): O10mChallengeModeId[] {
  return O10M_CHALLENGE_MODES.map(m => m.id);
}
