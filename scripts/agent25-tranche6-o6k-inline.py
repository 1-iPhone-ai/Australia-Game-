#!/usr/bin/env python3
"""Agent 25 — Tranche 6 O6K inline merges (push #2 trade, #3 replay, #4 public services)."""
from __future__ import annotations

import argparse
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from agent25_o6k_inline_lib import (  # noqa: E402
    ANCHOR,
    V94,
    bundle_local_files,
    energy_environment_paths,
    scenario_packs_paths,
    ai_fidelity_paths,
    insert_before,
    paths_from_index,
    public_services_paths,
    trade_sanctions_paths,
)

TRADE_MARKER = "export function runV1014TradeDepthTurn"
REPLAY_MARKER = "export function runV1014ReplayCounterfactualSelfTests"
PUBSVC_MARKER = "export function V1014_PUBSVC_computePublicServicesCrosswalk"
ENERGY_MARKER = "export function V1014_ENERGY_DEPTH_turnHook"
SCENARIO_MARKER = "export function runV1014ScenarioV2SelfTests"
AI_FIDELITY_MARKER = "export function runV1014AiFidelityTurn"

TRADE_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BA: V10.14 TRADE DEPTH — TARIFFS, SANCTIONS & CAPITAL CONTROLS (T6-6)\n"
    "// ============================================================================\n"
)

REPLAY_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20AY: V10.14 REPLAY & COUNTERFACTUAL ANALYTICS (T6-3 / Agent 24 depth)\n"
    "// ============================================================================\n"
)

PUBSVC_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20AZ: V10.14 PUBLIC SERVICES CROSSWALK v2 (T6-5)\n"
    "// ============================================================================\n"
)

ENERGY_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BC: V10.14 ENERGY DEPTH — GRID, DEPLETION, INTERMITTENCY, CARBON (T6-4)\n"
    "// ============================================================================\n"
)

SCENARIO_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BD: V10.14 SCENARIO & OBJECTIVE ENGINE v2 (T6-2)\n"
    "// ============================================================================\n"
)

AI_FIDELITY_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BE: V10.14 AI FIDELITY — PLAN→ACT→VERIFY LOOPS (T6-8)\n"
    "// Nested sub-blocks: ACC17 verify (20BC refs), UI unlock adapter (20BD UI gates), orchestrator + adapters\n"
    "// ============================================================================\n"
)

TRADE_HELPERS = """
export function buildV1014TradeDepthTurnInputFromGameState(gs: any, turn: number): V1014TradeDepthTurnInput {
  const persisted = sanitizeV1014TradeDepthPersisted(gs?.v1014TradeDepth, turn);
  return {
    turn,
    seed: Number(gs?.rngSeed ?? turn * 9973) % 2147483647,
    gtelAccessBand: (gs?.globalTradeEconomy?.accessBand as V1014TradeDepthAccessBand) || 'normal',
    diplomacyTrust: Number(gs?.diplomacyState?.aggregateTrust ?? gs?.diplomacy?.trustIndex ?? 50),
    tradeDeficitIndex: Number(gs?.globalTradeEconomy?.tradeDeficitIndex ?? 45),
    fiscalPressureBand: (gs?.publicFinance?.pressureBand as V1014TradeDepthFiscalBand) || 'healthy',
    householdSentiment: Number(gs?.householdEconomy?.sentimentIndex ?? 50),
    investmentClimateScore: Number(gs?.strategicCapital?.climateScore ?? 55),
    counterpartySanctionsActive: Boolean(gs?.diplomacyState?.sanctionsActive),
    bilateralPairIds: Object.keys(persisted.bilateralSnapshots || {}),
    activeSanctionPackages: persisted.activePackages || [],
    capitalRegimeIds: Object.keys(persisted.capitalRegimes || {}),
    persisted,
  };
}
"""

