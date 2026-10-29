#!/usr/bin/env python3
"""Copy agent-02 wave 53 integration files to wave 54 (O10-240 / 5bd043ad)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
TESTS = ROOT / "tests"
BUNDLE = ROOT / "scripts" / "bundle-chunk-for-agent25.ts"
INDEX = SRC / "index.ts"

pairs = [
    ("wave53", "wave54"),
    ("Wave53", "Wave54"),
    ("WAVE53", "WAVE54"),
    ("O10-237", "O10-240"),
    ("51039c5e", "5bd043ad"),
    ("2_979_928", "3_022_056"),
    ("2979928", "3022056"),
    ("5.12.0", "5.14.0"),
    ("round 53", "round 54"),
    ("round53", "round54"),
]


def xform(text: str) -> str:
    for a, b in pairs:
        text = text.replace(a, b)
    return text


def main() -> None:
    for name in [
        "batch-national-tick-session-wave53-integration-seal.ts",
        "batch-national-tick-session-wave53-integration-export.ts",
        "batch-national-tick-session-wave53-integration-export-compare.ts",
        "batch-national-tick-session-wave53-integration-replay-parity.ts",
    ]:
        src = SRC / name
        dst_name = name.replace("wave53", "wave54")
        dst = SRC / dst_name
        dst.write_text(xform(src.read_text()))

    t53 = (TESTS / "scale-wave-round53.test.ts").read_text()
    (TESTS / "scale-wave-round54.test.ts").write_text(xform(t53))

    idx = INDEX.read_text()
    block = """
export * from './batch-national-tick-session-wave54-integration-seal.js';
export * from './batch-national-tick-session-wave54-integration-export.js';
export * from './batch-national-tick-session-wave54-integration-export-compare.js';
export * from './batch-national-tick-session-wave54-integration-replay-parity.js';
"""
    if "wave54-integration-seal" not in idx:
        needle = "export * from './batch-national-tick-session-wave53-integration-replay-parity.js';\n"
        idx = idx.replace(needle, needle + block)
        INDEX.write_text(idx)

    bt = BUNDLE.read_text()
    if "wave54-integration-seal" not in bt:
        bt = bt.replace(
            "  'src/batch-national-tick-session-wave53-integration-replay-parity.ts',\n",
            "  'src/batch-national-tick-session-wave53-integration-replay-parity.ts',\n"
            "  'src/batch-national-tick-session-wave54-integration-seal.ts',\n"
            "  'src/batch-national-tick-session-wave54-integration-export.ts',\n"
            "  'src/batch-national-tick-session-wave54-integration-export-compare.ts',\n"
            "  'src/batch-national-tick-session-wave54-integration-replay-parity.ts',\n",
        )
        bt = bt.replace("5.12.0", "5.14.0")
        if "agent02_national_tick_session_wave53" in bt and "wave54" not in bt.split(
            "agent02_national_tick_session_wave53"
        )[1][:200]:
            bt = bt.replace(
                "agent02_national_tick_session_wave53_integration_seal",
                "agent02_national_tick_session_wave54_integration_seal",
            )
            bt = bt.replace(
                "national tick session wave 52 O10-237 integration seal 51039c5e",
                "national tick session wave 53 O10-240 integration seal 5bd043ad",
            )
        BUNDLE.write_text(bt)

    print("agent-02 wave54 copy ok")


if __name__ == "__main__":
    main()
