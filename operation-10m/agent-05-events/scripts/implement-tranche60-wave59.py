#!/usr/bin/env python3
"""Agent 05 O10-263 wave 59: tranche 60 (+220 → 18800 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE60_CHAINS = 220
TOTAL_CHAINS = 18800


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche59.py"
    dst = ROOT / "scripts/generate-catalog-tranche60.py"
    text = src.read_text()
    text = text.replace("Tranche 59", "Tranche 60")
    text = text.replace("tranche59", "tranche60")
    text = text.replace("TRANCHE59", "TRANCHE60")
    text = text.replace("op10m_t59_", "op10m_t60_")
    text = text.replace("generate-catalog-tranche59.py", "generate-catalog-tranche60.py")
    text = text.replace("51 + tier", "56 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE60" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE59 } from '../generated/chain-catalog-tranche59.ts';"
    if "TRANCHE60 } from '../generated/chain-catalog-tranche60.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60 } from '../generated/chain-catalog-tranche60.ts';",
        )
    text = text.replace(
        "  tranche59Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE59.length,\n  totalChains:",
        "  tranche59Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE59.length,\n"
        "  tranche60Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE59.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE59.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE59,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE59,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE59_STATS,\n} from '../generated/chain-catalog-tranche59.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE59_STATS,\n} from '../generated/chain-catalog-tranche59.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE60_STATS,\n} from '../generated/chain-catalog-tranche60.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("18580", str(TOTAL_CHAINS))
        new = new.replace("fifty-four tranches", "fifty-five tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("18580", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche59-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche60-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 59", "Tranche 60")
    text = text.replace("tranche59", "tranche60")
    text = text.replace("TRANCHE59", "TRANCHE60")
    text = text.replace("op10m_t59_", "op10m_t60_")
    text = text.replace("220", str(TRANSCHE60_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche60" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche59.ts',\n",
            "  'generated/chain-catalog-tranche59.ts',\n  'generated/chain-catalog-tranche60.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche59_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche60_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche60 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60.length === {TRANSCHE60_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t60_')),`,\n"
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
    print("tranche60 wave59 implementation ok")


if __name__ == "__main__":
    main()
