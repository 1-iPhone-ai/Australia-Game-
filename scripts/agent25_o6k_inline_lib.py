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
