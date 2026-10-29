#!/usr/bin/env python3
"""Agent 05 O10-273 wave 63: tranche 64 (+220 → 19680 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE64_CHAINS = 220
TOTAL_CHAINS = 19680


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche63.py"
    dst = ROOT / "scripts/generate-catalog-tranche64.py"
    text = src.read_text()
    text = text.replace("Tranche 63", "Tranche 64")
    text = text.replace("tranche63", "tranche64")
    text = text.replace("TRANCHE63", "TRANCHE64")
    text = text.replace("op10m_t63_", "op10m_t64_")
    text = text.replace("generate-catalog-tranche63.py", "generate-catalog-tranche64.py")
    text = text.replace("63 + tier", "64 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE64" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63 } from '../generated/chain-catalog-tranche63.ts';"
    if "TRANCHE64 } from '../generated/chain-catalog-tranche64.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE64 } from '../generated/chain-catalog-tranche64.ts';",
        )
    text = text.replace(
        "  tranche63Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63.length,\n  totalChains:",
        "  tranche63Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63.length,\n"
        "  tranche64Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE64.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE64.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE63,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE64,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE63_STATS,\n} from '../generated/chain-catalog-tranche63.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE63_STATS,\n} from '../generated/chain-catalog-tranche63.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE64,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE64_STATS,\n} from '../generated/chain-catalog-tranche64.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("19460", str(TOTAL_CHAINS))
        new = new.replace("fifty-eight tranches", "fifty-nine tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("19460", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche63-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche64-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 63", "Tranche 64")
    text = text.replace("tranche63", "tranche64")
    text = text.replace("TRANCHE63", "TRANCHE64")
    text = text.replace("op10m_t63_", "op10m_t64_")
    text = text.replace("220", str(TRANSCHE64_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche64" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche63.ts',\n",
            "  'generated/chain-catalog-tranche63.ts',\n  'generated/chain-catalog-tranche64.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche63_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche64_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche64 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE64.length === {TRANSCHE64_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t64_')),`,\n"
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
    print("tranche64 wave63 implementation ok")


if __name__ == "__main__":
    main()
