import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24BranchLineageReport } from './branch-lineage.ts';
import type { Agent24ExportReadinessReport } from './export-readiness.ts';
import type { Agent24ReplayAttestation } from './replay-attestation.ts';

export type Agent24ExportManifestSectionKind =
  | 'attestation'
  | 'export_readiness'
  | 'branch_lineage'
  | 'composite_bundle';

export interface Agent24ExportManifestSection {
  kind: Agent24ExportManifestSectionKind;
  label: string;
  fingerprint: string;
  required: boolean;
}

export interface Agent24ExportManifest {
  manifestId: string;
  matchId: string;
  sectionCount: number;
  requiredSectionCount: number;
  sections: Agent24ExportManifestSection[];
  compositeBundleFingerprint: string;
  complete: boolean;
  deterministicFingerprint: string;
}

export interface Agent24ExportManifestInput {
  matchId: string;
  attestation: Agent24ReplayAttestation;
  exportReadiness: Agent24ExportReadinessReport;
  branchLineage: Agent24BranchLineageReport;
  compositeBundleFingerprint: string;
}

export function buildAgent24ExportManifest(input: Agent24ExportManifestInput): Agent24ExportManifest {
  const sections: Agent24ExportManifestSection[] = [
    {
      kind: 'attestation',
      label: 'Replay attestation',
      fingerprint: input.attestation.deterministicFingerprint,
      required: true,
    },
    {
      kind: 'export_readiness',
      label: 'Export readiness gate',
      fingerprint: input.exportReadiness.deterministicFingerprint,
      required: true,
    },
    {
      kind: 'branch_lineage',
      label: 'Branch lineage map',
      fingerprint: input.branchLineage.deterministicFingerprint,
      required: input.branchLineage.nodeCount > 1,
    },
    {
      kind: 'composite_bundle',
      label: 'Composite determinism bundle',
      fingerprint: input.compositeBundleFingerprint,
      required: true,
    },
  ];

  sections.sort((a, b) => a.kind.localeCompare(b.kind));
  const requiredSectionCount = sections.filter(s => s.required).length;
  const complete = sections.every(s => !s.required || s.fingerprint.length > 0);

  return {
    manifestId: o6kAgent24Fingerprint('export_manifest', { matchId: input.matchId, sections: sections.length }),
    matchId: input.matchId,
    sectionCount: sections.length,
    requiredSectionCount,
    sections,
    compositeBundleFingerprint: input.compositeBundleFingerprint,
    complete,
    deterministicFingerprint: o6kAgent24Fingerprint('export_manifest_body', {
      sections: sections.map(s => ({ kind: s.kind, fp: s.fingerprint, req: s.required })),
      complete,
    }),
  };
}

export function runAgent24ExportManifestSelfTests(): Array<{ name: string; passed: boolean }> {
  const attestationFp = o6kAgent24Fingerprint('test_attest', { ok: 1 });
  const readinessFp = o6kAgent24Fingerprint('test_ready', { ok: 1 });
  const lineageFp = o6kAgent24Fingerprint('test_lineage', { ok: 1 });
  const composite = o6kAgent24Fingerprint('test_composite', { ok: 1 });
  const input = {
    matchId: 'self',
    attestation: {
      attestationId: 'a',
      matchId: 'self',
      turn: 1,
      status: 'verified' as const,
      twinBuildPassed: true,
      integrityScore: 90,
      scenarioSatisfiedRatio: 1,
      resumeSafe: true,
      chainRoot: 'r',
      chainTip: 't',
      deterministicFingerprint: attestationFp,
    },
    exportReadiness: {
      reportId: 'r',
      matchId: 'self',
      ready: true,
      readinessScore: 100,
      blockerCount: 0,
      blockers: [],
      deterministicFingerprint: readinessFp,
    },
    branchLineage: {
      reportId: 'l',
      matchId: 'self',
      nodeCount: 1,
      maxDepth: 0,
      deepestNodeId: 'root',
      nodes: [],
      deterministicFingerprint: lineageFp,
    },
    compositeBundleFingerprint: composite,
  };
  const manifest = buildAgent24ExportManifest(input);
  const twin = buildAgent24ExportManifest(input);
  return [
    { name: 'manifest_complete', passed: manifest.complete && manifest.sectionCount >= 3 },
    { name: 'deterministic_fingerprint', passed: manifest.deterministicFingerprint === twin.deterministicFingerprint },
  ];
}
