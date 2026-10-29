#!/usr/bin/env python3
"""Agent 05 O10-257 wave 57: tranche 58 (+220 → 18360 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE58_CHAINS = 220
TOTAL_CHAINS = 18360


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche57.py"
    dst = ROOT / "scripts/generate-catalog-tranche58.py"
    text = src.read_text()
    text = text.replace("Tranche 57", "Tranche 58")
    text = text.replace("tranche57", "tranche58")
    text = text.replace("TRANCHE57", "TRANCHE58")
    text = text.replace("op10m_t57_", "op10m_t58_")
    text = text.replace("generate-catalog-tranche57.py", "generate-catalog-tranche58.py")
    text = text.replace("51 + tier", "61 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE58" in text:
        return
    insert_export = """export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE58,
  OP10M_AGENT05_CATALOG_TRANCHE58_STATS,
} from '../generated/chain-catalog-tranche58.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE58 } from '../generated/chain-catalog-tranche58.ts';
"""
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE57 } from '../generated/chain-catalog-tranche57.ts';"
    text = text.replace(anchor, anchor + "\n" + insert_export)
    text = text.replace(
        "  tranche57Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE57.length,\n  totalChains:",
        "  tranche57Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE57.length,\n"
        "  tranche58Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE58.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE57.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE57.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE58.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE57,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE57,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE58,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE57_STATS,\n} from '../generated/chain-catalog-tranche57.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE57_STATS,\n} from '../generated/chain-catalog-tranche57.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE58,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE58_STATS,\n} from '../generated/chain-catalog-tranche58.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("18140", str(TOTAL_CHAINS))
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("18140", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche57-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche58-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 57", "Tranche 58")
    text = text.replace("tranche57", "tranche58")
    text = text.replace("TRANCHE57", "TRANCHE58")
    text = text.replace("op10m_t57_", "op10m_t58_")
    text = text.replace("220", str(TRANSCHE58_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche58" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche57.ts',\n",
            "  'generated/chain-catalog-tranche57.ts',\n  'generated/chain-catalog-tranche58.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche57_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche58_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche58 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE58.length === {TRANSCHE58_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t58_')),`,\n"
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
    print("tranche58 wave57 implementation ok")


if __name__ == "__main__":
    main()
