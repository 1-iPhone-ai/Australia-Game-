import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveFinalizationReport } from './archive-scale-wave-finalization.ts';
import type { Agent24ReplayScaleWaveCloseoutReport } from './replay-scale-wave-closeout.ts';
import type { Agent24ReplayScaleWaveVerificationReport } from './replay-scale-wave-verification.ts';

export type Agent24ReplayScaleWaveAttestationStatus = 'verified' | 'partial' | 'failed';

export interface Agent24ReplayScaleWaveAttestation {
  attestationId: string;
  matchId: string;
  waveRound: number;
  status: Agent24ReplayScaleWaveAttestationStatus;
  verificationOk: boolean;
  finalizationOk: boolean;
  closeoutOk: boolean;
  attestationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveAttestationInput {
  matchId: string;
  replayScaleWaveVerification: Agent24ReplayScaleWaveVerificationReport;
  archiveScaleWaveFinalization: Agent24ArchiveScaleWaveFinalizationReport;
  replayScaleWaveCloseout: Agent24ReplayScaleWaveCloseoutReport;
  minAttestationScore?: number;
}

export function buildAgent24ReplayScaleWaveAttestation(
  input: Agent24ReplayScaleWaveAttestationInput,
): Agent24ReplayScaleWaveAttestation {
  const waveRound = input.replayScaleWaveVerification.waveRound;
  const minScore = input.minAttestationScore ?? 72;

  const verificationOk =
    input.replayScaleWaveVerification.verified && input.replayScaleWaveVerification.verificationScore >= minScore;
  const finalizationOk =
    input.archiveScaleWaveFinalization.finalized && input.archiveScaleWaveFinalization.finalizationScore >= minScore;
  const closeoutOk =
    input.replayScaleWaveCloseout.closeoutComplete && input.replayScaleWaveCloseout.closeoutScore >= minScore;

  let attestationScore = 100;
  if (!verificationOk) attestationScore -= 28;
  if (!finalizationOk) attestationScore -= 32;
  if (!closeoutOk) attestationScore -= 22;
  attestationScore = Math.max(0, Math.min(100, Math.round(attestationScore)));

  let status: Agent24ReplayScaleWaveAttestationStatus = 'failed';
  if (verificationOk && finalizationOk && closeoutOk) status = 'verified';
  else if (attestationScore >= minScore) status = 'partial';

  return {
    attestationId: o6kAgent24Fingerprint('replay_scale_wave_attestation', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    status,
    verificationOk,
    finalizationOk,
    closeoutOk,
    attestationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_attestation_body', {
      waveRound,
      status,
      verificationOk,
      finalizationOk,
      closeoutOk,
      attestationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveAttestationSelfTests(): Array<{ name: string; passed: boolean }> {
  const closeout = {
    reportId: 'co',
    matchId: 'self',
    waveRound: 47,
    closeoutComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    closeoutScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswc_att', { v: 1 }),
  };
  const verification = {
    reportId: 'sv',
    matchId: 'self',
    waveRound: 47,
    verified: true,
    issueCount: 0,
    issues: [],
    closeoutScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswv_att', { v: 1 }),
  };
  const finalization = {
    reportId: 'fin',
    matchId: 'self',
    waveRound: 47,
    finalized: true,
    blockerCount: 0,
    blockers: [],
    finalizationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('aswf_att', { v: 1 }),
  };

  const attestation = buildAgent24ReplayScaleWaveAttestation({
    matchId: 'self',
    replayScaleWaveVerification: verification,
    archiveScaleWaveFinalization: finalization,
    replayScaleWaveCloseout: closeout,
  });

  return [
    { name: 'verified_when_scale_wave_attestation_ready', passed: attestation.status === 'verified' },
    { name: 'wave_round_pinned', passed: attestation.waveRound === 47 },
    {
      name: 'deterministic_fingerprint',
      passed:
        attestation.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveAttestation({
          matchId: 'self',
          replayScaleWaveVerification: verification,
          archiveScaleWaveFinalization: finalization,
          replayScaleWaveCloseout: closeout,
        }).deterministicFingerprint,
    },
  ];
}
