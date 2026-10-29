#!/usr/bin/env python3
"""Agent 05 O10-237 wave 53: tranche 54 (+320 → 17480 chains)."""
from __future__ import annotations

import pathlib
import re
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]


def copy_tranche_generator() -> None:
    src = ROOT / "scripts/generate-catalog-tranche53.py"
    dst = ROOT / "scripts/generate-catalog-tranche54.py"
    text = src.read_text()
    text = text.replace("Tranche 53", "Tranche 54")
    text = text.replace("tranche53", "tranche54")
    text = text.replace("op10m_t53_", "op10m_t54_")
    text = text.replace("generate-catalog-tranche53.py", "generate-catalog-tranche54.py")
    dst.write_text(text)
    subprocess.check_call(["python3", str(dst)], cwd=REPO)


def patch_aggregate() -> None:
    path = ROOT / "src/chain-catalog-aggregate.ts"
    text = path.read_text()
    if "TRANCHE54" in text:
        return
    insert_export = """export {
  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54,
  OP10M_AGENT05_CATALOG_TRANCHE54_STATS,
} from '../generated/chain-catalog-tranche54.ts';
import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54 } from '../generated/chain-catalog-tranche54.ts';
"""
    anchor = "import { OP10M_AGENT05_CHAIN_CATALOG_TRANCHE53 } from '../generated/chain-catalog-tranche53.ts';"
    text = text.replace(anchor, anchor + "\n" + insert_export)
    text = text.replace(
        "  tranche53Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE53.length,\n  totalChains:",
        "  tranche53Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE53.length,\n"
        "  tranche54Chains: OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54.length,\n  totalChains:",
    )
    text = text.replace(
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE53.length,\n  regions:",
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE53.length +\n"
        "    OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54.length,\n  regions:",
    )
    text = text.replace(
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE53,\n];",
        "  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE53,\n  ...OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54,\n];",
    )
    # re-export block at bottom
    text = text.replace(
        "  OP10M_AGENT05_CATALOG_TRANCHE53_STATS,\n} from '../generated/chain-catalog-tranche53.ts';",
        "  OP10M_AGENT05_CATALOG_TRANCHE53_STATS,\n} from '../generated/chain-catalog-tranche53.ts';\nexport {\n"
        "  OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54,\n"
        "  OP10M_AGENT05_CATALOG_TRANCHE54_STATS,\n} from '../generated/chain-catalog-tranche54.ts';",
    )
    path.write_text(text)


def bump_catalog_counts() -> None:
    for path in (ROOT / "tests").glob("**/*.test.ts"):
        text = path.read_text()
        new = text.replace("17160", "17480")
        if new != text:
            path.write_text(new)
    manifest = ROOT / "module.manifest.json"
    manifest.write_text(manifest.read_text().replace("17160", "17480"))


def copy_tranche_test() -> None:
    src = ROOT / "tests/tranche53-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    dst = ROOT / "tests/tranche54-scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice.test.ts"
    text = src.read_text()
    text = text.replace("Tranche 53", "Tranche 54")
    text = text.replace("tranche53", "tranche54")
    text = text.replace("TRANCHE53", "TRANCHE54")
    text = text.replace("op10m_t53_", "op10m_t54_")
    text = text.replace("17480 total", "17480 total")
    dst.write_text(text)


def patch_bundle_script() -> None:
    path = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    text = path.read_text()
    if "tranche54" in text:
        text = re.sub(r"chainCount: \d+,", "chainCount: 17480,", text)
        text = re.sub(
            r"OP10M_AGENT05_CHAIN_CATALOG\.length === \d+",
            "OP10M_AGENT05_CHAIN_CATALOG.length === 17480",
            text,
        )
        text = re.sub(
            r"name: '\d+ chain descriptors'",
            "name: '17480 chain descriptors'",
            text,
        )
        path.write_text(text)
        return
    text = text.replace(
        "  'generated/chain-catalog-tranche53.ts',\n",
        "  'generated/chain-catalog-tranche53.ts',\n  'generated/chain-catalog-tranche54.ts',\n",
    )
    block = """  results.push({
    id: 'agent05_tranche54_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',
    name: 'tranche54 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',
    passed:
      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54.length === 320 &&
      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t54_')),
  });
"""
    text = text.replace(
        "  `    id: 'agent05_tranche53_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,",
        block.replace("`", "").replace("  results.push({", "  `  results.push({").split("\n")[0]
        + "\n" + block,  # fallback simpler
    )
    # simpler insert before tranche53 block
    needle = "  `    id: 'agent05_tranche53_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,"
    insert = (
        "  `  results.push({`,\n"
        "  `    id: 'agent05_tranche54_scale_wave_full_chunks_handoff_closure_finalize_seal_sync_latch_wave_ready_commit_sealed_lattice',`,\n"
        "  `    name: 'tranche54 scale-wave-full-chunks-handoff-closure-finalize-seal-sync-latch-wave-ready-commit-sealed-lattice chains present',`,\n"
        "  `    passed:`,\n"
        "  `      OP10M_AGENT05_CHAIN_CATALOG_TRANCHE54.length === 320 &&`,\n"
        "  `      OP10M_AGENT05_CHAIN_CATALOG.some((c) => c.chainId.startsWith('op10m_t54_')),`,\n"
        "  `  });`,\n"
    )
    if needle in text:
        text = text.replace(needle, insert + needle)
    text = re.sub(r"chainCount: \d+,", "chainCount: 17480,", text)
    text = re.sub(
        r"OP10M_AGENT05_CHAIN_CATALOG\.length === \d+",
        "OP10M_AGENT05_CHAIN_CATALOG.length === 17480",
        text,
    )
    text = re.sub(
        r"name: '\d+ chain descriptors'",
        "name: '17480 chain descriptors'",
        text,
    )
    path.write_text(text)


def main() -> None:
    copy_tranche_generator()
    patch_aggregate()
    bump_catalog_counts()
    copy_tranche_test()
    patch_bundle_script()
    print("tranche54 wave53 implementation ok")


if __name__ == "__main__":
    main()