PUBSVC_HELPERS = """
export function buildV1014PubsSvcCrosswalkInputsFromGameState(gs: any, turn: number): Partial<V1014PubsSvcCrosswalkInputs> {
  const ps = gs?.publicServices;
  const wf = gs?.workforceHumanCapital ?? gs?.workforce;
  const hh = gs?.householdEconomy;
  return {
    turn,
    ap20: {
      turn,
      nationalOutcomeIndex: Number(ps?.nationalOutcomeIndex ?? 55),
      regionalOutcome: ps?.regionalOutcome ?? {},
    },
    ac20: {
      turn,
      nationalReadiness: Number(wf?.nationalReadiness ?? 58),
      specialistGap: Number(wf?.specialistGap ?? 28),
      regionalSkillSupply: wf?.regionalSkillSupply ?? {},
    },
    aj20: {
      turn,
      migrationFlowBand: (gs?.laborDemographics?.migrationFlowBand as any) || 'balanced',
      regionalAttractiveness: gs?.laborDemographics?.regionalAttractiveness ?? {},
      wagePressureIndex: Number(gs?.laborDemographics?.wagePressureIndex ?? 48),
    },
    af20: {
      turn,
      affordabilityStress: Number(hh?.affordabilityStress ?? 42),
      regionalLivingStandard: hh?.regionalLivingStandard ?? {},
      domesticDemandPull: Number(hh?.domesticDemandPull ?? 50),
    },
    fiscalHeadroom: Number(gs?.publicFinance?.headroomIndex ?? 55),
    policyFocus: ps?.policyFocus ?? { housing: 50, healthcare: 52, education: 54 },
  };
}

function V1014_PUBSVC_readSection6Slice(gs: any): V1014PubsSvcSection6Persisted | null {
  const raw = gs?.save?.meta?.v1014?.public_services_v2;
  return raw ? V1014_PUBSVC_migrateSection6Persisted(raw) : null;
}

function V1014_PUBSVC_patchSection6Slice(gs: any, persisted: V1014PubsSvcSection6Persisted): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1014 = { ...(meta.v1014 || {}) };
  v1014.public_services_v2 = persisted;
  meta.v1014 = v1014;
  save.meta = meta;
  return { ...gs, save };
}
"""

TRADE_DAY_HOOK = """
      if (typeof runV1014TradeDepthTurn === 'function') {
        try {
          const tdIn = buildV1014TradeDepthTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          const tdOut = runV1014TradeDepthTurn(tdIn);
          mergedGameState = { ...mergedGameState, v1014TradeDepth: tdOut.persisted };
        } catch (_) { /* isolated */ }
      }
"""

REPLAY_DAY_HOOK = """
      if (typeof V1014_REPLAY_encodeSnapshot === 'function' && typeof V1014_REPLAY_patchPersistenceSlice === 'function') {
        try {
          const branchId = String(mergedGameState?.replayBranchTree?.activeNodeId ?? 'root');
          const prevSlice = V1014_REPLAY_readPersistenceSlice(mergedGameState) ?? {
            schemaVersion: V1014_REPLAY_SCHEMA_VERSION,
            archiveRing: [],
            activeBranch: null,
            lastDiffReportId: null,
            section6SlotBindings: {},
            scrubberIndex: 0,
            forecastOverlay: null,
            dashboardTiles: [],
          };
          const snap = V1014_REPLAY_encodeSnapshot({
            matchId: String(mergedGameState?.matchId ?? mergedGameState?.id ?? 'live'),
            turn: passCtx.turnCounter,
            day: passCtx.newDay,
            sequence: passIndex,
            branchNodeId: branchId,
          });
          const nextSlice = {
            ...prevSlice,
            schemaVersion: V1014_REPLAY_SCHEMA_VERSION,
            archiveRing: V1014_REPLAY_pushArchiveRing(prevSlice.archiveRing ?? [], snap, 48),
          };
          mergedGameState = V1014_REPLAY_patchPersistenceSlice(mergedGameState, nextSlice);
        } catch (_) { /* isolated */ }
      }
"""

