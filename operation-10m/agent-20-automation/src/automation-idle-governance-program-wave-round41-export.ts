import type { O10IdleGovernanceProgramWaveRound40CapstoneResult } from './automation-idle-governance-program-wave-round40-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound41ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round41-export.v1';
  waveRound: 41;
  o10TaskId: 'O10-213';
  projectedLocHint: number;
  round41Ready: boolean;
  wave41HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound41ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round41-export.v1';
  waveRound: 41;
  o10TaskId: 'O10-213';
  round40Capstone: O10IdleGovernanceProgramWaveRound40CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound41ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-41 / wave-41 export for O10-213 integration hooks. */
export function exportIdleGovernanceProgramWaveRound41(
  round40Capstone: O10IdleGovernanceProgramWaveRound40CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound41ExportResult {
  const round41Ready = round40Capstone.capstoneReady;
  const wave41HookLines = [
    `O10_AGENT20_WAVE41 task=O10-213 round=41`,
    `O10_AGENT20_WAVE41 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE41 round41_ready=${round41Ready}`,
    `O10_AGENT20_WAVE41 prior_capstone=${round40Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE41 prior_task=${round40Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound41ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round41-export.v1',
    waveRound: 41,
    o10TaskId: 'O10-213',
    projectedLocHint,
    round41Ready,
    wave41HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 41 export (O10-213)',
    '',
    ...wave41HookLines.map(line => `- ${line}`),
    '',
    round40Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round41_export', 'task=O10-213', 'round=41', `ready=${round41Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round41-export.v1',
    waveRound: 41,
    o10TaskId: 'O10-213',
    round40Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound41ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound40CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round40-capstone.v1',
    o10TaskId: 'O10-211',
    waveRound: 40,
    capstoneReady: true,
    capstoneMarkdown: '# r40',
    summaryLine: 's',
    primaryRound39Capstone: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['primaryRound39Capstone'],
    twinRound39Capstone: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['twinRound39Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['capstoneCompare'],
    round40Export: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['round40Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound41(mockCap(), 2_165_132);
  push(
    'gov_prog_r41_export_o10',
    'wave 41 export tags O10-213 and loc hint',
    exported.o10TaskId === 'O10-213' &&
      exported.payload.projectedLocHint === 2_165_132 &&
      exported.payload.wave41HookLines.some(l => l.includes('O10-213'))
  );
  push(
    'gov_prog_r41_export_schema',
    'round 41 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round41-export.v1'
  );
  return results;
}
