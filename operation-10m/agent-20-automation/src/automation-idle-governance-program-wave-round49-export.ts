import type { O10IdleGovernanceProgramWaveRound48CapstoneResult } from './automation-idle-governance-program-wave-round48-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound49ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round49-export.v1';
  waveRound: 49;
  o10TaskId: 'O10-229';
  projectedLocHint: number;
  round49Ready: boolean;
  wave49HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound49ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round49-export.v1';
  waveRound: 49;
  o10TaskId: 'O10-229';
  round48Capstone: O10IdleGovernanceProgramWaveRound48CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound49ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-49 / wave-49 export for O10-229 integration hooks. */
export function exportIdleGovernanceProgramWaveRound49(
  round48Capstone: O10IdleGovernanceProgramWaveRound48CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound49ExportResult {
  const round49Ready = round48Capstone.capstoneReady;
  const wave49HookLines = [
    `O10_AGENT20_WAVE49 task=O10-229 round=49`,
    `O10_AGENT20_WAVE49 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE49 round49_ready=${round49Ready}`,
    `O10_AGENT20_WAVE49 prior_capstone=${round48Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE49 prior_task=${round48Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound49ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round49-export.v1',
    waveRound: 49,
    o10TaskId: 'O10-229',
    projectedLocHint,
    round49Ready,
    wave49HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 49 export (O10-229)',
    '',
    ...wave49HookLines.map(line => `- ${line}`),
    '',
    round48Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round49_export', 'task=O10-229', 'round=49', `ready=${round49Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round49-export.v1',
    waveRound: 49,
    o10TaskId: 'O10-229',
    round48Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound49ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound48CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round48-capstone.v1',
    o10TaskId: 'O10-227',
    waveRound: 48,
    capstoneReady: true,
    capstoneMarkdown: '# r48',
    summaryLine: 's',
    primaryRound47Capstone: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['primaryRound47Capstone'],
    twinRound47Capstone: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['twinRound47Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['capstoneCompare'],
    round48Export: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['round48Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound49(mockCap(), 2_727_364);
  push(
    'gov_prog_r49_export_o10',
    'wave 49 export tags O10-229 and loc hint',
    exported.o10TaskId === 'O10-229' &&
      exported.payload.projectedLocHint === 2_727_364 &&
      exported.payload.wave49HookLines.some(l => l.includes('O10-229'))
  );
  push(
    'gov_prog_r49_export_schema',
    'round 49 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round49-export.v1'
  );
  return results;
}
