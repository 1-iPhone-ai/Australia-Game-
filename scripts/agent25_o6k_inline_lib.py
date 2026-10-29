#!/usr/bin/env python3
"""Shared helpers — inline O6K expansion TS into (V9.4) australia-game-with-ai.tsx."""
from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
V94 = ROOT / "(V9.4) australia-game-with-ai.tsx"
ANCHOR = "// SECTION 21B:"


def strip_module_imports(src: str) -> str:
    out: list[str] = []
    skip = False
    for line in src.splitlines():
        st = line.strip()
        if st.startswith("export {") and "};" in st:
            continue
        if st.startswith("import ") or st.startswith("export *"):
            skip = " from " in st and not st.endswith(";")
            continue
        if skip:
            if ";" in line:
                skip = False
            continue
        if " from './" in line or ' from "./' in line or " from '../" in line or ' from "../' in line:
            continue
        out.append(line)
    return "\n".join(out)


def clean_orphan_import_lists(block: str) -> str:
    lines = block.splitlines()
    out: list[str] = []
    i = 0
    list_line = re.compile(r"^\s+(type\s+)?[\w]+\s*,?\s*$")
    while i < len(lines):
        line = lines[i]
        if list_line.match(line) and i + 1 < len(lines) and list_line.match(lines[i + 1]):
            while i < len(lines) and (
                list_line.match(lines[i])
                or lines[i].strip() in {"}", "} from './types';", '} from "./types";'}
            ):
                i += 1
            continue
        if "} from './" in line or '} from "./' in line or "} from '../" in line or '} from "../' in line:
            i += 1
            continue
        out.append(line)
        i += 1
    return "\n".join(out)


