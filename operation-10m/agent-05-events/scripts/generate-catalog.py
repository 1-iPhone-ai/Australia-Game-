#!/usr/bin/env python3
"""Generate Operation 10M Agent 05 chain catalog (state-triggered narrative data)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]
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

CRISIS_CATEGORIES = {
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

SEASONS = {
    "mining": ["Autumn", "Winter"],
    "agriculture": ["Spring", "Summer"],
    "energy": ["Summer", "Winter"],
    "renewables": ["Spring", "Summer"],
    "technology": ["Winter", "Spring"],
    "research": ["Winter", "Spring"],
    "trade": ["Autumn", "Spring"],
    "logistics": ["Autumn", "Winter"],
    "finance": ["Winter", "Spring"],
    "tourism": ["Summer", "Spring"],
    "water": ["Summer", "Autumn"],
    "manufacturing": ["Winter", "Autumn"],
    "governance": ["Spring", "Autumn"],
    "environment": ["Summer", "Spring"],
    "exploration": ["Winter", "Autumn"],
}

SECTORS = {
    "mining": "mining",
    "agriculture": "agriculture",
    "energy": "energy",
    "renewables": "renewables",
    "technology": "technology",
    "research": "research",
    "trade": "trade",
    "logistics": "logistics",
    "finance": "finance",
    "tourism": "tourism",
    "water": "agriculture",
    "manufacturing": "manufacturing",
    "governance": "finance",
    "environment": "renewables",
    "exploration": "mining",
}


def chain_id(region: str, theme: str, variant: int, global_idx: int) -> str:
    return f"op10m_{region.lower()}_{theme}_v{variant}_{global_idx}"


def emit_phase(
    phase: str,
    region: str,
    theme: str,
    variant: int,
    sector: str,
    seasons: list[str],
    exit_flag: str,
    cooldown: int,
    min_sector: int,
) -> str:
    seasons_ts = ", ".join(f"'{s}'" for s in seasons)
    requires = (
        f"[{{ k: 'season', seasons: [{seasons_ts}] }}, "
        f"{{ k: 'sector', sector: '{sector}', min: {min_sector} }}, "
        f"{{ k: 'no_flag', key: '{exit_flag}' }}, "
        f"{{ k: 'min_day', day: {8 + variant} }}]"
    )
    if phase != "signal":
        requires = f"[{{ k: 'chain_phase', phase: '{phase}' }}, {{ k: 'no_flag', key: '{exit_flag}' }}]"

    stab_delta = {"signal": -1, "pressure": -2, "rupture": -4, "recovery": 2}[phase]
    money_cost = {"signal": 0, "pressure": 500, "rupture": 1500, "recovery": 800}[phase]
    next_phase = {"signal": "pressure", "pressure": "rupture", "rupture": "recovery"}.get(phase)
    escalate_ts = "undefined" if not next_phase else f"'{next_phase}'"
    if phase == "recovery":
        resolve_fields = f"resolveChain: true, setFlags: {{ '{exit_flag}': true }}, incrementActiveCrises: -1,"
    else:
        resolve_fields = f"setFlags: {{ '{exit_flag}_commit_{phase}': true }},"

    passive = ""
    if phase in ("pressure", "rupture"):
        passive = (
            f"passiveTick: {{ stabilityDelta: -1, "
            f"spawnModifier: {{ description: '{region} {theme} {phase} strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: 0, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {theme} — {phase} (v{variant})',
          narrative: 'State-triggered {phase} beat for {theme} indicators in {region}. Simulation gates sector activity, season, cooldowns, and persistent modifiers.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Commit resources',
              description: 'Spend capital and political capital to stabilize the chain.',
              costMoney: {money_cost},
              onSelect: {{
                stabilityDelta: {stab_delta + 3},
                moneyDelta: {-money_cost // 2 if money_cost else -200},
                escalateToPhase: {escalate_ts},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Defer decision',
              description: 'Delay action; instability continues.',
              costMoney: 0,
              onSelect: {{ stabilityDelta: {stab_delta} }},
              onDefer: {{ stabilityDelta: {stab_delta - 1}, incrementActiveCrises: 1 }},
            }},
          ],
        }}"""
    ).strip()


def main() -> None:
    lines: list[str] = []
    lines.append("// AUTO-GENERATED — scripts/generate-catalog.py")
    lines.append("import type { Op10mChainDescriptor } from '../src/types.ts';")
    lines.append("")
    lines.append("export const OP10M_AGENT05_CATALOG_TRANCHE1_STATS = {")
    lines.append("  regions: 8,")
    lines.append("  themes: 15,")
    lines.append("  variantsPerPair: 5,")
    lines.append("  chainCount: 600,")
    lines.append("} as const;")
    lines.append("")
    lines.append("export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE1: Op10mChainDescriptor[] = [")

    idx = 0
    entries: list[str] = []
    for region in REGIONS:
        for theme in THEMES:
            sector = SECTORS[theme]
            seasons = SEASONS[theme]
            category = CRISIS_CATEGORIES[theme]
            for variant in range(5):
                cid = chain_id(region, theme, variant, idx)
                entry_flag = f"{cid}_entered"
                exit_flag = f"{cid}_resolved"
                min_sector = 10 + ((idx + variant) % 8)
                phases = ",\n".join(
                    emit_phase(
                        p,
                        region,
                        theme,
                        variant,
                        sector,
                        seasons,
                        exit_flag,
                        10 + variant,
                        min_sector,
                    )
                    for p in ("signal", "pressure", "rupture", "recovery")
                )
                block = textwrap.dedent(
                    f"""
                    {{
                      chainId: '{cid}',
                      region: '{region}',
                      theme: '{theme}',
                      category: '{category}',
                      entryFlag: '{entry_flag}',
                      exitFlag: '{exit_flag}',
                      phases: [
                    {phases}
                      ],
                    }}"""
                ).strip()
                entries.append(block)
                idx += 1

    lines.append(",\n".join(entries))
    lines.append("];")
    lines.append("")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({idx} chains, {len(lines)} lines)")


if __name__ == "__main__":
    main()
