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
    workforce_migration_paths,
    national_resilience_paths,
    fiscal_federalism_paths,
    intercity_logistics_paths,
    research_pipeline_paths,
    maritime_trade_paths,
    intermodal_freight_paths,
    housing_affordability_paths,
    climate_adaptation_paths,
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
WORKFORCE_MARKER = "export function runV1014WorkforceMigrationTurn"
NRES_MARKER = "export function runV1016NresTurn"
FFED_MARKER = "export function runV1018FfedTurn"
ICLOG_MARKER = "export function runV1017IclogTurn"
RPIPE_MARKER = "export function runV1020RpipeTurn"
MTRD_MARKER = "export function runV1019MtrdTurn"
IMFD_MARKER = "export function runV1021ImfdTurn"
HAFF_MARKER = "export function runV1022HaffTurn"
CLAD_MARKER = "export function runV1023CladTurn"

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

WORKFORCE_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BF: V10.14 WORKFORCE MIGRATION v2 — SKILLS GRAPH & 20AJ SCENARIOS (O6K-25)\n"
    "// Renumbered from shard 20BD (canonical 20BD = scenario packs, 20BE = AI fidelity)\n"
    "// ============================================================================\n"
)

NRES_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BH: V10.16 NATIONAL RESILIENCE — SUPPLY SHOCK & CONTINUITY (O6K-33)\n"
    "// Renumbered from shard 20BG (canonical 20BG = T6 mega cross-domain depth, push #9)\n"
    "// ============================================================================\n"
)

FFED_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BJ: V10.18 FISCAL FEDERALISM — TRANSFERS, GRANT STACKS & AUDIT TRAILS (O6K-37)\n"
    "// Renumbered from shard 20BI (canonical 20BI = T6 mega2 lattice, push #11)\n"
    "// ============================================================================\n"
)

ICLOG_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BK: V10.17 INTERCITY LOGISTICS — FREIGHT ROUTES & CORRIDOR HUBS (O6K-36)\n"
    "// Renumbered from shard 20BI (canonical 20BI = mega2, 20BJ = fiscal federalism)\n"
    "// ============================================================================\n"
)

RPIPE_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BM: V10.20 RESEARCH PIPELINE — COMMERCIALIZATION, LAB TRANSFER & SCENARIOS (O6K-42)\n"
    "// Renumbered from shard 20BL (canonical 20BL = T6 mega3 wave-4, push #14)\n"
    "// ============================================================================\n"
)

MTRD_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BN: V10.19 MARITIME TRADE — SHIPPING LANES, PORT GRAPH & ENERGY COUPLING (O6K-41)\n"
    "// Renumbered from shard 20BM (canonical 20BM = research pipeline, push #15)\n"
    "// ============================================================================\n"
)

IMFD_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BP: V10.21 INTERMODAL FREIGHT — CORRIDOR HANDOFFS, DWELL HUBS & CROSS-STACK BRIDGES (O6K-45)\n"
    "// Renumbered from shard 20BO (canonical 20BO = T6 mega4 wave-5 lattice, push #17)\n"
    "// ============================================================================\n"
)

HAFF_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BQ: V10.22 HOUSING AFFORDABILITY — STRESS SCENARIOS, SUPPLY PIPELINE & ZONING FRICTION (O6K-49)\n"
    "// Renumbered from shard 20BP (canonical 20BP = intermodal freight, push #18)\n"
    "// ============================================================================\n"
)