def sanitize_inlined_chunk(rel: str, src: str) -> str:
    name = rel.replace("\\", "/")
    if name.endswith("crosswalk-adapters.ts"):
        src = re.sub(r"\bPILLARS\b", "PUBSVC_ADAPTER_PILLARS", src)
    if name.endswith("crosswalk-engine.ts"):
        src = re.sub(r"\bPILLARS\b", "PUBSVC_ENGINE_PILLARS", src)
    if "kpi-regression-suite.ts" in name:
        src = re.sub(r"function check\(", "function v1014PubsSvcKpiCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1014PubsSvcKpiCheck(", src)
    if name.endswith("v1014-scenario-v2-gates.ts"):
        src = re.sub(r"\bREGIONS\b", "V1014SV2_GATE_REGIONS", src)
        src = re.sub(r"\bTIERS\b", "V1014SV2_GATE_TIERS", src)
        src = re.sub(r"\bARCH\b", "V1014SV2_GATE_ARCH", src)
    if "run-v1014-trade-depth-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1014TradeDepthCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1014TradeDepthCheck(", src)
    if "run-v1014-ai-fidelity-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1014AiFidelitySelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1014AiFidelitySelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1014AiFidelityBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1014AiFidelityBaseInput(", src)
    if "workforce-migration-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1014WorkforceMigrationPersisted, sanitizeV1014WorkforceMigrationPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1014_WORKFORCE_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1014_WORKFORCE_ORCH_REGIONS.forEach", src)
    if "workforce-migration/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"const REGIONS:", "const V1014_WORKFORCE_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1014_WORKFORCE_MIG_REGIONS", src)
    if "run-v1014-workforce-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1014WorkforceSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1014WorkforceSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1014WorkforceBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1014WorkforceBaseInput(", src)
        src = src.replace(
            "  sanitizeV1014WorkforceMigrationPersisted,\n} from '../engine/workforce-migration-orchestrator';",
            "} from '../engine/workforce-migration-orchestrator';\nimport {\n  createEmptyV1014WorkforceMigrationPersisted,\n  sanitizeV1014WorkforceMigrationPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1014WorkforceMigrationPersisted,\n  v1014WorkforceMigrationInputHash,\n  sanitizeV1014WorkforceMigrationPersisted,",
            "  createEmptyV1014WorkforceMigrationPersisted,\n  v1014WorkforceMigrationInputHash,",
        )
    if "national-resilience-utils.ts" in name:
        src = re.sub(
            r"export function V1016_NRES_propagationGraphHash",
            "export function V1016_NRES_utilPropagationGraphHash",
            src,
        )
        src = re.sub(
            r"V1016_NRES_propagationGraphHash\(",
            "V1016_NRES_utilPropagationGraphHash(",
            src,
        )
    if "national-resilience-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1016NresPersisted, sanitizeV1016NresPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1016_NRES_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1016_NRES_ORCH_REGIONS.forEach", src)
    if "v1016-national-resilience/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"const REGIONS:", "const V1016_NRES_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1016_NRES_MIG_REGIONS", src)
        src = re.sub(r"function clampNum\(", "function v1016NresClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1016NresClampNum(", src)
    if "run-v1016-nres-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1016NresSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1016NresSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1016NresBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1016NresBaseInput(", src)
    if "v1018-fiscal-federalism" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BI", "SECTION 20BJ")
    if "fiscal-federalism/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1018FfedClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1018FfedClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1018_FFED_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1018_FFED_MIG_REGIONS", src)
    if "fiscal-federalism-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1018FfedPersisted, sanitizeV1018FfedPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1018_FFED_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1018_FFED_ORCH_REGIONS.forEach", src)
    if "fiscal-federalism-utils.ts" in name:
        src = re.sub(
            r"export function V1018_FFED_grantStackGraphHash",
            "export function V1018_FFED_utilGrantStackGraphHash",
            src,
        )
    if "v1018-fiscal-federalism/grant-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"return nresPgHashCore\(edges\)",
            "return V1018_FFED_utilGrantStackGraphHash(edges)",
            src,
        )
    if "run-v1018-ffed-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1018FfedSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1018FfedSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1018FfedBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1018FfedBaseInput(", src)
        src = src.replace(
            "  runV1018FfedTurn,\n  createEmptyV1018FfedPersisted,\n  v1018FfedInputHash,\n  sanitizeV1018FfedPersisted,\n} from '../engine/fiscal-federalism-orchestrator';",
            "  runV1018FfedTurn,\n  v1018FfedInputHash,\n} from '../engine/fiscal-federalism-orchestrator';\nimport {\n  createEmptyV1018FfedPersisted,\n  sanitizeV1018FfedPersisted,\n} from '../persistence/migrations';",
        )
    if "v1017-intercity-logistics" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BI", "SECTION 20BK")
    if "intercity-logistics/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1017IclogClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1017IclogClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1017_ICLOG_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1017_ICLOG_MIG_REGIONS", src)
    if "intercity-logistics-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1017IclogPersisted, sanitizeV1017IclogPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1017_ICLOG_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1017_ICLOG_ORCH_REGIONS.forEach", src)
    if "intercity-logistics-utils.ts" in name:
        src = re.sub(
            r"export function V1017_ICLOG_corridorGraphHash",
            "export function V1017_ICLOG_utilCorridorGraphHash",
            src,
        )
    if "v1017-intercity-logistics/corridor-graph/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"return nresPgHashCore\(edges\)",
            "return V1017_ICLOG_utilCorridorGraphHash(edges)",
            src,
        )
    if "run-v1017-iclog-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1017IclogSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1017IclogSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1017IclogBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1017IclogBaseInput(", src)
        src = src.replace(
            "  runV1017IclogTurn,\n  createEmptyV1017IclogPersisted,\n  v1017IclogInputHash,\n  sanitizeV1017IclogPersisted,\n} from '../engine/intercity-logistics-orchestrator';",
            "  runV1017IclogTurn,\n  v1017IclogInputHash,\n} from '../engine/intercity-logistics-orchestrator';\nimport {\n  createEmptyV1017IclogPersisted,\n  sanitizeV1017IclogPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1017IclogPersisted,\n  v1017IclogInputHash,\n  sanitizeV1017IclogPersisted,\n} from '../engine/intercity-logistics-orchestrator';",
            "  v1017IclogInputHash,\n} from '../engine/intercity-logistics-orchestrator';\nimport {\n  createEmptyV1017IclogPersisted,\n  sanitizeV1017IclogPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1018FfedPersisted,\n  v1018FfedInputHash,\n  sanitizeV1018FfedPersisted,\n} from '../engine/fiscal-federalism-orchestrator';",
            "  v1018FfedInputHash,\n} from '../engine/fiscal-federalism-orchestrator';\nimport {\n  createEmptyV1018FfedPersisted,\n  sanitizeV1018FfedPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  sanitizeV1016NresPersisted,\n} from '../engine/national-resilience-orchestrator';",
            "} from '../engine/national-resilience-orchestrator';\nimport {\n  createEmptyV1016NresPersisted,\n  sanitizeV1016NresPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1016NresPersisted,\n  v1016NresInputHash,\n  sanitizeV1016NresPersisted,",
            "  createEmptyV1016NresPersisted,\n  v1016NresInputHash,",
        )
    if "v1020-research-pipeline" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BL", "SECTION 20BM")
    if "research-pipeline/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1020RpipeClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1020RpipeClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1020_RPIPE_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1020_RPIPE_MIG_REGIONS", src)
    if "research-pipeline-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1020RpipePersisted, sanitizeV1020RpipePersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1020_RPIPE_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1020_RPIPE_ORCH_REGIONS.forEach", src)
    if "research-pipeline-utils.ts" in name:
        src = re.sub(
            r"export function V1020_RPIPE_commercializationStackGraphHash",
            "export function V1020_RPIPE_utilCommercializationStackGraphHash",
            src,
        )
    if "v1020-research-pipeline/commercialization-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"return nresPgHashCore\(edges\)",
            "return V1020_RPIPE_utilCommercializationStackGraphHash(edges)",
            src,
        )
    if "run-v1020-rpipe-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1020RpipeSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1020RpipeSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1020RpipeBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1020RpipeBaseInput(", src)
        src = src.replace(
            "  runV1020RpipeTurn,\n  createEmptyV1020RpipePersisted,\n  v1020RpipeInputHash,\n  sanitizeV1020RpipePersisted,\n} from '../engine/research-pipeline-orchestrator';",
            "  runV1020RpipeTurn,\n  v1020RpipeInputHash,\n} from '../engine/research-pipeline-orchestrator';\nimport {\n  createEmptyV1020RpipePersisted,\n  sanitizeV1020RpipePersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1020RpipePersisted,\n  v1020RpipeInputHash,\n  sanitizeV1020RpipePersisted,\n} from '../engine/research-pipeline-orchestrator';",
            "  v1020RpipeInputHash,\n} from '../engine/research-pipeline-orchestrator';\nimport {\n  createEmptyV1020RpipePersisted,\n  sanitizeV1020RpipePersisted,\n} from '../persistence/migrations';",
        )
    return src


