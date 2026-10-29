import type { O10IdleGovernanceProgramWaveRound32CapstoneResult } from './automation-idle-governance-program-wave-round32-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound33ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round33-export.v1';
  waveRound: 33;
  o10TaskId: 'O10-197';
  projectedLocHint: number;
  round33Ready: boolean;
  wave33HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound33ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round33-export.v1';
  waveRound: 33;
  o10TaskId: 'O10-197';
  round32Capstone: O10IdleGovernanceProgramWaveRound32CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound33ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-33 / wave-33 export for O10-197 integration hooks. */
export function exportIdleGovernanceProgramWaveRound33(
  round32Capstone: O10IdleGovernanceProgramWaveRound32CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound33ExportResult {
  const round33Ready = round32Capstone.capstoneReady;
  const wave33HookLines = [
    `O10_AGENT20_WAVE33 task=O10-197 round=33`,
    `O10_AGENT20_WAVE33 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE33 round33_ready=${round33Ready}`,
    `O10_AGENT20_WAVE33 prior_capstone=${round32Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE33 prior_task=${round32Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound33ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round33-export.v1',
    waveRound: 33,
    o10TaskId: 'O10-197',
    projectedLocHint,
    round33Ready,
    wave33HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 33 export (O10-197)',
    '',
    ...wave33HookLines.map(line => `- ${line}`),
    '',
    round32Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round33_export', 'task=O10-197', 'round=33', `ready=${round33Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round33-export.v1',
    waveRound: 33,
    o10TaskId: 'O10-197',
    round32Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound33ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound32CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round32-capstone.v1',
    o10TaskId: 'O10-195',
    waveRound: 32,
    capstoneReady: true,
    capstoneMarkdown: '# r32',
    summaryLine: 's',
    primaryRound31Capstone: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['primaryRound31Capstone'],
    twinRound31Capstone: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['twinRound31Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['capstoneCompare'],
    round32Export: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['round32Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound33(mockCap(), 1_836_529);
  push(
    'gov_prog_r33_export_o10',
    'wave 33 export tags O10-197 and loc hint',
    exported.o10TaskId === 'O10-197' &&
      exported.payload.projectedLocHint === 1_836_529 &&
      exported.payload.wave33HookLines.some(l => l.includes('O10-197'))
  );
  push(
    'gov_prog_r33_export_schema',
    'round 33 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round33-export.v1'
  );
  return results;
}
