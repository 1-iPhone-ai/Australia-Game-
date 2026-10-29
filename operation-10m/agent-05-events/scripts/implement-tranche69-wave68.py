#!/usr/bin/env python3
"""Agent 05 O10-292 wave 68: tranche 69 (+220 → 20780 chains)."""
from __future__ import annotations

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]

TRANSCHE69_CHAINS = 220
TOTAL_CHAINS = 20780


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche68.py"
    dst = ROOT / "scripts/generate-catalog-tranche69.py"
    text = src.read_text()
    text = text.replace("Tranche 68", "Tranche 69")
    text = text.replace("tranche68", "tranche69")
    text = text.replace("TRANCHE68", "TRANCHE69")
    text = text.replace("op10m_t68_", "op10m_t69_")
    text = text.replace("generate-catalog-tranche68.py", "generate-catalog-tranche69.py")
    text = text.replace("68 + tier", "69 + tier")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE69" in text:
        return
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68 } from '../generated/chain-catalog-tranche68.ts';"
    if "TRANCHE69 } from '../generated/chain-catalog-tranche69.ts';" not in text.split("import type")[0]:
        text = text.replace(
            anchor,
            anchor + "\nimport { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69 } from '../generated/chain-catalog-tranche69.ts';",
        )
    text = text.replace(
        "  tranche68Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68.length,\n  totalChains:",
        "  tranche68Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68.length,\n"
        "  tranche69Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE68,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69,\n];",
    )
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE68_STATS,\n} from '../generated/chain-catalog-tranche68.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE68_STATS,\n} from '../generated/chain-catalog-tranche68.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE69_STATS,\n} from '../generated/chain-catalog-tranche69.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("20560", str(TOTAL_CHAINS))
        new = new.replace("sixty-three tranches", "sixty-four tranches")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("20560", str(TOTAL_CHAINS)))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche68-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche69-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 68", "Tranche 69")
    text = text.replace("tranche68", "tranche69")
    text = text.replace("TRANCHE68", "TRANCHE69")
    text = text.replace("op10m_t68_", "op10m_t69_")
    text = text.replace("220", str(TRANSCHE69_CHAINS), 2)
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche69" not in text:
        text = text.replace(
            "  'generated/chain-catalog-tranche68.ts',\n",
            "  'generated/chain-catalog-tranche68.ts',\n  'generated/chain-catalog-tranche69.ts',\n",
        )
        needle = "  `    id: 'agent05_tranche68_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
        insert = (
            "  `  results.push({`,\n"
            "  `    id: 'agent05_tranche69_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
            "  `    name: 'tranche69 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
            "  `    passed:`,\n"
            f"  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE69.length === {TRANSCHE69_CHAINS} &&`,\n"
            "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t69_')),`,\n"
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
    print("tranche69 wave68 implementation ok")


if __name__ == "__main__":
    main()
