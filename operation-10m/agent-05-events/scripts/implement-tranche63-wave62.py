#!/usr/bin/env python3
"""Agent 05 O10-269 wave 62: tranche 63 (+220 → 19460 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE63_CHAINS = 220
TOTAL_CHAINS = 19460


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche62.py"
    dst = ROOT / "scripts/generate-catalog-tranche63.py"
    text = src.read_text()
    text = text.replace("Tranche 62", "Tranche 63")
    text = text.replace("tranche62", "tranche63")
    text = text.replace("TRANCHE62", "TRANCHE63")
    text = text.replace("op10m_t62_", "op10m_t63_")
    text = text.replace("generate-catalog-tranche62.py", "generate-catalog-tranche63.py")
    text = text.replace("62 + tier", "63 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE63" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE62 } from '../generated/chain-catalog-tranche62.ts';"
    if "TRANCHE63 } from '../generated/chain-catalog-tranche63.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63 } from '../generated/chain-catalog-tranche63.ts';",
        )
    text = text.replace(
        "  tranche62Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE62.length,\n  totalChains:",
        "  tranche62Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE62.length,\n"
        "  tranche63Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE62.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE62.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE62,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE62,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE62_STATS,\n} from '../generated/chain-catalog-tranche62.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE62_STATS,\n} from '../generated/chain-catalog-tranche62.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE63_STATS,\n} from '../generated/chain-catalog-tranche63.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("19240", str(TOTAL_CHAINS))
        new = new.replace("fifty-seven tranches", "fifty-eight tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("19240", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche62-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche63-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 62", "Tranche 63")
    text = text.replace("tranche62", "tranche63")
    text = text.replace("TRANCHE62", "TRANCHE63")
    text = text.replace("op10m_t62_", "op10m_t63_")
    text = text.replace("220", str(TRANSCHE63_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche63" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche62.ts',\n",
            "  'generated/chain-catalog-tranche62.ts',\n  'generated/chain-catalog-tranche63.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche62_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche63_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche63 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63.length === {TRANSCHE63_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t63_')),`,\n"
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
    print("tranche63 wave62 implementation ok")


if __name__ == "__main__":
    main()
