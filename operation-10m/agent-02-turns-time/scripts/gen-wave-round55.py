#!/usr/bin/env python3
"""Copy agent-02 wave 54 integration files to wave 55 (O10-247 / c4bbec67)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
TESTS = ROOT / "tests"
BUNDLE = ROOT / "scripts" / "bundle-chunk-for-agent25.ts"
INDEX = SRC / "index.ts"

pairs = [
    ("wave54", "wave55"),
    ("Wave54", "Wave55"),
    ("WAVE54", "WAVE55"),
    ("O10-240", "O10-247"),
    ("5bd043ad", "c4bbec67"),
    ("3_022_056", "3_054_213"),
    ("3022056", "3054213"),
    ("5.14.0", "5.16.0"),
    ("round 54", "round 55"),
    ("round54", "round55"),
]


def xform(text: str) -> str:
    for a, b in pairs:
        text = text.replace(a, b)
    return text


def main() -> None:
    for name in [
        "batch-national-tick-session-wave54-integration-seal.ts",
        "batch-national-tick-session-wave54-integration-export.ts",
        "batch-national-tick-session-wave54-integration-export-compare.ts",
        "batch-national-tick-session-wave54-integration-replay-parity.ts",
    ]:
        src = SRC / name
        dst_name = name.replace("wave54", "wave55")
        dst = SRC / dst_name
        dst.write_text(xform(src.read_text()))

    t54 = (TESTS / "scale-wave-round54.test.ts").read_text()
    (TESTS / "scale-wave-round55.test.ts").write_text(xform(t54))

    idx = INDEX.read_text()
    block = """
export * from './batch-national-tick-session-wave55-integration-seal.js';
export * from './batch-national-tick-session-wave55-integration-export.js';
export * from './batch-national-tick-session-wave55-integration-export-compare.js';
export * from './batch-national-tick-session-wave55-integration-replay-parity.js';
"""
    if "wave55-integration-seal" not in idx:
        needle = "export * from './batch-national-tick-session-wave54-integration-replay-parity.js';\n"
        idx = idx.replace(needle, needle + block)
        INDEX.write_text(idx)

    bt = BUNDLE.read_text()
    if "wave55-integration-seal" not in bt:
        bt = bt.replace(
            "  'src/batch-national-tick-session-wave54-integration-replay-parity.ts',\n",
            "  'src/batch-national-tick-session-wave54-integration-replay-parity.ts',\n"
            "  'src/batch-national-tick-session-wave55-integration-seal.ts',\n"
            "  'src/batch-national-tick-session-wave55-integration-export.ts',\n"
            "  'src/batch-national-tick-session-wave55-integration-export-compare.ts',\n"
            "  'src/batch-national-tick-session-wave55-integration-replay-parity.ts',\n",
        )
        bt = bt.replace("5.14.0", "5.16.0")
        if "agent02_national_tick_session_wave54" in bt and "wave55" not in bt.split(
            "agent02_national_tick_session_wave54"
        )[1][:200]:
            bt = bt.replace(
                "agent02_national_tick_session_wave54_integration_seal",
                "agent02_national_tick_session_wave55_integration_seal",
            )
            bt = bt.replace(
                "national tick session wave 53 O10-240 integration seal 5bd043ad",
                "national tick session wave 54 O10-247 integration seal c4bbec67",
            )
        BUNDLE.write_text(bt)

    print("agent-02 wave55 copy ok")


if __name__ == "__main__":
    main()
