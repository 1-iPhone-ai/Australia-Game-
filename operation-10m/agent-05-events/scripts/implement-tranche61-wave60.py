#!/usr/bin/env python3
"""Agent 05 O10-265 wave 60: tranche 61 (+220 → 19020 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE61_CHAINS = 220
TOTAL_CHAINS = 19020


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche60.py"
    dst = ROOT / "scripts/generate-catalog-tranche61.py"
    text = src.read_text()
    text = text.replace("Tranche 60", "Tranche 61")
    text = text.replace("tranche60", "tranche61")
    text = text.replace("TRANCHE60", "TRANCHE61")
    text = text.replace("op10m_t60_", "op10m_t61_")
    text = text.replace("generate-catalog-tranche60.py", "generate-catalog-tranche61.py")
    text = text.replace("56 + tier", "61 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE61" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60 } from '../generated/chain-catalog-tranche60.ts';"
    if "TRANCHE61 } from '../generated/chain-catalog-tranche61.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE61 } from '../generated/chain-catalog-tranche61.ts';",
        )
    text = text.replace(
        "  tranche60Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60.length,\n  totalChains:",
        "  tranche60Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60.length,\n"
        "  tranche61Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE61.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE61.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE60,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE61,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE60_STATS,\n} from '../generated/chain-catalog-tranche60.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE60_STATS,\n} from '../generated/chain-catalog-tranche60.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE61,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE61_STATS,\n} from '../generated/chain-catalog-tranche61.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("18800", str(TOTAL_CHAINS))
        new = new.replace("fifty-five tranches", "fifty-six tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("18800", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche60-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche61-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 60", "Tranche 61")
    text = text.replace("tranche60", "tranche61")
    text = text.replace("TRANCHE60", "TRANCHE61")
    text = text.replace("op10m_t60_", "op10m_t61_")
    text = text.replace("220", str(TRANSCHE61_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche61" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche60.ts',\n",
            "  'generated/chain-catalog-tranche60.ts',\n  'generated/chain-catalog-tranche61.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche60_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche61_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche61 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE61.length === {TRANSCHE61_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t61_')),`,\n"
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
    print("tranche61 wave60 implementation ok")


if __name__ == "__main__":
    main()
