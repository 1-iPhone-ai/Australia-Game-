#!/usr/bin/env python3
"""Agent 05 O10-277 wave 65: tranche 66 (+220 → 20120 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE66_CHAINS = 220
TOTAL_CHAINS = 20120


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche65.py"
    dst = ROOT / "scripts/generate-catalog-tranche66.py"
    text = src.read_text()
    text = text.replace("Tranche 65", "Tranche 66")
    text = text.replace("tranche65", "tranche66")
    text = text.replace("TRANCHE65", "TRANCHE66")
    text = text.replace("op10m_t65_", "op10m_t66_")
    text = text.replace("generate-catalog-tranche65.py", "generate-catalog-tranche66.py")
    text = text.replace("65 + tier", "66 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE66" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE65 } from '../generated/chain-catalog-tranche65.ts';"
    if "TRANCHE66 } from '../generated/chain-catalog-tranche66.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66 } from '../generated/chain-catalog-tranche66.ts';",
        )
    text = text.replace(
        "  tranche65Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE65.length,\n  totalChains:",
        "  tranche65Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE65.length,\n"
        "  tranche66Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE65.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE65.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE65,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE65,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE65_STATS,\n} from '../generated/chain-catalog-tranche65.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE65_STATS,\n} from '../generated/chain-catalog-tranche65.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE66_STATS,\n} from '../generated/chain-catalog-tranche66.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("19900", str(TOTAL_CHAINS))
        new = new.replace("sixty tranches", "sixty-one tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("19900", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche65-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche66-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 65", "Tranche 66")
    text = text.replace("tranche65", "tranche66")
    text = text.replace("TRANCHE65", "TRANCHE66")
    text = text.replace("op10m_t65_", "op10m_t66_")
    text = text.replace("220", str(TRANSCHE66_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche66" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche65.ts',\n",
            "  'generated/chain-catalog-tranche65.ts',\n  'generated/chain-catalog-tranche66.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche65_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche66_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche66 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66.length === {TRANSCHE66_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t66_')),`,\n"
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
    print("tranche66 wave65 implementation ok")


if __name__ == "__main__":
    main()
