#!/usr/bin/env python3
"""Tranche 33 — scale wave full-chunks handoff sync commit / agent25-bundle-catalog-sealed gated chains (320)."""
from __future__ import annotations

import pathlib
import textwrap

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "chain-catalog-tranche33.ts"

REGIONS = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

CATALOG_ARCHETYPES: list[tuple[str, str, str, str, str, str]] = [
    ("latch_after_seal", "governance", "political", "governance", "finance", "commit"),
    ("assembly_wave_ready", "technology", "technological", "technology", "research", "sealed"),
    ("post_scale_wave", "logistics", "infrastructure", "logistics", "trade", "commit_sealed"),
    ("calm_latch_harmony", "manufacturing", "economic", "manufacturing", "logistics", "lock_commit"),
    ("queue_latch_echo", "finance", "economic", "finance", "trade", "commit_latch"),
    ("attention_latch", "energy", "infrastructure", "energy", "renewables", "sealed"),
    ("narrative_latch", "trade", "economic", "trade", "logistics", "commit"),
    ("deferred_latch_lattice", "water", "environmental", "agriculture", "agriculture", "sealed_latch"),
]


def chain_id(region: str, archetype: str, tier: int, idx: int) -> str:
    return f"op10m_t33_{region.lower()}_{archetype}_t{tier}_{idx}"


def signal_extra(signal_gate: str, tier: int) -> str:
    if signal_gate == "commit":
        return "{ k: 'scale_wave_full_chunks_handoff_sync_commit' }, "
    if signal_gate == "sealed":
        return "{ k: 'agent25_full_chunks_handoff_sync_wave_sealed' }, "
    if signal_gate == "commit_sealed":
        return "{ k: 'scale_wave_full_chunks_handoff_sync_commit' }, { k: 'agent25_full_chunks_handoff_sync_wave_sealed' }, "
    if signal_gate == "lock_commit":
        return "{ k: 'scale_wave_full_chunks_handoff_sync_latch' }, { k: 'scale_wave_full_chunks_handoff_sync_commit' }, "
    if signal_gate == "commit_latch":
        return "{ k: 'agent25_full_chunks_handoff_sync_wave_ready' }, { k: 'scale_wave_full_chunks_handoff_sync_commit' }, "
    if signal_gate == "sealed_latch":
        return "{ k: 'agent25_full_chunks_handoff_sync_wave_sealed' }, { k: 'scale_wave_full_chunks_handoff_sync_commit' }, "
    return "{ k: 'scale_wave_full_chunks_handoff_sync_commit' }, "


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
    min_day = 90 + tier * 4
    min_a = 40 + tier * 2
    min_b = 38 + tier * 2
    min_passes = 6 + tier // 2

    if phase == "signal":
        requires = (
            f"[{{ k: 'min_day', day: {min_day} }}, "
            f"{{ k: 'combined_sector', sectors: [{{ sector: '{sector_a}', min: {min_a} }}, {{ sector: '{sector_b}', min: {min_b} }}] }}, "
            f"{signal_extra(signal_gate, tier)}"
            f"{{ k: 'turn_compute_digest_set' }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "pressure":
        if signal_gate in ("commit", "commit_latch", "lock_commit"):
            gate = "{ k: 'scale_wave_full_chunks_handoff_sync_commit' }, { k: 'agent25_full_chunks_handoff_sync_wave_sealed' }"
        elif signal_gate in ("sealed", "sealed_latch"):
            gate = "{ k: 'agent25_full_chunks_handoff_sync_wave_ready' }, { k: 'scale_wave_full_chunks_handoff_sync_latch' }"
        else:
            gate = "{ k: 'scale_wave_catalog_commit' }, { k: 'agent25_bundle_catalog_sealed' }"
        requires = (
            f"[{{ k: 'chain_phase', phase: 'pressure' }}, "
            f"{gate}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    elif phase == "rupture":
        commit_gate = (
            "{ k: 'agent25_full_chunks_handoff_sync_wave_sealed' }"
            if signal_gate in ("sealed", "sealed_latch", "commit_sealed")
            else "{ k: 'scale_wave_full_chunks_handoff_sync_commit' }"
        )
        requires = (
            f"[{{ k: 'chain_phase', phase: 'rupture' }}, "
            f"{{ k: 'min_deferred_queue', min: {1 + tier // 4} }}, "
            f"{commit_gate}, "
            f"{{ k: 'money', min: {12600 + tier * 3000} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )
    else:
        requires = (
            f"[{{ k: 'chain_phase', phase: 'recovery' }}, "
            f"{{ k: 'scale_wave_full_chunks_handoff_sync_commit' }}, {{ k: 'agent25_full_chunks_handoff_sync_wave_sealed' }}, "
            f"{{ k: 'min_turn_compute_passes', min: {min_passes + 1} }}, "
            f"{{ k: 'no_flag', key: '{exit_flag}' }}]"
        )

    stab = {"signal": -1, "pressure": -4, "rupture": -6, "recovery": 7}[phase]
    cost = {"signal": 1150, "pressure": 2500, "rupture": 4300, "recovery": 2800}[phase]
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
            f"spawnModifier: {{ description: '{archetype} slot commit strain', "
            f"stabilityDeltaPerTurn: -1, moneyDeltaPerTurn: -220, expiresDay: 0 }} }},"
        )

    return textwrap.dedent(
        f"""
        {{
          phase: '{phase}',
          title: '{region} {archetype} — {phase} (t{tier})',
          narrative: 'Scale wave full-chunks handoff sync commit lattice {archetype}: {phase} gated by full-chunks handoff sync commit and full-chunks wave readiness.',
          requires: {requires},
          cooldownTurns: {cooldown},
          {passive}
          choices: [
            {{
              id: 'commit',
              label: 'Commit slot pass',
              description: 'Commit scale-wave full-chunks handoff sync commit slice for Agent 25 bundle assembly.',
              costMoney: {cost},
              onSelect: {{
                stabilityDelta: {stab + 5},
                escalateToPhase: {esc},
                {resolve_fields}
              }},
            }},
            {{
              id: 'defer',
              label: 'Hold catalog pass',
              description: 'Defer post-lock scale wave full-chunks handoff sync commit coordination.',
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
        for archetype, theme, category, sector_a, sector_b, signal_gate in CATALOG_ARCHETYPES:
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
                        36 + tier,
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
        "// AUTO-GENERATED — scripts/generate-catalog-tranche33.py",
        "import type { Op10mChainDescriptor } from '../src/types.ts';",
        "",
        "export const OP10M_AGENT05_CATALOG_TRANCHE33_STATS = {",
        "  regions: 8,",
        "  scaleWaveFullChunksHandoffSyncCommitLatticeArchetypes: 8,",
        "  tiersPerArchetype: 5,",
        f"  chainCount: {len(entries)},",
        "} as const;",
        "",
        "export const OP10M_AGENT05_CHAIN_CATALOG_TRANCHE33: Op10mChainDescriptor[] = [",
        ",\n".join(entries),
        "];",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(entries)} chains)")


if __name__ == "__main__":
    main()