PUBSVC_DAY_HOOK = """
      if (typeof V1014_PUBSVC_computePublicServicesCrosswalk === 'function') {
        try {
          const inputs = buildV1014PubsSvcCrosswalkInputsFromGameState(mergedGameState, passCtx.turnCounter);
          const prev6 = V1014_PUBSVC_readSection6Slice(mergedGameState);
          const cross = V1014_PUBSVC_computePublicServicesCrosswalk(inputs, prev6);
          mergedGameState = V1014_PUBSVC_patchSection6Slice(mergedGameState, cross.persisted);
          mergedGameState = { ...mergedGameState, v1014PublicServicesCrosswalk: cross.snapshot };
        } catch (_) { /* isolated */ }
      }
"""


def wire_pubsvc_day_hook(text: str) -> str:
    marker = "V1014_PUBSVC_patchSection6Slice(mergedGameState, cross.persisted)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:15000]
    if marker in day_slice:
        print("skip pubsvc day hook (present)")
        return text
    trade_tail = """      if (typeof runV1014TradeDepthTurn === 'function') {
        try {
          const tdIn = buildV1014TradeDepthTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          const tdOut = runV1014TradeDepthTurn(tdIn);
          mergedGameState = { ...mergedGameState, v1014TradeDepth: tdOut.persisted };
        } catch (_) { /* isolated */ }
      }"""
    if trade_tail not in text:
        raise SystemExit("trade day hook anchor missing for pubsvc hook")
    return text.replace(trade_tail, trade_tail + PUBSVC_DAY_HOOK, 1)


ENERGY_HELPERS = """
function V1014_ENERGY_DEPTH_readPersistedFromGameState(gs: any): V1014EnergyDepthPersisted | null {
  const raw = gs?.save?.meta?.v1014?.energy_depth;
  return raw ? sanitizeV1014EnergyDepthPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1014_ENERGY_DEPTH_applyEnergyDepthToGameState(
  gs: any,
  out: { state: V1014EnergyDepthState; persisted: V1014EnergyDepthPersisted },
): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1014 = { ...(meta.v1014 || {}) };
  v1014.energy_depth = out.persisted;
  meta.v1014 = v1014;
  save.meta = meta;
  return { ...gs, save, energyDepth: out.state };
}
"""

