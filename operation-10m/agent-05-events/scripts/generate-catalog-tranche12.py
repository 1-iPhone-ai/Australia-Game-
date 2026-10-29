#!/usr/bin/env python3
"""Tranche 12 — assembly handoff / sync-manifest gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche12.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

# archetype, theme, category, sector_a, sector_b, signal_gate
HANDOFF_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("handoff_after_sync", "governance", "political", "governance", "finance", "handoff"),
    ("manifest_latch_wave", "technology", "technological", "technology", "research", "manifest"),
    ("assembly_handoff", "logistics", "infrastructure", "logistics", "trade", "handoff_manifest"),
    ("calm_handoff_harmony", "manufacturing", "economic", "manufacturing", "logistics", "sync_handoff"),
    ("queue_handoff_echo", "finance", "economic", "finance", "trade", "handoff_latch"),
    ("attention_handoff", "energy", "infrastructure", "energy", "renewables", "manifest"),
    ("narrative_handoff", "trade", "economic", "trade", "logistics", "handoff"),
    ("deferred_handoff_lattice", "water", "environmental", "agriculture", "agriculture", "manifest_latch"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t12_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str, tier: int) -> str:
    if signal_gate == "handoff":
        return "{ k: 'assembly_handoff_wave' }, "
    if signal_gate == "manifest":
        return "{ k: 'sync_manifest_latch' }, "
    if signal_gate == "handoff_manifest":
        return "{ k: 'assembly_handoff_wave' }, { k: 'sync_manifest_latch' }, "
    if signal_gate == "sync_handoff":
        return "{ k: 'integration_sync_gate' }, { k: 'assembly_handoff_wave' }, "
    if signal_gate == "handoff_latch":
        return "{ k: 'closure_seal_ready' }, { k: 'assembly_handoff_wave' }, "
    if signal_gate == "manifest_latch":
        return "{ k: 'sync_manifest_latch' }, { k: 'integration_sync_gate' }, "
    return "{ k: 'assembly_handoff_wave' }, "


def emit_phase(
    phase: str,
    region: str,
    archetype: str,
    sector_a: str,
    sector_b: str,
    tier: int,
    exit_flag: str,
    cooldown: int,
    signal_gate: str,
) -> str:
    min_day = 70 + tier * 4
    min_a = 32 + tier * 2
    min_b = 30 + tier * 2
    min_passes = 4 + tier // 2

    if phase == "signal":
        requires = (
            f"[{{ k: 'min_day', day: {min_day} }}, "
            f"{{ k: 'combined_sector', sectors: [{{ sector: '{sector_a}', min: {min_a} }}, {{ sector: '{sector_b}', min: {min_b} }}] }}, "
            f"{signal_extra(signal_gate, tier)}"
            f"{{ k: 'turn_compute_digest_set' }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "pressure":
        if signal_gate in ("handoff", "handoff_latch", "sync_handoff"):
            gate = "{ k: 'assembly_handoff_wave' }, { k: 'integration_sync_gate' }"
        elif signal_gate in ("manifest", "manifest_latch"):
            gate = "{ k: 'sync_manifest_latch' }, { k: 'closure_seal_ready' }"
        else:
            gate = "{ k: 'assembly_handoff_wave' }, { k: 'sync_manifest_latch' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        handoff_gate = (
            "{ k: 'sync_manifest_latch' }"
            if signal_gate in ("manifest", "manifest_latch", "handoff_manifest")
            else "{ k: 'assembly_handoff_wave' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{handoff_gate}, "
            f"{{ k: 'money', min: {11000 + tier * 2600} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{{ k: 'assembly_handoff_wave' }}, {{ k: 'sync_manifest_latch' }}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -1, "pressure": -4, "rupture": -6, "recovery": 7}[phase]
    cost = {"signal": 950, "pressure": 2100, "rupture": 3900, "recovery": 2400}[phase]
    nxt = {"signal": "pressure", "pressure": "rupture", "rupture": "recovery"}.get(phase)
    esc = "undefined" if not nxt else f"'{nxt}'"
    if phase == "recovery":
        resolve_fields = f"resolveChain: true, setFlags: {{ '{exit_flag}': true }}, incrementActiveCrises: -1,"
    else:
        resolve_fields = f"setFlags: {{ '{exit_flag}_{phase}': true }},"

    passive = ""
    if phase == "pressure":
        passive = (
            f"passiveTick: {{ stabilityDelta: -1, "
            f"spawnModifier: {{ description: '{archetype} assembly handoff strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -180, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Assembly handoff lattice {archetype}: {phase} gated by handoff wave and sync manifest latch.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Commit handoff pass',
              description: 'Latch sync manifest for Agent 25 chunk assembly handoff.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold handoff pass',
              description: 'Defer post-sync assembly handoff coordination.',
              costMoney: 0,
              onSelect: {{ stabilityDelta: {stab - 2}, incrementActiveCrises: {1 if phase != 'signal' else 0} }},
            }},
          ],
        }}"""
    ).strip()


def main() -> None:
    entries: list[str] = []
    idx = 0
    for region in REGIONS:
        for archetype, theme, category, sector_a, sector_b, signal_gate in HANDOFF_ARCHETYPES:
            for tier in range(5):
                cid = chain_id(region, archetype, tier, idx)
                exit_flag = f"{cid}_resolved"
                phases = ",\n".join(
                    emit_phase(
                        p,
                        region,
                        archetype,
                        sector_a,
                        sector_b,
                        tier,
                        exit_flag,
                        28 + tier,
                        signal_gate,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche12.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE12_STATS = {",
        "  regions: 8,",
        "  assemblyHandoffLatticeArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE12: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
