import type { O10IdleGovernanceProgramWaveRound50CapstoneResult } from './automation-idle-governance-program-wave-round50-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound51ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round51-export.v1';
  waveRound: 51;
  o10TaskId: 'O10-233';
  projectedLocHint: number;
  round51Ready: boolean;
  wave51HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound51ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round51-export.v1';
  waveRound: 51;
  o10TaskId: 'O10-233';
  round50Capstone: O10IdleGovernanceProgramWaveRound50CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound51ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-51 / wave-51 export for O10-233 integration hooks. */
export function exportIdleGovernanceProgramWaveRound51(
  round50Capstone: O10IdleGovernanceProgramWaveRound50CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound51ExportResult {
  const round51Ready = round50Capstone.capstoneReady;
  const wave51HookLines = [
    `O10_AGENT20_WAVE51 task=O10-233 round=51`,
    `O10_AGENT20_WAVE51 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE51 round51_ready=${round51Ready}`,
    `O10_AGENT20_WAVE51 prior_capstone=${round50Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE51 prior_task=${round50Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE51 integration_baseline=a32b2b15`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound51ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round51-export.v1',
    waveRound: 51,
    o10TaskId: 'O10-233',
    projectedLocHint,
    round51Ready,
    wave51HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 51 export (O10-233)',
    '',
    ...wave51HookLines.map(line => `- ${line}`),
    '',
    round50Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round51_export', 'task=O10-233', 'round=51', `ready=${round51Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round51-export.v1',
    waveRound: 51,
    o10TaskId: 'O10-233',
    round50Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound51ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound50CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round50-capstone.v1',
    o10TaskId: 'O10-231',
    waveRound: 50,
    capstoneReady: true,
    capstoneMarkdown: '# r50',
    summaryLine: 's',
    primaryRound49Capstone: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['primaryRound49Capstone'],
    twinRound49Capstone: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['twinRound49Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['capstoneCompare'],
    round50Export: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['round50Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound51(mockCap(), 2_887_600);
  push(
    'gov_prog_r51_export_o10',
    'wave 51 export tags O10-233 and loc hint',
    exported.o10TaskId === 'O10-233' &&
      exported.payload.projectedLocHint === 2_887_600 &&
      exported.payload.wave51HookLines.some(l => l.includes('O10-233'))
  );
  push(
    'gov_prog_r51_export_schema',
    'round 51 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round51-export.v1'
  );
  return results;
}
