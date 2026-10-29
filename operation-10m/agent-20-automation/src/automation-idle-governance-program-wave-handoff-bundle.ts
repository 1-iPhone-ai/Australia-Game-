import type { O10IdleGovernanceProgramWaveIntegrationGateResult } from './automation-idle-governance-program-wave-integration-gate.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveHandoffBundlePayload {
  schema: '10m.agent20.idle-governance-program-wave-handoff-bundle.v1';
  waveRound: number;
  gateOpen: boolean;
  integrationHookLines: string[];
  handoffDigestLines: string[];
}

export interface O10IdleGovernanceProgramWaveHandoffBundleResult {
  schema: '10m.agent20.idle-governance-program-wave-handoff-bundle.v1';
  waveRound: number;
  gate: O10IdleGovernanceProgramWaveIntegrationGateResult;
  payload: O10IdleGovernanceProgramWaveHandoffBundlePayload;
  bundleMarkdown: string;
  summaryLine: string;
}

function buildHandoffDigestLines(gate: O10IdleGovernanceProgramWaveIntegrationGateResult): string[] {
  const exp = gate.primaryExport.payload;
  return [
    `O10_AGENT20_WAVE_HANDOFF round=${gate.waveRound}`,
    `O10_AGENT20_WAVE_INTEGRATION_GATE open=${gate.gateOpen}`,
    `O10_AGENT20_WAVE_EXPORT_COMPARE parity=${gate.exportCompare.parityOk}`,
    `O10_AGENT20_WAVE_REPLAY parity=${gate.replayParity.replayParityOk}`,
    `O10_AGENT20_WAVE_DIGEST run_ok=${exp.runSucceeded} band=${exp.assemblyDigest.scorecardBand}`,
  ];
}

/** Round-21 handoff bundle flattening integration gate for scale-wave coordination. */
export function bundleIdleGovernanceProgramWaveHandoff(
  gate: O10IdleGovernanceProgramWaveIntegrationGateResult
): O10IdleGovernanceProgramWaveHandoffBundleResult {
  const integrationHookLines = gate.primaryExport.payload.integrationHookLines;
  const handoffDigestLines = buildHandoffDigestLines(gate);

  const payload: O10IdleGovernanceProgramWaveHandoffBundlePayload = {
    schema: '10m.agent20.idle-governance-program-wave-handoff-bundle.v1',
    waveRound: gate.waveRound,
    gateOpen: gate.gateOpen,
    integrationHookLines: [...integrationHookLines],
    handoffDigestLines,
  };

  const bundleMarkdown = [
    '# Agent 20 idle governance wave handoff bundle',
    '',
    ...handoffDigestLines.map(line => `- ${line}`),
    '',
    gate.gateMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_handoff_bundle',
    `round=${gate.waveRound}`,
    `open=${gate.gateOpen}`,
    `digests=${handoffDigestLines.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-handoff-bundle.v1',
    waveRound: gate.waveRound,
    gate,
    payload,
    bundleMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveHandoffBundleSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockGate = (): O10IdleGovernanceProgramWaveIntegrationGateResult => ({
    schema: '10m.agent20.idle-governance-program-wave-integration-gate.v1',
    waveRound: 21,
    gateOpen: true,
    gateMarkdown: '# gate',
    summaryLine: 'gate',
    exportCompare: { parityOk: true, summaryLine: 'c' } as O10IdleGovernanceProgramWaveIntegrationGateResult['exportCompare'],
    replayParity: { replayParityOk: true, summaryLine: 'r' } as O10IdleGovernanceProgramWaveIntegrationGateResult['replayParity'],
    twinExport: {} as O10IdleGovernanceProgramWaveIntegrationGateResult['twinExport'],
    primaryExport: {
      payload: {
        runSucceeded: true,
        integrationHookLines: ['hook-a'],
        assemblyDigest: {
          waveRound: 21,
          gateOpen: true,
          scorecardBand: 'green',
          waveRecommendation: 'advance_scale_wave',
          closeoutParityOk: true,
          scorecardParityOk: true,
          assemblyReady: true,
        },
      },
    } as O10IdleGovernanceProgramWaveIntegrationGateResult['primaryExport'],
  });

  const bundle = bundleIdleGovernanceProgramWaveHandoff(mockGate());
  push(
    'gov_prog_handoff_bundle_lines',
    'handoff bundle includes digest and hook lines',
    bundle.payload.handoffDigestLines.length === 5 &&
      bundle.payload.integrationHookLines[0] === 'hook-a' &&
      bundle.bundleMarkdown.includes('handoff bundle')
  );

  push(
    'gov_prog_handoff_bundle_schema',
    'handoff bundle schema marker',
    bundle.schema === '10m.agent20.idle-governance-program-wave-handoff-bundle.v1'
  );

  return results;
}
