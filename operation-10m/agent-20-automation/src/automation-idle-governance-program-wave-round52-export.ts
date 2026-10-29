import type { O10IdleGovernanceProgramWaveRound51CapstoneResult } from './automation-idle-governance-program-wave-round51-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound52ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round52-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-235';
  projectedLocHint: number;
  round52Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound52ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round52-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-235';
  round51Capstone: O10IdleGovernanceProgramWaveRound51CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound52ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-52 / wave-52 export for O10-235 integration hooks. */
export function exportIdleGovernanceProgramWaveRound52(
  round51Capstone: O10IdleGovernanceProgramWaveRound51CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound52ExportResult {
  const round52Ready = round51Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE52 task=O10-235 round=52`,
    `O10_AGENT20_WAVE52 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE52 round52_ready=${round52Ready}`,
    `O10_AGENT20_WAVE52 prior_capstone=${round51Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE52 prior_task=${round51Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE52 integration_baseline=ba97bdce`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound52ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round52-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-235',
    projectedLocHint,
    round52Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-235)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round51Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round52_export', 'task=O10-235', 'round=52', `ready=${round52Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round52-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-235',
    round51Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound52ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound51CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round51-capstone.v1',
    o10TaskId: 'O10-233',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound50Capstone: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['primaryRound50Capstone'],
    twinRound50Capstone: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['twinRound50Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['capstoneCompare'],
    round51Export: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['round51Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound52(mockCap(), 2_932_752);
  push(
    'gov_prog_r52_export_o10',
    'wave 52 export tags O10-235 and loc hint',
    exported.o10TaskId === 'O10-235' &&
      exported.payload.projectedLocHint === 2_932_752 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-235'))
  );
  push(
    'gov_prog_r52_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round52-export.v1'
  );
  return results;
}
