/**
 * Agent 21 — export manifest for history module wiring (read-only round 12).
 */

import { attestAg21LabCloseout } from './forecast-closeout-attestation';
import { buildAg21ExportClearance } from './forecast-export-clearance';
import { buildAg21LabReplaySeed } from './forecast-lab-replay-seed';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21ExportManifestEntry {
  key: string;
  value: string;
}

export interface Ag21ExportManifest {
  manifestId: string;
  moduleVersion: string;
  attestationVerdict: ReturnType<typeof attestAg21LabCloseout>['verdict'];
  exportLevel: ReturnType<typeof buildAg21ExportClearance>['level'];
  entries: Ag21ExportManifestEntry[];
  mayPublish: boolean;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Build structured export manifest when clearance allows history publish (round 12). */
export function buildAg21ExportManifest(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ExportManifest {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.71),
      actorDebt: baseCtx.actorDebt + 235
    } satisfies Ag21ForecastContext);

  const attestation = attestAg21LabCloseout(baseCtx, candidate);
  const clearance = buildAg21ExportClearance(baseCtx, candidate);
  const replay = buildAg21LabReplaySeed(baseCtx, candidate);

  const entries: Ag21ExportManifestEntry[] = [
    { key: 'replaySeed', value: replay.seedId },
    { key: 'replayFingerprint', value: replay.fingerprint },
    { key: 'attestation', value: attestation.attestationId },
    { key: 'closeout', value: attestation.closeoutId },
    { key: 'clearance', value: clearance.level }
  ];

  const mayPublish = clearance.level === 'cleared' && attestation.verdict === 'accepted';
  const manifestId = `ag21_manifest_${baseCtx.turn}_${baseCtx.seed}_${clearance.level}`;

  return {
    manifestId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    attestationVerdict: attestation.verdict,
    exportLevel: clearance.level,
    entries,
    mayPublish,
    disclaimer: '(Non-authoritative forecast.) Export manifest for Agent 24 history wiring only.',
    overallUncertainty: ag21LabelUncertainty(
      mayPublish ? 'low' : clearance.level === 'denied' ? 'high' : 'moderate',
      [`manifest=${manifestId}`, `publish=${mayPublish}`]
    ),
    authoritative: false
  };
}

export function runAg21ExportManifestSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 20, seed: 12, actorCash: 1050, actorDebt: 80, regionsControlled: 4 };
  const manifest = buildAg21ExportManifest(ctx);

  push('manifest_id', manifest.manifestId.startsWith('ag21_manifest_'), manifest.manifestId);
  push('manifest_entries', manifest.entries.length === 5, String(manifest.entries.length));
  push('manifest_version', manifest.moduleVersion === O10M_AGENT21_MODULE_VERSION, manifest.moduleVersion);
  push('manifest_non_auth', manifest.authoritative === false, manifest.disclaimer.slice(0, 28));

  return out;
}
