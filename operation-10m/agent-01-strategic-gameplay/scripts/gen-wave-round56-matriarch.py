#!/usr/bin/env python3
"""Generate wave 56 matriarch supremacy tier from wave 55 sovereignty pattern."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
ENGINE = SRC / "engine"
TESTS = ROOT / "tests"

OLD = "Sovereignty"
NEW = "Supremacy"
old_snake = "sovereignty"
new_snake = "supremacy"
old_upper = "SOVEREIGNTY"
new_upper = "SUPREMACY"


def repl(text: str) -> str:
    text = text.replace(f"Matriarch{OLD}", f"Matriarch{NEW}")
    text = text.replace(f"matriarch_{old_snake}", f"matriarch_{new_snake}")
    text = text.replace(f"MATRIARCH_{old_upper}", f"MATRIARCH_{new_upper}")
    text = text.replace(f"coalitionMatriarch{OLD}", f"coalitionMatriarch{NEW}")
    text = text.replace(f"CoalitionMatriarch{OLD}", f"CoalitionMatriarch{NEW}")
    text = text.replace(
        f"min_coalition_matriarch_{old_snake}_streak",
        f"min_coalition_matriarch_{new_snake}_streak",
    )
    text = text.replace(f"minCoalitionMatriarch{OLD}", f"minCoalitionMatriarch{NEW}")
    text = text.replace(f"isMatriarchCoalition{OLD}", f"isMatriarchCoalition{NEW}")
    text = text.replace(f"applyMatriarch{OLD}", f"applyMatriarch{NEW}")
    text = text.replace(f"advanceCoalitionMatriarch{OLD}", f"advanceCoalitionMatriarch{NEW}")
    text = text.replace(f"resetCoalitionMatriarch{OLD}", f"resetCoalitionMatriarch{NEW}")
    text = text.replace(f"coalitionMatriarch{OLD}StreakIssues", f"coalitionMatriarch{NEW}StreakIssues")
    text = text.replace(f"matriarch{OLD}Eligible", f"matriarch{NEW}Eligible")
    text = text.replace(f"matriarch{OLD}RankingBonus", f"matriarch{NEW}RankingBonus")
    text = text.replace(f"sga_coalition_matriarch_{old_snake}_", f"sga_coalition_matriarch_{new_snake}_")
    text = text.replace(f"COALITION_MATRIARCH_{old_upper}_STREAK", f"COALITION_MATRIARCH_{new_upper}_STREAK")
    return text


def insert_after(content: str, needle: str, block: str) -> str:
    if block.strip() in content:
        return content
    idx = content.find(needle)
    if idx == -1:
        raise RuntimeError(f"needle not found: {needle[:80]!r}")
    end = idx + len(needle)
    return content[:end] + block + content[end:]


def copy_engine_pair() -> None:
    for suffix in ("", "-gates"):
        src_name = f"coalition-matriarch-{old_snake}{suffix}.ts"
        dst_name = f"coalition-matriarch-{new_snake}{suffix}.ts"
        text = (ENGINE / src_name).read_text()
        text = text.replace(
            "./coalition-matriarch-omnipotence.ts",
            "./coalition-matriarch-omnipotence.ts",
        )
        text = text.replace(
            "MATRIARCH_COALITION_SUPREMACY_THRESHOLD",
            "MATRIARCH_COALITION_SUPREMACY_THRESHOLD",
        )
        text = text.replace(
            "isMatriarchCoalitionSupremacy",
            "isMatriarchCoalitionSupremacy",
        )
        text = text.replace(
            "coalitionMatriarchSovereigntyStreakDays",
            "coalitionMatriarchSovereigntyStreakDays",
        )
        text = text.replace(
            "matriarchSovereigntyEligible",
            "matriarchSovereigntyEligible",
        )
        text = text.replace(
            "after matriarch supremacy is sustained",
            "after matriarch supremacy is sustained",
        )
        text = text.replace(
            "Matriarch omnipotence streak",
            "Matriarch omnipotence streak",
        )
        text = repl(text)
        (ENGINE / dst_name).write_text(text)


def main() -> None:
    copy_engine_pair()

    t54 = (TESTS / "scale-wave-round55.test.ts").read_text()
    t55 = t54
    t55 = t55.replace("round 56", "round 56")
    t55 = t55.replace("round56", "round56")
    t55 = repl(t55)
    t55 = t55.replace("save v54", "save v54")
    t55 = t55.replace("StrategicGameplaySaveV53", "StrategicGameplaySaveV54")
    t55 = t55.replace("O10-254", "O10-254")
    t55 = t55.replace(
        "matriarch coalition supremacy",
        "matriarch coalition sovereignty",
    )
    t55 = t55.replace("matriarch supremacy", "matriarch sovereignty")
    t55 = t55.replace(
        "isMatriarchCoalitionSupremacy",
        "isMatriarchCoalitionSupremacy",
    )
    t55 = t55.replace(
        "MATRIARCH_COALITION_SUPREMACY_THRESHOLD",
        "MATRIARCH_COALITION_SOVEREIGNTY_THRESHOLD",
    )
    (TESTS / "scale-wave-round56.test.ts").write_text(t55)

    catalog = ROOT / "src/catalog/strategic-action-catalog.ts"
    cat = catalog.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in cat:
        m = re.search(
            r"  'sga_coalition_matriarch_sovereignty_charter': \{.*?\n  \},\n  'sga_coalition_matriarch_sovereignty_covenant': \{.*?\n  \},",
            cat,
            re.S,
        )
        if not m:
            raise RuntimeError("catalog omnipotence block not found")
        block = repl(m.group(0))
        block = block.replace("minCoalitionMatriarchSovereigntyStreakDays: 4", "minCoalitionMatriarchSovereigntyStreakDays: 4")
        block = block.replace("minCoalitionBalanceIndex: 118", "minCoalitionBalanceIndex: 120")
        block = block.replace("treasuryCost: 218_000", "treasuryCost: 220_000")
        block = block.replace("cashCost: 82_000", "cashCost: 84_000")
        block = block.replace("cashDelta: -82_000", "cashDelta: -84_000")
        block = block.replace("treasuryDelta: -218_000", "treasuryDelta: -220_000")
        block = block.replace("cashCost: 63_000", "cashCost: 65_000")
        block = block.replace("treasuryCost: 152_000", "treasuryCost: 154_000")
        block = block.replace("cashDelta: -63_000", "cashDelta: -65_000")
        block = block.replace("treasuryDelta: -152_000", "treasuryDelta: -154_000")
        cat = cat.replace(m.group(0), m.group(0) + "\n" + block)
        catalog.write_text(cat)

    bal = ENGINE / "coalition-balance.ts"
    btext = bal.read_text()
    if f"matriarch{NEW}RankingBonus" not in btext:
        bonus = btext.split("export function matriarchSovereigntyRankingBonus")[1]
        bonus_block = "export function matriarchSovereigntyRankingBonus" + bonus.split("\n}\n")[0] + "\n}\n"
        new_bonus = repl(bonus_block).replace("return 47;", "return 48;")
        btext = btext.rstrip() + "\n\n\n" + new_bonus
        bal.write_text(btext)

    cal = ENGINE / "strategic-calendar.ts"
    ctext = cal.read_text()
    imp = (
        "import {\n"
        "  advanceCoalitionMatriarchSovereigntyStreak,\n"
        "  applyMatriarchSovereigntyMandateBonus,\n"
        "} from './coalition-matriarch-sovereignty.ts';\n"
    )
    if "coalition-matriarch-sovereignty" not in ctext:
        ctext = insert_after(
            ctext,
            "} from './coalition-matriarch-sovereignty.ts';\n",
            imp,
        )
        ctext = insert_after(
            ctext,
            "  next = applyMatriarchSovereigntyMandateBonus(next, daysAdvanced);\n",
            "  next = advanceCoalitionMatriarchSovereigntyStreak(next, daysAdvanced);\n"
            "  next = applyMatriarchSovereigntyMandateBonus(next, daysAdvanced);\n",
        )
        cal.write_text(ctext)

    eng = ENGINE / "strategic-gameplay-engine.ts"
    etext = eng.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in etext:
        etext = insert_after(
            etext,
            "  if (action.id === 'sga_coalition_matriarch_sovereignty_covenant') {\n"
            "    nextState = resetCoalitionMatriarchSovereigntyStreak(nextState);\n"
            "  }\n",
            "  if (action.id === 'sga_coalition_matriarch_sovereignty_charter') {\n"
            "    nextState = resetCoalitionMatriarchSovereigntyStreak(nextState);\n"
            "  }\n"
            "  if (action.id === 'sga_coalition_matriarch_sovereignty_covenant') {\n"
            "    nextState = resetCoalitionMatriarchSovereigntyStreak(nextState);\n"
            "  }\n",
        )
        etext = insert_after(
            etext,
            "import { resetCoalitionMatriarchSovereigntyStreak } from './coalition-matriarch-sovereignty.ts';\n",
            "import { resetCoalitionMatriarchSovereigntyStreak } from './coalition-matriarch-sovereignty.ts';\n",
        )
        if "coalitionMatriarchSovereigntyStreakDays: 0" not in etext:
            etext = etext.replace(
                "coalitionMatriarchSovereigntyStreakDays: 0,\n",
                "coalitionMatriarchSovereigntyStreakDays: 0,\n    coalitionMatriarchSovereigntyStreakDays: 0,\n",
                1,
            )
        eng.write_text(etext)

    val = ENGINE / "validation.ts"
    vtext = val.read_text()
    if "coalitionMatriarchSovereigntyStreakIssues" not in vtext:
        vtext = insert_after(
            vtext,
            "import { coalitionMatriarchSovereigntyStreakIssues } from './coalition-matriarch-sovereignty-gates.ts';\n",
            "import { coalitionMatriarchSovereigntyStreakIssues } from './coalition-matriarch-sovereignty-gates.ts';\n",
        )
        vtext = insert_after(
            vtext,
            "    issues.push(...coalitionMatriarchSovereigntyStreakIssues(action, state));\n",
            "    issues.push(...coalitionMatriarchSovereigntyStreakIssues(action, state));\n",
        )
        val.write_text(vtext)

    tb = ENGINE / "turn-briefing.ts"
    tbt = tb.read_text()
    if "isMatriarchCoalitionSovereignty" not in tbt:
        tbt = insert_after(
            tbt,
            "import { isMatriarchCoalitionSupremacy } from './coalition-matriarch-sovereignty.ts';\n",
            "import { isMatriarchCoalitionSovereignty } from './coalition-matriarch-sovereignty.ts';\n",
        )
        tbt = insert_after(
            tbt,
            "    coalitionMatriarchSovereigntyStreakDays: state.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
            "    matriarchSovereigntyActive: isMatriarchCoalitionSovereignty(state),\n"
            "    coalitionMatriarchSovereigntyStreakDays: state.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
        )
        tb.write_text(tbt)

    sig = SRC / "integrations/external-coalition-turn-signals.ts"
    st = sig.read_text()
    if "coalitionMatriarchSovereigntyStreakDays" not in st:
        st = insert_after(
            st,
            "import { isMatriarchCoalitionSupremacy } from '../engine/coalition-matriarch-sovereignty.ts';\n",
            "import { isMatriarchCoalitionSovereignty } from '../engine/coalition-matriarch-sovereignty.ts';\n",
        )
        st = insert_after(
            st,
            "  coalitionMatriarchSovereigntyStreakDays: number;\n",
            "  matriarchSovereigntyActive: boolean;\n  coalitionMatriarchSovereigntyStreakDays: number;\n",
        )
        st = insert_after(
            st,
            "    coalitionMatriarchSovereigntyStreakDays: state.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
            "    matriarchSovereigntyActive: isMatriarchCoalitionSovereignty(state),\n"
            "    coalitionMatriarchSovereigntyStreakDays: state.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
        )
        st = insert_after(
            st,
            "    coalitionMatriarchSovereigntyStreakDays: raw?.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
            "    matriarchSovereigntyActive: raw?.matriarchSovereigntyActive ?? false,\n"
            "    coalitionMatriarchSovereigntyStreakDays: raw?.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
        )
        sig.write_text(st)

    sa = SRC / "types/strategic-action.ts"
    sat = sa.read_text()
    if f"min_coalition_matriarch_{new_snake}_streak" not in sat:
        sat = insert_after(
            sat,
            "  | { kind: 'min_coalition_matriarch_sovereignty_streak'; minDays: number };",
            "\n  | { kind: 'min_coalition_matriarch_sovereignty_streak'; minDays: number };",
        )
        sat = insert_after(
            sat,
            "  minCoalitionMatriarchSovereigntyStreakDays?: number;",
            "\n  /** Action requires matriarch sovereignty streak after matriarch supremacy. */\n  minCoalitionMatriarchSovereigntyStreakDays?: number;",
        )
        sat = insert_after(
            sat,
            "  coalitionMatriarchSovereigntyStreakDays?: number;\n",
            "  coalitionMatriarchSovereigntyStreakDays?: number;\n",
        )
        sa.write_text(sat)

    cm = SRC / "types/coalition-mandate.ts"
    cmt = cm.read_text()
    if "coalitionMatriarchSovereigntyStreakDays" not in cmt:
        cmt = insert_after(
            cmt,
            "  coalitionMatriarchSovereigntyStreakDays: number;\n",
            "  matriarchSovereigntyActive: boolean;\n  coalitionMatriarchSovereigntyStreakDays: number;\n",
        )
        cm.write_text(cmt)

    idx = ROOT / "src/index.ts"
    it = idx.read_text()
    if "coalition-matriarch-sovereignty.ts" not in it:
        block = """
