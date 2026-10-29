/**
 * Agent 21 — lab cycle closeout rollup for scale-wave checkpoints (read-only round 11).
 */

import { buildAg21ExportClearance } from './forecast-export-clearance';
import { verifyAg21StagingIntegrity } from './forecast-staging-verification';
import { buildAg21LabStagingPacket } from './forecast-lab-staging-packet';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21LabCycleCloseout {
  closeoutId: string;
  moduleVersion: string;
  exportLevel: ReturnType<typeof buildAg21ExportClearance>['level'];
  stagingPhase: ReturnType<typeof buildAg21LabStagingPacket>['phase'];
  verificationStatus: ReturnType<typeof verifyAg21StagingIntegrity>['status'];
  summaryBullets: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Summarize round 10–11 staging path for operator closeout logs (round 11). */
export function summarizeAg21LabCycleCloseout(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabCycleCloseout {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.73),
      actorDebt: baseCtx.actorDebt + 215
    } satisfies Ag21ForecastContext);

  const staging = buildAg21LabStagingPacket(baseCtx, candidate);
  const verification = verifyAg21StagingIntegrity(baseCtx, candidate);
  const clearance = buildAg21ExportClearance(baseCtx, candidate);

  const closeoutId = `ag21_closeout_${baseCtx.turn}_${baseCtx.seed}_${clearance.level}`;

  const summaryBullets = [
    `staging phase ${staging.phase}`,
    `verification ${verification.status} (${verification.findings.length} findings)`,
    `export clearance ${clearance.level}`,
    `replay seed ${clearance.replaySeedId}`
  ];

  return {
    closeoutId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    exportLevel: clearance.level,
    stagingPhase: staging.phase,
    verificationStatus: verification.status,
    summaryBullets,
    disclaimer: '(Non-authoritative forecast.) Lab cycle closeout for Operation 10M checkpoints only.',
    overallUncertainty: ag21LabelUncertainty(
      clearance.level === 'cleared' && verification.status === 'verified' ? 'low' : 'moderate',
      [`closeout=${closeoutId}`, `export=${clearance.level}`]
    ),
    authoritative: false
  };
}

export function runAg21LabCycleCloseoutSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 26, seed: 9, actorCash: 1420, actorDebt: 48, regionsControlled: 5 };
  const closeout = summarizeAg21LabCycleCloseout(ctx);

  push('closeout_id', closeout.closeoutId.startsWith('ag21_closeout_'), closeout.closeoutId);
  push('closeout_bullets', closeout.summaryBullets.length === 4, String(closeout.summaryBullets.length));
  push('closeout_version', closeout.moduleVersion === O10M_AGENT21_MODULE_VERSION, closeout.moduleVersion);
  push('closeout_non_auth', closeout.authoritative === false, closeout.disclaimer.slice(0, 28));

  return out;
}
