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
    if "v1019-maritime-trade" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BM", "SECTION 20BN")
        src = src.replace("SECTION 20BL", "SECTION 20BN")
    if "maritime-trade/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1019MtrdClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1019MtrdClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1019_MTRD_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1019_MTRD_MIG_REGIONS", src)
    if "maritime-trade-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1019MtrdPersisted, sanitizeV1019MtrdPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1019_MTRD_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1019_MTRD_ORCH_REGIONS.forEach", src)
    if "maritime-trade-utils.ts" in name:
        src = re.sub(
            r"export function V1019_MTRD_laneGraphHash",
            "export function V1019_MTRD_utilLaneGraphHash",
            src,
        )
    if "v1019-maritime-trade/lane-graph/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"return nresPgHashCore\(edges\)",
            "return V1019_MTRD_utilLaneGraphHash(edges)",
            src,
        )
    if "run-v1019-mtrd-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1019MtrdSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1019MtrdSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1019MtrdBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1019MtrdBaseInput(", src)
        src = src.replace(
            "  runV1019MtrdTurn,\n  createEmptyV1019MtrdPersisted,\n  v1019MtrdInputHash,\n  sanitizeV1019MtrdPersisted,\n} from '../engine/maritime-trade-orchestrator';",
            "  runV1019MtrdTurn,\n  v1019MtrdInputHash,\n} from '../engine/maritime-trade-orchestrator';\nimport {\n  createEmptyV1019MtrdPersisted,\n  sanitizeV1019MtrdPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1019MtrdPersisted,\n  v1019MtrdInputHash,\n  sanitizeV1019MtrdPersisted,\n} from '../engine/maritime-trade-orchestrator';",
            "  v1019MtrdInputHash,\n} from '../engine/maritime-trade-orchestrator';\nimport {\n  createEmptyV1019MtrdPersisted,\n  sanitizeV1019MtrdPersisted,\n} from '../persistence/migrations';",
        )
    if "v1021-intermodal-freight" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BO", "SECTION 20BP")
        src = src.replace("SECTION 20BL", "SECTION 20BP")
        src = src.replace("SECTION 20BM", "SECTION 20BP")
    if "intermodal-freight/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1021ImfdClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1021ImfdClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1021_IMFD_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1021_IMFD_MIG_REGIONS", src)
    if "intermodal-freight-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1021ImfdPersisted, sanitizeV1021ImfdPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1021_IMFD_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1021_IMFD_ORCH_REGIONS.forEach", src)
    if "intermodal-freight-utils.ts" in name:
        src = re.sub(
            r"export function V1021_IMFD_handoffStackGraphHash",
            "export function V1021_IMFD_utilHandoffStackGraphHash",
            src,
        )
    if "v1021-intermodal-freight/handoff-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1021_IMFD_handoffStackGraphHash as imfdPgHashCore",
            "V1021_IMFD_utilHandoffStackGraphHash as imfdPgHashCore",
            src,
        )
    if "run-v1021-imfd-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1021ImfdSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1021ImfdSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1021ImfdBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1021ImfdBaseInput(", src)
        src = src.replace(
            "  runV1021ImfdTurn,\n  createEmptyV1021ImfdPersisted,\n  v1021ImfdInputHash,\n  sanitizeV1021ImfdPersisted,\n} from '../engine/intermodal-freight-orchestrator';",
            "  runV1021ImfdTurn,\n  v1021ImfdInputHash,\n} from '../engine/intermodal-freight-orchestrator';\nimport {\n  createEmptyV1021ImfdPersisted,\n  sanitizeV1021ImfdPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1021ImfdPersisted,\n  v1021ImfdInputHash,\n  sanitizeV1021ImfdPersisted,\n} from '../engine/intermodal-freight-orchestrator';",
            "  v1021ImfdInputHash,\n} from '../engine/intermodal-freight-orchestrator';\nimport {\n  createEmptyV1021ImfdPersisted,\n  sanitizeV1021ImfdPersisted,\n} from '../persistence/migrations';",
        )
    if "v1022-housing-affordability" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BP", "SECTION 20BQ")
        src = src.replace("SECTION 20BO", "SECTION 20BQ")
        src = src.replace("SECTION 20BL", "SECTION 20BQ")
    if "housing-affordability/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1022HaffClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1022HaffClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1022_HAFF_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1022_HAFF_MIG_REGIONS", src)
    if "housing-affordability-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1022HaffPersisted, sanitizeV1022HaffPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1022_HAFF_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1022_HAFF_ORCH_REGIONS.forEach", src)
    if "housing-affordability-utils.ts" in name:
        src = re.sub(
            r"export function V1022_HAFF_supplyPipelineGraphHash",
            "export function V1022_HAFF_utilSupplyPipelineGraphHash",
            src,
        )
    if "v1022-housing-affordability/supply-pipeline-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1022_HAFF_supplyPipelineGraphHash as imfdPgHashCore",
            "V1022_HAFF_utilSupplyPipelineGraphHash as haffPgHashCore",
            src,
        )
        src = re.sub(r"imfdPgHashCore", "haffPgHashCore", src)
    if "run-v1022-haff-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1022HaffSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1022HaffSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1022HaffBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1022HaffBaseInput(", src)
        src = src.replace(
            "  runV1022HaffTurn,\n  createEmptyV1022HaffPersisted,\n  v1022HaffInputHash,\n  sanitizeV1022HaffPersisted,\n} from '../engine/housing-affordability-orchestrator';",
            "  runV1022HaffTurn,\n  v1022HaffInputHash,\n} from '../engine/housing-affordability-orchestrator';\nimport {\n  createEmptyV1022HaffPersisted,\n  sanitizeV1022HaffPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1022HaffPersisted,\n  v1022HaffInputHash,\n  sanitizeV1022HaffPersisted,\n} from '../engine/housing-affordability-orchestrator';",
            "  v1022HaffInputHash,\n} from '../engine/housing-affordability-orchestrator';\nimport {\n  createEmptyV1022HaffPersisted,\n  sanitizeV1022HaffPersisted,\n} from '../persistence/migrations';",
        )
    if "v1023-climate-adaptation" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BQ", "SECTION 20BR")
        src = src.replace("SECTION 20BP", "SECTION 20BR")
        src = src.replace("SECTION 20BS", "SECTION 20BR")
    if "climate-adaptation/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1023CladClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1023CladClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1023_CLAD_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1023_CLAD_MIG_REGIONS", src)
    if "climate-adaptation-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1023CladPersisted, sanitizeV1023CladPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1023_CLAD_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1023_CLAD_ORCH_REGIONS.forEach", src)
    if "climate-adaptation-utils.ts" in name:
        src = re.sub(
            r"export function V1023_CLAD_droughtBufferGraphHash",
            "export function V1023_CLAD_utilDroughtBufferGraphHash",
            src,
        )
    if "v1023-climate-adaptation/drought-buffer-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1023_CLAD_droughtBufferGraphHash as imfdPgHashCore",
            "V1023_CLAD_utilDroughtBufferGraphHash as cladPgHashCore",
            src,
        )
        src = re.sub(r"imfdPgHashCore", "cladPgHashCore", src)
    if "run-v1023-clad-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1023CladSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1023CladSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1023CladBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1023CladBaseInput(", src)
        src = src.replace(
            "  runV1023CladTurn,\n  createEmptyV1023CladPersisted,\n  v1023CladInputHash,\n  sanitizeV1023CladPersisted,\n} from '../engine/climate-adaptation-orchestrator';",
            "  runV1023CladTurn,\n  v1023CladInputHash,\n} from '../engine/climate-adaptation-orchestrator';\nimport {\n  createEmptyV1023CladPersisted,\n  sanitizeV1023CladPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1023CladPersisted,\n  v1023CladInputHash,\n  sanitizeV1023CladPersisted,\n} from '../engine/climate-adaptation-orchestrator';",
            "  v1023CladInputHash,\n} from '../engine/climate-adaptation-orchestrator';\nimport {\n  createEmptyV1023CladPersisted,\n  sanitizeV1023CladPersisted,\n} from '../persistence/migrations';",
        )
    if "v1024-digital-governance" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BR", "SECTION 20BT")
        src = src.replace("SECTION 20BQ", "SECTION 20BT")
        src = src.replace("SECTION 20BS", "SECTION 20BT")
    if "digital-governance/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1024DgovClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1024DgovClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1024_DGOV_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1024_DGOV_MIG_REGIONS", src)
    if "digital-governance-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1024DgovPersisted, sanitizeV1024DgovPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1024_DGOV_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1024_DGOV_ORCH_REGIONS.forEach", src)
    if "digital-governance-utils.ts" in name:
        src = re.sub(
            r"export function V1024_DGOV_dataSovereigntyGraphHash",
            "export function V1024_DGOV_utilDataSovereigntyGraphHash",
            src,
        )
    if "v1024-digital-governance/data-sovereignty-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1024_DGOV_dataSovereigntyGraphHash as dgovGraphHashCore",
            "V1024_DGOV_utilDataSovereigntyGraphHash as dgovGraphHashCore",
            src,
        )
    if "run-v1024-dgov-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1024DgovSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1024DgovSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1024DgovBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1024DgovBaseInput(", src)
        src = src.replace(
            "  runV1024DgovTurn,\n  createEmptyV1024DgovPersisted,\n  v1024DgovInputHash,\n  sanitizeV1024DgovPersisted,\n} from '../engine/digital-governance-orchestrator';",
            "  runV1024DgovTurn,\n  v1024DgovInputHash,\n} from '../engine/digital-governance-orchestrator';\nimport {\n  createEmptyV1024DgovPersisted,\n  sanitizeV1024DgovPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1024DgovPersisted,\n  v1024DgovInputHash,\n  sanitizeV1024DgovPersisted,\n} from '../engine/digital-governance-orchestrator';",
            "  v1024DgovInputHash,\n} from '../engine/digital-governance-orchestrator';\nimport {\n  createEmptyV1024DgovPersisted,\n  sanitizeV1024DgovPersisted,\n} from '../persistence/migrations';",
        )
    if "v1025-biodiversity-stewardship" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BT", "SECTION 20BU")
        src = src.replace("SECTION 20BS", "SECTION 20BU")
        src = src.replace("SECTION 20BR", "SECTION 20BU")
    if "biodiversity-stewardship/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1025BioClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1025BioClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1025_BIO_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1025_BIO_MIG_REGIONS", src)
    if "biodiversity-stewardship-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1025BioPersisted, sanitizeV1025BioPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1025_BIO_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1025_BIO_ORCH_REGIONS.forEach", src)
    if "biodiversity-stewardship-utils.ts" in name:
        src = re.sub(
            r"export function V1025_BIO_conservationOffsetGraphHash",
            "export function V1025_BIO_utilConservationOffsetGraphHash",
            src,
        )
    if "v1025-biodiversity-stewardship/conservation-offset-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1025_BIO_conservationOffsetGraphHash as dgovGraphHashCore",
            "V1025_BIO_utilConservationOffsetGraphHash as dgovGraphHashCore",
            src,
        )
    if "run-v1025-bio-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1025BioSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1025BioSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1025BioBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1025BioBaseInput(", src)
        src = src.replace(
            "  runV1025BioTurn,\n  createEmptyV1025BioPersisted,\n  v1025BioInputHash,\n  sanitizeV1025BioPersisted,\n} from '../engine/biodiversity-stewardship-orchestrator';",
            "  runV1025BioTurn,\n  v1025BioInputHash,\n} from '../engine/biodiversity-stewardship-orchestrator';\nimport {\n  createEmptyV1025BioPersisted,\n  sanitizeV1025BioPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1025BioPersisted,\n  v1025BioInputHash,\n  sanitizeV1025BioPersisted,\n} from '../engine/biodiversity-stewardship-orchestrator';",
            "  v1025BioInputHash,\n} from '../engine/biodiversity-stewardship-orchestrator';\nimport {\n  createEmptyV1025BioPersisted,\n  sanitizeV1025BioPersisted,\n} from '../persistence/migrations';",
        )
    if "v1026-regional-health-systems" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BU", "SECTION 20BV")
        src = src.replace("SECTION 20BT", "SECTION 20BV")
        src = src.replace("SECTION 20BR", "SECTION 20BV")
    if "regional-health-systems/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1026RhsClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1026RhsClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1026_RHS_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1026_RHS_MIG_REGIONS", src)
    if "regional-health-systems-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1026RhsPersisted, sanitizeV1026RhsPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1026_RHS_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1026_RHS_ORCH_REGIONS.forEach", src)
    if "regional-health-systems-utils.ts" in name:
        src = re.sub(
            r"export function V1026_RHS_primaryCareAccessGraphHash",
            "export function V1026_RHS_utilPrimaryCareAccessGraphHash",
            src,
        )
    if "v1026-regional-health-systems/primary-care-access-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1026_RHS_primaryCareAccessGraphHash as dgovGraphHashCore",
            "V1026_RHS_utilPrimaryCareAccessGraphHash as dgovGraphHashCore",
            src,
        )
    if "run-v1026-rhs-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1026RhsSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1026RhsSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1026RhsBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1026RhsBaseInput(", src)
        src = src.replace(
            "  runV1026RhsTurn,\n  createEmptyV1026RhsPersisted,\n  v1026RhsInputHash,\n  sanitizeV1026RhsPersisted,\n} from '../engine/regional-health-systems-orchestrator';",
            "  runV1026RhsTurn,\n  v1026RhsInputHash,\n} from '../engine/regional-health-systems-orchestrator';\nimport {\n  createEmptyV1026RhsPersisted,\n  sanitizeV1026RhsPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1026RhsPersisted,\n  v1026RhsInputHash,\n  sanitizeV1026RhsPersisted,\n} from '../engine/regional-health-systems-orchestrator';",
            "  v1026RhsInputHash,\n} from '../engine/regional-health-systems-orchestrator';\nimport {\n  createEmptyV1026RhsPersisted,\n  sanitizeV1026RhsPersisted,\n} from '../persistence/migrations';",
        )
    if "v1027-water-security" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BV", "SECTION 20BW")
        src = src.replace("SECTION 20BU", "SECTION 20BW")
        src = src.replace("SECTION 20BT", "SECTION 20BW")
        src = src.replace("SECTION 20BR", "SECTION 20BW")
    if "water-security/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1027WsecClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1027WsecClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1027_WSEC_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1027_WSEC_MIG_REGIONS", src)
    if "water-security-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1027WsecPersisted, sanitizeV1027WsecPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1027_WSEC_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1027_WSEC_ORCH_REGIONS.forEach", src)
    if "water-security-utils.ts" in name:
        src = re.sub(
            r"export function V1027_WSEC_aquiferReserveGraphHash",
            "export function V1027_WSEC_utilAquiferReserveGraphHash",
            src,
        )
    if "v1027-water-security/aquifer-reserve-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1027_WSEC_aquiferReserveGraphHash as dgovGraphHashCore",
            "V1027_WSEC_utilAquiferReserveGraphHash as dgovGraphHashCore",
            src,
        )
    if "run-v1027-wsec-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1027WsecSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1027WsecSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1027WsecBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1027WsecBaseInput(", src)
        src = src.replace(
            "  runV1027WsecTurn,\n  createEmptyV1027WsecPersisted,\n  v1027WsecInputHash,\n  sanitizeV1027WsecPersisted,\n} from '../engine/water-security-orchestrator';",
            "  runV1027WsecTurn,\n  v1027WsecInputHash,\n} from '../engine/water-security-orchestrator';\nimport {\n  createEmptyV1027WsecPersisted,\n  sanitizeV1027WsecPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1027WsecPersisted,\n  v1027WsecInputHash,\n  sanitizeV1027WsecPersisted,\n} from '../engine/water-security-orchestrator';",
            "  v1027WsecInputHash,\n} from '../engine/water-security-orchestrator';\nimport {\n  createEmptyV1027WsecPersisted,\n  sanitizeV1027WsecPersisted,\n} from '../persistence/migrations';",
        )
    if "v1028-disaster-resilience" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BW", "SECTION 20BX")
        src = src.replace("SECTION 20BV", "SECTION 20BX")
        src = src.replace("SECTION 20BU", "SECTION 20BX")
        src = src.replace("SECTION 20BT", "SECTION 20BX")
        src = src.replace("SECTION 20BR", "SECTION 20BX")
    if "disaster-resilience/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1028DresClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1028DresClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1028_DRES_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1028_DRES_MIG_REGIONS", src)
    if "disaster-resilience-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1028DresPersisted, sanitizeV1028DresPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1028_DRES_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1028_DRES_ORCH_REGIONS.forEach", src)
    if "disaster-resilience-utils.ts" in name:
        src = re.sub(
            r"export function V1028_DRES_evacuationCapacityGraphHash",
            "export function V1028_DRES_utilEvacuationCapacityGraphHash",
            src,
        )
    if "v1028-disaster-resilience/evacuation-capacity-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1028_DRES_evacuationCapacityGraphHash as dgovGraphHashCore",
            "V1028_DRES_utilEvacuationCapacityGraphHash as dgovGraphHashCore",
            src,
        )
    if "run-v1028-dres-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1028DresSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1028DresSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1028DresBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1028DresBaseInput(", src)
        src = src.replace(
            "  runV1028DresTurn,\n  createEmptyV1028DresPersisted,\n  v1028DresInputHash,\n  sanitizeV1028DresPersisted,\n} from '../engine/disaster-resilience-orchestrator';",
            "  runV1028DresTurn,\n  v1028DresInputHash,\n} from '../engine/disaster-resilience-orchestrator';\nimport {\n  createEmptyV1028DresPersisted,\n  sanitizeV1028DresPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1028DresPersisted,\n  v1028DresInputHash,\n  sanitizeV1028DresPersisted,\n} from '../engine/disaster-resilience-orchestrator';",
            "  v1028DresInputHash,\n} from '../engine/disaster-resilience-orchestrator';\nimport {\n  createEmptyV1028DresPersisted,\n  sanitizeV1028DresPersisted,\n} from '../persistence/migrations';",
        )
    if "v1029-coastal-resilience" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BX", "SECTION 20BY")
        src = src.replace("SECTION 20BW", "SECTION 20BY")
        src = src.replace("SECTION 20BV", "SECTION 20BY")
        src = src.replace("SECTION 20BU", "SECTION 20BY")
        src = src.replace("SECTION 20BT", "SECTION 20BY")
        src = src.replace("SECTION 20BR", "SECTION 20BY")
    if "coastal-resilience/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1029CresClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1029CresClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1029_CRES_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1029_CRES_MIG_REGIONS", src)
    if "coastal-resilience-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1029CresPersisted, sanitizeV1029CresPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1029_CRES_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1029_CRES_ORCH_REGIONS.forEach", src)
    if "coastal-resilience-utils.ts" in name:
        src = re.sub(
            r"export function V1029_CRES_adaptationBufferGraphHash",
            "export function V1029_CRES_utilAdaptationBufferGraphHash",
            src,
        )
    if "v1029-coastal-resilience/adaptation-buffer-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1029_CRES_adaptationBufferGraphHash as dgovGraphHashCore",
            "V1029_CRES_utilAdaptationBufferGraphHash as dgovGraphHashCore",
            src,
        )
    if "run-v1029-cres-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1029CresSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1029CresSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1029CresBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1029CresBaseInput(", src)
        src = src.replace(
            "  runV1029CresTurn,\n  createEmptyV1029CresPersisted,\n  v1029CresInputHash,\n  sanitizeV1029CresPersisted,\n} from '../engine/coastal-resilience-orchestrator';",
            "  runV1029CresTurn,\n  v1029CresInputHash,\n} from '../engine/coastal-resilience-orchestrator';\nimport {\n  createEmptyV1029CresPersisted,\n  sanitizeV1029CresPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1029CresPersisted,\n  v1029CresInputHash,\n  sanitizeV1029CresPersisted,\n} from '../engine/coastal-resilience-orchestrator';",
            "  v1029CresInputHash,\n} from '../engine/coastal-resilience-orchestrator';\nimport {\n  createEmptyV1029CresPersisted,\n  sanitizeV1029CresPersisted,\n} from '../persistence/migrations';",
        )
    if "v1030-inland-heat" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BY", "SECTION 20BZ")
        src = src.replace("SECTION 20BX", "SECTION 20BZ")
        src = src.replace("SECTION 20BW", "SECTION 20BZ")
        src = src.replace("SECTION 20BV", "SECTION 20BZ")
        src = src.replace("SECTION 20BU", "SECTION 20BZ")
        src = src.replace("SECTION 20BT", "SECTION 20BZ")
        src = src.replace("SECTION 20BR", "SECTION 20BZ")
    if "inland-heat/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1030IheatClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1030IheatClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1030_IHEAT_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1030_IHEAT_MIG_REGIONS", src)
    if "inland-heat-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1030IheatPersisted, sanitizeV1030IheatPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1030_IHEAT_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1030_IHEAT_ORCH_REGIONS.forEach", src)
    if "inland-heat-utils.ts" in name:
        src = re.sub(
            r"export function V1030_IHEAT_aridBufferGraphHash",
            "export function V1030_IHEAT_utilAridBufferGraphHash",
            src,
        )
    if "v1030-inland-heat/arid-buffer-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1030_IHEAT_aridBufferGraphHash as dgovGraphHashCore",
            "V1030_IHEAT_utilAridBufferGraphHash as dgovGraphHashCore",
            src,
        )
    if "run-v1030-iheat-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1030IheatSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1030IheatSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1030IheatBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1030IheatBaseInput(", src)
        src = src.replace(
            "  runV1030IheatTurn,\n  createEmptyV1030IheatPersisted,\n  v1030IheatInputHash,\n  sanitizeV1030IheatPersisted,\n} from '../engine/inland-heat-orchestrator';",
            "  runV1030IheatTurn,\n  v1030IheatInputHash,\n} from '../engine/inland-heat-orchestrator';\nimport {\n  createEmptyV1030IheatPersisted,\n  sanitizeV1030IheatPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1030IheatPersisted,\n  v1030IheatInputHash,\n  sanitizeV1030IheatPersisted,\n} from '../engine/inland-heat-orchestrator';",
            "  v1030IheatInputHash,\n} from '../engine/inland-heat-orchestrator';\nimport {\n  createEmptyV1030IheatPersisted,\n  sanitizeV1030IheatPersisted,\n} from '../persistence/migrations';",
        )
    if "v1031-grid-resilience" in name.replace("\\", "/"):
        src = src.replace("SECTION 20BZ", "SECTION 20CA")
        src = src.replace("SECTION 20BY", "SECTION 20CA")
        src = src.replace("SECTION 20BX", "SECTION 20CA")
        src = src.replace("SECTION 20BW", "SECTION 20CA")
        src = src.replace("SECTION 20BV", "SECTION 20CA")
        src = src.replace("SECTION 20BU", "SECTION 20CA")
        src = src.replace("SECTION 20BT", "SECTION 20CA")
        src = src.replace("SECTION 20BR", "SECTION 20CA")
    if "grid-resilience/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1031GresClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1031GresClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1031_GRES_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1031_GRES_MIG_REGIONS", src)
    if "grid-resilience-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1031GresPersisted, sanitizeV1031GresPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1031_GRES_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1031_GRES_ORCH_REGIONS.forEach", src)
    if "grid-resilience-utils.ts" in name:
        src = re.sub(
            r"export function V1031_GRES_gridBufferGraphHash",
            "export function V1031_GRES_utilGridBufferGraphHash",
            src,
        )
    if "v1031-grid-resilience/grid-buffer-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1031_GRES_gridBufferGraphHash as dgovGraphHashCore",
            "V1031_GRES_utilGridBufferGraphHash as dgovGraphHashCore",
            src,
        )
    if "run-v1031-gres-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1031GresSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1031GresSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1031GresBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1031GresBaseInput(", src)
        src = src.replace(
            "  runV1031GresTurn,\n  createEmptyV1031GresPersisted,\n  v1031GresInputHash,\n  sanitizeV1031GresPersisted,\n} from '../engine/grid-resilience-orchestrator';",
            "  runV1031GresTurn,\n  v1031GresInputHash,\n} from '../engine/grid-resilience-orchestrator';\nimport {\n  createEmptyV1031GresPersisted,\n  sanitizeV1031GresPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1031GresPersisted,\n  v1031GresInputHash,\n  sanitizeV1031GresPersisted,\n} from '../engine/grid-resilience-orchestrator';",
            "  v1031GresInputHash,\n} from '../engine/grid-resilience-orchestrator';\nimport {\n  createEmptyV1031GresPersisted,\n  sanitizeV1031GresPersisted,\n} from '../persistence/migrations';",
        )
    if "v1032-telecom-resilience" in name.replace("\\", "/"):
        src = src.replace("SECTION 20CA", "SECTION 20CB")
        src = src.replace("SECTION 20BZ", "SECTION 20CB")
        src = src.replace("SECTION 20BY", "SECTION 20CB")
        src = src.replace("SECTION 20BX", "SECTION 20CB")
        src = src.replace("SECTION 20BW", "SECTION 20CB")
        src = src.replace("SECTION 20BV", "SECTION 20CB")
        src = src.replace("SECTION 20BU", "SECTION 20CB")
        src = src.replace("SECTION 20BT", "SECTION 20CB")
        src = src.replace("SECTION 20BR", "SECTION 20CB")
    if "telecom-resilience/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1032TresClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1032TresClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1032_TRES_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1032_TRES_MIG_REGIONS", src)
    if "telecom-resilience-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1032TresPersisted, sanitizeV1032TresPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1032_TRES_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1032_TRES_ORCH_REGIONS.forEach", src)
    if "telecom-resilience-utils.ts" in name:
        src = re.sub(
            r"export function V1032_TRES_backboneBufferGraphHash",
            "export function V1032_TRES_utilBackboneBufferGraphHash",
            src,
        )
    if "v1032-telecom-resilience/backbone-buffer-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1032_TRES_backboneBufferGraphHash as dgovGraphHashCore",
            "V1032_TRES_utilBackboneBufferGraphHash as dgovGraphHashCore",
            src,
        )
    if "run-v1032-tres-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1032TresSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1032TresSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1032TresBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1032TresBaseInput(", src)
        src = src.replace(
            "  runV1032TresTurn,\n  createEmptyV1032TresPersisted,\n  v1032TresInputHash,\n  sanitizeV1032TresPersisted,\n} from '../engine/telecom-resilience-orchestrator';",
            "  runV1032TresTurn,\n  v1032TresInputHash,\n} from '../engine/telecom-resilience-orchestrator';\nimport {\n  createEmptyV1032TresPersisted,\n  sanitizeV1032TresPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1032TresPersisted,\n  v1032TresInputHash,\n  sanitizeV1032TresPersisted,\n} from '../engine/telecom-resilience-orchestrator';",
            "  v1032TresInputHash,\n} from '../engine/telecom-resilience-orchestrator';\nimport {\n  createEmptyV1032TresPersisted,\n  sanitizeV1032TresPersisted,\n} from '../persistence/migrations';",
        )
    if "v1033-supply-chain-resilience" in name.replace("\\", "/"):
        src = src.replace("SECTION 20CA", "SECTION 20CD")
        src = src.replace("SECTION 20CB", "SECTION 20CD")
        src = src.replace("SECTION 20BZ", "SECTION 20CD")
        src = src.replace("SECTION 20BY", "SECTION 20CD")
        src = src.replace("SECTION 20BX", "SECTION 20CD")
        src = src.replace("SECTION 20BW", "SECTION 20CD")
        src = src.replace("SECTION 20BV", "SECTION 20CD")
        src = src.replace("SECTION 20BU", "SECTION 20CD")
        src = src.replace("SECTION 20BT", "SECTION 20CD")
        src = src.replace("SECTION 20BR", "SECTION 20CD")
        src = src.replace("SECTION 20CC", "SECTION 20CD")
    if "supply-chain-resilience/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1033ScresClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1033ScresClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1033_SCRES_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1033_SCRES_MIG_REGIONS", src)
    if "supply-chain-resilience-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1033ScresPersisted, sanitizeV1033ScresPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1033_SCRES_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1033_SCRES_ORCH_REGIONS.forEach", src)
    if "supply-chain-resilience-utils.ts" in name:
        src = re.sub(
            r"export function V1033_SCRES_corridorBufferGraphHash",
            "export function V1033_SCRES_utilCorridorBufferGraphHash",
            src,
        )
    if "v1033-supply-chain-resilience/corridor-buffer-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1033_SCRES_corridorBufferGraphHash as dgovGraphHashCore",
            "V1033_SCRES_utilCorridorBufferGraphHash as dgovGraphHashCore",
            src,
        )
    if "disruption-scenarios/scenario-" in name.replace("\\", "/"):
        src = re.sub(
            r"\n    supplyChainResilienceBand: V1033_SCRES_DISRUPTION_SCENARIO_\d+_META\.supplyChainResilienceBand,",
            "",
            src,
        )
    if "run-v1033-scres-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1033ScresSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1033ScresSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1033ScresBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1033ScresBaseInput(", src)
        src = src.replace(
            "  runV1033ScresTurn,\n  createEmptyV1033ScresPersisted,\n  v1033ScresInputHash,\n  sanitizeV1033ScresPersisted,\n} from '../engine/supply-chain-resilience-orchestrator';",
            "  runV1033ScresTurn,\n  v1033ScresInputHash,\n} from '../engine/supply-chain-resilience-orchestrator';\nimport {\n  createEmptyV1033ScresPersisted,\n  sanitizeV1033ScresPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1033ScresPersisted,\n  v1033ScresInputHash,\n  sanitizeV1033ScresPersisted,\n} from '../engine/supply-chain-resilience-orchestrator';",
            "  v1033ScresInputHash,\n} from '../engine/supply-chain-resilience-orchestrator';\nimport {\n  createEmptyV1033ScresPersisted,\n  sanitizeV1033ScresPersisted,\n} from '../persistence/migrations';",
        )
    if "v1034-critical-infrastructure-resilience" in name.replace("\\", "/"):
        for sec in ("20CA", "20CB", "20CD", "20BZ", "20BY", "20BX", "20BW", "20BV", "20BU", "20BT", "20BR", "20CC"):
            src = src.replace(f"SECTION {sec}", "SECTION 20CE")
    if "critical-infrastructure-resilience/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1034CiresClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1034CiresClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1034_CIRES_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1034_CIRES_MIG_REGIONS", src)
    if "critical-infrastructure-resilience-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1034CiresPersisted, sanitizeV1034CiresPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1034_CIRES_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1034_CIRES_ORCH_REGIONS.forEach", src)
    if "critical-infrastructure-resilience-utils.ts" in name:
        src = re.sub(
            r"export function V1034_CIRES_segmentBufferGraphHash",
            "export function V1034_CIRES_utilSegmentBufferGraphHash",
            src,
        )
    if "v1034-critical-infrastructure-resilience/segment-buffer-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1034_CIRES_segmentBufferGraphHash as dgovGraphHashCore",
            "V1034_CIRES_utilSegmentBufferGraphHash as dgovGraphHashCore",
            src,
        )
    if "compromise-scenarios/scenario-" in name.replace("\\", "/"):
        src = re.sub(
            r"\n    criticalInfrastructureResilienceBand: V1034_CIRES_COMPROMISE_SCENARIO_\d+_META\.criticalInfrastructureResilienceBand,",
            "",
            src,
        )
    if "run-v1034-cires-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1034CiresSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1034CiresSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1034CiresBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1034CiresBaseInput(", src)
        src = src.replace(
            "  runV1034CiresTurn,\n  createEmptyV1034CiresPersisted,\n  v1034CiresInputHash,\n  sanitizeV1034CiresPersisted,\n} from '../engine/critical-infrastructure-resilience-orchestrator';",
            "  runV1034CiresTurn,\n  v1034CiresInputHash,\n} from '../engine/critical-infrastructure-resilience-orchestrator';\nimport {\n  createEmptyV1034CiresPersisted,\n  sanitizeV1034CiresPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1034CiresPersisted,\n  v1034CiresInputHash,\n  sanitizeV1034CiresPersisted,\n} from '../engine/critical-infrastructure-resilience-orchestrator';",
            "  v1034CiresInputHash,\n} from '../engine/critical-infrastructure-resilience-orchestrator';\nimport {\n  createEmptyV1034CiresPersisted,\n  sanitizeV1034CiresPersisted,\n} from '../persistence/migrations';",
        )
    if "v1035-cyber-resilience" in name.replace("\\", "/"):
        for sec in ("20CA", "20CB", "20CD", "20CE", "20CF", "20BZ", "20BY", "20BX", "20BW", "20BV", "20BU", "20BT", "20BR", "20CC"):
            src = src.replace(f"SECTION {sec}", "SECTION 20CG")
    if "cyber-resilience/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1035CyresClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1035CyresClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1035_CYRES_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1035_CYRES_MIG_REGIONS", src)
    if "cyber-resilience-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1035CyresPersisted, sanitizeV1035CyresPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1035_CYRES_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1035_CYRES_ORCH_REGIONS.forEach", src)
    if "cyber-resilience-utils.ts" in name:
        src = re.sub(
            r"export function V1035_CYRES_segmentBufferGraphHash",
            "export function V1035_CYRES_utilSegmentBufferGraphHash",
            src,
        )
    if "v1035-cyber-resilience/segment-buffer-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1035_CYRES_segmentBufferGraphHash as dgovGraphHashCore",
            "V1035_CYRES_utilSegmentBufferGraphHash as dgovGraphHashCore",
            src,
        )
    if "intrusion-scenarios/scenario-" in name.replace("\\", "/"):
        src = re.sub(
            r"\n    cyberResilienceBand: V1035_CYRES_INTRUSION_SCENARIO_\d+_META\.cyberResilienceBand,",
            "",
            src,
        )
    if "run-v1035-cyres-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1035CyresSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1035CyresSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1035CyresBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1035CyresBaseInput(", src)
        src = src.replace(
            "  runV1035CyresTurn,\n  createEmptyV1035CyresPersisted,\n  v1035CyresInputHash,\n  sanitizeV1035CyresPersisted,\n} from '../engine/cyber-resilience-orchestrator';",
            "  runV1035CyresTurn,\n  v1035CyresInputHash,\n} from '../engine/cyber-resilience-orchestrator';\nimport {\n  createEmptyV1035CyresPersisted,\n  sanitizeV1035CyresPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1035CyresPersisted,\n  v1035CyresInputHash,\n  sanitizeV1035CyresPersisted,\n} from '../engine/cyber-resilience-orchestrator';",
            "  v1035CyresInputHash,\n} from '../engine/cyber-resilience-orchestrator';\nimport {\n  createEmptyV1035CyresPersisted,\n  sanitizeV1035CyresPersisted,\n} from '../persistence/migrations';",
        )
    if "v1036-information-integrity-resilience" in name.replace("\\", "/"):
        for sec in ("20CA", "20CB", "20CD", "20CE", "20CF", "20CG", "20CH", "20BZ", "20BY", "20BX", "20BW", "20BV", "20BU", "20BT", "20BR", "20CC"):
            src = src.replace(f"SECTION {sec}", "SECTION 20CI")
    if "information-integrity-resilience/persistence/migrations.ts" in name.replace("\\", "/"):
        src = re.sub(r"function clampNum\(", "function v1036IiresClampNum(", src)
        src = re.sub(r"(?<![\w.])clampNum\(", "v1036IiresClampNum(", src)
        src = re.sub(r"const REGIONS:", "const V1036_IIRES_MIG_REGIONS:", src)
        src = re.sub(r"(?<![\w.])REGIONS\b", "V1036_IIRES_MIG_REGIONS", src)
    if "information-integrity-resilience-orchestrator.ts" in name:
        src = re.sub(
            r"^export \{ createEmptyV1036IiresPersisted, sanitizeV1036IiresPersisted \};\n",
            "",
            src,
            flags=re.M,
        )
        src = re.sub(r"const REGIONS:", "const V1036_IIRES_ORCH_REGIONS:", src)
        src = re.sub(r"REGIONS\.forEach", "V1036_IIRES_ORCH_REGIONS.forEach", src)
    if "information-integrity-resilience-utils.ts" in name:
        src = re.sub(
            r"export function V1036_IIRES_attestationMeshGraphHash",
            "export function V1036_IIRES_utilAttestationMeshGraphHash",
            src,
        )
        src = re.sub(
            r"export function V1036_IIRES_segmentBufferGraphHash",
            "export function V1036_IIRES_utilAttestationMeshGraphHash",
            src,
        )
    if "v1036-information-integrity-resilience/attestation-mesh-stacks/graph-utils.ts" in name.replace("\\", "/"):
        src = re.sub(
            r"V1036_IIRES_attestationMeshGraphHash as dgovGraphHashCore",
            "V1036_IIRES_utilAttestationMeshGraphHash as dgovGraphHashCore",
            src,
        )
        src = re.sub(
            r"V1036_IIRES_segmentBufferGraphHash as dgovGraphHashCore",
            "V1036_IIRES_utilAttestationMeshGraphHash as dgovGraphHashCore",
            src,
        )
    if "attestation-scenarios/scenario-" in name.replace("\\", "/"):
        src = re.sub(
            r"\n    informationIntegrityResilienceBand: V1036_IIRES_ATTESTATION_SCENARIO_\d+_META\.informationIntegrityResilienceBand,",
            "",
            src,
        )
    if "run-v1036-iires-self-tests.ts" in name:
        src = re.sub(r"function check\(", "function v1036IiresSelfTestCheck(", src)
        src = re.sub(r"(?<![\w.])check\(", "v1036IiresSelfTestCheck(", src)
        src = re.sub(r"function baseInput\(", "function v1036IiresBaseInput(", src)
        src = re.sub(r"(?<![\w.])baseInput\(", "v1036IiresBaseInput(", src)
        src = src.replace(
            "  runV1036IiresTurn,\n  createEmptyV1036IiresPersisted,\n  v1036IiresInputHash,\n  sanitizeV1036IiresPersisted,\n} from '../engine/information-integrity-resilience-orchestrator';",
            "  runV1036IiresTurn,\n  v1036IiresInputHash,\n} from '../engine/information-integrity-resilience-orchestrator';\nimport {\n  createEmptyV1036IiresPersisted,\n  sanitizeV1036IiresPersisted,\n} from '../persistence/migrations';",
        )
        src = src.replace(
            "  createEmptyV1036IiresPersisted,\n  v1036IiresInputHash,\n  sanitizeV1036IiresPersisted,\n} from '../engine/information-integrity-resilience-orchestrator';",
            "  v1036IiresInputHash,\n} from '../engine/information-integrity-resilience-orchestrator';\nimport {\n  createEmptyV1036IiresPersisted,\n  sanitizeV1036IiresPersisted,\n} from '../persistence/migrations';",
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


def maritime_trade_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1019-maritime-trade"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/lane-graph/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/shipping-lane-scenarios/" in s:
            return (3, s)
        if "/generated/lane-graph/" in s:
            return (4, s)
        if "shipping-lane-registry" in s or "lane-graph-bundle" in s:
            return (5, s)
        if "/maritime-ports/" in s:
            return (6, s)
        if "maritime-trade-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "maritime-trade-orchestrator" in s:
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


def intermodal_freight_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1021-intermodal-freight"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/handoff-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/corridor-scenarios/" in s:
            return (3, s)
        if "/generated/handoff-stacks/" in s:
            return (4, s)
        if "corridor-registry" in s or "handoff-stack-bundle" in s:
            return (5, s)
        if "/dwell-hubs/" in s:
            return (6, s)
        if "intermodal-freight-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "intermodal-freight-orchestrator" in s:
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


def housing_affordability_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1022-housing-affordability"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/supply-pipeline-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/stress-scenarios/" in s:
            return (3, s)
        if "/generated/supply-pipeline-stacks/" in s:
            return (4, s)
        if "stress-registry" in s or "supply-pipeline-bundle" in s:
            return (5, s)
        if "/zoning-friction-nodes/" in s:
            return (6, s)
        if "housing-affordability-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "housing-affordability-orchestrator" in s:
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
            and not (p.parent.name == "generated" and p.name == "index.ts")
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def climate_adaptation_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1023-climate-adaptation"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/drought-buffer-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/hazard-scenarios/" in s:
            return (3, s)
        if "/generated/drought-buffer-stacks/" in s:
            return (4, s)
        if "hazard-registry" in s or "drought-buffer-bundle" in s:
            return (5, s)
        if "/flood-defend-nodes/" in s:
            return (6, s)
        if "climate-adaptation-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "climate-adaptation-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def digital_governance_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1024-digital-governance"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/data-sovereignty-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/policy-scenarios/" in s:
            return (3, s)
        if "/generated/data-sovereignty-stacks/" in s:
            return (4, s)
        if "policy-registry" in s or "data-sovereignty-bundle" in s:
            return (5, s)
        if "/platform-regulation-nodes/" in s:
            return (6, s)
        if "digital-governance-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "digital-governance-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s or "hazard-registry" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "hazard-registry" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def biodiversity_stewardship_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1025-biodiversity-stewardship"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/conservation-offset-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/recovery-scenarios/" in s:
            return (3, s)
        if "/generated/conservation-offset-stacks/" in s:
            return (4, s)
        if "recovery-registry" in s or "conservation-offset-bundle" in s:
            return (5, s)
        if "/protected-area-nodes/" in s:
            return (6, s)
        if "biodiversity-stewardship-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "biodiversity-stewardship-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s or "hazard-registry" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "hazard-registry" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def regional_health_systems_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1026-regional-health-systems"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/primary-care-access-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/care-scenarios/" in s:
            return (3, s)
        if "/generated/primary-care-access-stacks/" in s:
            return (4, s)
        if "care-registry" in s or "primary-care-access-bundle" in s:
            return (5, s)
        if "/hospital-network-nodes/" in s:
            return (6, s)
        if "regional-health-systems-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "regional-health-systems-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "conservation-offset" in s or "recovery-registry" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s or "hazard-registry" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "hazard-registry" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def water_security_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1027-water-security"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/aquifer-reserve-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/basin-scenarios/" in s:
            return (3, s)
        if "/generated/aquifer-reserve-stacks/" in s:
            return (4, s)
        if "basin-registry" in s or "aquifer-reserve-bundle" in s:
            return (5, s)
        if "/distribution-network-nodes/" in s:
            return (6, s)
        if "water-security-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "water-security-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "conservation-offset" in s or "recovery-registry" in s or "primary-care" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s or "hazard-registry" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "primary-care" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "hazard-registry" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def disaster_resilience_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1028-disaster-resilience"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/evacuation-capacity-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/hazard-scenarios/" in s:
            return (3, s)
        if "/generated/evacuation-capacity-stacks/" in s:
            return (4, s)
        if "hazard-registry" in s or "evacuation-capacity-bundle" in s:
            return (5, s)
        if "/emergency-response-nodes/" in s:
            return (6, s)
        if "disaster-resilience-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "disaster-resilience-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "distribution-network" in s:
            return (98, s)
        if "aquifer-reserve" in s or "basin-registry" in s:
            return (98, s)
        if "conservation-offset" in s or "recovery-registry" in s or "primary-care" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "aquifer-reserve" not in str(p)
            and "basin-registry" not in str(p)
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "primary-care" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "distribution-network" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def coastal_resilience_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1029-coastal-resilience"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s or "v1029-coastal-resilience-backup" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/adaptation-buffer-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/surge-scenarios/" in s:
            return (3, s)
        if "/generated/adaptation-buffer-stacks/" in s:
            return (4, s)
        if "surge-registry" in s or "adaptation-buffer-bundle" in s:
            return (5, s)
        if "/littoral-zone-nodes/" in s:
            return (6, s)
        if "coastal-resilience-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "coastal-resilience-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "distribution-network" in s or "emergency-response" in s:
            return (98, s)
        if "aquifer-reserve" in s or "basin-registry" in s:
            return (98, s)
        if "evacuation-capacity" in s or "hazard-registry" in s:
            return (98, s)
        if "conservation-offset" in s or "recovery-registry" in s or "primary-care" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and "v1029-coastal-resilience-backup" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "aquifer-reserve" not in str(p)
            and "basin-registry" not in str(p)
            and "evacuation-capacity" not in str(p)
            and "hazard-registry" not in str(p)
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "primary-care" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "distribution-network" not in str(p)
            and "emergency-response" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def inland_heat_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1030-inland-heat"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/arid-buffer-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/heatwave-scenarios/" in s:
            return (3, s)
        if "/generated/arid-buffer-stacks/" in s:
            return (4, s)
        if "heatwave-registry" in s or "arid-buffer-bundle" in s:
            return (5, s)
        if "/inland-zone-nodes/" in s:
            return (6, s)
        if "inland-heat-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "inland-heat-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "distribution-network" in s or "emergency-response" in s or "littoral-zone" in s:
            return (98, s)
        if "aquifer-reserve" in s or "basin-registry" in s:
            return (98, s)
        if "evacuation-capacity" in s or "hazard-registry" in s:
            return (98, s)
        if "surge-registry" in s or "adaptation-buffer" in s:
            return (98, s)
        if "biodiversity-stewardship-20bu" in s:
            return (98, s)
        if "conservation-offset" in s or "recovery-registry" in s or "primary-care" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "aquifer-reserve" not in str(p)
            and "basin-registry" not in str(p)
            and "evacuation-capacity" not in str(p)
            and "hazard-registry" not in str(p)
            and "surge-registry" not in str(p)
            and "adaptation-buffer" not in str(p)
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "primary-care" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "distribution-network" not in str(p)
            and "emergency-response" not in str(p)
            and "littoral-zone" not in str(p)
            and "biodiversity-stewardship-20bu" not in str(p)
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def grid_resilience_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1031-grid-resilience"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/grid-buffer-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/outage-scenarios/" in s:
            return (3, s)
        if "/generated/grid-buffer-stacks/" in s:
            return (4, s)
        if "outage-registry" in s or "grid-buffer-bundle" in s:
            return (5, s)
        if "/substation-zone-nodes/" in s:
            return (6, s)
        if "grid-resilience-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "grid-resilience-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "distribution-network" in s or "emergency-response" in s or "inland-zone" in s:
            return (98, s)
        if "littoral-zone" in s:
            return (98, s)
        if "aquifer-reserve" in s or "basin-registry" in s:
            return (98, s)
        if "evacuation-capacity" in s or "hazard-registry" in s:
            return (98, s)
        if "surge-registry" in s or "adaptation-buffer" in s or "heatwave" in s:
            return (98, s)
        if "arid-buffer" in s:
            return (98, s)
        if "biodiversity-stewardship-20bu" in s:
            return (98, s)
        if "conservation-offset" in s or "recovery-registry" in s or "primary-care" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "aquifer-reserve" not in str(p)
            and "basin-registry" not in str(p)
            and "evacuation-capacity" not in str(p)
            and "hazard-registry" not in str(p)
            and "surge-registry" not in str(p)
            and "adaptation-buffer" not in str(p)
            and "heatwave-scenarios" not in str(p)
            and "arid-buffer-stacks" not in str(p)
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "primary-care" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "distribution-network" not in str(p)
            and "emergency-response" not in str(p)
            and "littoral-zone" not in str(p)
            and "inland-zone" not in str(p)
            and "biodiversity-stewardship-20bu" not in str(p)
            and (
                "/substation-zone-nodes/" not in str(p)
                or re.match(r"substation-zone-\d+\.ts$", p.name)
            )
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def telecom_resilience_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1032-telecom-resilience"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/backbone-buffer-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/failover-scenarios/" in s:
            return (3, s)
        if "/generated/backbone-buffer-stacks/" in s:
            return (4, s)
        if "failover-registry" in s or "backbone-buffer-bundle" in s:
            return (5, s)
        if "/exchange-zone-nodes/" in s:
            return (6, s)
        if "telecom-resilience-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "telecom-resilience-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "distribution-network" in s or "emergency-response" in s or "inland-zone" in s:
            return (98, s)
        if "littoral-zone" in s or "substation-zone" in s:
            return (98, s)
        if "outage-scenarios" in s or "grid-buffer" in s:
            return (98, s)
        if "aquifer-reserve" in s or "basin-registry" in s:
            return (98, s)
        if "evacuation-capacity" in s or "hazard-registry" in s:
            return (98, s)
        if "surge-registry" in s or "adaptation-buffer" in s or "heatwave" in s:
            return (98, s)
        if "arid-buffer" in s:
            return (98, s)
        if "biodiversity-stewardship-20bu" in s:
            return (98, s)
        if "conservation-offset" in s or "recovery-registry" in s or "primary-care" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "outage-scenarios" not in str(p)
            and "grid-buffer-stacks" not in str(p)
            and "outage-registry.ts" not in str(p)
            and "grid-buffer-bundle.ts" not in str(p)
            and "substation-zone-nodes" not in str(p)
            and "aquifer-reserve" not in str(p)
            and "basin-registry" not in str(p)
            and "evacuation-capacity" not in str(p)
            and "hazard-registry" not in str(p)
            and "surge-registry" not in str(p)
            and "adaptation-buffer" not in str(p)
            and "heatwave-scenarios" not in str(p)
            and "arid-buffer-stacks" not in str(p)
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "primary-care" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "distribution-network" not in str(p)
            and "emergency-response" not in str(p)
            and "littoral-zone" not in str(p)
            and "inland-zone" not in str(p)
            and "substation-zone" not in str(p)
            and "biodiversity-stewardship-20bu" not in str(p)
            and (
                "/exchange-zone-nodes/" not in str(p)
                or re.match(r"exchange-zone-\d+\.ts$", p.name)
            )
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def supply_chain_resilience_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1033-supply-chain-resilience"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/corridor-buffer-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/disruption-scenarios/" in s:
            return (3, s)
        if "/generated/corridor-buffer-stacks/" in s:
            return (4, s)
        if "disruption-registry" in s or "corridor-buffer-bundle" in s:
            return (5, s)
        if "/hub-zone-nodes/" in s:
            return (6, s)
        if "supply-chain-resilience-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "supply-chain-resilience-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "distribution-network" in s or "emergency-response" in s or "inland-zone" in s:
            return (98, s)
        if "littoral-zone" in s or "substation-zone" in s:
            return (98, s)
        if "outage-scenarios" in s or "grid-buffer" in s:
            return (98, s)
        if "failover-scenarios" in s or "backbone-buffer" in s:
            return (98, s)
        if "exchange-zone" in s:
            return (98, s)
        if "aquifer-reserve" in s or "basin-registry" in s:
            return (98, s)
        if "evacuation-capacity" in s or "hazard-registry" in s:
            return (98, s)
        if "surge-registry" in s or "adaptation-buffer" in s or "heatwave" in s:
            return (98, s)
        if "arid-buffer" in s:
            return (98, s)
        if "biodiversity-stewardship-20bu" in s:
            return (98, s)
        if "conservation-offset" in s or "recovery-registry" in s or "primary-care" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "outage-scenarios" not in str(p)
            and "grid-buffer-stacks" not in str(p)
            and "outage-registry.ts" not in str(p)
            and "grid-buffer-bundle.ts" not in str(p)
            and "backbone-buffer-bundle.ts" not in str(p)
            and "failover-scenarios" not in str(p)
            and "backbone-buffer-stacks" not in str(p)
            and "outage-registry.ts" not in str(p)
            and "grid-buffer-bundle.ts" not in str(p)
            and "substation-zone-nodes" not in str(p)
            and "exchange-zone-nodes" not in str(p)
            and "aquifer-reserve" not in str(p)
            and "basin-registry" not in str(p)
            and "evacuation-capacity" not in str(p)
            and "hazard-registry" not in str(p)
            and "surge-registry" not in str(p)
            and "adaptation-buffer" not in str(p)
            and "heatwave-scenarios" not in str(p)
            and "arid-buffer-stacks" not in str(p)
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "primary-care" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "distribution-network" not in str(p)
            and "emergency-response" not in str(p)
            and "littoral-zone" not in str(p)
            and "inland-zone" not in str(p)
            and "substation-zone" not in str(p)
            and "biodiversity-stewardship-20bu" not in str(p)
            and (
                "/hub-zone-nodes/" not in str(p)
                or re.match(r"hub-zone-\d+\.ts$", p.name)
            )
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def critical_infrastructure_resilience_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1034-critical-infrastructure-resilience"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/segment-buffer-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/compromise-scenarios/" in s:
            return (3, s)
        if "/generated/segment-buffer-stacks/" in s:
            return (4, s)
        if "compromise-registry" in s or "segment-buffer-bundle" in s:
            return (5, s)
        if "/facility-zone-nodes/" in s:
            return (6, s)
        if "critical-infrastructure-resilience-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "critical-infrastructure-resilience-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "distribution-network" in s or "emergency-response" in s or "inland-zone" in s:
            return (98, s)
        if "littoral-zone" in s or "substation-zone" in s:
            return (98, s)
        if "outage-scenarios" in s or "grid-buffer" in s:
            return (98, s)
        if "failover-scenarios" in s or "backbone-buffer" in s:
            return (98, s)
        if "exchange-zone" in s or "hub-zone" in s:
            return (98, s)
        if "disruption-scenarios" in s or "corridor-buffer" in s:
            return (98, s)
        if "aquifer-reserve" in s or "basin-registry" in s:
            return (98, s)
        if "evacuation-capacity" in s or "hazard-registry" in s:
            return (98, s)
        if "surge-registry" in s or "adaptation-buffer" in s or "heatwave" in s:
            return (98, s)
        if "arid-buffer" in s:
            return (98, s)
        if "biodiversity-stewardship-20bu" in s:
            return (98, s)
        if "conservation-offset" in s or "recovery-registry" in s or "primary-care" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "outage-scenarios" not in str(p)
            and "grid-buffer-stacks" not in str(p)
            and "outage-registry.ts" not in str(p)
            and "grid-buffer-bundle.ts" not in str(p)
            and "backbone-buffer-bundle.ts" not in str(p)
            and "failover-scenarios" not in str(p)
            and "backbone-buffer-stacks" not in str(p)
            and "disruption-scenarios" not in str(p)
            and "corridor-buffer-stacks" not in str(p)
            and "corridor-buffer-bundle.ts" not in str(p)
            and "substation-zone-nodes" not in str(p)
            and "exchange-zone-nodes" not in str(p)
            and "hub-zone-nodes" not in str(p)
            and "aquifer-reserve" not in str(p)
            and "basin-registry" not in str(p)
            and "evacuation-capacity" not in str(p)
            and "hazard-registry" not in str(p)
            and "surge-registry" not in str(p)
            and "adaptation-buffer" not in str(p)
            and "heatwave-scenarios" not in str(p)
            and "arid-buffer-stacks" not in str(p)
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "primary-care" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "distribution-network" not in str(p)
            and "emergency-response" not in str(p)
            and "littoral-zone" not in str(p)
            and "inland-zone" not in str(p)
            and "substation-zone" not in str(p)
            and "biodiversity-stewardship-20bu" not in str(p)
            and (
                "/facility-zone-nodes/" not in str(p)
                or re.match(r"facility-zone-\d+\.ts$", p.name)
            )
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def cyber_resilience_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1035-cyber-resilience"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/segment-buffer-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/intrusion-scenarios/" in s:
            return (3, s)
        if "/generated/segment-buffer-stacks/" in s:
            return (4, s)
        if "intrusion-registry" in s or "segment-buffer-bundle" in s:
            return (5, s)
        if "/facility-zone-nodes/" in s:
            return (6, s)
        if "cyber-resilience-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "cyber-resilience-orchestrator" in s:
            return (9, s)
        if "/self-tests/" in s:
            return (10, s)
        if "distribution-network" in s or "emergency-response" in s or "inland-zone" in s:
            return (98, s)
        if "littoral-zone" in s or "substation-zone" in s:
            return (98, s)
        if "outage-scenarios" in s or "grid-buffer" in s:
            return (98, s)
        if "failover-scenarios" in s or "backbone-buffer" in s:
            return (98, s)
        if "exchange-zone" in s or "hub-zone" in s:
            return (98, s)
        if "disruption-scenarios" in s or "corridor-buffer" in s:
            return (98, s)
        if "compromise-scenarios" in s or "intrusion-scenarios" in s and "/generated/" not in s:
            return (98, s)
        if "aquifer-reserve" in s or "basin-registry" in s:
            return (98, s)
        if "evacuation-capacity" in s or "hazard-registry" in s:
            return (98, s)
        if "surge-registry" in s or "adaptation-buffer" in s or "heatwave" in s:
            return (98, s)
        if "arid-buffer" in s:
            return (98, s)
        if "biodiversity-stewardship-20bu" in s:
            return (98, s)
        if "conservation-offset" in s or "recovery-registry" in s or "primary-care" in s:
            return (98, s)
        if "stress-registry" in s or "supply-pipeline" in s:
            return (98, s)
        if "drought-buffer-bundle" in s:
            return (98, s)
        return (50, s)

    files = sorted(
        (
            p
            for p in root.rglob("*.ts")
            if p.name not in {"index.ts", "run-self-tests.ts"}
            and "/scripts/" not in str(p)
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "outage-scenarios" not in str(p)
            and "grid-buffer-stacks" not in str(p)
            and "outage-registry.ts" not in str(p)
            and "grid-buffer-bundle.ts" not in str(p)
            and "backbone-buffer-bundle.ts" not in str(p)
            and "failover-scenarios" not in str(p)
            and "backbone-buffer-stacks" not in str(p)
            and "disruption-scenarios" not in str(p)
            and "corridor-buffer-stacks" not in str(p)
            and "corridor-buffer-bundle.ts" not in str(p)
            and "compromise-scenarios" not in str(p)
            and "substation-zone-nodes" not in str(p)
            and "exchange-zone-nodes" not in str(p)
            and "hub-zone-nodes" not in str(p)
            and "aquifer-reserve" not in str(p)
            and "basin-registry" not in str(p)
            and "evacuation-capacity" not in str(p)
            and "hazard-registry" not in str(p)
            and "surge-registry" not in str(p)
            and "adaptation-buffer" not in str(p)
            and "heatwave-scenarios" not in str(p)
            and "arid-buffer-stacks" not in str(p)
            and "conservation-offset" not in str(p)
            and "recovery-registry" not in str(p)
            and "primary-care" not in str(p)
            and "stress-registry" not in str(p)
            and "supply-pipeline" not in str(p)
            and "drought-buffer-bundle" not in str(p)
            and "distribution-network" not in str(p)
            and "emergency-response" not in str(p)
            and "littoral-zone" not in str(p)
            and "inland-zone" not in str(p)
            and "substation-zone" not in str(p)
            and "biodiversity-stewardship-20bu" not in str(p)
            and (
                "/facility-zone-nodes/" not in str(p)
                or re.match(r"facility-zone-\d+\.ts$", p.name)
            )
        ),
        key=sort_key,
    )
    return [str(p.relative_to(ROOT)) for p in files]


def information_integrity_resilience_paths() -> list[str]:
    root = ROOT / "expansion/o6k-10m/v1036-information-integrity-resilience"

    def sort_key(p: pathlib.Path) -> tuple:
        s = str(p)
        if "/scripts/" in s:
            return (99, s)
        if "/types/" in s:
            return (0, s)
        if "/persistence/" in s:
            return (1, s)
        if "/attestation-mesh-stacks/" in s and "graph-utils" in s:
            return (2, s)
        if "/generated/attestation-scenarios/" in s:
            return (3, s)
        if "/generated/attestation-mesh-stacks/" in s:
            return (4, s)
        if "attestation-registry" in s or "attestation-mesh-bundle" in s:
            return (5, s)
        if "/facility-zone-nodes/" in s:
            return (6, s)
        if "information-integrity-resilience-utils" in s:
            return (7, s)
        if "/adapters/" in s:
            return (8, s)
        if "information-integrity-resilience-orchestrator" in s:
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
            and not (p.parent.name == "generated" and p.name == "index.ts")
            and "segment-buffer-stacks" not in str(p)
            and "intrusion-scenarios" not in str(p)
            and "biodiversity-stewardship-20bu" not in str(p)
            and (
                "/facility-zone-nodes/" not in str(p)
                or re.match(r"facility-zone-\d+\.ts$", p.name)
            )
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