ENERGY_DAY_HOOK = """
      if (typeof V1014_ENERGY_DEPTH_turnHook === 'function') {
        try {
          const eIn = buildV1014EnergyDepthInputs({
            turn: passCtx.turnCounter,
            enabled: settings?.energyDepthEnabled !== false,
            gameState: mergedGameState,
            industrialEnergyState: mergedGameState?.industrialEnergy ?? null,
            industriesState: mergedGameState?.industries ?? null,
            infrastructureState: mergedGameState?.infrastructureNetworks ?? null,
            systemicRiskState: mergedGameState?.systemicRisk ?? null,
          });
          const eOut = V1014_ENERGY_DEPTH_turnHook({
            inputs: eIn,
            persisted: V1014_ENERGY_DEPTH_readPersistedFromGameState(mergedGameState),
            prevState: mergedGameState?.energyDepth ?? null,
          });
          mergedGameState = V1014_ENERGY_DEPTH_applyEnergyDepthToGameState(mergedGameState, eOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_energy_day_hook(text: str) -> str:
    marker = "V1014_ENERGY_DEPTH_applyEnergyDepthToGameState(mergedGameState, eOut)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:18000]
    if marker in day_slice:
        print("skip energy day hook (present)")
        return text
    pubsvc_tail = """      if (typeof V1014_PUBSVC_computePublicServicesCrosswalk === 'function') {
        try {
          const inputs = buildV1014PubsSvcCrosswalkInputsFromGameState(mergedGameState, passCtx.turnCounter);
          const prev6 = V1014_PUBSVC_readSection6Slice(mergedGameState);
          const cross = V1014_PUBSVC_computePublicServicesCrosswalk(inputs, prev6);
          mergedGameState = V1014_PUBSVC_patchSection6Slice(mergedGameState, cross.persisted);
          mergedGameState = { ...mergedGameState, v1014PublicServicesCrosswalk: cross.snapshot };
        } catch (_) { /* isolated */ }
      }"""
    if pubsvc_tail not in text:
        raise SystemExit("pubsvc day hook anchor missing for energy hook")
    return text.replace(pubsvc_tail, pubsvc_tail + ENERGY_DAY_HOOK, 1)


def wire_energy_migration(text: str) -> str:
    anchor = "  if (migrated.gameState) {\n    const pubsRaw = (migrated.gameState as any)?.save?.meta?.v1014?.public_services_v2;"
    patch = (
        "  if (migrated.gameState) {\n"
        "    const energyRaw = (migrated.gameState as any)?.save?.meta?.v1014?.energy_depth;\n"
        "    if (energyRaw && typeof sanitizeV1014EnergyDepthPersisted === 'function') {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1014 = { ...(meta.v1014 || {}) };\n"
        "      v1014.energy_depth = sanitizeV1014EnergyDepthPersisted(energyRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1014 = v1014;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1014.energy_depth = sanitizeV1014EnergyDepthPersisted" in text:
        print("skip energy §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("pubsvc §6 anchor missing for energy migration")
    return text.replace(anchor, patch + anchor, 1)


def wire_day_hooks(text: str, extra_hook: str, hook_id: str) -> str:
    anchor = "        v1014SupplyChain: supplyOut?.persisted ?? mergedGameState?.v1014SupplyChain,\n      };"
    runtime_marker = extra_hook.strip().split("\n", 1)[0].strip()
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:12000]
    if runtime_marker in day_slice:
        print(f"skip day hook {hook_id}")
        return text
    if anchor not in text:
        raise SystemExit("orchestrator supply anchor missing for day hook")
    return text.replace(anchor, anchor + extra_hook, 1)


def wire_trade_migration(text: str) -> str:
    needle = "  if (migrated.gameState) migrated.gameState.v1014SupplyChain = sanitizeV1014SupplyChainPersisted(migrated.gameState.v1014SupplyChain);"
    patch = needle + "\n  if (migrated.gameState) migrated.gameState.v1014TradeDepth = sanitizeV1014TradeDepthPersisted(migrated.gameState.v1014TradeDepth, Number(migrated.gameState.turnCounter || 0));"
    if "sanitizeV1014TradeDepthPersisted" in text and "v1014TradeDepth" in text.split("migrateSavePayload")[1][:8000] if "migrateSavePayload" in text else False:
        return text
    if "migrated.gameState.v1014TradeDepth" in text:
        print("skip trade §6 migration")
        return text
    if needle not in text:
        raise SystemExit("§6 supply anchor missing")
    return text.replace(needle, patch, 1)


def wire_replay_migration(text: str) -> str:
    anchor = "  if (migrated.gameState) migrated.gameState.v1014TradeDepth = sanitizeV1014TradeDepthPersisted"
    patch = (
        "  if (migrated.gameState && typeof V1014_REPLAY_readPersistenceSlice === 'function') {\n"
        "    const replaySlice = V1014_REPLAY_readPersistenceSlice(migrated.gameState);\n"
        "    if (replaySlice) migrated.gameState = V1014_REPLAY_patchPersistenceSlice(migrated.gameState, replaySlice);\n"
        "  }\n"
    )
    if "V1014_REPLAY_readPersistenceSlice(migrated.gameState)" in text:
        print("skip replay §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("trade §6 anchor missing for replay migration insert")
    return text.replace(anchor, patch + anchor, 1)


def wire_pubsvc_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof V1014_REPLAY_readPersistenceSlice === 'function') {"
    patch = (
        "  if (migrated.gameState) {\n"
        "    const pubsRaw = (migrated.gameState as any)?.save?.meta?.v1014?.public_services_v2;\n"
        "    if (pubsRaw && typeof V1014_PUBSVC_migrateSection6Persisted === 'function') {\n"
        "      migrated.gameState = V1014_PUBSVC_patchSection6Slice(\n"
        "        migrated.gameState,\n"
        "        V1014_PUBSVC_migrateSection6Persisted(pubsRaw),\n"
        "      );\n"
        "    }\n"
        "  }\n"
    )
    if "V1014_PUBSVC_patchSection6Slice" in text and "public_services_v2" in text:
        if "pubsRaw" in text:
            print("skip pubsvc §6 migration")
            return text
    if anchor not in text:
        raise SystemExit("replay §6 anchor missing for pubsvc migration")
    return text.replace(anchor, patch + anchor, 1)


SCENARIO_HELPERS = """
function V1014_SCENARIO_V2_readPersistedFromGameState(gs: any): V1014ScenarioV2Persisted | null {
  const raw = (gs?.save?.meta?.v1014 as any)?.v1014_scenario_v2_state;
  if (!raw) return null;
  const mig = migrateV1014ScenarioV2Persisted(raw);
  return mig.ok ? mig.persisted : null;
}

