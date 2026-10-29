import { V1014_REPLAY_DIFF_RULE_CATALOG, V1014_REPLAY_lookupDiffRule } from './diff-rule-catalog.generated';
import { V1014_REPLAY_fingerprint } from './primitives';
import type {
  V1014ReplaySnapshotPayload,
  V1014ReplayTurnDiffOp,
  V1014ReplayTurnDiffReport,
} from './types';

function readPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.').filter(Boolean);
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p.replace(/\{metric\}/g, 'gdp_index')];
  }
  return cur;
}

export function V1014_REPLAY_diffSnapshots(
  base: V1014ReplaySnapshotPayload,
  head: V1014ReplaySnapshotPayload,
): V1014ReplayTurnDiffReport {
  const ops: V1014ReplayTurnDiffOp[] = [];
  let netScalar = 0;
  const domains = new Set([...Object.keys(base.domainSlices), ...Object.keys(head.domainSlices)]);
  for (const domain of domains) {
    const b = base.domainSlices[domain as keyof typeof base.domainSlices];
    const h = head.domainSlices[domain as keyof typeof head.domainSlices];
    if (!b || !h) continue;
    for (const key of Object.keys(h.scalarMetrics)) {
      const fromValue = b.scalarMetrics[key] ?? 0;
      const toValue = h.scalarMetrics[key] ?? 0;
      const delta = Number(toValue) - Number(fromValue);
      if (Math.abs(delta) < 1e-9) continue;
      netScalar += delta;
      const rule = V1014_REPLAY_DIFF_RULE_CATALOG.find(r => r.kind === 'scalar_delta')!;
      ops.push({
        opId: V1014_REPLAY_fingerprint('diff_op', { domain, key, delta }),
        kind: 'scalar_delta',
        path: `domainSlices.${domain}.scalarMetrics.${key}`,
        fromValue,
        toValue,
        magnitude: Math.abs(delta),
        ruleId: rule.ruleId,
        coordinate: head.header.coordinate,
      });
    }
  }
  for (const rule of V1014_REPLAY_DIFF_RULE_CATALOG) {
    if (ops.length > 400) break;
    if (rule.kind === 'scalar_delta') continue;
    const fromValue = readPath(base as unknown as Record<string, unknown>, rule.pathTemplate);
    const toValue = readPath(head as unknown as Record<string, unknown>, rule.pathTemplate);
    if (fromValue === toValue) continue;
    if (!V1014_REPLAY_lookupDiffRule(rule.ruleId)) continue;
    ops.push({
      opId: V1014_REPLAY_fingerprint('diff_op_rule', rule.ruleId),
      kind: rule.kind,
      path: rule.pathTemplate,
      fromValue,
      toValue,
      magnitude: rule.weight,
      ruleId: rule.ruleId,
      coordinate: head.header.coordinate,
    });
  }
  const fingerprint = V1014_REPLAY_fingerprint('diff_report', { base: base.header.headerId, head: head.header.headerId, ops: ops.length });
  return {
    reportId: fingerprint,
    baseSnapshotId: base.header.headerId,
    headSnapshotId: head.header.headerId,
    ops,
    netScalarDelta: netScalar,
    branchIsolationVerified: base.header.isolatedBranchId === head.header.isolatedBranchId,
    fingerprint,
  };
}
