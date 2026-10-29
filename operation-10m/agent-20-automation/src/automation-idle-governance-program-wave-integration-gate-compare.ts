import type { O10IdleGovernanceProgramWaveIntegrationGateResult } from './automation-idle-governance-program-wave-integration-gate.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveIntegrationGateCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-integration-gate-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareIntegrationGateFields(
  baseline: O10IdleGovernanceProgramWaveIntegrationGateResult,
  candidate: O10IdleGovernanceProgramWaveIntegrationGateResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.gateOpen !== candidate.gateOpen) {
    mismatches.push(`gate_open ${baseline.gateOpen} vs ${candidate.gateOpen}`);
  }
  if (baseline.exportCompare.parityOk !== candidate.exportCompare.parityOk) {
    mismatches.push('export_compare_parity');
  }
  if (baseline.replayParity.replayParityOk !== candidate.replayParity.replayParityOk) {
    mismatches.push('replay_parity');
  }
  if (
    baseline.primaryExport.payload.runSucceeded !== candidate.primaryExport.payload.runSucceeded
  ) {
    mismatches.push('primary_run_succeeded');
  }
  return mismatches;
}

/** Round-21 twin integration gate regression compare. */
export function compareIdleGovernanceProgramWaveIntegrationGates(
  baseline: O10IdleGovernanceProgramWaveIntegrationGateResult,
  candidate: O10IdleGovernanceProgramWaveIntegrationGateResult
): O10IdleGovernanceProgramWaveIntegrationGateCompareResult {
  const mismatches = compareIntegrationGateFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_integration_gate_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-integration-gate-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveIntegrationGateCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveIntegrationGateResult => ({
    schema: '10m.agent20.idle-governance-program-wave-integration-gate.v1',
    waveRound: 21,
    gateOpen: true,
    gateMarkdown: 'md',
    summaryLine: 'gate',
    primaryExport: {
      payload: { runSucceeded: true },
    } as O10IdleGovernanceProgramWaveIntegrationGateResult['primaryExport'],
    twinExport: {} as O10IdleGovernanceProgramWaveIntegrationGateResult['twinExport'],
    exportCompare: {
      parityOk: true,
      summaryLine: 'cmp',
    } as O10IdleGovernanceProgramWaveIntegrationGateResult['exportCompare'],
    replayParity: {
      replayParityOk: true,
      summaryLine: 'rpl',
    } as O10IdleGovernanceProgramWaveIntegrationGateResult['replayParity'],
  });

  const ok = compareIdleGovernanceProgramWaveIntegrationGates(twin(), twin());
  push('gov_prog_int_gate_cmp_parity', 'identical gates report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveIntegrationGates(twin(), { ...twin(), gateOpen: false });
  push(
    'gov_prog_int_gate_cmp_drift',
    'gate_open drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('gate_open'))
  );

  push(
    'gov_prog_int_gate_cmp_schema',
    'integration gate compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-integration-gate-compare.v1'
  );

  return results;
}
