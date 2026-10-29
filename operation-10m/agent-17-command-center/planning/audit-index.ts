import type {
  Agent17AuditIndexSnapshot,
  Agent17ComplianceAccordSnapshot,
  Agent17SanctionAccordSnapshot,
  Agent17StatuteIndexSnapshot,
} from '../types/command-center-types.ts';
import { complianceAccordBlocksAudit } from './compliance-accord.ts';
import { sanctionAccordBlocksStatute } from './sanction-accord.ts';
import { statuteIndexBlocksCompliance } from './statute-index.ts';

export interface Agent17AuditIndexInputs {
  complianceAccord: Agent17ComplianceAccordSnapshot;
  statuteIndex: Agent17StatuteIndexSnapshot;
  sanctionAccord: Agent17SanctionAccordSnapshot;
}

export function buildAgent17AuditIndex(
  inputs: Agent17AuditIndexInputs
): Agent17AuditIndexSnapshot {
  const findings: Agent17AuditIndexSnapshot['findings'] = [];

  findings.push({
    id: 'compliance_verified',
    label: 'Compliance accord verified',
    cleared:
      inputs.complianceAccord.complianceVerified &&
      !complianceAccordBlocksAudit(inputs.complianceAccord),
    weight: 30,
  });

  findings.push({
    id: 'compliance_band',
    label: 'Compliance verified or pending',
    cleared:
      inputs.complianceAccord.band === 'verified' ||
      inputs.complianceAccord.band === 'pending',
    weight: 25,
  });

  findings.push({
    id: 'statute_codified',
    label: 'Statute index statute-codified',
    cleared:
      inputs.statuteIndex.statuteCodified && !statuteIndexBlocksCompliance(inputs.statuteIndex),
    weight: 20,
  });

  findings.push({
    id: 'sanction_clear',
    label: 'Sanction accord not blocking statute',
    cleared: !sanctionAccordBlocksStatute(inputs.sanctionAccord),
    weight: 15,
  });

  findings.push({
    id: 'compliance_score',
    label: 'Compliance score headroom',
    cleared: inputs.complianceAccord.complianceScore >= 32,
    weight: 10,
  });

  const weighted = findings.reduce(
    (n, f) => n + (f.cleared ? 100 : 6) * (f.weight / 100),
    0
  );
  const totalWeight = findings.reduce((n, f) => n + f.weight, 0);
  const auditScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const failedSignals =
    complianceAccordBlocksAudit(inputs.complianceAccord) ||
    statuteIndexBlocksCompliance(inputs.statuteIndex) ||
    sanctionAccordBlocksStatute(inputs.sanctionAccord);

  const band: Agent17AuditIndexSnapshot['band'] = failedSignals
    ? 'failed'
    : auditScore >= 58 &&
        inputs.complianceAccord.band === 'verified' &&
        inputs.statuteIndex.band === 'codified'
      ? 'passed'
      : 'open';

  const auditPassed =
    band === 'passed' &&
    inputs.complianceAccord.complianceVerified &&
    !complianceAccordBlocksAudit(inputs.complianceAccord);

  return {
    auditScore,
    band,
    findings,
    complianceBand: inputs.complianceAccord.band,
    statuteBand: inputs.statuteIndex.band,
    auditPassed,
    headline: `Audit ${band} (${auditScore}/100) · ${findings.filter(f => f.cleared).length}/${findings.length} findings`,
  };
}

export function auditIndexBlocksAttestation(snapshot: Agent17AuditIndexSnapshot): boolean {
  return snapshot.band === 'failed' || !snapshot.auditPassed;
}