function V1014_SCENARIO_V2_applyPersistedToGameState(gs: any, persisted: V1014ScenarioV2Persisted): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1014 = { ...(meta.v1014 || {}) };
  v1014.v1014_scenario_v2_state = persisted;
  meta.v1014 = v1014;
  save.meta = meta;
  return { ...gs, save, v1014ScenarioV2: persisted };
}

export function V1014_SCENARIO_V2_turnHook(args: {
  turn: number;
  gameState: any;
  settings?: GameSettingsState | undefined;
}): { gameState: any } {
  const { turn, settings } = args;
  let gs = args.gameState;
  if (settings?.scenarioV2Enabled === false) return { gameState: gs };
  if (typeof V1014_SCENARIO_V2_CATALOG_BY_ID !== 'object') return { gameState: gs };
  let persisted = V1014_SCENARIO_V2_readPersistedFromGameState(gs);
  const scenarioId =
    persisted?.activeScenarioId ??
    (typeof gs?.activeScenarioId === 'string' ? gs.activeScenarioId : null) ??
    (typeof gs?.selectedScenarioId === 'string' ? gs.selectedScenarioId : null);
  if (!scenarioId) return { gameState: gs };
  const scenario = V1014_SCENARIO_V2_CATALOG_BY_ID[scenarioId];
  if (!scenario) return { gameState: gs };
  const graph = V1014_SCENARIO_V2_GRAPH_BY_ID[scenario.missionGraphId];
  if (!graph) return { gameState: gs };
  if (!persisted || persisted.missionGraphId !== graph.id) {
    persisted = initializeV1014ScenarioV2Run(scenario, graph, turn);
  } else {
    persisted = {
      ...persisted,
      revision: persisted.revision + 1,
      inputHash: buildV1014ScenarioV2InputHash(scenario, graph, turn),
    };
  }
  gs = V1014_SCENARIO_V2_applyPersistedToGameState(gs, persisted);
  return { gameState: gs };
}

(function wireV1014ScenarioV2PresetSpread() {
  if (typeof V1014_SCENARIO_V2_CATALOG === 'undefined') return;
  const extras = V1014_SCENARIO_V2_CATALOG as PresetScenario[];
  for (const s of extras) {
    if (!PRESET_GAME_SCENARIOS.some((p) => p.id === s.id)) PRESET_GAME_SCENARIOS.push(s);
  }
})();
"""

SCENARIO_DAY_HOOK = """
      if (typeof V1014_SCENARIO_V2_turnHook === 'function') {
        try {
          const sv2 = V1014_SCENARIO_V2_turnHook({
            turn: passCtx.turnCounter,
            gameState: mergedGameState,
            settings,
          });
          mergedGameState = sv2.gameState;
        } catch (_) { /* isolated */ }
      }
