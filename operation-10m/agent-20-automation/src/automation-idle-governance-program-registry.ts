import type { O10IdleGovernanceProgramAttestation } from './automation-idle-governance-program-attestation.js';
import type { O10IdleGovernanceProgramPassResult } from './automation-idle-governance-program-pass.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramRegistryEntry {
  schema: '10m.agent20.idle-governance-program-registry-entry.v1';
  turn: number;
  digestChain: string;
  charterPolicyLine: string;
  rollupRecommendation: string;
  attestOk: boolean;
}

export interface O10IdleGovernanceProgramRegistry {
  schema: '10m.agent20.idle-governance-program-registry.v1';
  entries: O10IdleGovernanceProgramRegistryEntry[];
}

export function createEmptyIdleGovernanceProgramRegistry(): O10IdleGovernanceProgramRegistry {
  return { schema: '10m.agent20.idle-governance-program-registry.v1', entries: [] };
}

export function appendIdleGovernanceProgramRegistryEntry(
  registry: O10IdleGovernanceProgramRegistry,
  pass: O10IdleGovernanceProgramPassResult,
  attestation: O10IdleGovernanceProgramAttestation,
  turn: number
): O10IdleGovernanceProgramRegistry {
  const entry: O10IdleGovernanceProgramRegistryEntry = {
    schema: '10m.agent20.idle-governance-program-registry-entry.v1',
    turn,
    digestChain: attestation.digestChain,
    charterPolicyLine: pass.charterPolicyLine,
    rollupRecommendation: attestation.rollupRecommendation,
    attestOk: attestation.ok,
  };
  return { schema: registry.schema, entries: [...registry.entries, entry].slice(-32) };
}

export function formatIdleGovernanceProgramRegistryDigest(registry: O10IdleGovernanceProgramRegistry): string {
  if (registry.entries.length === 0) return 'gov_program_registry entries=0';
  const last = registry.entries[registry.entries.length - 1];
  return `gov_program_registry entries=${registry.entries.length} last_ok=${last.attestOk} rollup=${last.rollupRecommendation}`;
}

export function runO10Agent20IdleGovernanceProgramRegistrySelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  let registry = createEmptyIdleGovernanceProgramRegistry();
  push('gov_prog_reg_empty', 'empty registry digest', formatIdleGovernanceProgramRegistryDigest(registry).includes('entries=0'));

  const mockAtt: O10IdleGovernanceProgramAttestation = {
    schema: '10m.agent20.idle-governance-program-attestation.v1',
    replayFrameCount: 1,
    effectiveCycles: 1,
    replayDeterministic: true,
    charterPolicyLine: 'charter ok',
    rollupRecommendation: 'continue_scheduled_watch',
    digestChain: 'o10govprog_deadbeef',
    ok: true,
    notes: [],
  };
  const mockPass: O10IdleGovernanceProgramPassResult = {
    schema: '10m.agent20.idle-governance-program-pass.v1',
    requestedCycles: 1,
    effectiveCycles: 1,
    charterPolicyLine: 'charter ok',
    replayDeterministic: true,
    summaryLine: 's',
    watch: {} as never,
    replayTape: {} as never,
  };

  registry = appendIdleGovernanceProgramRegistryEntry(registry, mockPass, mockAtt, 3);
  push('gov_prog_reg_append', 'append stores digest and rollup', registry.entries.length === 1 && registry.entries[0].digestChain.includes('o10govprog'));

  registry = appendIdleGovernanceProgramRegistryEntry(registry, mockPass, { ...mockAtt, ok: false, rollupRecommendation: 'escalate_to_human_takeover' }, 4);
  push('gov_prog_reg_digest', 'digest reflects last entry', formatIdleGovernanceProgramRegistryDigest(registry).includes('escalate_to_human_takeover'));

  push('gov_prog_reg_schema', 'registry schema marker', registry.schema === '10m.agent20.idle-governance-program-registry.v1');

  return results;
}
