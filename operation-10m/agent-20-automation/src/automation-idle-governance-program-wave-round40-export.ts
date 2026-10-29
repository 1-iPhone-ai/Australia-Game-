import type { O10IdleGovernanceProgramWaveRound39CapstoneResult } from './automation-idle-governance-program-wave-round39-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound40ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round40-export.v1';
  waveRound: 40;
  o10TaskId: 'O10-211';
  projectedLocHint: number;
  round40Ready: boolean;
  wave40HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound40ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round40-export.v1';
  waveRound: 40;
  o10TaskId: 'O10-211';
  round39Capstone: O10IdleGovernanceProgramWaveRound39CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound40ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-40 / wave-40 export for O10-211 integration hooks. */
export function exportIdleGovernanceProgramWaveRound40(
  round39Capstone: O10IdleGovernanceProgramWaveRound39CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound40ExportResult {
  const round40Ready = round39Capstone.capstoneReady;
  const wave40HookLines = [
    `O10_AGENT20_WAVE40 task=O10-211 round=40`,
    `O10_AGENT20_WAVE40 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE40 round40_ready=${round40Ready}`,
    `O10_AGENT20_WAVE40 prior_capstone=${round39Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE40 prior_task=${round39Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound40ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round40-export.v1',
    waveRound: 40,
    o10TaskId: 'O10-211',
    projectedLocHint,
    round40Ready,
    wave40HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 40 export (O10-211)',
    '',
    ...wave40HookLines.map(line => `- ${line}`),
    '',
    round39Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round40_export', 'task=O10-211', 'round=40', `ready=${round40Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round40-export.v1',
    waveRound: 40,
    o10TaskId: 'O10-211',
    round39Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound40ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound39CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round39-capstone.v1',
    o10TaskId: 'O10-209',
    waveRound: 39,
    capstoneReady: true,
    capstoneMarkdown: '# r39',
    summaryLine: 's',
    primaryRound38Capstone: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['primaryRound38Capstone'],
    twinRound38Capstone: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['twinRound38Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['capstoneCompare'],
    round39Export: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['round39Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound40(mockCap(), 2_121_263);
  push(
    'gov_prog_r40_export_o10',
    'wave 40 export tags O10-211 and loc hint',
    exported.o10TaskId === 'O10-211' &&
      exported.payload.projectedLocHint === 2_121_263 &&
      exported.payload.wave40HookLines.some(l => l.includes('O10-211'))
  );
  push(
    'gov_prog_r40_export_schema',
    'round 40 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round40-export.v1'
  );
  return results;
}
