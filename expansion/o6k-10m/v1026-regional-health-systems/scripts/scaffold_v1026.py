#!/usr/bin/env python3
"""Transform v1025 biodiversity copy into v1026 regional health systems + regenerate TS."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REPLACEMENTS = [
    ("v1025-biodiversity-stewardship", "v1026-regional-health-systems"),
    ("V1025_BIO", "V1026_RHS"),
    ("V1025Bio", "V1026Rhs"),
    ("v1025Bio", "v1026Rhs"),
    ("v1025_bio", "v1026_rhs"),
    ("biodiversity_stewardship", "regional_health_systems"),
    ("biodiversity-stewardship", "regional-health-systems"),
    ("v1025_biodiversity_stewardship", "v1026_regional_health_systems"),
    ("10.25.biodiversity_stewardship.1", "10.26.regional_health_systems.1"),
    ("SECTION 20BU", "SECTION 20BV"),
    ("O6K-56", "O6K-59"),
    ("V10.25 BIODIVERSITY STEWARDSHIP", "V10.26 REGIONAL HEALTH SYSTEMS"),
    ("Biodiversity stewardship", "Regional health systems"),
    ("biodiversity stewardship", "regional health systems"),
    ("recovery-scenarios", "care-scenarios"),
    ("recovery-registry", "care-registry"),
    ("recovery_snapshots", "care_snapshots"),
    ("recoverySnapshots", "careSnapshots"),
    ("RECOVERY_SCENARIO", "CARE_SCENARIO"),
    ("Recovery scenario", "Care scenario"),
    ("recovery scenario", "care scenario"),
    ("activeRecoveryScenarioIds", "activeCareScenarioIds"),
    ("activeProtectedAreaIds", "activeHospitalNetworkIds"),
    ("recoveryBatch", "careBatch"),
    ("evaluateRecoveryBatch", "evaluateCareBatch"),
    ("listActiveRecoveryScenarioIds", "listActiveCareScenarioIds"),
    ("ALL_RECOVERY_SCENARIO", "ALL_CARE_SCENARIO"),
    ("runRecoveryScenarioRegressionSweep", "runCareScenarioRegressionSweep"),
    ("RECOVERY_SCENARIO_COUNT", "CARE_SCENARIO_COUNT"),
    ("meanEcosystemStress", "meanCapacityStress"),
    ("meanStewardshipScore", "meanHealthSystemScore"),
    ("aggregateEcosystemStressIndex", "aggregateCapacityStressIndex"),
    ("aggregateStewardshipScore", "aggregateHealthSystemScore"),
    ("aggregateEcosystemStress", "aggregateCapacityStress"),
    ("aggregateStewardship", "aggregateHealthSystem"),
    ("ecosystemStressIndex", "capacityStressIndex"),
    ("stewardshipScore", "healthSystemScore"),
    ("stewardshipBandFromScore", "healthSystemBandFromScore"),
    ("conservation-offset-stacks", "primary-care-access-stacks"),
    ("conservation-offset-stack", "primary-care-access-stack"),
    ("conservation-offset-bundle", "primary-care-access-bundle"),
    ("conservationOffset", "primaryCareAccess"),
    ("ConservationOffset", "PrimaryCareAccess"),
    ("conservation_offset", "primary_care_access"),
    ("CONSERVATION_OFFSET", "PRIMARY_CARE_ACCESS"),
    ("Conservation offset", "Primary care access"),
    ("conservation offset", "primary care access"),
    ("protected-area-nodes", "hospital-network-nodes"),
    ("protected-area-node", "hospital-network-node"),
    ("regional_protected_area", "regional_hospital_network"),
    ("protected_area", "hospital_network"),
    ("PROTECTED_AREA", "HOSPITAL_NETWORK"),
    ("Protected area", "Hospital network"),
    ("protected area", "hospital network"),
    ("stewardshipChannel", "healthSystemChannel"),
    ("StewardshipChannel", "HealthSystemChannel"),
    ("stewardshipPolicyFocus", "healthPolicyFocus"),
    ("stewardshipClimateHarmonyScore", "healthClimateHarmonyScore"),
    ("conservationOffsetDelayTurns", "primaryCareAccessDelayTurns"),
    ("V1025BioRecoveryBand", "V1026RhsCareBand"),
    ("V1025BioHabitatBand", "V1026RhsBedBand"),
    ("stewardshipBand", "healthSystemBand"),
    ("StewardshipBand", "HealthSystemBand"),
    ("RecoverySnapshot", "CareSnapshot"),
    ("CONSERVATION_OFFSET_SHARD_COUNT", "PRIMARY_CARE_ACCESS_SHARD_COUNT"),
    ("PROTECTED_AREA_COUNT", "HOSPITAL_NETWORK_COUNT"),
    ("biodiversityStewardshipScore", "regionalHealthSystemScore"),
    ("species/habitat/offset", "clinical/bed/primary-care"),
    ("species/habitat conservation offset", "clinical/bed primary care access"),
    ("biodiversity recovery", "regional health care"),
    ("habitatHeadroom", "bedHeadroom"),
    ("invasiveRiskStress", "surgeRiskStress"),
    ("park ranger & field staffing", "clinical & allied health staffing"),
    (
        "ECOSYSTEM STRESS, PROTECTED AREAS & CONSERVATION OFFSETS",
        "CAPACITY STRESS, HOSPITAL NETWORKS & PRIMARY CARE ACCESS",
    ),
    (
        "recovery scenarios, conservation-offset graph, protected-area nodes, stewardship scoring",
        "care scenarios, primary-care-access graph, hospital-network nodes, health system scoring",
    ),
    (
        "Recovery scenario matrix, conservation-offset graph, protected-area nodes",
        "Care scenario matrix, primary-care-access graph, hospital-network nodes",
    ),
    ("runV1025BioTurn", "runV1026RhsTurn"),
    ("buildV1025BioTurnInputFromGameState", "buildV1026RhsTurnInputFromGameState"),
    ("buildV1025BioTurnInputFromGameStateStub", "buildV1026RhsTurnInputFromGameStateStub"),
    ("sanitizeV1025BioPersisted", "sanitizeV1026RhsPersisted"),
    ("createEmptyV1025BioPersisted", "createEmptyV1026RhsPersisted"),
    ("V1025BioPersisted", "V1026RhsPersisted"),
    ("V1025BioTurnInput", "V1026RhsTurnInput"),
    ("runV1025BioSelfTests", "runV1026RhsSelfTests"),
    ("readV1025BioClimateAdaptation20brBridge", "readV1026RhsClimateAdaptation20brBridge"),
    ("computeV1025BioClimateAdaptation20brBridge", "computeV1026RhsClimateAdaptation20brBridge"),
    (
        "applyV1025BioClimateAdaptation20brClimateAdaptationOverrides",
        "applyV1026RhsClimateAdaptation20brClimateAdaptationOverrides",
    ),
    ("V1025BioClimateAdaptation20brSlice", "V1026RhsClimateAdaptation20brSlice"),
    ("gameState.v1025BiodiversityStewardship", "gameState.v1026RegionalHealthSystems"),
    ("v1025BiodiversityStewardship", "v1026RegionalHealthSystems"),
    ("run-v1025-bio-self-tests.ts", "run-v1026-rhs-self-tests.ts"),
    ("scaffold_v1025.py", "scaffold_v1026.py"),
    ("protected-area", "hospital-network"),
    ("offset-", "access-"),
    ("V1025_BIO_RECOVERY", "V1026_RHS_CARE"),
    ("V1025BioRecovery", "V1026RhsCare"),
    ("V1025BioStewardship", "V1026RhsHealthSystem"),
    ("stewardshipBandRank", "healthSystemBandRank"),
    ("v1025_bio_", "v1026_rhs_"),
    ("mergeConservationOffsetEdges", "mergePrimaryCareAccessEdges"),
    ("conservationOffsetGraphHash", "primaryCareAccessGraphHash"),
    ("GENERATED_CONSERVATION_OFFSET", "GENERATED_PRIMARY_CARE_ACCESS"),
    ("regionalConservationOffset", "regionalPrimaryCareAccess"),
    ("conservationOffsetGraphRevision", "primaryCareAccessGraphRevision"),
    ("conservationOffsetPressure", "primaryCareAccessPressure"),
    ("conservationOffsetIndex", "primaryCareAccessIndex"),
    ("Climate adaptation protected-area-node", "Climate adaptation hospital-network"),
    ("20BR protected area node adapter", "20BR hospital network adapter"),
    ("grid habitat load", "grid clinical load"),
    ("national recovery scenarios", "national care scenarios"),
    ("national recovery scenarios, conservation-offset graph", "national care scenarios, primary-care-access graph"),
]


def transform_file(path: pathlib.Path) -> None:
    if path.suffix not in {".ts", ".md", ".py"}:
        return
    if path.name in {"scaffold_v1025.py", "scaffold_v1026.py"}:
        return
    text = path.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    path.write_text(text, encoding="utf-8")


def rename_paths() -> None:
    renames = [
        (
            ROOT / "engine" / "biodiversity-stewardship-orchestrator.ts",
            ROOT / "engine" / "regional-health-systems-orchestrator.ts",
        ),
        (
            ROOT / "engine" / "biodiversity-stewardship-utils.ts",
            ROOT / "engine" / "regional-health-systems-utils.ts",
        ),
        (
            ROOT / "self-tests" / "run-v1025-bio-self-tests.ts",
            ROOT / "self-tests" / "run-v1026-rhs-self-tests.ts",
        ),
    ]
    gen_old = ROOT / "generated" / "recovery-scenarios"
    if gen_old.exists():
        (ROOT / "generated" / "care-scenarios").mkdir(exist_ok=True)
        for p in gen_old.glob("*.ts"):
            dest_name = p.name.replace("scenario-", "scenario-")
            p.rename(ROOT / "generated" / "care-scenarios" / dest_name)
        shutil.rmtree(gen_old, ignore_errors=True)
    for src, dst in renames:
        if src.exists():
            dst.parent.mkdir(parents=True, exist_ok=True)
            if dst.exists():
                dst.unlink()
            src.rename(dst)


def patch_types_core() -> None:
    path = ROOT / "types" / "core.ts"
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "export type V1026RhsHealthSystemBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';",
        "export type V1026RhsHealthSystemBand = 'robust' | 'stable' | 'strained' | 'overloaded' | 'critical';",
    )
    text = re.sub(
        r"export type V1026RhsHealthSystemChannel =[\s\S]*?;\n\nexport type V1026RhsHealthSystemChannelLegacy =",
        """export type V1026RhsHealthSystemChannel =
  | 'emergency_care'
  | 'primary_access'
  | 'hospital_network'
  | 'telehealth'
  | 'rural_clinic'
  | 'specialist_referral'
  | 'aged_care'
  | 'mental_health'
  | 'regional'
  | 'remote';

