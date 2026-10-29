#!/usr/bin/env python3
"""Tranche 13 — chunk assembly seal / handoff-manifest commit gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche13.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

SEAL_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("seal_after_handoff", "governance", "political", "governance", "finance", "seal"),
    ("manifest_commit_wave", "technology", "technological", "technology", "research", "commit"),
    ("chunk_assembly_seal", "logistics", "infrastructure", "logistics", "trade", "seal_commit"),
    ("calm_seal_harmony", "manufacturing", "economic", "manufacturing", "logistics", "handoff_seal"),
    ("queue_seal_echo", "finance", "economic", "finance", "trade", "seal_latch"),
    ("attention_seal", "energy", "infrastructure", "energy", "renewables", "commit"),
    ("narrative_seal", "trade", "economic", "trade", "logistics", "seal"),
    ("deferred_seal_lattice", "water", "environmental", "agriculture", "agriculture", "commit_latch"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t13_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str, tier: int) -> str:
    if signal_gate == "seal":
        return "{ k: 'chunk_assembly_seal' }, "
    if signal_gate == "commit":
        return "{ k: 'handoff_manifest_commit' }, "
    if signal_gate == "seal_commit":
        return "{ k: 'chunk_assembly_seal' }, { k: 'handoff_manifest_commit' }, "
    if signal_gate == "handoff_seal":
        return "{ k: 'assembly_handoff_wave' }, { k: 'chunk_assembly_seal' }, "
    if signal_gate == "seal_latch":
        return "{ k: 'sync_manifest_latch' }, { k: 'chunk_assembly_seal' }, "
    if signal_gate == "commit_latch":
        return "{ k: 'handoff_manifest_commit' }, { k: 'integration_sync_gate' }, "
    return "{ k: 'chunk_assembly_seal' }, "


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
    min_day = 75 + tier * 4
    min_a = 34 + tier * 2
    min_b = 32 + tier * 2
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
        if signal_gate in ("seal", "seal_latch", "handoff_seal"):
            gate = "{ k: 'chunk_assembly_seal' }, { k: 'assembly_handoff_wave' }"
        elif signal_gate in ("commit", "commit_latch"):
            gate = "{ k: 'handoff_manifest_commit' }, { k: 'sync_manifest_latch' }"
        else:
            gate = "{ k: 'chunk_assembly_seal' }, { k: 'handoff_manifest_commit' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        seal_gate = (
            "{ k: 'handoff_manifest_commit' }"
            if signal_gate in ("commit", "commit_latch", "seal_commit")
            else "{ k: 'chunk_assembly_seal' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{seal_gate}, "
            f"{{ k: 'money', min: {11400 + tier * 2700} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{{ k: 'chunk_assembly_seal' }}, {{ k: 'handoff_manifest_commit' }}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -1, "pressure": -4, "rupture": -6, "recovery": 7}[phase]
    cost = {"signal": 1000, "pressure": 2200, "rupture": 4000, "recovery": 2500}[phase]
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
            f"spawnModifier: {{ description: '{archetype} chunk seal strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -190, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Chunk assembly seal lattice {archetype}: {phase} gated by seal and manifest commit.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Commit seal pass',
              description: 'Seal chunk assembly for Agent 25 inline manifest commit.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold seal pass',
              description: 'Defer post-handoff chunk assembly seal coordination.',
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
        for archetype, theme, category, sector_a, sector_b, signal_gate in SEAL_ARCHETYPES:
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
                        30 + tier,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche13.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE13_STATS = {",
        "  regions: 8,",
        "  chunkAssemblySealLatticeArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE13: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
