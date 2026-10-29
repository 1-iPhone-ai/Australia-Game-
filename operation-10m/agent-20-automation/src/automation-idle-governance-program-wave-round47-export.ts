import type { O10IdleGovernanceProgramWaveRound46CapstoneResult } from './automation-idle-governance-program-wave-round46-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound47ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round47-export.v1';
  waveRound: 47;
  o10TaskId: 'O10-225';
  projectedLocHint: number;
  round47Ready: boolean;
  wave47HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound47ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round47-export.v1';
  waveRound: 47;
  o10TaskId: 'O10-225';
  round46Capstone: O10IdleGovernanceProgramWaveRound46CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound47ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-47 / wave-47 export for O10-225 integration hooks. */
export function exportIdleGovernanceProgramWaveRound47(
  round46Capstone: O10IdleGovernanceProgramWaveRound46CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound47ExportResult {
  const round47Ready = round46Capstone.capstoneReady;
  const wave47HookLines = [
    `O10_AGENT20_WAVE47 task=O10-225 round=47`,
    `O10_AGENT20_WAVE47 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE47 round47_ready=${round47Ready}`,
    `O10_AGENT20_WAVE47 prior_capstone=${round46Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE47 prior_task=${round46Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound47ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round47-export.v1',
    waveRound: 47,
    o10TaskId: 'O10-225',
    projectedLocHint,
    round47Ready,
    wave47HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 47 export (O10-225)',
    '',
    ...wave47HookLines.map(line => `- ${line}`),
    '',
    round46Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round47_export', 'task=O10-225', 'round=47', `ready=${round47Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round47-export.v1',
    waveRound: 47,
    o10TaskId: 'O10-225',
    round46Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound47ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound46CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round46-capstone.v1',
    o10TaskId: 'O10-223',
    waveRound: 46,
    capstoneReady: true,
    capstoneMarkdown: '# r46',
    summaryLine: 's',
    primaryRound45Capstone: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['primaryRound45Capstone'],
    twinRound45Capstone: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['twinRound45Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['capstoneCompare'],
    round46Export: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['round46Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound47(mockCap(), 2_637_258);
  push(
    'gov_prog_r47_export_o10',
    'wave 47 export tags O10-225 and loc hint',
    exported.o10TaskId === 'O10-225' &&
      exported.payload.projectedLocHint === 2_637_258 &&
      exported.payload.wave47HookLines.some(l => l.includes('O10-225'))
  );
  push(
    'gov_prog_r47_export_schema',
    'round 47 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round47-export.v1'
  );
  return results;
}
