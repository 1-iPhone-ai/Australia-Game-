import type { O10IdleGovernanceProgramWaveRound29CapstoneResult } from './automation-idle-governance-program-wave-round29-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound30ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round30-export.v1';
  waveRound: 30;
  o10TaskId: 'O10-191';
  projectedLocHint: number;
  round30Ready: boolean;
  wave30HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound30ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round30-export.v1';
  waveRound: 30;
  o10TaskId: 'O10-191';
  round29Capstone: O10IdleGovernanceProgramWaveRound29CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound30ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-30 / wave-30 export for O10-191 integration hooks. */
export function exportIdleGovernanceProgramWaveRound30(
  round29Capstone: O10IdleGovernanceProgramWaveRound29CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound30ExportResult {
  const round30Ready = round29Capstone.capstoneReady;

  const wave30HookLines = [
    `O10_AGENT20_WAVE30 task=O10-191 round=30`,
    `O10_AGENT20_WAVE30 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE30 round30_ready=${round30Ready}`,
    `O10_AGENT20_WAVE30 prior_capstone=${round29Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE30 prior_task=${round29Capstone.o10TaskId}`,
  ];

  const payload: O10IdleGovernanceProgramWaveRound30ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round30-export.v1',
    waveRound: 30,
    o10TaskId: 'O10-191',
    projectedLocHint,
    round30Ready,
    wave30HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 scale wave round 30 export (O10-191)',
    '',
    ...wave30HookLines.map(line => `- ${line}`),
    '',
    round29Capstone.capstoneMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round30_export',
    'task=O10-191',
    'round=30',
    `ready=${round30Ready}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round30-export.v1',
    waveRound: 30,
    o10TaskId: 'O10-191',
    round29Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound30ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCap = (): O10IdleGovernanceProgramWaveRound29CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round29-capstone.v1',
    o10TaskId: 'O10-189',
    waveRound: 29,
    capstoneReady: true,
    capstoneMarkdown: '# r29',
    summaryLine: 's',
    primaryRound28Capstone: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['primaryRound28Capstone'],
    twinRound28Capstone: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['twinRound28Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['capstoneCompare'],
    round29Export: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['round29Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound30(mockCap(), 1_721_932);
  push(
    'gov_prog_r30_export_o10',
    'wave 30 export tags O10-191 and loc hint',
    exported.o10TaskId === 'O10-191' &&
      exported.payload.projectedLocHint === 1_721_932 &&
      exported.payload.wave30HookLines.some(l => l.includes('O10-191'))
  );

  push(
    'gov_prog_r30_export_schema',
    'round 30 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round30-export.v1'
  );

  return results;
}