export type V1026RhsHealthSystemChannelLegacy =""",
        text,
        count=1,
    )
    dgov_slice = """
/** Digital governance hospital-network slice (SECTION 20BT — V1024 bridge). */
export interface V1026RhsDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}
"""
    if "V1026RhsDigitalGovernance20btSlice" not in text:
        text = text.replace(
            "/** Climate adaptation hospital-network slice (SECTION 20BR). */",
            dgov_slice + "\n/** Climate adaptation hospital-network slice (SECTION 20BR). */",
        )
    if "digitalGovernance20bt:" not in text:
        text = text.replace(
            "  climateAdaptation20br: V1026RhsClimateAdaptation20brSlice;\n",
            "  climateAdaptation20br: V1026RhsClimateAdaptation20brSlice;\n"
            "  digitalGovernance20bt: V1026RhsDigitalGovernance20btSlice;\n",
        )
    if "digitalGovernanceDelta?" not in text:
        text = text.replace(
            "  climateAdaptationDelta?: number;\n",
            "  climateAdaptationDelta?: number;\n  digitalGovernanceDelta?: number;\n",
        )
    path.write_text(text, encoding="utf-8")


def patch_crosswire_hub() -> None:
    path = ROOT / "adapters" / "adapter-crosswire-hub.ts"
    text = path.read_text(encoding="utf-8")
    if "readV1026RhsDigitalGovernance20btBridge" in text:
        return
    insert = """
