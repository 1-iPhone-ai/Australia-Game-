/**
 * Agent 21 — archive seal tying manifest to attestation (read-only round 12).
 */

import { buildAg21ExportManifest } from './forecast-export-manifest';
import { attestAg21LabCloseout } from './forecast-closeout-attestation';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21ArchiveSealStatus = 'open' | 'sealed' | 'void';

export interface Ag21LabArchiveSeal {
  sealId: string;
  status: Ag21ArchiveSealStatus;
  manifestId: string;
  manifestMayPublish: boolean;
  attestationVerdict: ReturnType<typeof attestAg21LabCloseout>['verdict'];
  sealDigest: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21SealDigest(manifestId: string, attestationId: string, verdict: string): string {
  return `ag21_seal_${manifestId.split('_').slice(-2).join('_')}_${verdict}_${attestationId.split('_').pop()}`;
}

/** Seal lab archive when manifest and attestation agree (round 12). */
export function sealAg21LabArchiveRecord(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabArchiveSeal {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.7),
      actorDebt: baseCtx.actorDebt + 245
    } satisfies Ag21ForecastContext);

  const manifest = buildAg21ExportManifest(baseCtx, candidate);
  const attestation = attestAg21LabCloseout(baseCtx, candidate);

  let status: Ag21ArchiveSealStatus = 'open';
  if (attestation.verdict === 'rejected' || manifest.exportLevel === 'denied') status = 'void';
  else if (manifest.mayPublish && attestation.verdict === 'accepted') status = 'sealed';

  const sealId = `ag21_archive_${baseCtx.turn}_${baseCtx.seed}_${status}`;

  return {
    sealId,
    status,
    manifestId: manifest.manifestId,
    manifestMayPublish: manifest.mayPublish,
    attestationVerdict: attestation.verdict,
    sealDigest: ag21SealDigest(manifest.manifestId, attestation.attestationId, attestation.verdict),
    disclaimer: '(Non-authoritative forecast.) Archive seal for modular checkpoint logs only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'sealed' ? 'low' : status === 'void' ? 'high' : 'moderate',
      [`seal=${sealId}`, `status=${status}`, `v=${O10M_AGENT21_MODULE_VERSION}`]
    ),
    authoritative: false
  };
}

export function runAg21LabArchiveSealSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 28, seed: 5, actorCash: 1500, actorDebt: 40, regionsControlled: 5 };
  const seal = sealAg21LabArchiveRecord(ctx);

  push('seal_id', seal.sealId.startsWith('ag21_archive_'), seal.sealId);
  push('seal_status', ['open', 'sealed', 'void'].includes(seal.status), seal.status);
  push('seal_digest', seal.sealDigest.startsWith('ag21_seal_'), seal.sealDigest.slice(0, 24));
  push('seal_non_auth', seal.authoritative === false, seal.disclaimer.slice(0, 28));

  return out;
}
