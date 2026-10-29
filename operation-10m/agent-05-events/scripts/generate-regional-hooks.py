#!/usr/bin/env python3
"""Generate Operation 10M Agent 05 regional narrative hook catalog."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "regional-hook-catalog.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
NEIGHBORS = {
    "NSW": ["VIC", "QLD", "SA", "ACT"],
    "VIC": ["NSW", "SA", "TAS"],
    "QLD": ["NSW", "NT", "SA"],
    "WA": ["SA", "NT"],
    "SA": ["NSW", "VIC", "QLD", "WA", "NT"],
    "TAS": ["VIC"],
    "NT": ["QLD", "WA", "SA"],
    "ACT": ["NSW"],
}

THEMES = [
    "mining",
    "agriculture",
    "energy",
    "renewables",
    "technology",
    "research",
    "trade",
    "logistics",
    "finance",
    "tourism",
    "water",
    "manufacturing",
    "governance",
    "environment",
    "exploration",
]

CATEGORIES = {
    "mining": "economic",
    "agriculture": "environmental",
    "energy": "infrastructure",
    "renewables": "infrastructure",
    "technology": "technological",
    "research": "technological",
    "trade": "infrastructure",
    "logistics": "infrastructure",
    "finance": "economic",
    "tourism": "economic",
    "water": "environmental",
    "manufacturing": "economic",
    "governance": "political",
    "environment": "environmental",
    "exploration": "economic",
}


def main() -> None:
    entries: list[str] = []
    idx = 0
    for region in REGIONS:
        for theme in THEMES:
            hook_id = f"op10m_reg_{region.lower()}_{theme}_{idx}"
            targets = ", ".join(f"'{t}'" for t in NEIGHBORS[region])
            variant = idx % 5
            beat = (
                f"Cross-border {theme} stress radiates from {region} into adjacent jurisdictions "
                f"when a local crisis chain reaches rupture (variant {variant})."
            )
            block = textwrap.dedent(
                f"""
                {{
                  hookId: '{hook_id}',
                  sourceRegion: '{region}',
                  watchPhase: 'rupture',
                  theme: '{theme}',
                  category: '{CATEGORIES[theme]}',
                  targetRegions: [{targets}],
                  narrativeBeat: '{beat.replace("'", "\\'")}',
                  cooldownTurns: {12 + (idx % 4)},
                  contagionDelta: {1 + (idx % 3)},
                  neighborStabilityDelta: {-2 - (idx % 3)},
                  setsContagionFlag: true,
                  armNeighborFollowUp: true,
                }}"""
            ).strip()
            entries.append(block)
            idx += 1

    text = "\n".join(
        [
            "// AUTO-GENERATED — scripts/generate-regional-hooks.py",
            "import type { Op10mRegionalNarrativeHook } from '../src/types.ts';",
            "",
            "export const OP10M_AGENT05_REGIONAL_HOOK_STATS = {",
            f"  hookCount: {len(entries)},",
            "  watchPhase: 'rupture' as const,",
            "} as const;",
            "",
            "export const OP10M_AGENT05_REGIONAL_HOOK_CATALOG: Op10mRegionalNarrativeHook[] = [",
            ",\n".join(entries),
            "];",
            "",
        ]
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(text, encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} hooks)")


if __name__ == "__main__":
    main()
