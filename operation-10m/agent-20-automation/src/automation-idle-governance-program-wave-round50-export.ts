import type { O10IdleGovernanceProgramWaveRound49CapstoneResult } from './automation-idle-governance-program-wave-round49-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound50ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round50-export.v1';
  waveRound: 50;
  o10TaskId: 'O10-231';
  projectedLocHint: number;
  round50Ready: boolean;
  wave50HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound50ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round50-export.v1';
  waveRound: 50;
  o10TaskId: 'O10-231';
  round49Capstone: O10IdleGovernanceProgramWaveRound49CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound50ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-50 / wave-50 export for O10-231 integration hooks. */
export function exportIdleGovernanceProgramWaveRound50(
  round49Capstone: O10IdleGovernanceProgramWaveRound49CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound50ExportResult {
  const round50Ready = round49Capstone.capstoneReady;
  const wave50HookLines = [
    `O10_AGENT20_WAVE50 task=O10-231 round=50`,
    `O10_AGENT20_WAVE50 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE50 round50_ready=${round50Ready}`,
    `O10_AGENT20_WAVE50 prior_capstone=${round49Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE50 prior_task=${round49Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE50 integration_baseline=8aaaf700`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound50ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round50-export.v1',
    waveRound: 50,
    o10TaskId: 'O10-231',
    projectedLocHint,
    round50Ready,
    wave50HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 50 export (O10-231)',
    '',
    ...wave50HookLines.map(line => `- ${line}`),
    '',
    round49Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round50_export', 'task=O10-231', 'round=50', `ready=${round50Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round50-export.v1',
    waveRound: 50,
    o10TaskId: 'O10-231',
    round49Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound50ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound49CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round49-capstone.v1',
    o10TaskId: 'O10-229',
    waveRound: 49,
    capstoneReady: true,
    capstoneMarkdown: '# r49',
    summaryLine: 's',
    primaryRound48Capstone: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['primaryRound48Capstone'],
    twinRound48Capstone: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['twinRound48Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['capstoneCompare'],
    round49Export: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['round49Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound50(mockCap(), 2_771_207);
  push(
    'gov_prog_r50_export_o10',
    'wave 50 export tags O10-231 and loc hint',
    exported.o10TaskId === 'O10-231' &&
      exported.payload.projectedLocHint === 2_771_207 &&
      exported.payload.wave50HookLines.some(l => l.includes('O10-231'))
  );
  push(
    'gov_prog_r50_export_schema',
    'round 50 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round50-export.v1'
  );
  return results;
}
