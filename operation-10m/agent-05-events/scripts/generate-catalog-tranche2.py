#!/usr/bin/env python3
"""Tranche 2 — deep crisis archetype chains (contagion-gated pressure, fiscal/stability gates)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche2.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

ARCHETYPES: list[tuple[str, str, str, list[str], str]] = [
    ("supply_shock", "trade", "infrastructure", ["Autumn", "Winter"], "trade"),
    ("labor_unrest", "manufacturing", "economic", ["Winter", "Autumn"], "manufacturing"),
    ("credit_tightening", "finance", "economic", ["Winter", "Spring"], "finance"),
    ("infrastructure_failure", "energy", "infrastructure", ["Summer", "Winter"], "energy"),
    ("diplomatic_friction", "governance", "political", ["Spring", "Autumn"], "finance"),
    ("climate_extreme", "environment", "environmental", ["Summer", "Spring"], "renewables"),
]


def chain_id(region: str, archetype: str, intensity: int, global_idx: int) -> str:
    return f"op10m_t2_{region.lower()}_{archetype}_i{intensity}_{global_idx}"


def emit_phase(
    phase: str,
    region: str,
    theme: str,
    archetype: str,
    intensity: int,
    sector: str,
    seasons: list[str],
    exit_flag: str,
    cooldown: int,
) -> str:
    seasons_ts = ", ".join(f"'{s}'" for s in seasons)
    min_sector = 18 + intensity * 2
    min_day = 15 + intensity * 3

    if phase == "signal":
        requires = (
            f"[{{ k: 'season', seasons: [{seasons_ts}] }}, "
            f"{{ k: 'sector', sector: '{sector}', min: {min_sector} }}, "
            f"{{ k: 'min_day', day: {min_day} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
        if archetype == "credit_tightening":
            requires = (
                f"[{{ k: 'season', seasons: [{seasons_ts}] }}, "
                f"{{ k: 'sector', sector: '{sector}', min: {min_sector} }}, "
                f"{{ k: 'min_day', day: {min_day} }}, "
                f"{{ k: 'stability', max: {72 - intensity} }}, "
                f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
            )
        elif archetype == "climate_extreme":
            requires = (
                f"[{{ k: 'season', seasons: [{seasons_ts}] }}, "
                f"{{ k: 'sector', sector: '{sector}', min: {min_sector} }}, "
                f"{{ k: 'min_day', day: {min_day} }}, "
                f"{{ k: 'stability', min: {35 + intensity} }}, "
                f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
            )
    elif phase == "pressure":
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{{ k: 'regional_contagion', region: '{region}', theme: '{theme}', min: 1 }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        money_min = 4000 + intensity * 1500
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'money', min: {money_min} }}, "
            f"{{ k: 'stability', max: {55 - intensity} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = f"[{{ k: 'chain_phase', phase: 'recovery' }}, {{ k: 'no_flag', key: '{exit_flag}' }}]"

    stab_delta = {"signal": -2, "pressure": -3, "rupture": -5, "recovery": 3}[phase]
    money_cost = {"signal": 250, "pressure": 900, "rupture": 2200, "recovery": 1200}[phase]
    next_phase = {"signal": "pressure", "pressure": "rupture", "rupture": "recovery"}.get(phase)
    escalate_ts = "undefined" if not next_phase else f"'{next_phase}'"
    if phase == "recovery":
        resolve_fields = f"resolveChain: true, setFlags: {{ '{exit_flag}': true }}, incrementActiveCrises: -1,"
    else:
        resolve_fields = f"setFlags: {{ '{exit_flag}_{phase}': true }},"

    passive = ""
    if phase == "pressure":
        passive = (
            f"passiveTick: {{ "
            f"regionalStabilityDelta: {{ '{region}': -1 }}, "
            f"spawnModifier: {{ description: '{archetype} pressure', "
            f"stabilityDeltaPerTurn: -2, moneyDeltaPerTurn: -100, expiresDay: 0 }} }},"
        )
    elif phase == "rupture":
        passive = (
            f"passiveTick: {{ "
            f"stabilityDelta: -1, "
            f"incrementActiveCrises: 0, "
            f"sectorActivityDelta: {{ '{sector}': -1 }} }},"
        )

    title = f"{region} {archetype.replace('_', ' ')} — {phase} (i{intensity})"
    narrative = (
        f"Tranche-2 {archetype} chain: {phase} stage with simulation gates "
        f"(sector>={min_sector}, contagion on pressure, fiscal floor on rupture)."
    )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{title}',
          narrative: '{narrative}',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Intervene',
              description: 'Apply targeted policy spend for this crisis archetype.',
              costMoney: {money_cost},
              onSelect: {{
                stabilityDelta: {stab_delta + 4},
                moneyDelta: {-money_cost // 3},
                escalateToPhase: {escalate_ts},
                {resolve_fields}
                sectorActivityDelta: {{ '{sector}': {1 if phase == 'recovery' else -1} }},
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold position',
              description: 'Accept ongoing simulation damage.',
              costMoney: 0,
              onSelect: {{ stabilityDelta: {stab_delta - 1}, incrementActiveCrises: {1 if phase == 'rupture' else 0} }},
            }},
          ],
        }}"""
    ).strip()


def main() -> None:
    entries: list[str] = []
    idx = 0
    for region in REGIONS:
        for archetype, theme, category, seasons, sector in ARCHETYPES:
            for intensity in range(5):
                cid = chain_id(region, archetype, intensity, idx)
                entry_flag = f"{cid}_entered"
                exit_flag = f"{cid}_resolved"
                phases = ",\n".join(
                    emit_phase(
                        p,
                        region,
                        theme,
                        archetype,
                        intensity,
                        sector,
                        seasons,
                        exit_flag,
                        14 + intensity,
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

    lines = [
        "// AUTO-GENERATED — scripts/generate-catalog-tranche2.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE2_STATS = {",
        "  regions: 8,",
        "  archetypes: 6,",
        "  intensitiesPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE2: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