export function readV1026RhsDigitalGovernance20btBridge(
  slice: import('../types/core').V1026RhsDigitalGovernance20btSlice,
  capacityStressIndex: number,
) {
  const digitalGovernanceDelta = V1026_RHS_clamp(
    slice.modelGovernancePressure * 0.05 + slice.alignmentDriftTurns * 0.04 + capacityStressIndex * 0.04,
    -6,
    14,
  );
  return { bottleneckDelta: digitalGovernanceDelta, stockDaysDelta: {}, digitalGovernanceDelta };
}
"""
    text = text.replace(
        "export function buildV1026RhsBriefing(",
        insert + "\nexport function buildV1026RhsBriefing(",
    )
    path.write_text(text, encoding="utf-8")


def write_dgov_adapter() -> None:
    path = ROOT / "adapters" / "adapter-digital-governance-20bt.ts"
    path.write_text(
        """/**
 * Cross-wire: V1024 digital governance hospital network depth (SECTION 20BT — e-health & data governance bridge).
 */
import type { V1026RhsTurnInput, V1026RhsSupplyBridge } from '../types/core';
import { readV1026RhsDigitalGovernance20btBridge } from './adapter-crosswire-hub';
import { V1026_RHS_clamp } from '../engine/regional-health-systems-utils';