def bundle_local_files(rel_paths: list[str]) -> str:
    parts: list[str] = []
    for rel in rel_paths:
        p = ROOT / rel
        if not p.is_file():
            raise SystemExit(f"missing bundle file: {rel}")
        raw = strip_module_imports(p.read_text(encoding="utf-8"))
        parts.append(sanitize_inlined_chunk(rel, raw))
    return clean_orphan_import_lists("\n\n".join(parts))


def paths_from_index(index_rel: str) -> list[str]:
    idx = ROOT / index_rel
    base = idx.parent
    out: list[str] = []
    for m in re.finditer(r"from ['\"]\./([^'\"]+)['\"]", idx.read_text(encoding="utf-8")):
        tail = m.group(1)
        if not tail.endswith(".ts"):
            tail = f"{tail}.ts"
        out.append(str((base / tail).relative_to(ROOT)))
    return out


def trade_sanctions_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/trade-sanctions"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/types/" in s:
            return (0, s)
        if "/constants/" in s:
            return (1, s)
        if "/persistence/" in s:
            return (2, s)
        if "trade-depth-utils" in s:
            return (3, s)
        if "/engine/retaliation/" in s:
            return (4, s)
        if "/bilateral-deals/" in s:
            return (5, s)
        if "/tariffs/" in s:
            return (6, s)
        if "/sanctions/" in s:
            return (7, s)
        if "/capital-controls/" in s:
            return (8, s)
        if "/fixtures/" in s:
            return (9, s)
        if "/ai/personas/" in s:
            return (10, s)
        if "/ai/" in s:
            return (11, s)
        if "/adapters/" in s:
            return (12, s)
        if "trade-depth-orchestrator" in s:
            return (13, s)
        if "/self-tests/" in s:
            return (14, s)
        return (50, s)

    files = sorted(
        (p for p in root.rglob("*.ts") if p.name != "index.ts"),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def public_services_paths() -> list[str]:
    core = [
        "expansion/o6k-10m/public-services/src/core/types.ts",
        "expansion/o6k-10m/public-services/src/core/constants.ts",
        "expansion/o6k-10m/public-services/src/core/math.ts",
        "expansion/o6k-10m/public-services/src/queues/delivery-queue-engine.ts",
        "expansion/o6k-10m/public-services/src/skills/skill-mismatch-engine.ts",
        "expansion/o6k-10m/public-services/src/migration/migration-feedback-engine.ts",
        "expansion/o6k-10m/public-services/src/adapters/crosswalk-adapters.ts",
        "expansion/o6k-10m/public-services/src/persistence/section6-regional-aggregates.ts",
        "expansion/o6k-10m/public-services/src/core/crosswalk-engine.ts",
    ]
    generated = paths_from_index("expansion/o6k-10m/public-services/src/generated/index.ts")
    tail = ["expansion/o6k-10m/public-services/src/self-tests/kpi-regression-suite.ts"]
    return core + generated + tail


def energy_environment_paths() -> list[str]:
    base = ROOT / "expansion/o6k-10m/energy-environment/src"
    catalog = sorted(str(p.relative_to(ROOT)) for p in (base / "catalog").glob("*.ts"))
    core = [
        "expansion/o6k-10m/energy-environment/src/types.ts",
        "expansion/o6k-10m/energy-environment/src/primitives.ts",
        "expansion/o6k-10m/energy-environment/src/persistence.ts",
    ]
    engines = [
        "expansion/o6k-10m/energy-environment/src/engine-grid-stability.ts",
        "expansion/o6k-10m/energy-environment/src/engine-extraction-depletion.ts",
        "expansion/o6k-10m/energy-environment/src/engine-renewable-intermittency.ts",
        "expansion/o6k-10m/energy-environment/src/engine-carbon-budgets.ts",
        "expansion/o6k-10m/energy-environment/src/engine-contingency.ts",
        "expansion/o6k-10m/energy-environment/src/engine-coupling.ts",
    ]
    adapters = sorted(str(p.relative_to(ROOT)) for p in (base / "adapters").glob("*.ts"))
    tail = [
        "expansion/o6k-10m/energy-environment/src/compute.ts",
        "expansion/o6k-10m/energy-environment/src/self-test-fixtures.ts",
        "expansion/o6k-10m/energy-environment/src/self-tests.ts",
    ]
    return core + catalog + engines + adapters + tail


def scenario_packs_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/scenario-packs"
    catalogs = sorted(str(p.relative_to(ROOT)) for p in (root / "catalog").glob("*.ts"))
    core = [
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-types.ts",
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-persistence.ts",
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-engine.ts",
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-gates.ts",
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-crosswire.ts",
    ]
    tail = catalogs + [
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-catalog-aggregate.ts",
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-replay-manifests.ts",
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-coaching-ledger.ts",
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-fixtures.ts",
        "expansion/o6k-10m/scenario-packs/v1014-scenario-v2-self-tests.ts",
    ]
    return core + tail


def ai_fidelity_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/ai-fidelity"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/types/" in s:
            return (0, s)
        if "/constants/" in s:
            return (1, s)
        if "/persistence/" in s:
            return (2, s)
        if "ai-fidelity-utils" in s:
            return (3, s)
        if "/plan-act-verify/" in s:
            return (4, s)
        if "/verify/" in s:
            return (5, s)
        if "/team-routes/" in s:
            return (6, s)
        if "/advisory/" in s:
            return (7, s)
        if "/ui-gates/" in s:
            return (8, s)
        if "/explainability-bundles/" in s:
            return (9, s)
        if "fidelity-read-adapters" in s:
            return (10, s)
        if "/adapters/" in s:
            return (11, s)
        if "ai-fidelity-orchestrator" in s:
            return (12, s)
        if "/self-tests/" in s:
            return (13, s)
        return (50, s)

    files = sorted(
        (p for p in root.rglob("*.ts") if p.name != "index.ts"),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def workforce_migration_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/workforce-migration"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/constants/" in s:
            return (1, s)
        if "/persistence/" in s:
            return (2, s)
        if "/migration-corridors/" in s:
            return (3, s)
        if "skills-graph/graph-utils" in s:
            return (4, s)
        if "/migration-scenarios/" in s:
            return (5, s)
        if "/skills-graph/edge-" in s:
            return (6, s)
        if "migration-scenario-registry" in s:
            return (7, s)
        if "skills-graph-bundle" in s:
            return (8, s)
        if "workforce-migration-utils" in s:
            return (9, s)
        if "/adapters/" in s:
            return (10, s)
        if "workforce-migration-orchestrator" in s:
            return (11, s)
        if "/self-tests/" in s:
            return (12, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name != "index.ts"
            and "/scripts/" not in str(p)
            and p.name != "run-self-tests.ts"
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def national_resilience_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1016-national-resilience"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/continuity-nodes/" in s:
            return (2, s)
        if "propagation-graph/graph-utils" in s:
            return (3, s)
        if "/supply-shock-scenarios/" in s:
            return (4, s)
        if "/propagation-graph/edge-" in s or "/generated/propagation-graph/" in s:
            return (5, s)
        if "supply-shock-registry" in s:
            return (6, s)
        if "propagation-graph-bundle" in s:
            return (7, s)
        if "national-resilience-utils" in s:
            return (8, s)
        if "/adapters/" in s:
            return (9, s)
        if "national-resilience-orchestrator" in s:
            return (10, s)
        if "/self-tests/" in s:
            return (11, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def fiscal_federalism_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1018-fiscal-federalism"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/grant-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/transfer-scenarios/" in s:
            return (3, s)
        if "/generated/grant-stacks/" in s:
            return (4, s)
        if "transfer-registry" in s or "grant-stack-bundle" in s:
            return (5, s)
        if "/audit-trails/" in s:
            return (6, s)
        if "fiscal-federalism-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "fiscal-federalism-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def intercity_logistics_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1017-intercity-logistics"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/corridor-graph/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/freight-route-scenarios/" in s:
            return (3, s)
        if "/generated/corridor-graph/" in s:
            return (4, s)
        if "freight-route-registry" in s or "corridor-graph-bundle" in s:
            return (5, s)
        if "/logistics-hubs/" in s:
            return (6, s)
        if "intercity-logistics-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "intercity-logistics-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def research_pipeline_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1020-research-pipeline"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/commercialization-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/pipeline-scenarios/" in s:
            return (3, s)
        if "/generated/commercialization-stacks/" in s:
            return (4, s)
        if "pipeline-registry" in s or "commercialization-stack-bundle" in s:
            return (5, s)
        if "/lab-transfers/" in s:
            return (6, s)
        if "research-pipeline-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "research-pipeline-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def insert_before(text: str, block: str, marker: str, label: str) -> str:
    if marker in text:
        print(f"skip insert {label} (marker present)")
        return text
    idx = text.index(ANCHOR)
    banner = (
        f"\n// ============================================================================\n"
        f"// Agent 25 tranche 6 — {label}\n"
        f"// ============================================================================\n"
    )
    return text[:idx] + banner + block + "\n" + text[idx:]
