import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ExportManifest } from './export-manifest.ts';
import type { Agent24ExportReadinessReport } from './export-readiness.ts';
import type { Agent24ReplayAttestation } from './replay-attestation.ts';

export type Agent24ImportValidationIssueKind =
  | 'manifest_incomplete'
  | 'fingerprint_mismatch'
  | 'export_not_ready'
  | 'attestation_not_verified';

export interface Agent24ImportValidationIssue {
  kind: Agent24ImportValidationIssueKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ImportValidationReport {
  reportId: string;
  matchId: string;
  valid: boolean;
  issueCount: number;
  issues: Agent24ImportValidationIssue[];
  validationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ImportValidationInput {
  matchId: string;
  manifest: Agent24ExportManifest;
  attestation: Agent24ReplayAttestation;
  exportReadiness: Agent24ExportReadinessReport;
  expectedCompositeFingerprint: string;
}

export function buildAgent24ImportValidationReport(input: Agent24ImportValidationInput): Agent24ImportValidationReport {
  const issues: Agent24ImportValidationIssue[] = [];

  if (!input.manifest.complete) {
    issues.push({
      kind: 'manifest_incomplete',
      detail: 'Export manifest missing required section fingerprints',
      fingerprint: o6kAgent24Fingerprint('import_manifest_incomplete', { complete: false }),
    });
  }
  if (input.manifest.compositeBundleFingerprint !== input.expectedCompositeFingerprint) {
    issues.push({
      kind: 'fingerprint_mismatch',
      detail: 'Manifest composite fingerprint does not match live bundle',
      fingerprint: o6kAgent24Fingerprint('import_fp_mismatch', {
        manifest: input.manifest.compositeBundleFingerprint,
        live: input.expectedCompositeFingerprint,
      }),
    });
  }
  if (!input.exportReadiness.ready) {
    issues.push({
      kind: 'export_not_ready',
      detail: `Export readiness blocked (${input.exportReadiness.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('import_not_ready', { blockers: input.exportReadiness.blockerCount }),
    });
  }
  if (input.attestation.status !== 'verified') {
    issues.push({
      kind: 'attestation_not_verified',
      detail: `Attestation status ${input.attestation.status}`,
      fingerprint: o6kAgent24Fingerprint('import_attest', { status: input.attestation.status }),
    });
  }

  const attestationSection = input.manifest.sections.find(s => s.kind === 'attestation');
  if (attestationSection && attestationSection.fingerprint !== input.attestation.deterministicFingerprint) {
    issues.push({
      kind: 'fingerprint_mismatch',
      detail: 'Manifest attestation section fingerprint stale',
      fingerprint: o6kAgent24Fingerprint('import_attest_fp', { stale: true }),
    });
  }

  issues.sort((a, b) => a.kind.localeCompare(b.kind));
  let validationScore = 100;
  validationScore -= issues.length * 22;
  validationScore = Math.max(0, Math.min(100, validationScore));
  const valid = issues.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('import_validation', { matchId: input.matchId, valid }),
    matchId: input.matchId,
    valid,
    issueCount: issues.length,
    issues,
    validationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('import_validation_body', {
      issues: issues.map(i => i.fingerprint),
      valid,
      validationScore,
    }),
  };
}

export function runAgent24ImportValidationSelfTests(): Array<{ name: string; passed: boolean }> {
  const composite = o6kAgent24Fingerprint('import_self_composite', { v: 1 });
  const attestationFp = o6kAgent24Fingerprint('import_self_attest', { v: 1 });
  const readinessFp = o6kAgent24Fingerprint('import_self_ready', { v: 1 });
  const manifest = {
    manifestId: 'm',
    matchId: 'self',
    sectionCount: 3,
    requiredSectionCount: 3,
    sections: [
      { kind: 'attestation' as const, label: 'A', fingerprint: attestationFp, required: true },
      { kind: 'composite_bundle' as const, label: 'C', fingerprint: composite, required: true },
    ],
    compositeBundleFingerprint: composite,
    complete: true,
    deterministicFingerprint: o6kAgent24Fingerprint('import_self_manifest', { v: 1 }),
  };
  const attestation = {
    attestationId: 'a',
    matchId: 'self',
    turn: 5,
    status: 'verified' as const,
    twinBuildPassed: true,
    integrityScore: 90,
    scenarioSatisfiedRatio: 1,
    resumeSafe: true,
    chainRoot: 'r',
    chainTip: 't',
    deterministicFingerprint: attestationFp,
  };
  const readiness = {
    reportId: 'r',
    matchId: 'self',
    ready: true,
    readinessScore: 100,
    blockerCount: 0,
    blockers: [],
    deterministicFingerprint: readinessFp,
  };
  const ok = buildAgent24ImportValidationReport({
    matchId: 'self',
    manifest,
    attestation,
    exportReadiness: readiness,
    expectedCompositeFingerprint: composite,
  });
  const bad = buildAgent24ImportValidationReport({
    matchId: 'self',
    manifest,
    attestation,
    exportReadiness: readiness,
    expectedCompositeFingerprint: o6kAgent24Fingerprint('wrong', { v: 2 }),
  });
  return [
    { name: 'valid_import', passed: ok.valid && ok.validationScore >= 90 },
    { name: 'mismatch_detected', passed: !bad.valid && bad.issues.some(i => i.kind === 'fingerprint_mismatch') },
  ];
}
