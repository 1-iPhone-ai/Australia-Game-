#!/usr/bin/env python3
"""Agent 05 O10-326 wave 72: tranche 73 (+220 → 21660 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE73_CHAINS = 220
TOTAL_CHAINS = 21660


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche72.py"
    dst = ROOT / "scripts/generate-catalog-tranche73.py"
    text = src.read_text()
    text = text.replace("Tranche 72", "Tranche 73")
    text = text.replace("tranche72", "tranche73")
    text = text.replace("TRANCHE72", "TRANCHE73")
    text = text.replace("op10m_t72_", "op10m_t73_")
    text = text.replace("generate-catalog-tranche73.py", "generate-catalog-tranche73.py")
    text = text.replace("72 + tier", "73 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE73" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE72 } from '../generated/chain-catalog-tranche72.ts';"
    if "TRANCHE73 } from '../generated/chain-catalog-tranche73.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73 } from '../generated/chain-catalog-tranche73.ts';",
        )
    text = text.replace(
        "  tranche72Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE72.length,\n  totalChains:",
        "  tranche72Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE72.length,\n"
        "  tranche73Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE72.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE72.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE72,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE72,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE72_STATS,\n} from '../generated/chain-catalog-tranche72.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE72_STATS,\n} from '../generated/chain-catalog-tranche72.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE73_STATS,\n} from '../generated/chain-catalog-tranche73.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("21440", str(TOTAL_CHAINS))
        new = new.replace("sixty-seven tranches", "sixty-eight tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("21440", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche72-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche73-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 72", "Tranche 73")
    text = text.replace("tranche72", "tranche73")
    text = text.replace("TRANCHE72", "TRANCHE73")
    text = text.replace("op10m_t72_", "op10m_t73_")
    text = text.replace("220", str(TRANSCHE73_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche73" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche72.ts',\n",
            "  'generated/chain-catalog-tranche72.ts',\n  'generated/chain-catalog-tranche73.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche72_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche73_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche73 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE73.length === {TRANSCHE73_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t73_')),`,\n"
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
    print("tranche73 wave72 implementation ok")


if __name__ == "__main__":
    main()
