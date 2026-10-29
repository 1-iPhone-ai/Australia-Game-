#!/usr/bin/env python3
"""Agent 05 O10-283 wave 67: tranche 68 (+220 → 20560 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE68_CHAINS = 220
TOTAL_CHAINS = 20560


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche67.py"
    dst = ROOT / "scripts/generate-catalog-tranche68.py"
    text = src.read_text()
    text = text.replace("Tranche 67", "Tranche 68")
    text = text.replace("tranche67", "tranche68")
    text = text.replace("TRANCHE67", "TRANCHE68")
    text = text.replace("op10m_t67_", "op10m_t68_")
    text = text.replace("generate-catalog-tranche67.py", "generate-catalog-tranche68.py")
    text = text.replace("67 + tier", "68 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE68" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67 } from '../generated/chain-catalog-tranche67.ts';"
    if "TRANCHE68 } from '../generated/chain-catalog-tranche68.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68 } from '../generated/chain-catalog-tranche68.ts';",
        )
    text = text.replace(
        "  tranche67Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67.length,\n  totalChains:",
        "  tranche67Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67.length,\n"
        "  tranche68Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE67,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE67_STATS,\n} from '../generated/chain-catalog-tranche67.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE67_STATS,\n} from '../generated/chain-catalog-tranche67.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE68_STATS,\n} from '../generated/chain-catalog-tranche68.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("20340", str(TOTAL_CHAINS))
        new = new.replace("sixty-two tranches", "sixty-three tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("20340", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche67-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche68-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 67", "Tranche 68")
    text = text.replace("tranche67", "tranche68")
    text = text.replace("TRANCHE67", "TRANCHE68")
    text = text.replace("op10m_t67_", "op10m_t68_")
    text = text.replace("220", str(TRANSCHE68_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche68" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche67.ts',\n",
            "  'generated/chain-catalog-tranche67.ts',\n  'generated/chain-catalog-tranche68.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche67_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche68_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche68 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68.length === {TRANSCHE68_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t68_')),`,\n"
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
    print("tranche68 wave67 implementation ok")


if __name__ == "__main__":
    main()