export { coalitionMatriarchSovereigntyStreakIssues } from './engine/coalition-matriarch-sovereignty-gates.ts';
export {
  MATRIARCH_COALITION_SOVEREIGNTY_THRESHOLD,
  advanceCoalitionMatriarchSovereigntyStreak,
  applyMatriarchSovereigntyMandateBonus,
  isMatriarchCoalitionSovereignty,
  resetCoalitionMatriarchSovereigntyStreak,
} from './engine/coalition-matriarch-sovereignty.ts';
"""
        it = insert_after(
            it,
            "} from './engine/coalition-matriarch-sovereignty.ts';\n",
            block,
        )
        it = it.replace("5.16.0", "5.16.0")
        idx.write_text(it)

    rec = ENGINE / "strategic-recommendations.ts"
    rt = rec.read_text()
    if "matriarchSovereigntyRankingBonus" not in rt:
        rt = insert_after(
            rt,
            "  matriarchSovereigntyRankingBonus,\n",
            "  matriarchSovereigntyRankingBonus,\n",
        )
        rt = insert_after(
            rt,
            "        matriarchSovereigntyRankingBonus(state, action),\n",
            "        matriarchSovereigntyRankingBonus(state, action),\n",
        )
        rec.write_text(rt)

    save = ENGINE / "strategic-save.ts"
    stext = save.read_text()
    if "StrategicGameplaySaveV54" not in stext:
        stext = insert_after(
            stext,
            "export interface StrategicGameplaySaveV53 extends Omit<StrategicGameplaySaveV52, 'version'> {\n"
            "  version: 53;\n"
            "  coalitionMatriarchSovereigntyStreakDays: number;\n"
            "}\n",
            "\nexport interface StrategicGameplaySaveV54 extends Omit<StrategicGameplaySaveV53, 'version'> {\n"
            "  version: 54;\n"
            "  coalitionMatriarchSupremacyStreakDays: number;\n"
            "}\n",
        )
        stext = stext.replace(
            "  | StrategicGameplaySaveV53;",
            "  | StrategicGameplaySaveV53\n  | StrategicGameplaySaveV54;",
        )
        stext = stext.replace(
            "): StrategicGameplaySaveV53 {",
            "): StrategicGameplaySaveV54 {",
        )
        stext = stext.replace("    version: 53,", "    version: 54,", 1)
        stext = insert_after(
            stext,
            "    coalitionMatriarchSovereigntyStreakDays: state.coalitionMatriarchSovereigntyStreakDays ?? 0,\n  };\n}",
            "    coalitionMatriarchSupremacyStreakDays: state.coalitionMatriarchSupremacyStreakDays ?? 0,\n",
        )
        stext = insert_after(
            stext,
            "    coalitionMatriarchSovereigntyStreakDays: (save as StrategicGameplaySaveV53).coalitionMatriarchSovereigntyStreakDays,\n  };\n  }",
            "    coalitionMatriarchSupremacyStreakDays: 0,\n",
        )
        v53_block = "  if (save.version === 53) {"
        if "save.version === 54" not in stext:
            idx53 = stext.find(v53_block)
            if idx53 == -1:
                raise RuntimeError("v53 deserialize block missing")
            end_marker = "  if (save.version === 52) {"
            v53_section = stext[idx53 : stext.find(end_marker, idx53)]
            v54_section = v53_section.replace("save.version === 53", "save.version === 54")
            v54_section = v54_section.replace(
                "(save as StrategicGameplaySaveV53).coalitionMatriarchSovereigntyStreakDays,",
                "(save as StrategicGameplaySaveV54).coalitionMatriarchSovereigntyStreakDays,\n"
                "    coalitionMatriarchSupremacyStreakDays: (save as StrategicGameplaySaveV54).coalitionMatriarchSupremacyStreakDays,",
            )
            stext = stext.replace(v53_section, v54_section + v53_section)
        save.write_text(stext)

    bundle = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    bt = bundle.read_text()
    if "coalition-matriarch-supremacy.ts" not in bt:
        bt = insert_after(
            bt,
            "  'src/engine/coalition-matriarch-sovereignty-gates.ts',\n",
            "  'src/engine/coalition-matriarch-supremacy.ts',\n"
            "  'src/engine/coalition-matriarch-supremacy-gates.ts',\n",
        )
    bt = bt.replace("5.15.0", "5.16.0")
    bundle.write_text(bt)

    cj = TESTS / "commitment-journal.test.ts"
    cjt = cj.read_text()
    cjt = re.sub(r"toBe\(\d+\)", "toBe(112)", cjt, count=1)
    cj.write_text(cjt)

    print("gen-wave-round56-matriarch: ok")


if __name__ == "__main__":
    main()
