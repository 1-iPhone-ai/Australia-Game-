import type { O10IdleGovernanceProgramWaveRound45CapstoneResult } from './automation-idle-governance-program-wave-round45-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound46ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round46-export.v1';
  waveRound: 46;
  o10TaskId: 'O10-223';
  projectedLocHint: number;
  round46Ready: boolean;
  wave46HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound46ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round46-export.v1';
  waveRound: 46;
  o10TaskId: 'O10-223';
  round45Capstone: O10IdleGovernanceProgramWaveRound45CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound46ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-46 / wave-46 export for O10-223 integration hooks. */
export function exportIdleGovernanceProgramWaveRound46(
  round45Capstone: O10IdleGovernanceProgramWaveRound45CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound46ExportResult {
  const round46Ready = round45Capstone.capstoneReady;
  const wave46HookLines = [
    `O10_AGENT20_WAVE46 task=O10-223 round=46`,
    `O10_AGENT20_WAVE46 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE46 round46_ready=${round46Ready}`,
    `O10_AGENT20_WAVE46 prior_capstone=${round45Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE46 prior_task=${round45Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound46ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round46-export.v1',
    waveRound: 46,
    o10TaskId: 'O10-223',
    projectedLocHint,
    round46Ready,
    wave46HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 46 export (O10-223)',
    '',
    ...wave46HookLines.map(line => `- ${line}`),
    '',
    round45Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round46_export', 'task=O10-223', 'round=46', `ready=${round46Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round46-export.v1',
    waveRound: 46,
    o10TaskId: 'O10-223',
    round45Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound46ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound45CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round45-capstone.v1',
    o10TaskId: 'O10-221',
    waveRound: 45,
    capstoneReady: true,
    capstoneMarkdown: '# r45',
    summaryLine: 's',
    primaryRound44Capstone: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['primaryRound44Capstone'],
    twinRound44Capstone: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['twinRound44Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['capstoneCompare'],
    round45Export: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['round45Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound46(mockCap(), 2_593_189);
  push(
    'gov_prog_r46_export_o10',
    'wave 46 export tags O10-223 and loc hint',
    exported.o10TaskId === 'O10-223' &&
      exported.payload.projectedLocHint === 2_593_189 &&
      exported.payload.wave46HookLines.some(l => l.includes('O10-223'))
  );
  push(
    'gov_prog_r46_export_schema',
    'round 46 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round46-export.v1'
  );
  return results;
}