export function computeV1026RhsDigitalGovernance20btBridge(
  input: V1026RhsTurnInput,
  capacityStressIndex: number,
): V1026RhsSupplyBridge {
  return readV1026RhsDigitalGovernance20btBridge(input.digitalGovernance20bt, capacityStressIndex);
}

export function applyV1026RhsDigitalGovernance20btDigitalGovernanceOverrides<T extends { bottleneckPressure?: number }>(
  base: T,
  bridge: V1026RhsSupplyBridge,
): T {
  return {
    ...base,
    bottleneckPressure: V1026_RHS_clamp(
      (base.bottleneckPressure ?? 40) + (bridge.digitalGovernanceDelta ?? bridge.bottleneckDelta),
      0,
      100,
    ),
  };
}
""",
        encoding="utf-8",
    )


def patch_self_tests() -> None:
    path = ROOT / "self-tests" / "run-v1026-rhs-self-tests.ts"
    text = path.read_text(encoding="utf-8")
    if "adapter-digital-governance-20bt" not in text:
        text = text.replace(
            "import { computeV1026RhsClimateAdaptation20brBridge, applyV1026RhsClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';",
            "import { computeV1026RhsClimateAdaptation20brBridge, applyV1026RhsClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';\n"
            "import { computeV1026RhsDigitalGovernance20btBridge, applyV1026RhsDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';",
        )
    if "digitalGovernance20bt:" not in text:
        text = text.replace(
            "    climateAdaptation20br: {\n      turn: 1,\n      heatStressPressure: 36,\n      grantStackLoad: 0.33,\n      resilienceDriftTurns: 22,\n    },",
            "    climateAdaptation20br: {\n      turn: 1,\n      heatStressPressure: 36,\n      grantStackLoad: 0.33,\n      resilienceDriftTurns: 22,\n    },\n"
            "    digitalGovernance20bt: {\n      turn: 1,\n      modelGovernancePressure: 28,\n      grantStackLoad: 0.29,\n      alignmentDriftTurns: 18,\n    },",
        )
    if "20BT digital governance adapter" not in text:
        block = """
  {
    const b = computeV1026RhsDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1026RhsDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1026_rhs_20bt_dgov',
      '20BT digital governance adapter',
      (next.bottleneckPressure ?? 0) > 40,
    );
  }
