#!/usr/bin/env python3
"""Build unified SECTION 20AG for Operation 111 V10.14 integration."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

GAME = "(V9.4) australia-game-with-ai.tsx"
START = "// SECTION 20AG"
END = "// SECTION 21B"

AGENTS = [
    ("macro", "origin/op111/agent-21-economy", "NATIONAL MACROECONOMY & AGGREGATE BALANCE"),
    ("inflation", "origin/op111/agent-25-inflation", "INFLATION & PRICE DYNAMICS"),
    ("corporate", "origin/op111/agent-29-corporate", "CORPORATE SECTOR & FIRM ECONOMICS"),
    ("analytics", "origin/op111/agent-30-analytics", "NATIONAL ECONOMIC ANALYTICS & KPI SYNTHESIS"),
    ("population", "origin/op111/agent-36-population", "POPULATION DYNAMICS & DEMOGRAPHIC MOMENTUM"),
    ("services", "origin/op111/agent-40-services", "PUBLIC SERVICES & CIVIC DELIVERY"),
    ("policy", "origin/op111/agent-55-policy", "NATIONAL POLICY SYSTEMS & GOVERNMENT AGENDA"),
    ("wellbeing", "origin/op111/agent-109-wellbeing", "NATIONAL WELLBEING INDEX"),
]

STRIP_RES = [
    re.compile(r"^export const V1014_SCHEMA_VERSION =[^\n]+\n", re.M),
    re.compile(r"^export const V1014_LIMITS =[\s\S]*?^} as const;\n", re.M),
    re.compile(r"^export function v1014Clamp\([\s\S]*?^\}\n", re.M),
    re.compile(r"^function v1014Clamp\([\s\S]*?^\}\n", re.M),
    re.compile(r"^export function triggerJsonFileDownload\([\s\S]*?^\}\n", re.M),
    re.compile(r"^const v1014Clamp =[^\n]+\n", re.M),
    re.compile(r"^export const V1014_CORE_REGIONS[^\n]+\n", re.M),
]

CORPORATE_RENAMES = [
    ("v1014BandFromScore", "v1014CorporateBandFromScore"),
    ("const v1014Round", "const v1014CorporateRound"),
    ("v1014Round(", "v1014CorporateRound("),
]

SELF_TESTS = [
    "runV1014NationalMacroeconomySelfTests",
    "runV1014InflationPriceDynamicsSelfTests",
    "runV1014CorporateSectorSelfTests",
    "runV1014EconomicAnalyticsSelfTests",
    "runV1014PopulationDynamicsSelfTests",
    "runV1014PublicServicesSelfTests",
    "runV1014NationalPolicySystemsSelfTests",
    "runV1014NationalWellbeingSelfTests",
]


def load(ref: str) -> str:
    return subprocess.check_output(["git", "show", f"{ref}:{GAME}"], text=True)


def extract_block(ref: str) -> str:
    text = load(ref)
    s = text.index(START)
    e = text.index(END, s)
    return text[s:e]


def strip_shared(block: str) -> str:
    out = block
    for rx in STRIP_RES:
        out = rx.sub("", out)
    return out


def postprocess_submodule(key: str, block: str) -> str:
    if key == "corporate":
        for old, new in CORPORATE_RENAMES:
            block = block.replace(old, new)
    return block


def main() -> None:
    parts: list[str] = [
        "// ============================================================================\n",
        "// SECTION 20AG: V10.14 UNIFIED NATIONAL LAYER (Operation 111 — Agents 21,25,29,30,36,40,55,109)\n",
        "// ============================================================================\n",
        "// Shared core + submodules. Single schema version and clamp helpers.\n",
        "export const V1014_SCHEMA_VERSION = '10.14.0';\n",
        "export const V1014_LIMITS = {\n",
        "  maxEvidence: 10,\n",
        "  maxHistory: 16,\n",
        "  maxDrivers: 8,\n",
        "  maxRisks: 6,\n",
        "  hysteresisDeadband: 2.5\n",
        "} as const;\n",
        "export function v1014Clamp(n: number, min = 0, max = 100): number {\n",
        "  if (!Number.isFinite(n)) return min;\n",
        "  return Math.min(max, Math.max(min, n));\n",
        "}\n",
        "\n",
    ]

    first = True
    for key, ref, title in AGENTS:
        block = extract_block(ref)
        if first:
            block = strip_shared(block)
            block = re.sub(
                r"^export function triggerJsonFileDownload\([\s\S]*?^\}\n",
                "",
                block,
                count=1,
                flags=re.M,
            )
            block = re.sub(r"^// SECTION 20AG:[^\n]+\n", f"// --- 20AG-{key}: {title} ---\n", block, count=1, flags=re.M)
            first = False
        else:
            block = strip_shared(block)
            block = postprocess_submodule(key, block)
            block = re.sub(r"^// SECTION 20AG:[^\n]+\n", f"\n// --- 20AG-{key}: {title} ---\n", block, count=1, flags=re.M)
        parts.append(block)
        if not block.endswith("\n"):
            parts.append("\n")

    runner = [
        "\nexport function runV1014UnifiedSelfTests(): V9SelfTestResult[] {\n",
        "  return [\n",
    ]
    for fn in SELF_TESTS:
        runner.append(f"    ...{fn}(),\n")
    runner.append("  ];\n}\n")
    parts.extend(runner)

    unified = "".join(parts)
    out_path = Path("op111/unified-section-20AG.fragment.txt")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(unified, encoding="utf-8")
    print(f"Wrote {out_path} ({unified.count(chr(10))} lines)")


if __name__ == "__main__":
    main()
