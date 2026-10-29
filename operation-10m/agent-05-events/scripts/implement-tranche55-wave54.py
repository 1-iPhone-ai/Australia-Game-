#!/usr/bin/env python3
"""Agent 05 O10-240 wave 54: tranche 55 (+220 → 17700 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE55_CHAINS = 220
TOTAL_CHAINS = 17700


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche54.py"
    dst = ROOT / "scripts/generate-catalog-tranche55.py"
    text = src.read_text()
    text = text.replace("Tranche 54", "Tranche 55")
    text = text.replace("tranche54", "tranche55")
    text = text.replace("TRANCHE54", "TRANCHE55")
    text = text.replace("op10m_t54_", "op10m_t55_")
    text = text.replace("generate-catalog-tranche54.py", "generate-catalog-tranche55.py")
    text = text.replace("36 + tier", "41 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE55" in text:
        return
    insert_export = """export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55,
  OP10M_AGENT05_CATALOG_TRANCHE55_STATS,
} from '../generated/chain-catalog-tranche55.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55 } from '../generated/chain-catalog-tranche55.ts';
"""
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54 } from '../generated/chain-catalog-tranche54.ts';"
    text = text.replace(anchor, anchor + "\n" + insert_export)
    text = text.replace(
        "  tranche54Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54.length,\n  totalChains:",
        "  tranche54Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54.length,\n"
        "  tranche55Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE54_STATS,\n} from '../generated/chain-catalog-tranche54.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE54_STATS,\n} from '../generated/chain-catalog-tranche54.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE55_STATS,\n} from '../generated/chain-catalog-tranche55.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("17480", str(TOTAL_CHAINS))
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("17480", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche54-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche55-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 54", "Tranche 55")
    text = text.replace("tranche54", "tranche55")
    text = text.replace("TRANCHE54", "TRANCHE55")
    text = text.replace("op10m_t54_", "op10m_t55_")
    text = text.replace("320", str(TRANSCHE55_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche55" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche54.ts',\n",
            "  'generated/chain-catalog-tranche54.ts',\n  'generated/chain-catalog-tranche55.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche54_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche55_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche55 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE55.length === {TRANSCHE55_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t55_')),`,\n"
            "  `  });`,\n"
        )
        if needle in text:
            text = text.replace(needle, insert + needle)
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
    print("tranche55 wave54 implementation ok")


if __name__ == "__main__":
    main()
