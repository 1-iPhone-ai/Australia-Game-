#!/usr/bin/env python3
"""Agent 05 O10-301 wave 69: tranche 70 (+220 → 21000 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE70_CHAINS = 220
TOTAL_CHAINS = 21000


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche69.py"
    dst = ROOT / "scripts/generate-catalog-tranche70.py"
    text = src.read_text()
    text = text.replace("Tranche 69", "Tranche 70")
    text = text.replace("tranche69", "tranche70")
    text = text.replace("TRANCHE69", "TRANCHE70")
    text = text.replace("op10m_t69_", "op10m_t70_")
    text = text.replace("generate-catalog-tranche69.py", "generate-catalog-tranche70.py")
    text = text.replace("69 + tier", "70 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE70" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69 } from '../generated/chain-catalog-tranche69.ts';"
    if "TRANCHE70 } from '../generated/chain-catalog-tranche70.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE70 } from '../generated/chain-catalog-tranche70.ts';",
        )
    text = text.replace(
        "  tranche69Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69.length,\n  totalChains:",
        "  tranche69Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69.length,\n"
        "  tranche70Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE70.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE70.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE70,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE69_STATS,\n} from '../generated/chain-catalog-tranche69.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE69_STATS,\n} from '../generated/chain-catalog-tranche69.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE70,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE70_STATS,\n} from '../generated/chain-catalog-tranche70.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("20780", str(TOTAL_CHAINS))
        new = new.replace("sixty-four tranches", "sixty-five tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("20780", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche69-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche70-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 69", "Tranche 70")
    text = text.replace("tranche69", "tranche70")
    text = text.replace("TRANCHE69", "TRANCHE70")
    text = text.replace("op10m_t69_", "op10m_t70_")
    text = text.replace("220", str(TRANSCHE70_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche70" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche69.ts',\n",
            "  'generated/chain-catalog-tranche69.ts',\n  'generated/chain-catalog-tranche70.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche69_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche70_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche70 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE70.length === {TRANSCHE70_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t70_')),`,\n"
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
    print("tranche70 wave69 implementation ok")


if __name__ == "__main__":
    main()
