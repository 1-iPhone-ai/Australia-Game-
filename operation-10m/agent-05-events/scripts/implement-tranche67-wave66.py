#!/usr/bin/env python3
"""Agent 05 O10-279 wave 66: tranche 67 (+220 → 20340 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE67_CHAINS = 220
TOTAL_CHAINS = 20340


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche66.py"
    dst = ROOT / "scripts/generate-catalog-tranche67.py"
    text = src.read_text()
    text = text.replace("Tranche 66", "Tranche 67")
    text = text.replace("tranche66", "tranche67")
    text = text.replace("TRANCHE66", "TRANCHE67")
    text = text.replace("op10m_t66_", "op10m_t67_")
    text = text.replace("generate-catalog-tranche66.py", "generate-catalog-tranche67.py")
    text = text.replace("66 + tier", "67 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE67" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66 } from '../generated/chain-catalog-tranche66.ts';"
    if "TRANCHE67 } from '../generated/chain-catalog-tranche67.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67 } from '../generated/chain-catalog-tranche67.ts';",
        )
    text = text.replace(
        "  tranche66Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66.length,\n  totalChains:",
        "  tranche66Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66.length,\n"
        "  tranche67Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE66,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE66_STATS,\n} from '../generated/chain-catalog-tranche66.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE66_STATS,\n} from '../generated/chain-catalog-tranche66.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE67_STATS,\n} from '../generated/chain-catalog-tranche67.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("20120", str(TOTAL_CHAINS))
        new = new.replace("sixty-one tranches", "sixty-two tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("20120", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche66-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche67-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 66", "Tranche 67")
    text = text.replace("tranche66", "tranche67")
    text = text.replace("TRANCHE66", "TRANCHE67")
    text = text.replace("op10m_t66_", "op10m_t67_")
    text = text.replace("220", str(TRANSCHE67_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche67" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche66.ts',\n",
            "  'generated/chain-catalog-tranche66.ts',\n  'generated/chain-catalog-tranche67.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche66_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche67_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche67 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67.length === {TRANSCHE67_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t67_')),`,\n"
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
    print("tranche67 wave66 implementation ok")


if __name__ == "__main__":
    main()