"""
        text = text.replace(
            "  check(\n    results,\n    'v1026_rhs_20br_climate',",
            block + "\n  check(\n    results,\n    'v1026_rhs_20br_climate',",
        )
    path.write_text(text, encoding="utf-8")


def patch_run_self_tests() -> None:
    path = ROOT / "run-self-tests.ts"
    path.write_text(
        """#!/usr/bin/env node
import { runV1026RhsSelfTests } from './self-tests/run-v1026-rhs-self-tests.ts';

const r = runV1026RhsSelfTests();
console.log(JSON.stringify({ passed: r.passed, total: r.total, allPassed: r.allPassed, labSuiteId: r.labSuiteId }, null, 2));
process.exit(r.allPassed ? 0 : 1);
""",
        encoding="utf-8",
    )


def patch_integration() -> None:
    path = ROOT / "INTEGRATION.md"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    extra = """
| **20BT** | Digital governance (V1024) — model governance pressure, alignment drift (`adapter-digital-governance-20bt.ts`) |
"""
    if "**20BT**" not in text:
        text = text.replace(
            "| **20BR** | Climate adaptation (V1023)",
            extra + "| **20BR** | Climate adaptation (V1023)",
        )
    text = text.replace(
        "Apply **20BR** Climate adaptation overrides",
        "Apply **20BT** digital governance overrides via `applyV1026RhsDigitalGovernance20btDigitalGovernanceOverrides` when digital governance tick runs\n| 5b | Apply **20BR** Climate adaptation overrides",
    )
    text = text.replace(
        "- `climateAdaptation20br` ← `gs.v1023ClimateAdaptation` / hazard resilience + drought-buffer slices",
        "- `climateAdaptation20br` ← `gs.v1023ClimateAdaptation` / hazard resilience + drought-buffer slices\n"
        "- `digitalGovernance20bt` ← `gs.v1024DigitalGovernance` / compliance + audit drift slices",
    )
    text = text.replace(
        "| `adapters/` | 20AZ / 20BR / 20BA / 20BB / 20BC / 20BF bridges |",
        "| `adapters/` | 20AZ / 20BR / 20BT / 20BA / 20BB / 20BC / 20BF bridges |",
    )
    path.write_text(text, encoding="utf-8")


def write_generate_py() -> None:
    src_gen = ROOT / "scripts" / "generate.py"
    text = src_gen.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace(
        'CHANNELS = ["species_recovery", "habitat_connectivity", "offset_integrity", "invasive_pressure", "fire_regime", "marine_protected", "urban_green", "indigenous_care", "regional", "remote"]',
        'CHANNELS = ["emergency_care", "primary_access", "hospital_network", "telehealth", "rural_clinic", "specialist_referral", "aged_care", "mental_health", "regional", "remote"]',
    )
    text = text.replace("!== 'fragile'", "!== 'overloaded'")
    text = text.replace("id: 'stress_", "id: 'care_")
    text = text.replace('SCEN_DIR = GEN / "recovery-scenarios"', 'SCEN_DIR = GEN / "care-scenarios"')
    src_gen.write_text(text, encoding="utf-8")


def patch_orchestrator_stub() -> None:
    path = ROOT / "engine" / "regional-health-systems-orchestrator.ts"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    if "digitalGovernance20bt:" in text:
        return
    text = text.replace(
        "climateAdaptation20br: { turn, heatStressPressure: 30, grantStackLoad: 0.2, resilienceDriftTurns: 12 },",
        "climateAdaptation20br: { turn, heatStressPressure: 30, grantStackLoad: 0.2, resilienceDriftTurns: 12 },\n"
        "    digitalGovernance20bt: { turn, modelGovernancePressure: 24, grantStackLoad: 0.18, alignmentDriftTurns: 10 },",
    )
    path.write_text(text, encoding="utf-8")


def main() -> None:
    rename_paths()
    write_generate_py()
    for p in ROOT.rglob("*"):
        if p.is_file():
            transform_file(p)
    patch_types_core()
    patch_crosswire_hub()
    write_dgov_adapter()
    patch_self_tests()
    patch_integration()
    patch_run_self_tests()
    patch_orchestrator_stub()
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "generate.py")], cwd=str(ROOT))


if __name__ == "__main__":
    main()
