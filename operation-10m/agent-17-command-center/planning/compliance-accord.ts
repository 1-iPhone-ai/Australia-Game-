import type {
  Agent17CharterIndexSnapshot,
  Agent17ComplianceAccordSnapshot,
  Agent17SanctionAccordSnapshot,
  Agent17StatuteIndexSnapshot,
} from '../types/command-center-types.ts';
import { charterIndexBlocksSanction } from './charter-index.ts';
import { sanctionAccordBlocksStatute } from './sanction-accord.ts';
import { statuteIndexBlocksCompliance } from './statute-index.ts';

export interface Agent17ComplianceAccordInputs {
  statuteIndex: Agent17StatuteIndexSnapshot;
  sanctionAccord: Agent17SanctionAccordSnapshot;
  charterIndex: Agent17CharterIndexSnapshot;
}

export function buildAgent17ComplianceAccord(
  inputs: Agent17ComplianceAccordInputs
): Agent17ComplianceAccordSnapshot {
  const checks: Agent17ComplianceAccordSnapshot['checks'] = [];

  checks.push({
    id: 'statute_codified',
    label: 'Statute index statute-codified',
    verified:
      inputs.statuteIndex.statuteCodified &&
      !statuteIndexBlocksCompliance(inputs.statuteIndex),
    weight: 30,
  });

  checks.push({
    id: 'statute_band',
    label: 'Statute codified or drafting',
    verified:
      inputs.statuteIndex.band === 'codified' || inputs.statuteIndex.band === 'drafting',
    weight: 25,
  });

  checks.push({
    id: 'sanction_binding',
    label: 'Sanction accord binding-ready',
    verified:
      inputs.sanctionAccord.sanctionBinding &&
      !sanctionAccordBlocksStatute(inputs.sanctionAccord),
    weight: 20,
  });

  checks.push({
    id: 'charter_clear',
    label: 'Charter index not blocking sanction',
    verified: !charterIndexBlocksSanction(inputs.charterIndex),
    weight: 15,
  });

  checks.push({
    id: 'statute_score',
    label: 'Statute score headroom',
    verified: inputs.statuteIndex.statuteScore >= 33,
    weight: 10,
  });

  const weighted = checks.reduce(
    (n, c) => n + (c.verified ? 100 : 5) * (c.weight / 100),
    0
  );
  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const complianceScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const breachedSignals =
    statuteIndexBlocksCompliance(inputs.statuteIndex) ||
    sanctionAccordBlocksStatute(inputs.sanctionAccord) ||
    charterIndexBlocksSanction(inputs.charterIndex);

  const band: Agent17ComplianceAccordSnapshot['band'] = breachedSignals
    ? 'breached'
    : complianceScore >= 56 &&
        inputs.statuteIndex.band === 'codified' &&
        inputs.sanctionAccord.band === 'binding'
      ? 'verified'
      : 'pending';

  const complianceVerified =
    band === 'verified' &&
    inputs.statuteIndex.statuteCodified &&
    !charterIndexBlocksSanction(inputs.charterIndex);

  return {
    complianceScore,
    band,
    checks,
    statuteBand: inputs.statuteIndex.band,
    sanctionBand: inputs.sanctionAccord.band,
    complianceVerified,
    headline: `Compliance ${band} (${complianceScore}/100) · ${checks.filter(c => c.verified).length}/${checks.length} checks`,
  };
}

export function complianceAccordBlocksStatute(snapshot: Agent17ComplianceAccordSnapshot): boolean {
  return snapshot.band === 'breached' || !snapshot.complianceVerified;
}

export function complianceAccordBlocksAudit(snapshot: Agent17ComplianceAccordSnapshot): boolean {
  return snapshot.band === 'breached' || !snapshot.complianceVerified;
}
