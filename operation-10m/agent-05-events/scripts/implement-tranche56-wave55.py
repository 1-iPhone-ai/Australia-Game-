#!/usr/bin/env python3
"""Agent 05 O10-247 wave 55: tranche 56 (+220 → 17920 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE56_CHAINS = 220
TOTAL_CHAINS = 17920


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche55.py"
    dst = ROOT / "scripts/generate-catalog-tranche56.py"
    text = src.read_text()
    text = text.replace("Tranche 55", "Tranche 56")
    text = text.replace("tranche55", "tranche56")
    text = text.replace("TRANCHE55", "TRANCHE56")
    text = text.replace("op10m_t55_", "op10m_t56_")
    text = text.replace("generate-catalog-tranche55.py", "generate-catalog-tranche56.py")
    text = text.replace("41 + tier", "46 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE56" in text:
        return
    insert_export = """export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE56,
  OP10M_AGENT05_CATALOG_TRANCHE56_STATS,
} from '../generated/chain-catalog-tranche56.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE56 } from '../generated/chain-catalog-tranche56.ts';
"""
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55 } from '../generated/chain-catalog-tranche55.ts';"
    text = text.replace(anchor, anchor + "\n" + insert_export)
    text = text.replace(
        "  tranche55Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55.length,\n  totalChains:",
        "  tranche55Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55.length,\n"
        "  tranche56Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE56.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE56.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE56,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE55_STATS,\n} from '../generated/chain-catalog-tranche55.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE55_STATS,\n} from '../generated/chain-catalog-tranche55.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE56,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE56_STATS,\n} from '../generated/chain-catalog-tranche56.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("17700", str(TOTAL_CHAINS))
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("17700", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche55-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche56-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 55", "Tranche 56")
    text = text.replace("tranche55", "tranche56")
    text = text.replace("TRANCHE55", "TRANCHE56")
    text = text.replace("op10m_t55_", "op10m_t56_")
    text = text.replace("220", str(TRANSCHE56_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche56" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche55.ts',\n",
            "  'generated/chain-catalog-tranche55.ts',\n  'generated/chain-catalog-tranche56.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche55_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent06_tranche56_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche56 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE56.length === {TRANSCHE56_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t56_')),`,\n"
            "  `  });`,\n"
        )
        if needle in text:
            text = text.replace(needle, insert + needle)
        text = text.replace(
            "agent06_tranche56",
            "agent05_tranche56",
        )
    text = re.sub(r"chainCount: \d+,", f"chainCount: {TOTAL_CHAINS},", text)
    text = re.sub(
        r"OP10M_AGENT05_CHAIN_CATALOG\.length === \d+",
        f"OP10M_AGENT05_CHAIN_CATALOG.length === {TOTAL_CHAINS}",
        text,
    )
    text = re.sub(
        r"name: '\d+ chain descriptors'",
        f"name: '{TOTAL_CHAINS} chain descriptors'",
        text,
    )
    path.write_text(text)


def main() -> None:
    copy_tranche_generator()
    patch_aggregate()
    bump_catalog_counts()
    copy_tranche_test()
    patch_bundle_script()
    print("tranche56 wave55 implementation ok")


if __name__ == "__main__":
    main()
