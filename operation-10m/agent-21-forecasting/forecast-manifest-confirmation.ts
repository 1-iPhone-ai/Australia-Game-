/**
 * Agent 21 — export manifest confirmation against archive seal (read-only round 13).
 */

import { buildAg21ExportManifest } from './forecast-export-manifest';
import { sealAg21LabArchiveRecord } from './forecast-lab-archive-seal';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21ManifestConfirmationStatus = 'confirmed' | 'pending' | 'revoked';

export interface Ag21ManifestConfirmation {
  status: Ag21ManifestConfirmationStatus;
  manifestId: string;
  sealStatus: ReturnType<typeof sealAg21LabArchiveRecord>['status'];
  manifestMayPublish: boolean;
  mismatchNotes: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Confirm export manifest aligns with archive seal state (round 13). */
export function confirmAg21ExportManifest(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ManifestConfirmation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.69),
      actorDebt: baseCtx.actorDebt + 255
    } satisfies Ag21ForecastContext);

  const manifest = buildAg21ExportManifest(baseCtx, candidate);
  const seal = sealAg21LabArchiveRecord(baseCtx, candidate);

  const mismatchNotes: string[] = [];
  if (seal.manifestId !== manifest.manifestId) {
    mismatchNotes.push('seal manifestId differs from live manifest');
  }
  if (seal.manifestMayPublish !== manifest.mayPublish) {
    mismatchNotes.push('publish flag mismatch between seal and manifest');
  }
  if (seal.status === 'sealed' && !manifest.mayPublish) {
    mismatchNotes.push('sealed archive but manifest mayPublish false');
  }
  if (seal.status === 'void' && manifest.exportLevel !== 'denied') {
    mismatchNotes.push('void seal with non-denied export level');
  }

  let status: Ag21ManifestConfirmationStatus = 'confirmed';
  if (seal.status === 'void' || mismatchNotes.length >= 2) status = 'revoked';
  else if (seal.status === 'open' || mismatchNotes.length === 1) status = 'pending';

  return {
    status,
    manifestId: manifest.manifestId,
    sealStatus: seal.status,
    manifestMayPublish: manifest.mayPublish,
    mismatchNotes,
    disclaimer: '(Non-authoritative forecast.) Manifest confirmation for export wiring only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'confirmed' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`confirm=${status}`, `notes=${mismatchNotes.length}`]
    ),
    authoritative: false
  };
}

export function runAg21ManifestConfirmationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 17, seed: 58, actorCash: 970, actorDebt: 100, regionsControlled: 3 };
  const confirmation = confirmAg21ExportManifest(ctx);

  push('confirm_status', ['confirmed', 'pending', 'revoked'].includes(confirmation.status), confirmation.status);
  push('confirm_manifest', confirmation.manifestId.startsWith('ag21_manifest_'), confirmation.manifestId);
  push('confirm_notes', Array.isArray(confirmation.mismatchNotes), String(confirmation.mismatchNotes.length));
  push('confirm_non_auth', confirmation.authoritative === false, confirmation.disclaimer.slice(0, 28));

  return out;
}