CLAD_SECTION = (
    "// ============================================================================\n"
    "// SECTION 20BR: V10.23 CLIMATE ADAPTATION — HAZARD SCENARIOS, DROUGHT BUFFERS & FLOOD DEFEND (O6K-50)\n"
    "// Renumbered from shard 20BQ (canonical 20BQ = housing affordability, push #19)\n"
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


WORKFORCE_HELPERS = """
function V1014_WORKFORCE_readPersistedFromGameState(gs: any): V1014WorkforcePersisted | null {
  const raw = (gs?.save?.meta?.v1014 as any)?.workforce_v2;
  return raw ? sanitizeV1014WorkforceMigrationPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1014_WORKFORCE_applyToGameState(gs: any, out: V1014WorkforceTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1014 = { ...(meta.v1014 || {}) };
  v1014.workforce_v2 = out.persisted;
  meta.v1014 = v1014;
  save.meta = meta;
  return { ...gs, save, v1014WorkforceV2: out.state };
}

export function buildV1014WorkforceMigrationTurnInputFromGameState(gs: any, turn: number): V1014WorkforceTurnInput {
  const seed = typeof gs?.seed === 'number' ? gs.seed : 9001;
  const hc = gs?.workforceHumanCapital ?? gs?.workforce ?? null;
  const labor = gs?.laborDemographics ?? null;
  const household = gs?.householdEconomy ?? null;
  return {
    turn,
    seed,
    ac20: {
      turn,
      nationalReadiness: Number(hc?.nationalReadiness ?? hc?.readiness ?? 58),
      specialistGap: Number(hc?.specialistGap ?? 32),
      regionalSkillSupply: (hc?.regionalSkillSupply as any) ?? { NSW: 54, VIC: 52 },
    },
    aj20: {
      turn,
      migrationFlowBand: (labor?.migrationFlowBand as any) ?? 'balanced',
      regionalAttractiveness: (labor?.regionalAttractiveness as any) ?? { NSW: 55, QLD: 48 },
      wagePressureIndex: Number(labor?.wagePressureIndex ?? 46),
      visaBacklogTurns: Number(labor?.visaBacklogTurns ?? 3),
    },
    af20: {
      turn,
      affordabilityStress: Number(household?.affordabilityStress ?? 41),
      regionalLivingStandard: (household?.regionalLivingStandard as any) ?? { NSW: 53, WA: 49 },
      domesticDemandPull: Number(household?.domesticDemandPull ?? 50),
    },
    fiscalHeadroom: Number(gs?.publicFinance?.headroom ?? 58),
    policyRetrainFocus: Number(hc?.policyRetrainFocus ?? 44),
    activeScenarioIds: [],
    activeCorridorIds: [],
    persisted: null,
  };
}
"""

WORKFORCE_DAY_HOOK = """
      if (typeof runV1014WorkforceMigrationTurn === 'function') {
        try {
          const wfIn = buildV1014WorkforceMigrationTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          wfIn.persisted = V1014_WORKFORCE_readPersistedFromGameState(mergedGameState);
          const wfOut = runV1014WorkforceMigrationTurn(wfIn);
          mergedGameState = V1014_WORKFORCE_applyToGameState(mergedGameState, wfOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_workforce_day_hook(text: str) -> str:
    marker = "runV1014WorkforceMigrationTurn(wfIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:24000]
    if marker in day_slice:
        print("skip workforce day hook (present)")
        return text
    ai_tail = """      if (typeof runV1014AiFidelityTurn === 'function') {
        try {
          const aiIn = buildV1014AiFidelityTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          aiIn.persisted = V1014_AI_FIDELITY_readPersistedFromGameState(mergedGameState);
          const aiOut = runV1014AiFidelityTurn(aiIn);
          mergedGameState = V1014_AI_FIDELITY_applyToGameState(mergedGameState, aiOut);
        } catch (_) { /* isolated */ }
      }"""
    if ai_tail not in text:
        raise SystemExit("ai fidelity day hook anchor missing for workforce hook")
    return text.replace(ai_tail, ai_tail + WORKFORCE_DAY_HOOK, 1)


def wire_workforce_migration(text: str) -> str:
    anchor = "  if (migrated.gameState) {\n    const aiRaw = (migrated.gameState as any)?.save?.meta?.v1014?.ai_fidelity;"
    patch = (
        "  if (migrated.gameState) {\n"
        "    const wfRaw = (migrated.gameState as any)?.save?.meta?.v1014?.workforce_v2;\n"
        "    if (wfRaw && typeof sanitizeV1014WorkforceMigrationPersisted === 'function') {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1014 = { ...(meta.v1014 || {}) };\n"
        "      v1014.workforce_v2 = sanitizeV1014WorkforceMigrationPersisted(wfRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1014 = v1014;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1014.workforce_v2 = sanitizeV1014WorkforceMigrationPersisted" in text:
        print("skip workforce §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("ai fidelity §6 anchor missing for workforce migration")
    return text.replace(anchor, patch + anchor, 1)


def push_workforce(text: str) -> str:
    block = WORKFORCE_SECTION + bundle_local_files(workforce_migration_paths()) + WORKFORCE_HELPERS
    text = insert_before(text, block, WORKFORCE_MARKER, "T6 push #8 workforce-migration (PR #338)")
    text = wire_workforce_day_hook(text)
    text = wire_workforce_migration(text)
    lab = """  { id: 'v1014_workforce_v2', label: 'V10.14 Workforce migration v2 (20BF / 20AC part 4)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1014WorkforceMigrationSelfTestsForLab() },
"""
    text = wire_lab(text, lab, "v1014_workforce_v2")
    return text


NRES_HELPERS = """
function V1016_NRES_readPersistedFromGameState(gs: any): V1016NresPersisted | null {
  const raw = (gs?.save?.meta?.v1016 as any)?.national_resilience;
  return raw ? sanitizeV1016NresPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1016_NRES_applyToGameState(gs: any, out: V1016NresTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1016 = { ...(meta.v1016 || {}) };
  v1016.national_resilience = out.persisted;
  meta.v1016 = v1016;
  save.meta = meta;
  return { ...gs, save, v1016NationalResilience: out.state };
}

export function buildV1016NresTurnInputFromGameState(gs: any, turn: number): V1016NresTurnInput {
  const seed = typeof gs?.seed === 'number' ? gs.seed : 4242;
  const inp = buildV1016NresTurnInputFromGameStateStub(turn, seed);
  const supply = gs?.v1014SupplyChain ?? null;
  const trade = gs?.v1014TradeDepth ?? null;
  const energy = gs?.energyDepth ?? null;
  const workforce = gs?.v1014WorkforceV2 ?? gs?.v1014Workforce ?? null;
  return {
    ...inp,
    supply20bb: {
      ...inp.supply20bb,
      turn,
      bottleneckPressure: Number(supply?.bottleneckPressure ?? inp.supply20bb.bottleneckPressure),
    },
    trade20ba: {
      ...inp.trade20ba,
      turn,
      sanctionsPressure: Number(trade?.sanctionsPressure ?? inp.trade20ba.sanctionsPressure),
    },
    energy20bc: {
      ...inp.energy20bc,
      turn,
      gridStability: Number(energy?.gridStability ?? inp.energy20bc.gridStability),
    },
    workforce20bf: {
      ...inp.workforce20bf,
      turn,
      nationalReadiness: Number(workforce?.nationalResilienceScore ?? workforce?.nationalReadiness ?? inp.workforce20bf.nationalReadiness),
    },
    persisted: null,
  };
}
"""

NRES_DAY_HOOK = """
      if (typeof runV1016NresTurn === 'function') {
        try {
          const nresIn = buildV1016NresTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          nresIn.persisted = V1016_NRES_readPersistedFromGameState(mergedGameState);
          const nresOut = runV1016NresTurn(nresIn);
          mergedGameState = V1016_NRES_applyToGameState(mergedGameState, nresOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_nres_day_hook(text: str) -> str:
    marker = "runV1016NresTurn(nresIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:26000]
    if marker in day_slice:
        print("skip nres day hook (present)")
        return text
    mega_tail = """      if (typeof runV1014T6MegaDepthTurn === 'function') {
        try {
          const megaIn = buildV1014T6MegaDepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6MegaDepthEnabled !== false,
          );
          megaIn.persisted = V1014_T6MEGA_readPersistedFromGameState(mergedGameState);
          const megaOut = runV1014T6MegaDepthTurn(megaIn);
          mergedGameState = V1014_T6MEGA_applyToGameState(mergedGameState, megaOut);
        } catch (_) { /* isolated */ }
      }"""
    if mega_tail not in text:
        raise SystemExit("T6 mega day hook anchor missing for nres hook")
    return text.replace(mega_tail, mega_tail + NRES_DAY_HOOK, 1)


def wire_nres_migration(text: str) -> str:
    anchor = "  if (migrated.gameState) {\n    const megaRaw = (migrated.gameState as any)?.save?.meta?.v1014?.t6_mega_depth;"
    patch = (
        "  if (migrated.gameState && typeof sanitizeV1016NresPersisted === 'function') {\n"
        "    const nresRaw = (migrated.gameState as any)?.save?.meta?.v1016?.national_resilience;\n"
        "    if (nresRaw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1016 = { ...(meta.v1016 || {}) };\n"
        "      v1016.national_resilience = sanitizeV1016NresPersisted(nresRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1016 = v1016;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1016.national_resilience = sanitizeV1016NresPersisted" in text:
        print("skip nres §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("T6 mega §6 anchor missing for nres migration")
    return text.replace(anchor, patch + anchor, 1)


def push_nres(text: str) -> str:
    block = NRES_SECTION + bundle_local_files(national_resilience_paths()) + NRES_HELPERS
    text = insert_before(text, block, NRES_MARKER, "T6 push #10 v1016-national-resilience (PR #341)")
    text = wire_nres_day_hook(text)
    text = wire_nres_migration(text)
    lab = """  { id: 'v1016_national_resilience', label: 'V10.16 National resilience (20BH supply shock & continuity)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1016NresSelfTestsForLab().map((r) => ({ id: r.id, name: r.name, passed: r.passed, detail: r.detail })) },
"""
    text = wire_lab(text, lab, "v1016_national_resilience")
    return text


FFED_HELPERS = """
function V1018_FFED_readPersistedFromGameState(gs: any): V1018FfedPersisted | null {
  const raw = (gs?.save?.meta?.v1018 as any)?.fiscal_federalism;
  return raw ? sanitizeV1018FfedPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1018_FFED_applyToGameState(gs: any, out: V1018FfedTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1018 = { ...(meta.v1018 || {}) };
  v1018.fiscal_federalism = out.persisted;
  meta.v1018 = v1018;
  save.meta = meta;
  return { ...gs, save, v1018FiscalFederalism: out.state };
}

export function buildV1018FfedTurnInputFromGameState(gs: any, turn: number): V1018FfedTurnInput {
  const seed = typeof gs?.seed === 'number' ? gs.seed : 8180;
  const inp = buildV1018FfedTurnInputFromGameStateStub(turn, seed);
  const supply = gs?.v1014SupplyChain ?? null;
  const trade = gs?.v1014TradeDepth ?? null;
  const energy = gs?.energyDepth ?? null;
  const workforce = gs?.v1014WorkforceV2 ?? gs?.v1014Workforce ?? null;
  return {
    ...inp,
    supply20bb: {
      ...inp.supply20bb,
      turn,
      bottleneckPressure: Number(supply?.bottleneckPressure ?? inp.supply20bb.bottleneckPressure),
      regionalStockDays: supply?.regionalStockDays ?? inp.supply20bb.regionalStockDays,
    },
    trade20ba: {
      ...inp.trade20ba,
      turn,
      sanctionsPressure: Number(trade?.sanctionsPressure ?? inp.trade20ba.sanctionsPressure),
      exportLaneStability: Number(trade?.exportLaneStability ?? inp.trade20ba.exportLaneStability),
    },
    energy20bc: {
      ...inp.energy20bc,
      turn,
      gridStability: Number(energy?.gridStability ?? inp.energy20bc.gridStability),
    },
    workforce20bf: {
      ...inp.workforce20bf,
      turn,
      nationalReadiness: Number(workforce?.nationalResilienceScore ?? workforce?.nationalReadiness ?? inp.workforce20bf.nationalReadiness),
    },
    persisted: null,
  };
}
"""

FFED_DAY_HOOK = """
      if (typeof runV1018FfedTurn === 'function') {
        try {
          const ffedIn = buildV1018FfedTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          ffedIn.persisted = V1018_FFED_readPersistedFromGameState(mergedGameState);
          const ffedOut = runV1018FfedTurn(ffedIn);
          mergedGameState = V1018_FFED_applyToGameState(mergedGameState, ffedOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_ffed_day_hook(text: str) -> str:
    marker = "runV1018FfedTurn(ffedIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:28000] if "executeAgent02SingleDayBoundary" in text else ""
    if marker in day_slice:
        print("skip ffed day hook (present)")
        return text
    mega2_tail = """      if (typeof runV1017T6Mega2DepthTurn === 'function') {
        try {
          const m2In = buildV1017T6Mega2DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega2DepthEnabled !== false,
          );
          m2In.persisted = V1017_T6MEGA2_readPersistedFromGameState(mergedGameState);
          const m2Out = runV1017T6Mega2DepthTurn(m2In);
          mergedGameState = V1017_T6MEGA2_applyToGameState(mergedGameState, m2Out);
        } catch (_) { /* isolated */ }
      }"""
    if mega2_tail not in text:
        raise SystemExit("T6 mega2 day hook anchor missing for ffed hook")
    return text.replace(mega2_tail, mega2_tail + FFED_DAY_HOOK, 1)


def wire_ffed_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof sanitizeV1017T6Mega2DepthPersisted === 'function') {"
    patch = (
        "  if (migrated.gameState && typeof sanitizeV1018FfedPersisted === 'function') {\n"
        "    const ffedRaw = (migrated.gameState as any)?.save?.meta?.v1018?.fiscal_federalism;\n"
        "    if (ffedRaw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1018 = { ...(meta.v1018 || {}) };\n"
        "      v1018.fiscal_federalism = sanitizeV1018FfedPersisted(ffedRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1018 = v1018;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1018.fiscal_federalism = sanitizeV1018FfedPersisted" in text:
        print("skip ffed §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("T6 mega2 §6 anchor missing for ffed migration")
    return text.replace(anchor, patch + anchor, 1)


def push_ffed(text: str) -> str:
    block = FFED_SECTION + bundle_local_files(fiscal_federalism_paths()) + FFED_HELPERS
    text = insert_before(text, block, FFED_MARKER, "T6 push #12 v1018-fiscal-federalism (PR #342)")
    text = wire_ffed_day_hook(text)
    text = wire_ffed_migration(text)
    lab = """  { id: 'v1018_fiscal_federalism', label: 'V10.18 Fiscal federalism (20BJ transfers & grant stacks)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1018FfedSelfTestsForLab() },
"""
    anchor_lab = "  { id: 'v1017_t6_mega2_depth',"
    if "{ id: 'v1018_fiscal_federalism'" not in text:
        if anchor_lab in text:
            text = text.replace(anchor_lab, lab + anchor_lab, 1)
        else:
            text = wire_lab(text, lab, "v1018_fiscal_federalism")
        print("registered LAB v1018_fiscal_federalism")
    return text


ICLOG_HELPERS = """
function V1017_ICLOG_readPersistedFromGameState(gs: any): V1017IclogPersisted | null {
  const raw = (gs?.save?.meta?.v1017 as any)?.intercity_logistics;
  return raw ? sanitizeV1017IclogPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1017_ICLOG_applyToGameState(gs: any, out: V1017IclogTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1017 = { ...(meta.v1017 || {}) };
  v1017.intercity_logistics = out.persisted;
  meta.v1017 = v1017;
  save.meta = meta;
  return { ...gs, save, v1017IntercityLogistics: out.state };
}

export function buildV1017IclogTurnInputFromGameState(gs: any, turn: number): V1017IclogTurnInput {
  const seed = typeof gs?.seed === 'number' ? gs.seed : 7170;
  const inp = buildV1017IclogTurnInputFromGameStateStub(turn, seed);
  const supply = gs?.v1014SupplyChain ?? null;
  const trade = gs?.v1014TradeDepth ?? null;
  const cities = gs?.v1014CitiesIntercity ?? gs?.v1014Cities ?? null;
  const nres = gs?.v1016NationalResilience ?? null;
  return {
    ...inp,
    supply20bb: {
      ...inp.supply20bb,
      turn,
      bottleneckPressure: Number(supply?.bottleneckPressure ?? inp.supply20bb.bottleneckPressure),
      regionalStockDays: supply?.regionalStockDays ?? inp.supply20bb.regionalStockDays,
    },
    trade20ba: {
      ...inp.trade20ba,
      turn,
      sanctionsPressure: Number(trade?.sanctionsPressure ?? inp.trade20ba.sanctionsPressure),
      exportLaneStability: Number(trade?.exportLaneStability ?? inp.trade20ba.exportLaneStability),
    },
    cities20ak: {
      ...inp.cities20ak,
      turn,
      intercityLinkCongestion: Number(cities?.intercityLinkCongestion ?? cities?.linkCongestion ?? inp.cities20ak.intercityLinkCongestion),
      corridorThroughputIndex: Number(cities?.corridorThroughputIndex ?? inp.cities20ak.corridorThroughputIndex),
      hubCapacityScore: Number(cities?.hubCapacityScore ?? inp.cities20ak.hubCapacityScore),
    },
    resilience20bg: {
      ...inp.resilience20bg,
      turn,
      supplyShockPressure: Number(nres?.aggregateSeverityIndex ?? nres?.supplyShockPressure ?? inp.resilience20bg.supplyShockPressure),
      resilienceContinuityScore: Number(nres?.aggregateContinuityScore ?? nres?.resilienceContinuityScore ?? inp.resilience20bg.resilienceContinuityScore),
      rerouteUrgencyIndex: Number(nres?.rerouteUrgencyIndex ?? inp.resilience20bg.rerouteUrgencyIndex),
    },
    persisted: null,
  };
}
"""

ICLOG_DAY_HOOK = """
      if (typeof runV1017IclogTurn === 'function') {
        try {
          const iclogIn = buildV1017IclogTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          iclogIn.persisted = V1017_ICLOG_readPersistedFromGameState(mergedGameState);
          const iclogOut = runV1017IclogTurn(iclogIn);
          mergedGameState = V1017_ICLOG_applyToGameState(mergedGameState, iclogOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_iclog_day_hook(text: str) -> str:
    marker = "runV1017IclogTurn(iclogIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:30000] if "executeAgent02SingleDayBoundary" in text else ""
    if marker in day_slice:
        print("skip iclog day hook (present)")
        return text
    ffed_tail = """      if (typeof runV1018FfedTurn === 'function') {
        try {
          const ffedIn = buildV1018FfedTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          ffedIn.persisted = V1018_FFED_readPersistedFromGameState(mergedGameState);
          const ffedOut = runV1018FfedTurn(ffedIn);
          mergedGameState = V1018_FFED_applyToGameState(mergedGameState, ffedOut);
        } catch (_) { /* isolated */ }
      }"""
    if ffed_tail not in text:
        raise SystemExit("ffed day hook anchor missing for iclog hook")
    return text.replace(ffed_tail, ffed_tail + ICLOG_DAY_HOOK, 1)


def wire_iclog_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof sanitizeV1018FfedPersisted === 'function') {"
    patch = (
        "  if (migrated.gameState && typeof sanitizeV1017IclogPersisted === 'function') {\n"
        "    const iclogRaw = (migrated.gameState as any)?.save?.meta?.v1017?.intercity_logistics;\n"
        "    if (iclogRaw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1017 = { ...(meta.v1017 || {}) };\n"
        "      v1017.intercity_logistics = sanitizeV1017IclogPersisted(iclogRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1017 = v1017;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1017.intercity_logistics = sanitizeV1017IclogPersisted" in text:
        print("skip iclog §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("ffed §6 anchor missing for iclog migration")
    return text.replace(anchor, patch + anchor, 1)


def push_iclog(text: str) -> str:
    block = ICLOG_SECTION + bundle_local_files(intercity_logistics_paths()) + ICLOG_HELPERS
    text = insert_before(text, block, ICLOG_MARKER, "T6 push #13 v1017-intercity-logistics (PR #343)")
    text = wire_iclog_day_hook(text)
    text = wire_iclog_migration(text)
    lab = """  { id: 'v1017_intercity_logistics', label: 'V10.17 Intercity logistics (20BK freight routes & hubs)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1017IclogSelfTestsForLab() },
"""
    anchor_lab = "  { id: 'v1018_fiscal_federalism',"
    if "{ id: 'v1017_intercity_logistics'" not in text:
        if anchor_lab in text:
            text = text.replace(anchor_lab, lab + anchor_lab, 1)
        else:
            text = wire_lab(text, lab, "v1017_intercity_logistics")
        print("registered LAB v1017_intercity_logistics")
    return text


RPIPE_HELPERS = """
function V1020_RPIPE_readPersistedFromGameState(gs: any): V1020RpipePersisted | null {
  const raw = (gs?.save?.meta?.v1020 as any)?.research_pipeline;
  return raw ? sanitizeV1020RpipePersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1020_RPIPE_applyToGameState(gs: any, out: V1020RpipeTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1020 = { ...(meta.v1020 || {}) };
  v1020.research_pipeline = out.persisted;
  meta.v1020 = v1020;
  save.meta = meta;
  return { ...gs, save, v1020ResearchPipeline: out.state };
}

export function buildV1020RpipeTurnInputFromGameState(gs: any, turn: number): V1020RpipeTurnInput {
  const seed = typeof gs?.seed === 'number' ? gs.seed : 10200;
  const inp = buildV1020RpipeTurnInputFromGameStateStub(turn, seed);
  const supply = gs?.v1014SupplyChain ?? null;
  const trade = gs?.v1014TradeDepth ?? null;
  const energy = gs?.energyDepth ?? null;
  const workforce = gs?.v1014WorkforceV2 ?? gs?.v1014Workforce ?? null;
  const ai = gs?.v1014AiFidelity ?? null;
  const ffed = gs?.v1018FiscalFederalism ?? null;
  return {
    ...inp,
    supply20bb: {
      ...inp.supply20bb,
      turn,
      bottleneckPressure: Number(supply?.bottleneckPressure ?? inp.supply20bb.bottleneckPressure),
      regionalStockDays: supply?.regionalStockDays ?? inp.supply20bb.regionalStockDays,
    },
    trade20ba: {
      ...inp.trade20ba,
      turn,
      sanctionsPressure: Number(trade?.sanctionsPressure ?? inp.trade20ba.sanctionsPressure),
      exportLaneStability: Number(trade?.exportLaneStability ?? inp.trade20ba.exportLaneStability),
    },
    energy20bc: {
      ...inp.energy20bc,
      turn,
      gridStability: Number(energy?.gridStability ?? inp.energy20bc.gridStability),
    },
    workforce20bf: {
      ...inp.workforce20bf,
      turn,
      nationalReadiness: Number(workforce?.nationalResilienceScore ?? workforce?.nationalReadiness ?? inp.workforce20bf.nationalReadiness),
    },
    aiFidelity20be: {
      ...inp.aiFidelity20be,
      turn,
      planVerifyScore: Number(ai?.planVerifyScore ?? ai?.aggregateScore ?? inp.aiFidelity20be.planVerifyScore),
      commercializationReadiness: Number(ai?.commercializationReadiness ?? inp.aiFidelity20be.commercializationReadiness),
    },
    fiscalFederalism20bj: {
      ...inp.fiscalFederalism20bj,
      turn,
      transferPressure: Number(ffed?.supplyTransferPressure ?? ffed?.fiscalFederalismScore ?? inp.fiscalFederalism20bj.transferPressure),
      labTransferBacklog: Number(ffed?.labTransferBacklog ?? inp.fiscalFederalism20bj.labTransferBacklog),
    },
    persisted: null,
  };
}
"""

RPIPE_DAY_HOOK = """
      if (typeof runV1020RpipeTurn === 'function') {
        try {
          const rpipeIn = buildV1020RpipeTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          rpipeIn.persisted = V1020_RPIPE_readPersistedFromGameState(mergedGameState);
          const rpipeOut = runV1020RpipeTurn(rpipeIn);
          mergedGameState = V1020_RPIPE_applyToGameState(mergedGameState, rpipeOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_rpipe_day_hook(text: str) -> str:
    marker = "runV1020RpipeTurn(rpipeIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:32000] if "executeAgent02SingleDayBoundary" in text else ""
    if marker in day_slice:
        print("skip rpipe day hook (present)")
        return text
    mega3_tail = """      if (typeof runV1018T6Mega3DepthTurn === 'function') {
        try {
          const m3In = buildV1018T6Mega3DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega3DepthEnabled !== false,
          );
          m3In.persisted = V1018_T6MEGA3_readPersistedFromGameState(mergedGameState);
          const m3Out = runV1018T6Mega3DepthTurn(m3In);
          mergedGameState = V1018_T6MEGA3_applyToGameState(mergedGameState, m3Out);
        } catch (_) { /* isolated */ }
      }"""
    if mega3_tail not in text:
        raise SystemExit("T6 mega3 day hook anchor missing for rpipe hook")
    return text.replace(mega3_tail, mega3_tail + RPIPE_DAY_HOOK, 1)


def wire_rpipe_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof sanitizeV1018T6Mega3DepthPersisted === 'function') {"
    patch = (
        "  if (migrated.gameState && typeof sanitizeV1020RpipePersisted === 'function') {\n"
        "    const rpipeRaw = (migrated.gameState as any)?.save?.meta?.v1020?.research_pipeline;\n"
        "    if (rpipeRaw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1020 = { ...(meta.v1020 || {}) };\n"
        "      v1020.research_pipeline = sanitizeV1020RpipePersisted(rpipeRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1020 = v1020;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1020.research_pipeline = sanitizeV1020RpipePersisted" in text:
        print("skip rpipe §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("T6 mega3 §6 anchor missing for rpipe migration")
    return text.replace(anchor, patch + anchor, 1)


def push_rpipe(text: str) -> str:
    block = RPIPE_SECTION + bundle_local_files(research_pipeline_paths()) + RPIPE_HELPERS
    text = insert_before(text, block, RPIPE_MARKER, "T6 push #15 v1020-research-pipeline (PR #344)")
    text = wire_rpipe_day_hook(text)
    text = wire_rpipe_migration(text)
    lab = """  { id: 'v1020_research_pipeline', label: 'V10.20 Research pipeline (20BM commercialization & lab transfer)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1020RpipeSelfTestsForLab() },
"""
    anchor_lab = "  { id: 'v1018_t6_mega3_depth',"
    if "{ id: 'v1020_research_pipeline'" not in text:
        if anchor_lab in text:
            text = text.replace(anchor_lab, lab + anchor_lab, 1)
        else:
            text = wire_lab(text, lab, "v1020_research_pipeline")
        print("registered LAB v1020_research_pipeline")
    return text


MTRD_HELPERS = """
function V1019_MTRD_readPersistedFromGameState(gs: any): V1019MtrdPersisted | null {
  const raw = (gs?.save?.meta?.v1019 as any)?.maritime_trade;
  return raw ? sanitizeV1019MtrdPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1019_MTRD_applyToGameState(gs: any, out: V1019MtrdTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1019 = { ...(meta.v1019 || {}) };
  v1019.maritime_trade = out.persisted;
  meta.v1019 = v1019;
  save.meta = meta;
  return { ...gs, save, v1019MaritimeTrade: out.state };
}

export function buildV1019MtrdTurnInputFromGameState(gs: any, turn: number): V1019MtrdTurnInput {
  const seed = typeof gs?.seed === 'number' ? gs.seed : 9190;
  const inp = buildV1019MtrdTurnInputFromGameStateStub(turn, seed);
  const trade = gs?.v1014TradeDepth ?? null;
  const energy = gs?.energyDepth ?? null;
  return {
    ...inp,
    trade20ba: {
      ...inp.trade20ba,
      turn,
      sanctionsPressure: Number(trade?.sanctionsPressure ?? inp.trade20ba.sanctionsPressure),
      exportLaneStability: Number(trade?.exportLaneStability ?? inp.trade20ba.exportLaneStability),
      importDependencyRatio: Number(trade?.importDependencyRatio ?? inp.trade20ba.importDependencyRatio),
    },
    energy20bc: {
      ...inp.energy20bc,
      turn,
      gridStability: Number(energy?.gridStability ?? inp.energy20bc.gridStability),
      reserveMarginPct: Number(energy?.reserveMarginPct ?? inp.energy20bc.reserveMarginPct),
      carbonStress: Number(energy?.carbonStress ?? inp.energy20bc.carbonStress),
    },
    persisted: null,
  };
}
"""

MTRD_DAY_HOOK = """
      if (typeof runV1019MtrdTurn === 'function') {
        try {
          const mtrdIn = buildV1019MtrdTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          mtrdIn.persisted = V1019_MTRD_readPersistedFromGameState(mergedGameState);
          const mtrdOut = runV1019MtrdTurn(mtrdIn);
          mergedGameState = V1019_MTRD_applyToGameState(mergedGameState, mtrdOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_mtrd_day_hook(text: str) -> str:
    marker = "runV1019MtrdTurn(mtrdIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:34000] if "executeAgent02SingleDayBoundary" in text else ""
    if marker in day_slice:
        print("skip mtrd day hook (present)")
        return text
    rpipe_tail = """      if (typeof runV1020RpipeTurn === 'function') {
        try {
          const rpipeIn = buildV1020RpipeTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          rpipeIn.persisted = V1020_RPIPE_readPersistedFromGameState(mergedGameState);
          const rpipeOut = runV1020RpipeTurn(rpipeIn);
          mergedGameState = V1020_RPIPE_applyToGameState(mergedGameState, rpipeOut);
        } catch (_) { /* isolated */ }
      }"""
    if rpipe_tail not in text:
        raise SystemExit("rpipe day hook anchor missing for mtrd hook")
    return text.replace(rpipe_tail, rpipe_tail + MTRD_DAY_HOOK, 1)


def wire_mtrd_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof sanitizeV1020RpipePersisted === 'function') {"
    patch = (
        "  if (migrated.gameState && typeof sanitizeV1019MtrdPersisted === 'function') {\n"
        "    const mtrdRaw = (migrated.gameState as any)?.save?.meta?.v1019?.maritime_trade;\n"
        "    if (mtrdRaw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1019 = { ...(meta.v1019 || {}) };\n"
        "      v1019.maritime_trade = sanitizeV1019MtrdPersisted(mtrdRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1019 = v1019;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1019.maritime_trade = sanitizeV1019MtrdPersisted" in text:
        print("skip mtrd §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("rpipe §6 anchor missing for mtrd migration")
    return text.replace(anchor, patch + anchor, 1)


def push_mtrd(text: str) -> str:
    block = MTRD_SECTION + bundle_local_files(maritime_trade_paths()) + MTRD_HELPERS
    text = insert_before(text, block, MTRD_MARKER, "T6 push #16 v1019-maritime-trade")
    text = wire_mtrd_day_hook(text)
    text = wire_mtrd_migration(text)
    lab = """  { id: 'v1019_maritime_trade', label: 'V10.19 Maritime trade (20BN shipping lanes & ports)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1019MtrdSelfTestsForLab() },
"""
    anchor_lab = "  { id: 'v1020_research_pipeline',"
    if "{ id: 'v1019_maritime_trade'" not in text:
        if anchor_lab in text:
            text = text.replace(anchor_lab, lab + anchor_lab, 1)
        else:
            text = wire_lab(text, lab, "v1019_maritime_trade")
        print("registered LAB v1019_maritime_trade")
    return text


IMFD_HELPERS = """
function V1021_IMFD_readPersistedFromGameState(gs: any): V1021ImfdPersisted | null {
  const raw = (gs?.save?.meta?.v1021 as any)?.intermodal_freight;
  return raw ? sanitizeV1021ImfdPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1021_IMFD_applyToGameState(gs: any, out: V1021ImfdTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1021 = { ...(meta.v1021 || {}) };
  v1021.intermodal_freight = out.persisted;
  meta.v1021 = v1021;
  save.meta = meta;
  return { ...gs, save, v1021IntermodalFreight: out.state };
}

export function buildV1021ImfdTurnInputFromGameState(gs: any, turn: number): V1021ImfdTurnInput {
  const seed = typeof gs?.seed === 'number' ? gs.seed : 10210;
  const inp = buildV1021ImfdTurnInputFromGameStateStub(turn, seed);
  const trade = gs?.v1014TradeDepth ?? null;
  const energy = gs?.energyDepth ?? null;
  const supply = gs?.v1014SupplyChain ?? null;
  const workforce = gs?.v1014WorkforceMigration ?? gs?.workforceHumanCapital ?? null;
  const maritime = gs?.v1019MaritimeTrade ?? null;
  const iclog = gs?.v1017IntercityLogistics ?? null;
  return {
    ...inp,
    supply20bb: {
      ...inp.supply20bb,
      turn,
      bottleneckPressure: Number(supply?.bottleneckPressure ?? inp.supply20bb.bottleneckPressure),
      handoffStackIndex: Number(supply?.handoffStackIndex ?? inp.supply20bb.handoffStackIndex),
    },
    trade20ba: {
      ...inp.trade20ba,
      turn,
      sanctionsPressure: Number(trade?.sanctionsPressure ?? inp.trade20ba.sanctionsPressure),
      exportLaneStability: Number(trade?.exportLaneStability ?? inp.trade20ba.exportLaneStability),
      importDependencyRatio: Number(trade?.importDependencyRatio ?? inp.trade20ba.importDependencyRatio),
    },
    energy20bc: {
      ...inp.energy20bc,
      turn,
      gridStability: Number(energy?.gridStability ?? inp.energy20bc.gridStability),
      reserveMarginPct: Number(energy?.reserveMarginPct ?? inp.energy20bc.reserveMarginPct),
      carbonStress: Number(energy?.carbonStress ?? inp.energy20bc.carbonStress),
    },
    workforce20bf: {
      ...inp.workforce20bf,
      turn,
      specialistGap: Number(workforce?.specialistGap ?? inp.workforce20bf.specialistGap),
      nationalReadiness: Number(workforce?.nationalReadiness ?? inp.workforce20bf.nationalReadiness),
      mismatchIndex: Number(workforce?.mismatchIndex ?? inp.workforce20bf.mismatchIndex),
    },
    maritime20bn: {
      ...inp.maritime20bn,
      turn,
      berthUtilizationScore: Number(maritime?.berthUtilizationScore ?? inp.maritime20bn.berthUtilizationScore),
      craneAutomationCoverage: Number(
        maritime?.craneAutomationCoverage ?? inp.maritime20bn.craneAutomationCoverage,
      ),
      handoffReadiness: Number(maritime?.handoffReadiness ?? inp.maritime20bn.handoffReadiness),
    },
    iclog20bk: {
      ...inp.iclog20bk,
      turn,
      iclogBackpressure: Number(iclog?.iclogBackpressure ?? inp.iclog20bk.iclogBackpressure),
      corridorLoadFactor: Number(iclog?.corridorLoadFactor ?? inp.iclog20bk.corridorLoadFactor),
      dwellBacklogTurns: Number(iclog?.dwellBacklogTurns ?? inp.iclog20bk.dwellBacklogTurns),
    },
    persisted: null,
  };
}
"""

IMFD_DAY_HOOK = """
      if (typeof runV1021ImfdTurn === 'function') {
        try {
          const imfdIn = buildV1021ImfdTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          imfdIn.persisted = V1021_IMFD_readPersistedFromGameState(mergedGameState);
          const imfdOut = runV1021ImfdTurn(imfdIn);
          mergedGameState = V1021_IMFD_applyToGameState(mergedGameState, imfdOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_imfd_day_hook(text: str) -> str:
    marker = "runV1021ImfdTurn(imfdIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:38000] if "executeAgent02SingleDayBoundary" in text else ""
    if marker in day_slice:
        print("skip imfd day hook (present)")
        return text
    mega4_tail = """      if (typeof runV1019T6Mega4DepthTurn === 'function') {
        try {
          const m4In = buildV1019T6Mega4DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega4DepthEnabled !== false,
          );
          m4In.persisted = V1019_T6MEGA4_readPersistedFromGameState(mergedGameState);
          const m4Out = runV1019T6Mega4DepthTurn(m4In);
          mergedGameState = V1019_T6MEGA4_applyToGameState(mergedGameState, m4Out);
        } catch (_) { /* isolated */ }
      }"""
    if mega4_tail not in text:
        raise SystemExit("T6 mega4 day hook anchor missing for imfd hook")
    return text.replace(mega4_tail, mega4_tail + IMFD_DAY_HOOK, 1)


def wire_imfd_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof sanitizeV1019T6Mega4DepthPersisted === 'function') {"
    patch = (
        "  if (migrated.gameState && typeof sanitizeV1021ImfdPersisted === 'function') {\n"
        "    const imfdRaw = (migrated.gameState as any)?.save?.meta?.v1021?.intermodal_freight;\n"
        "    if (imfdRaw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1021 = { ...(meta.v1021 || {}) };\n"
        "      v1021.intermodal_freight = sanitizeV1021ImfdPersisted(imfdRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1021 = v1021;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1021.intermodal_freight = sanitizeV1021ImfdPersisted" in text:
        print("skip imfd §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("T6 mega4 §6 anchor missing for imfd migration")
    return text.replace(anchor, patch + anchor, 1)


def push_imfd(text: str) -> str:
    block = IMFD_SECTION + bundle_local_files(intermodal_freight_paths()) + IMFD_HELPERS
    text = insert_before(text, block, IMFD_MARKER, "T6 push #18 v1021-intermodal-freight (PR #345)")
    text = wire_imfd_day_hook(text)
    text = wire_imfd_migration(text)
    lab = """  { id: 'v1021_intermodal_freight', label: 'V10.21 Intermodal freight (20BP corridors & handoff stacks)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1021ImfdSelfTestsForLab() },
"""
    mega4_lab = (
        "  { id: 'v1019_t6_mega4_depth', label: 'V10.19 T6 mega4 wave-5 lattice (20BO / 20BA–20BN)', "
        "tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1019T6Mega4DepthSelfTestsForLab() },"
    )
    if "{ id: 'v1021_intermodal_freight'" not in text:
        if mega4_lab in text:
            text = text.replace(mega4_lab, mega4_lab + "\n" + lab.strip(), 1)
            print("registered LAB v1021_intermodal_freight")
        else:
            text = wire_lab(text, lab, "v1021_intermodal_freight")
            print("registered LAB v1021_intermodal_freight (fallback)")
    return text


HAFF_HELPERS = """
function V1022_HAFF_readPersistedFromGameState(gs: any): V1022HaffPersisted | null {
  const raw = (gs?.save?.meta?.v1022 as any)?.housing_affordability;
  return raw ? sanitizeV1022HaffPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1022_HAFF_applyToGameState(gs: any, out: V1022HaffTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1022 = { ...(meta.v1022 || {}) };
  v1022.housing_affordability = out.persisted;
  meta.v1022 = v1022;
  save.meta = meta;
  return { ...gs, save, v1022HousingAffordability: out.state };
}

export function buildV1022HaffTurnInputFromGameState(gs: any, turn: number): V1022HaffTurnInput {
  const seed = typeof gs?.seed === 'number' ? gs.seed : 10220;
  const inp = buildV1022HaffTurnInputFromGameStateStub(turn, seed);
  const trade = gs?.v1014TradeDepth ?? null;
  const energy = gs?.energyDepth ?? null;
  const supply = gs?.v1014SupplyChain ?? null;
  const workforce = gs?.v1014WorkforceMigration ?? gs?.workforceHumanCapital ?? null;
  const pubsvc = gs?.v1014PublicServicesCrosswalk ?? null;
  const ffed = gs?.v1018FiscalFederalism ?? null;
  return {
    ...inp,
    supply20bb: {
      ...inp.supply20bb,
      turn,
      bottleneckPressure: Number(supply?.bottleneckPressure ?? inp.supply20bb.bottleneckPressure),
      supplyPipelineIndex: Number(supply?.supplyPipelineIndex ?? inp.supply20bb.supplyPipelineIndex),
    },
    trade20ba: {
      ...inp.trade20ba,
      turn,
      sanctionsPressure: Number(trade?.sanctionsPressure ?? inp.trade20ba.sanctionsPressure),
      exportLaneStability: Number(trade?.exportLaneStability ?? inp.trade20ba.exportLaneStability),
      importDependencyRatio: Number(trade?.importDependencyRatio ?? inp.trade20ba.importDependencyRatio),
    },
    energy20bc: {
      ...inp.energy20bc,
      turn,
      gridStability: Number(energy?.gridStability ?? inp.energy20bc.gridStability),
      reserveMarginPct: Number(energy?.reserveMarginPct ?? inp.energy20bc.reserveMarginPct),
      carbonStress: Number(energy?.carbonStress ?? inp.energy20bc.carbonStress),
    },
    workforce20bf: {
      ...inp.workforce20bf,
      turn,
      specialistGap: Number(workforce?.specialistGap ?? inp.workforce20bf.specialistGap),
      nationalReadiness: Number(workforce?.nationalReadiness ?? inp.workforce20bf.nationalReadiness),
      mismatchIndex: Number(workforce?.mismatchIndex ?? inp.workforce20bf.mismatchIndex),
    },
    publicServices20az: {
      ...inp.publicServices20az,
      turn,
      clinicCapacityScore: Number(pubsvc?.clinicCapacityScore ?? inp.publicServices20az.clinicCapacityScore),
      digitalServiceCoverage: Number(
        pubsvc?.digitalServiceCoverage ?? inp.publicServices20az.digitalServiceCoverage,
      ),
      serviceDeliveryReadiness: Number(
        pubsvc?.serviceDeliveryReadiness ?? inp.publicServices20az.serviceDeliveryReadiness,
      ),
    },
    fiscalFederalism20bj: {
      ...inp.fiscalFederalism20bj,
      turn,
      transferBackpressure: Number(ffed?.transferBackpressure ?? inp.fiscalFederalism20bj.transferBackpressure),
      grantStackLoad: Number(ffed?.grantStackLoad ?? inp.fiscalFederalism20bj.grantStackLoad),
      zoningBacklogTurns: Number(ffed?.zoningBacklogTurns ?? inp.fiscalFederalism20bj.zoningBacklogTurns),
    },
    persisted: null,
  };
}
"""

HAFF_DAY_HOOK = """
      if (typeof runV1022HaffTurn === 'function') {
        try {
          const haffIn = buildV1022HaffTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          haffIn.persisted = V1022_HAFF_readPersistedFromGameState(mergedGameState);
          const haffOut = runV1022HaffTurn(haffIn);
          mergedGameState = V1022_HAFF_applyToGameState(mergedGameState, haffOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_haff_day_hook(text: str) -> str:
    marker = "runV1022HaffTurn(haffIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:40000] if "executeAgent02SingleDayBoundary" in text else ""
    if marker in day_slice:
        print("skip haff day hook (present)")
        return text
    imfd_tail = """      if (typeof runV1021ImfdTurn === 'function') {
        try {
          const imfdIn = buildV1021ImfdTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          imfdIn.persisted = V1021_IMFD_readPersistedFromGameState(mergedGameState);
          const imfdOut = runV1021ImfdTurn(imfdIn);
          mergedGameState = V1021_IMFD_applyToGameState(mergedGameState, imfdOut);
        } catch (_) { /* isolated */ }
      }"""
    if imfd_tail not in text:
        raise SystemExit("imfd day hook anchor missing for haff hook")
    return text.replace(imfd_tail, imfd_tail + HAFF_DAY_HOOK, 1)


def wire_haff_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof sanitizeV1021ImfdPersisted === 'function') {"
    patch = (
        "  if (migrated.gameState && typeof sanitizeV1022HaffPersisted === 'function') {\n"
        "    const haffRaw = (migrated.gameState as any)?.save?.meta?.v1022?.housing_affordability;\n"
        "    if (haffRaw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1022 = { ...(meta.v1022 || {}) };\n"
        "      v1022.housing_affordability = sanitizeV1022HaffPersisted(haffRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1022 = v1022;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1022.housing_affordability = sanitizeV1022HaffPersisted" in text:
        print("skip haff §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("imfd §6 anchor missing for haff migration")
    return text.replace(anchor, patch + anchor, 1)


def push_haff(text: str) -> str:
    block = HAFF_SECTION + bundle_local_files(housing_affordability_paths()) + HAFF_HELPERS
    text = insert_before(text, block, HAFF_MARKER, "T6 push #19 v1022-housing-affordability (PR #346)")
    text = wire_haff_day_hook(text)
    text = wire_haff_migration(text)
    lab = """  { id: 'v1022_housing_affordability', label: 'V10.22 Housing affordability (20BQ stress & supply pipeline)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1022HaffSelfTestsForLab() },
"""
    imfd_lab = (
        "  { id: 'v1021_intermodal_freight', label: 'V10.21 Intermodal freight (20BP corridors & handoff stacks)', "
        "tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1021ImfdSelfTestsForLab() },"
    )
    if "{ id: 'v1022_housing_affordability'" not in text:
        if imfd_lab in text:
            text = text.replace(imfd_lab, imfd_lab + "\n" + lab.strip(), 1)
            print("registered LAB v1022_housing_affordability")
        else:
            text = wire_lab(text, lab, "v1022_housing_affordability")
            print("registered LAB v1022_housing_affordability (fallback)")
    return text


CLAD_HELPERS = """
function V1023_CLAD_readPersistedFromGameState(gs: any): V1023CladPersisted | null {
  const raw = (gs?.save?.meta?.v1023 as any)?.climate_adaptation;
  return raw ? sanitizeV1023CladPersisted(raw, Number(gs?.turnCounter ?? 1)) : null;
}

function V1023_CLAD_applyToGameState(gs: any, out: V1023CladTurnResult): any {
  const save = { ...(gs?.save || {}) };
  const meta = { ...(save.meta || {}) };
  const v1023 = { ...(meta.v1023 || {}) };
  v1023.climate_adaptation = out.persisted;
  meta.v1023 = v1023;
  save.meta = meta;
  return { ...gs, save, v1023ClimateAdaptation: out.state };
}

export function buildV1023CladTurnInputFromGameState(gs: any, turn: number): V1023CladTurnInput {
  const seed = typeof gs?.seed === 'number' ? gs.seed : 10230;
  const inp = buildV1023CladTurnInputFromGameStateStub(turn, seed);
  const trade = gs?.v1014TradeDepth ?? null;
  const energy = gs?.energyDepth ?? null;
  const supply = gs?.v1014SupplyChain ?? null;
  const workforce = gs?.v1014WorkforceMigration ?? gs?.workforceHumanCapital ?? null;
  const pubsvc = gs?.v1014PublicServicesCrosswalk ?? null;
  const scen = gs?.v1014ScenarioV2 ?? null;
  return {
    ...inp,
    supply20bb: {
      ...inp.supply20bb,
      turn,
      bottleneckPressure: Number(supply?.bottleneckPressure ?? inp.supply20bb.bottleneckPressure),
      droughtBufferIndex: Number(supply?.droughtBufferIndex ?? inp.supply20bb.droughtBufferIndex),
    },
    trade20ba: {
      ...inp.trade20ba,
      turn,
      sanctionsPressure: Number(trade?.sanctionsPressure ?? inp.trade20ba.sanctionsPressure),
      exportLaneStability: Number(trade?.exportLaneStability ?? inp.trade20ba.exportLaneStability),
      importDependencyRatio: Number(trade?.importDependencyRatio ?? inp.trade20ba.importDependencyRatio),
    },
    energy20bc: {
      ...inp.energy20bc,
      turn,
      gridStability: Number(energy?.gridStability ?? inp.energy20bc.gridStability),
      reserveMarginPct: Number(energy?.reserveMarginPct ?? inp.energy20bc.reserveMarginPct),
      carbonStress: Number(energy?.carbonStress ?? inp.energy20bc.carbonStress),
    },
    workforce20bf: {
      ...inp.workforce20bf,
      turn,
      specialistGap: Number(workforce?.specialistGap ?? inp.workforce20bf.specialistGap),
      nationalReadiness: Number(workforce?.nationalReadiness ?? inp.workforce20bf.nationalReadiness),
      mismatchIndex: Number(workforce?.mismatchIndex ?? inp.workforce20bf.mismatchIndex),
    },
    publicServices20az: {
      ...inp.publicServices20az,
      turn,
      clinicCapacityScore: Number(pubsvc?.clinicCapacityScore ?? inp.publicServices20az.clinicCapacityScore),
      digitalServiceCoverage: Number(
        pubsvc?.digitalServiceCoverage ?? inp.publicServices20az.digitalServiceCoverage,
      ),
      serviceDeliveryReadiness: Number(
        pubsvc?.serviceDeliveryReadiness ?? inp.publicServices20az.serviceDeliveryReadiness,
      ),
    },
    scenarioPacks20bd: {
      ...inp.scenarioPacks20bd,
      turn,
      packCohesionPressure: Number(scen?.packCohesionPressure ?? inp.scenarioPacks20bd.packCohesionPressure),
      grantStackLoad: Number(scen?.grantStackLoad ?? inp.scenarioPacks20bd.grantStackLoad),
      objectiveDriftTurns: Number(scen?.objectiveDriftTurns ?? inp.scenarioPacks20bd.objectiveDriftTurns),
    },
    persisted: null,
  };
}
"""

CLAD_DAY_HOOK = """
      if (typeof runV1023CladTurn === 'function') {
        try {
          const cladIn = buildV1023CladTurnInputFromGameState(mergedGameState, passCtx.turnCounter);
          cladIn.persisted = V1023_CLAD_readPersistedFromGameState(mergedGameState);
          const cladOut = runV1023CladTurn(cladIn);
          mergedGameState = V1023_CLAD_applyToGameState(mergedGameState, cladOut);
        } catch (_) { /* isolated */ }
      }
"""


def wire_clad_day_hook(text: str) -> str:
    marker = "runV1023CladTurn(cladIn)"
    day_slice = text.split("executeAgent02SingleDayBoundary", 1)[1][:45000] if "executeAgent02SingleDayBoundary" in text else ""
    if marker in day_slice:
        print("skip clad day hook (present)")
        return text
    mega5_tail = """      if (typeof runV1020T6Mega5DepthTurn === 'function') {
        try {
          const m5In = buildV1020T6Mega5DepthTurnInputFromGameState(
            mergedGameState,
            passCtx.turnCounter,
            settings?.t6Mega5DepthEnabled !== false,
          );
          m5In.persisted = V1020_T6MEGA5_readPersistedFromGameState(mergedGameState);
          const m5Out = runV1020T6Mega5DepthTurn(m5In);
          mergedGameState = V1020_T6MEGA5_applyToGameState(mergedGameState, m5Out);
        } catch (_) { /* isolated */ }
      }"""
    if mega5_tail not in text:
        raise SystemExit("T6 mega5 day hook anchor missing for clad hook")
    return text.replace(mega5_tail, mega5_tail + CLAD_DAY_HOOK, 1)


def wire_clad_migration(text: str) -> str:
    anchor = "  if (migrated.gameState && typeof sanitizeV1020T6Mega5DepthPersisted === 'function') {"
    patch = (
        "  if (migrated.gameState && typeof sanitizeV1023CladPersisted === 'function') {\n"
        "    const cladRaw = (migrated.gameState as any)?.save?.meta?.v1023?.climate_adaptation;\n"
        "    if (cladRaw) {\n"
        "      const save = { ...((migrated.gameState as any).save || {}) };\n"
        "      const meta = { ...(save.meta || {}) };\n"
        "      const v1023 = { ...(meta.v1023 || {}) };\n"
        "      v1023.climate_adaptation = sanitizeV1023CladPersisted(cladRaw, Number((migrated.gameState as any).turnCounter || 0));\n"
        "      meta.v1023 = v1023;\n"
        "      save.meta = meta;\n"
        "      migrated.gameState = { ...(migrated.gameState as any), save };\n"
        "    }\n"
        "  }\n"
    )
    if "v1023.climate_adaptation = sanitizeV1023CladPersisted" in text:
        print("skip clad §6 migration")
        return text
    if anchor not in text:
        raise SystemExit("mega5 §6 anchor missing for clad migration")
    return text.replace(anchor, patch + anchor, 1)


def push_clad(text: str) -> str:
    block = CLAD_SECTION + bundle_local_files(climate_adaptation_paths()) + CLAD_HELPERS
    text = insert_before(text, block, CLAD_MARKER, "T6 push #21 v1023-climate-adaptation (PR #347)")
    text = wire_clad_day_hook(text)
    text = wire_clad_migration(text)
    lab = """  { id: 'v1023_climate_adaptation', label: 'V10.23 Climate adaptation (20BR hazard & drought buffers)', tier: 'quick', section: 'System Regression', severity: 'MAJOR', run: () => runV1023CladSelfTestsForLab() },
"""
    mega5_lab = (
        "  { id: 'v1020_t6_mega5_depth', label: 'V10.20 T6 mega5 wave-6 lattice (20BS / 20BA–20BQ)', "
        "tier: 'full', section: 'System Regression', severity: 'MAJOR', run: () => runV1020T6Mega5DepthSelfTestsForLab() },"
    )
    if "{ id: 'v1023_climate_adaptation'" not in text:
        if mega5_lab in text:
            text = text.replace(mega5_lab, mega5_lab + "\n" + lab.strip(), 1)
            print("registered LAB v1023_climate_adaptation")
        else:
            text = wire_lab(text, lab, "v1023_climate_adaptation")
            print("registered LAB v1023_climate_adaptation (fallback)")
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
    ap.add_argument("push", type=int, choices=[2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 15, 16, 18, 19, 21])
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
    elif args.push == 8:
        text = push_workforce(text)
    elif args.push == 10:
        text = push_nres(text)
    elif args.push == 12:
        text = push_ffed(text)
    elif args.push == 13:
        text = push_iclog(text)
    elif args.push == 15:
        text = push_rpipe(text)
    elif args.push == 16:
        text = push_mtrd(text)
    elif args.push == 18:
        text = push_imfd(text)
    elif args.push == 19:
        text = push_haff(text)
    elif args.push == 21:
        text = push_clad(text)
    V94.write_text(text, encoding="utf-8")
    after = len(text.splitlines())
    print(f"lines {before} -> {after} (+{after - before})")


if __name__ == "__main__":
    main()
