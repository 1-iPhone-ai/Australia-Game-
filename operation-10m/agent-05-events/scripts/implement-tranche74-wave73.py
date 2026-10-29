#!/usr/bin/env python3
"""Agent 05 O10-335 wave 73: tranche 74 (+220 → 21880 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE74_CHAINS = 220
TOTAL_CHAINS = 21880


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche73.py"
    dst = ROOT / "scripts/generate-catalog-tranche74.py"
    text = src.read_text()
    text = text.replace("Tranche 73", "Tranche 74")
    text = text.replace("tranche73", "tranche74")
    text = text.replace("TRANCHE73", "TRANCHE74")
    text = text.replace("op10m_t73_", "op10m_t74_")
    text = text.replace("generate-catalog-tranche73.py", "generate-catalog-tranche74.py")
    text = text.replace("73 + tier", "74 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE74" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73 } from '../generated/chain-catalog-tranche73.ts';"
    if "TRANCHE74 } from '../generated/chain-catalog-tranche74.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE74 } from '../generated/chain-catalog-tranche74.ts';",
        )
    text = text.replace(
        "  tranche73Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73.length,\n  totalChains:",
        "  tranche73Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73.length,\n"
        "  tranche74Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE74.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE74.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE74,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE73_STATS,\n} from '../generated/chain-catalog-tranche73.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE73_STATS,\n} from '../generated/chain-catalog-tranche73.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE74,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE74_STATS,\n} from '../generated/chain-catalog-tranche74.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("21660", str(TOTAL_CHAINS))
        new = new.replace("sixty-eight tranches", "sixty-nine tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("21660", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche73-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche74-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 73", "Tranche 74")
    text = text.replace("tranche73", "tranche74")
    text = text.replace("TRANCHE73", "TRANCHE74")
    text = text.replace("op10m_t73_", "op10m_t74_")
    text = text.replace("220", str(TRANSCHE74_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche74" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche73.ts',\n",
            "  'generated/chain-catalog-tranche73.ts',\n  'generated/chain-catalog-tranche74.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche73_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche74_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche74 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE74.length === {TRANSCHE74_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t74_')),`,\n"
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
    print("tranche74 wave73 implementation ok")


if __name__ == "__main__":
    main()
