import type { O10IdleGovernanceProgramWaveAssemblyExportResult } from './automation-idle-governance-program-wave-assembly-export.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveAssemblyExportCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-export-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareExportPayloads(
  baseline: O10IdleGovernanceProgramWaveAssemblyExportResult,
  candidate: O10IdleGovernanceProgramWaveAssemblyExportResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.payload.runSucceeded !== candidate.payload.runSucceeded) {
    mismatches.push(
      `run_succeeded ${baseline.payload.runSucceeded} vs ${candidate.payload.runSucceeded}`
    );
  }
  const b = baseline.payload.assemblyDigest;
  const c = candidate.payload.assemblyDigest;
  if (b.gateOpen !== c.gateOpen) mismatches.push('digest_gate_open');
  if (b.scorecardParityOk !== c.scorecardParityOk) mismatches.push('digest_scorecard_parity');
  if (b.closeoutParityOk !== c.closeoutParityOk) mismatches.push('digest_closeout_parity');
  if (b.scorecardBand !== c.scorecardBand) mismatches.push('digest_band');
  if (baseline.payload.integrationHookLines.length !== candidate.payload.integrationHookLines.length) {
    mismatches.push('hook_line_count');
  } else {
    for (let i = 0; i < baseline.payload.integrationHookLines.length; i += 1) {
      if (baseline.payload.integrationHookLines[i] !== candidate.payload.integrationHookLines[i]) {
        mismatches.push(`hook_line_${i}`);
        break;
      }
    }
  }
  return mismatches;
}

/** Round-20 twin assembly export regression compare. */
export function compareIdleGovernanceProgramWaveAssemblyExports(
  baseline: O10IdleGovernanceProgramWaveAssemblyExportResult,
  candidate: O10IdleGovernanceProgramWaveAssemblyExportResult
): O10IdleGovernanceProgramWaveAssemblyExportCompareResult {
  const mismatches = compareExportPayloads(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_assembly_export_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-export-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyExportCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveAssemblyExportResult => ({
    schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1',
    waveRound: 20,
    exportMarkdown: 'md',
    summaryLine: 'exp',
    run: {} as O10IdleGovernanceProgramWaveAssemblyExportResult['run'],
    payload: {
      schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1',
      waveRound: 20,
      runSucceeded: true,
      assemblyDigest: {
        waveRound: 20,
        gateOpen: true,
        scorecardBand: 'green',
        waveRecommendation: 'advance_scale_wave',
        closeoutParityOk: true,
        scorecardParityOk: true,
        assemblyReady: true,
      },
      integrationHookLines: ['O10_AGENT20_WAVE_RUN ok=true'],
    },
  });

  const ok = compareIdleGovernanceProgramWaveAssemblyExports(twin(), twin());
  push('gov_prog_exp_cmp_parity', 'identical exports report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveAssemblyExports(twin(), {
    ...twin(),
    payload: { ...twin().payload, runSucceeded: false },
  });
  push(
    'gov_prog_exp_cmp_drift',
    'run_succeeded drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('run_succeeded'))
  );

  push(
    'gov_prog_exp_cmp_schema',
    'export compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-assembly-export-compare.v1'
  );

  return results;
}