"""


def wire_scenario_day_hook(text: str) -> str:
    marker = "V1014_SCENARIO_V2_turnHook({"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:20000]
    if marker in day_slice:
        print("skip scenario day hook (present)")
        return text
    energy_tail = """      if (typeof V1014_ENERGY_DEPTH_turnHook === 'function') {
        try {
          const eIn = buildV1014EnergyDepthInputs({
            turn: passCtx.turnCounter,
            enabled: settings?.energyDepthEnabled !== false,
            gameState: mergedGameState,
            industrialEnergyState: mergedGameState?.industrialEnergy ?? null,
            industriesState: mergedGameState?.industries ?? null,
            infrastructureState: mergedGameState?.infrastructureNetworks ?? null,
            systemicRiskState: mergedGameState?.systemicRisk ?? null,
          });
          const eOut = V1014_ENERGY_DEPTH_turnHook({
            inputs: eIn,
            persisted: V1014_ENERGY_DEPTH_readPersistedFromGameState(mergedGameState),
            prevState: mergedGameState?.energyDepth ?? null,
          });
          mergedGameState = V1014_ENERGY_DEPTH_applyEnergyDepthToGameState(mergedGameState, eOut);
        } catch (_) { /* isolated */ }
      }"""
    if energy_tail not in text:
        raise SystemExit("energy day hook anchor missing for scenario hook")
    return text.replace(energy_tail, energy_tail + SCENARIO_DAY_HOOK, 1)


def wire_scenario_migration(text: str) -> str:
    anchor = "  if (migrated.gameState) {\n    const energyRaw = (migrated.gameState as any)?.save?.meta?.v1014?.energy_depth;"
    patch = (
        "  if (migrated.gameState && typeof migrateV1014ScenarioV2Persisted === 'function') {\n"
        "    const sv2Raw = (migrated.gameState as any)?.save?.meta?.v1014?.v1014_scenario_v2_state;\n"
        "    if (sv2Raw) {\n"
        "      const mig = migrateV1014ScenarioV2Persisted(sv2Raw);\n"
        "      if (mig.ok) {\n"
        "        const save = { ...((migrated.gameState as any).save || {}) };\n"
        "        const meta = { ...(save.meta || {}) };\n"
        "        const v1014 = { ...(meta.v1014 || {}) };\n"
        "        v1014.v1014_scenario_v2_state = mig.persisted;\n"
        "        meta.v1014 = v1014;\n"
        "        save.meta = meta;\n"
        "        migrated.gameState = { ...(migrated.gameState as any), save, v1014ScenarioV2: mig.persisted };\n"
        "      }\n"
        "    }\n"
        "  }\n"
    )
    if "v1014.v1014_scenario_v2_state = mig.persisted" in text:
        print("skip scenario §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("energy §6 anchor missing for scenario migration")
    return text.replace(anchor, patch + anchor, 1)


def wire_lab(text: str, lab_line: str, lab_id: str) -> str:
    token = f"{{ id: '{lab_id}'"
    if token in text:
        print(f"skip LAB {lab_id}")
        return text
    return text.replace("  { id: 'v1014_fiscal',", lab_line + "  { id: 'v1014_fiscal',", 1)


def push_trade(text: str) -> str:
    block = TRADE_SECTION + bundle_local_files(trade_sanctions_paths()) + TRADE_HELPERS
    text = insert_before(text, block, TRADE_MARKER, "T6 push #2 trade-sanctions (PR #306)")
    text = wire_day_hooks(text, TRADE_DAY_HOOK, "runV1014TradeDepthTurn(tdIn)")
    text = wire_trade_migration(text)
    lab = """  { id: 'v1014_trade_depth', label: 'V10.14 Trade depth (T6-6 tariffs/sanctions/capital)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1014TradeDepthSelfTestsForLab() },
"""
    text = wire_lab(text, lab, "v1014_trade_depth")
    return text


def push_replay(text: str) -> str:
    replay_paths = paths_from_index("expansion/o6k-10m/replay-counterfactual/generated/index.ts")
    block = REPLAY_SECTION + bundle_local_files(replay_paths)
    text = insert_before(text, block, REPLAY_MARKER, "T6 push #3 replay-counterfactual (PR #307)")
    text = wire_day_hooks(text, REPLAY_DAY_HOOK, "V1014_REPLAY_encodeSnapshot")
    text = wire_replay_migration(text)
    lab = """  { id: 'o6k_agent24_v2', label: 'Agent 24 replay counterfactual v2 (T6-3)', tier: 'quick', section: 'Replay Integrity', severity: 'MAJOR', run: () => { const r = runV1014ReplayCounterfactualSelfTests(); return r.results.map(x => ({ id: x.id, name: x.name, passed: x.passed, detail: x.detail || (x.passed ? 'ok' : 'fail') })); } },
"""
    text = wire_lab(text, lab, "o6k_agent24_v2")
    return text


def push_pubsvc(text: str) -> str:
    block = PUBSVC_SECTION + bundle_local_files(public_services_paths()) + PUBSVC_HELPERS
    text = insert_before(text, block, PUBSVC_MARKER, "T6 push #4 public-services (PR #310)")
    text = wire_pubsvc_day_hook(text)
    text = wire_pubsvc_migration(text)
    lab = """  { id: 'v1014_public_services_v2', label: 'V10.14 Public services crosswalk v2 (20AZ)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1014PublicServicesV2SelfTests().results.map((r) => ({ id: r.id, name: r.name, passed: r.passed, detail: r.detail })) },
"""
    text = wire_lab(text, lab, "v1014_public_services_v2")
    return text


def push_energy(text: str) -> str:
    block = ENERGY_SECTION + bundle_local_files(energy_environment_paths()) + ENERGY_HELPERS
    text = insert_before(text, block, ENERGY_MARKER, "T6 push #5 energy-environment (PR #330)")
    text = wire_energy_day_hook(text)
    text = wire_energy_migration(text)
    lab = """  { id: 'v1014_energy_depth', label: 'V10.14 Energy depth (grid, depletion, intermittency, carbon)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1014EnergyDepthSelfTests() },
"""
    text = wire_lab(text, lab, "v1014_energy_depth")
    return text


def push_scenario(text: str) -> str:
    block = SCENARIO_SECTION + bundle_local_files(scenario_packs_paths()) + SCENARIO_HELPERS
    text = insert_before(text, block, SCENARIO_MARKER, "T6 push #6 scenario-packs (PR #335)")
    text = wire_scenario_day_hook(text)
    text = wire_scenario_migration(text)
    lab = """  { id: 'v1014_scenarios_v2', label: 'V10.14 Scenario engine v2 (T6-2)', tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1014ScenarioV2SelfTests().map((r) => ({ id: r.id, name: r.name, passed: r.passed, detail: r.detail })) },
"""
    text = wire_lab(text, lab, "v1014_scenarios_v2")
    return text


AI_FIDELITY_HELPERS = """
function V1014_AI_FIDELITY_readPersistedFromGameState(gs: any): V1014AiFidelityPersisted | null {
  const raw = (gs?.save?.meta?.v1014 as any)?.ai_fidelity;
  return raw ? sanitizeV1014AiFidelityPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1014_AI_FIDELITY_applyToGameState(gs: any, out: V1014AiFidelityTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1014 = { ...(meta.v1014 || {}) };
  v1014.ai_fidelity = out.persisted;
  meta.v1014 = v1014;
  save.meta = meta;
  return { ...gs, save, v1014AiFidelity: out.state };
}
"""

AI_FIDELITY_DAY_HOOK = """
      if (typeof runV1014AiFidelityTurn === 'function') {
        try {
          const aiIn = buildV1014AiFidelityTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          aiIn.persisted = V1014_AI_FIDELITY_readPersistedFromGameState(mergedGameState);
          const aiOut = runV1014AiFidelityTurn(aiIn);
          mergedGameState = V1014_AI_FIDELITY_applyToGameState(mergedGameState, aiOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_ai_fidelity_day_hook(text: str) -> str:
    marker = "runV1014AiFidelityTurn(aiIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:22000]
    if marker in day_slice:
        print("skip ai fidelity day hook (present)")
        return text
    scenario_tail = """      if (typeof V1014_SCENARIO_V2_turnHook === 'function') {
        try {
          const sv2 = V1014_SCENARIO_V2_turnHook({
            turn: passCtx.turnCounter,
            gameState: mergedGameState,
            settings,
          });
          mergedGameState = sv2.gameState;
        } catch (_) { /* isolated */ }
      }"""
    if scenario_tail not in text:
        raise SystemExit("scenario day hook anchor missing for ai fidelity hook")
    return text.replace(scenario_tail, scenario_tail + AI_FIDELITY_DAY_HOOK, 1)


def wire_ai_fidelity_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof migrateV1014ScenarioV2Persisted === 'function') {"
    patch = (
        "  if (migrated.gameState) {\n"
        "    const aiRaw = (migrated.gameState as any)?.save?.meta?.v1014?.ai_fidelity;\n"
        "    if (aiRaw && typeof sanitizeV1014AiFidelityPersisted === 'function') {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1014 = { ...(meta.v1014 || {}) };\n"
        "      v1014.ai_fidelity = sanitizeV1014AiFidelityPersisted(aiRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1014 = v1014;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1014.ai_fidelity = sanitizeV1014AiFidelityPersisted" in text:
        print("skip ai fidelity §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("scenario §6 anchor missing for ai fidelity migration")
    return text.replace(anchor, patch + anchor, 1)


def push_ai_fidelity(text: str) -> str:
    block = AI_FIDELITY_SECTION + bundle_local_files(ai_fidelity_paths()) + AI_FIDELITY_HELPERS
    text = insert_before(text, block, AI_FIDELITY_MARKER, "T6 push #7 ai-fidelity (PR #337)")
    text = wire_ai_fidelity_day_hook(text)
    text = wire_ai_fidelity_migration(text)
    lab = """  { id: 'v1014_ai_fidelity', label: 'V10.14 AI fidelity (T6-8 plan/act/verify + UI gates)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1014AiFidelitySelfTestsForLab() },
"""
    text = wire_lab(text, lab, "v1014_ai_fidelity")
    return text


def write_loc_report() -> None:
    out = ROOT / "expansion/o6k-10m/trade-sanctions"
    store = pathlib.Path("/cursor/stores/self/internal/trade-sanctions-t6-6-loc-per-file.txt")
    lines: list[str] = []
    for p in sorted(out.rglob("*")):
        if p.is_file() and p.suffix in {".ts", ".md"}:
            n = len(p.read_text(encoding="utf-8").splitlines())
            lines.append(f"{n:6d} {p}")
    store.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {store}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("push", type=int, choices=[2, 3, 4, 5, 6, 7])
    args = ap.parse_args()
    text = V94.read_text(encoding="utf-8")
    before = len(text.splitlines())
    if args.push == 2:
        text = push_trade(text)
        write_loc_report()
    elif args.push == 3:
        text = push_replay(text)
    elif args.push == 4:
        text = push_pubsvc(text)
    elif args.push == 5:
        text = push_energy(text)
    elif args.push == 6:
        text = push_scenario(text)
    elif args.push == 7:
        text = push_ai_fidelity(text)
    V94.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    print(f"lines {before} -> {after} (+{after - before})")


if __name__ == "__main__":
    main()
