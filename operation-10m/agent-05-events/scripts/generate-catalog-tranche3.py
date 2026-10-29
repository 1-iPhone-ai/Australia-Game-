#!/usr/bin/env python3
"""Tranche 3 — cross-system synergy chains (360)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche3.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

SYNERGIES: list[tuple[str, str, str, str, str, str]] = [
    ("mining_water", "mining", "water", "mining", "agriculture", "environmental"),
    ("energy_trade", "energy", "trade", "energy", "trade", "infrastructure"),
    ("finance_governance", "finance", "governance", "finance", "finance", "political"),
    ("agriculture_environment", "agriculture", "environment", "agriculture", "renewables", "environmental"),
    ("technology_research", "technology", "research", "technology", "research", "technological"),
    ("logistics_manufacturing", "logistics", "manufacturing", "logistics", "manufacturing", "infrastructure"),
    ("tourism_renewables", "tourism", "renewables", "tourism", "renewables", "economic"),
    ("exploration_energy", "exploration", "energy", "mining", "energy", "economic"),
    ("governance_finance", "governance", "finance", "finance", "finance", "political"),
]


def chain_id(region: str, synergy: str, tier: int, idx: int) -> str:
    return f"op10m_t3_{region.lower()}_{synergy}_t{tier}_{idx}"


def emit_phase(
    phase: str,
    region: str,
    synergy: str,
    primary: str,
    secondary: str,
    sector_a: str,
    sector_b: str,
    tier: int,
    exit_flag: str,
    cooldown: int,
) -> str:
    min_a = 20 + tier * 2
    min_b = 18 + tier * 2
    min_day = 20 + tier * 4

    if phase == "signal":
        requires = (
            f"[{{ k: 'min_day', day: {min_day} }}, "
            f"{{ k: 'combined_sector', sectors: [{{ sector: '{sector_a}', min: {min_a} }}, {{ sector: '{sector_b}', min: {min_b} }}] }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "pressure":
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{{ k: 'min_active_crises', min: {1 + tier // 2} }}, "
            f"{{ k: 'cross_system_coupling', region: '{region}', synergyId: '{synergy}', min: 1 }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'peer_chain_phase', region: '{region}', theme: '{secondary}', minPhase: 'pressure' }}, "
            f"{{ k: 'money', min: {6000 + tier * 2000} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = f"[{{ k: 'chain_phase', phase: 'recovery' }}, {{ k: 'no_flag', key: '{exit_flag}' }}]"

    stab = {"signal": -2, "pressure": -4, "rupture": -6, "recovery": 4}[phase]
    cost = {"signal": 400, "pressure": 1200, "rupture": 2800, "recovery": 1600}[phase]
    nxt = {"signal": "pressure", "pressure": "rupture", "rupture": "recovery"}.get(phase)
    esc = "undefined" if not nxt else f"'{nxt}'"
    if phase == "recovery":
        resolve_fields = f"resolveChain: true, setFlags: {{ '{exit_flag}': true }}, incrementActiveCrises: -1,"
    else:
        resolve_fields = f"setFlags: {{ '{exit_flag}_{phase}': true }},"

    passive = ""
    if phase == "pressure":
        passive = (
            f"passiveTick: {{ stabilityDelta: -2, "
            f"spawnModifier: {{ description: '{synergy} coupling strain', "
            f"stabilityDeltaPerTurn: -2, moneyDeltaPerTurn: -150, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {synergy} — {phase} (t{tier})',
          narrative: 'Cross-system {synergy}: {phase} with coupling, peer-chain, and crisis-count gates.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Coordinate response',
              description: 'Align cross-sector policy to stabilize linked systems.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
                sectorActivityDelta: {{ '{sector_a}': 1, '{sector_b}': 1 }},
              }},
            }},
            {{
              id: 'defer',
              label: 'Fragment response',
              description: 'Allow cross-system stress to compound.',
              costMoney: 0,
              onSelect: {{ stabilityDelta: {stab - 2}, incrementActiveCrises: {1 if phase in ('pressure', 'rupture') else 0} }},
            }},
          ],
        }}"""
    ).strip()


def main() -> None:
    entries: list[str] = []
    idx = 0
    for region in REGIONS:
        for synergy, primary, secondary, sector_a, sector_b, category in SYNERGIES:
            for tier in range(5):
                cid = chain_id(region, synergy, tier, idx)
                exit_flag = f"{cid}_resolved"
                phases = ",\n".join(
                    emit_phase(
                        p,
                        region,
                        synergy,
                        primary,
                        secondary,
                        sector_a,
                        sector_b,
                        tier,
                        exit_flag,
                        16 + tier,
                    )
                    for p in ("signal", "pressure", "rupture", "recovery")
                )
                block = textwrap.dedent(
                    f"""
                    {{
                      chainId: '{cid}',
                      region: '{region}',
                      theme: '{primary}',
                      category: '{category}',
                      entryFlag: '{cid}_entered',
                      exitFlag: '{exit_flag}',
                      phases: [
                    {phases}
                      ],
                    }}"""
                ).strip()
                entries.append(block)
                idx += 1

    lines = [
        "// AUTO-GENERATED — scripts/generate-catalog-tranche3.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE3_STATS = {",
        "  regions: 8,",
        "  synergies: 9,",
        "  tiersPerSynergy: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE3: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
