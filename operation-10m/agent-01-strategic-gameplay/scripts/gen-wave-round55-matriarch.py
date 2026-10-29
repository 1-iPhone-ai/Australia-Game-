#!/usr/bin/env python3
"""Generate wave 55 matriarch sovereignty tier from wave 54 omnipotence pattern."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
ENGINE = SRC / "engine"
TESTS = ROOT / "tests"

OLD = "Omnipotence"
NEW = "Sovereignty"
old_snake = "omnipotence"
new_snake = "sovereignty"
old_upper = "OMNIPOTENCE"
new_upper = "SOVEREIGNTY"


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
            "./coalition-matriarch-deification.ts",
            "./coalition-matriarch-omnipotence.ts",
        )
        text = text.replace(
            "MATRIARCH_COALITION_DEIFICATION_THRESHOLD",
            "MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD",
        )
        text = text.replace(
            "isMatriarchCoalitionDeification",
            "isMatriarchCoalitionOmnipotence",
        )
        text = text.replace(
            "coalitionMatriarchDeificationStreakDays",
            "coalitionMatriarchOmnipotenceStreakDays",
        )
        text = text.replace(
            "matriarchDeificationEligible",
            "matriarchOmnipotenceEligible",
        )
        text = text.replace(
            "after matriarch deification is sustained",
            "after matriarch omnipotence is sustained",
        )
        text = text.replace(
            "Matriarch deification streak",
            "Matriarch omnipotence streak",
        )
        text = repl(text)
        (ENGINE / dst_name).write_text(text)


def main() -> None:
    copy_engine_pair()

    t54 = (TESTS / "scale-wave-round54.test.ts").read_text()
    t55 = t54
    t55 = t55.replace("round 54", "round 55")
    t55 = t55.replace("round54", "round55")
    t55 = repl(t55)
    t55 = t55.replace("save v52", "save v53")
    t55 = t55.replace("StrategicGameplaySaveV52", "StrategicGameplaySaveV53")
    t55 = t55.replace("O10-240", "O10-247")
    t55 = t55.replace(
        "matriarch coalition omnipotence",
        "matriarch coalition sovereignty",
    )
    t55 = t55.replace("matriarch omnipotence", "matriarch sovereignty")
    t55 = t55.replace(
        "isMatriarchCoalitionOmnipotence",
        "isMatriarchCoalitionSovereignty",
    )
    t55 = t55.replace(
        "MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD",
        "MATRIARCH_COALITION_SOVEREIGNTY_THRESHOLD",
    )
    (TESTS / "scale-wave-round55.test.ts").write_text(t55)

    catalog = ROOT / "src/catalog/strategic-action-catalog.ts"
    cat = catalog.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in cat:
        m = re.search(
            r"  'sga_coalition_matriarch_omnipotence_charter': \{.*?\n  \},\n  'sga_coalition_matriarch_omnipotence_covenant': \{.*?\n  \},",
            cat,
            re.S,
        )
        if not m:
            raise RuntimeError("catalog omnipotence block not found")
        block = repl(m.group(0))
        block = block.replace("minCoalitionMatriarchOmnipotenceStreakDays: 4", "minCoalitionMatriarchOmnipotenceStreakDays: 4")
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
        bonus = btext.split("export function matriarchOmnipotenceRankingBonus")[1]
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
            "} from './coalition-matriarch-omnipotence.ts';\n",
            imp,
        )
        ctext = insert_after(
            ctext,
            "  next = applyMatriarchOmnipotenceMandateBonus(next, daysAdvanced);\n",
            "  next = advanceCoalitionMatriarchSovereigntyStreak(next, daysAdvanced);\n"
            "  next = applyMatriarchSovereigntyMandateBonus(next, daysAdvanced);\n",
        )
        cal.write_text(ctext)

    eng = ENGINE / "strategic-gameplay-engine.ts"
    etext = eng.read_text()
    if f"sga_coalition_matriarch_{new_snake}_charter" not in etext:
        etext = insert_after(
            etext,
            "  if (action.id === 'sga_coalition_matriarch_omnipotence_covenant') {\n"
            "    nextState = resetCoalitionMatriarchOmnipotenceStreak(nextState);\n"
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
            "import { resetCoalitionMatriarchOmnipotenceStreak } from './coalition-matriarch-omnipotence.ts';\n",
            "import { resetCoalitionMatriarchSovereigntyStreak } from './coalition-matriarch-sovereignty.ts';\n",
        )
        if "coalitionMatriarchSovereigntyStreakDays: 0" not in etext:
            etext = etext.replace(
                "coalitionMatriarchOmnipotenceStreakDays: 0,\n",
                "coalitionMatriarchOmnipotenceStreakDays: 0,\n    coalitionMatriarchSovereigntyStreakDays: 0,\n",
                1,
            )
        eng.write_text(etext)

    val = ENGINE / "validation.ts"
    vtext = val.read_text()
    if "coalitionMatriarchSovereigntyStreakIssues" not in vtext:
        vtext = insert_after(
            vtext,
            "import { coalitionMatriarchOmnipotenceStreakIssues } from './coalition-matriarch-omnipotence-gates.ts';\n",
            "import { coalitionMatriarchSovereigntyStreakIssues } from './coalition-matriarch-sovereignty-gates.ts';\n",
        )
        vtext = insert_after(
            vtext,
            "    issues.push(...coalitionMatriarchOmnipotenceStreakIssues(action, state));\n",
            "    issues.push(...coalitionMatriarchSovereigntyStreakIssues(action, state));\n",
        )
        val.write_text(vtext)

    tb = ENGINE / "turn-briefing.ts"
    tbt = tb.read_text()
    if "isMatriarchCoalitionSovereignty" not in tbt:
        tbt = insert_after(
            tbt,
            "import { isMatriarchCoalitionOmnipotence } from './coalition-matriarch-omnipotence.ts';\n",
            "import { isMatriarchCoalitionSovereignty } from './coalition-matriarch-sovereignty.ts';\n",
        )
        tbt = insert_after(
            tbt,
            "    coalitionMatriarchOmnipotenceStreakDays: state.coalitionMatriarchOmnipotenceStreakDays ?? 0,\n",
            "    matriarchSovereigntyActive: isMatriarchCoalitionSovereignty(state),\n"
            "    coalitionMatriarchSovereigntyStreakDays: state.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
        )
        tb.write_text(tbt)

    sig = SRC / "integrations/external-coalition-turn-signals.ts"
    st = sig.read_text()
    if "coalitionMatriarchSovereigntyStreakDays" not in st:
        st = insert_after(
            st,
            "import { isMatriarchCoalitionOmnipotence } from '../engine/coalition-matriarch-omnipotence.ts';\n",
            "import { isMatriarchCoalitionSovereignty } from '../engine/coalition-matriarch-sovereignty.ts';\n",
        )
        st = insert_after(
            st,
            "  coalitionMatriarchOmnipotenceStreakDays: number;\n",
            "  matriarchSovereigntyActive: boolean;\n  coalitionMatriarchSovereigntyStreakDays: number;\n",
        )
        st = insert_after(
            st,
            "    coalitionMatriarchOmnipotenceStreakDays: state.coalitionMatriarchOmnipotenceStreakDays ?? 0,\n",
            "    matriarchSovereigntyActive: isMatriarchCoalitionSovereignty(state),\n"
            "    coalitionMatriarchSovereigntyStreakDays: state.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
        )
        st = insert_after(
            st,
            "    coalitionMatriarchOmnipotenceStreakDays: raw?.coalitionMatriarchOmnipotenceStreakDays ?? 0,\n",
            "    matriarchSovereigntyActive: raw?.matriarchSovereigntyActive ?? false,\n"
            "    coalitionMatriarchSovereigntyStreakDays: raw?.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
        )
        sig.write_text(st)

    sa = SRC / "types/strategic-action.ts"
    sat = sa.read_text()
    if f"min_coalition_matriarch_{new_snake}_streak" not in sat:
        sat = insert_after(
            sat,
            "  | { kind: 'min_coalition_matriarch_omnipotence_streak'; minDays: number };",
            "\n  | { kind: 'min_coalition_matriarch_sovereignty_streak'; minDays: number };",
        )
        sat = insert_after(
            sat,
            "  minCoalitionMatriarchOmnipotenceStreakDays?: number;",
            "\n  /** Action requires matriarch sovereignty streak after matriarch omnipotence. */\n  minCoalitionMatriarchSovereigntyStreakDays?: number;",
        )
        sat = insert_after(
            sat,
            "  coalitionMatriarchOmnipotenceStreakDays?: number;\n",
            "  coalitionMatriarchSovereigntyStreakDays?: number;\n",
        )
        sa.write_text(sat)

    cm = SRC / "types/coalition-mandate.ts"
    cmt = cm.read_text()
    if "coalitionMatriarchSovereigntyStreakDays" not in cmt:
        cmt = insert_after(
            cmt,
            "  coalitionMatriarchOmnipotenceStreakDays: number;\n",
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
            "} from './engine/coalition-matriarch-omnipotence.ts';\n",
            block,
        )
        it = it.replace("5.14.0", "5.15.0")
        idx.write_text(it)

    rec = ENGINE / "strategic-recommendations.ts"
    rt = rec.read_text()
    if "matriarchSovereigntyRankingBonus" not in rt:
        rt = insert_after(
            rt,
            "  matriarchOmnipotenceRankingBonus,\n",
            "  matriarchSovereigntyRankingBonus,\n",
        )
        rt = insert_after(
            rt,
            "        matriarchOmnipotenceRankingBonus(state, action),\n",
            "        matriarchSovereigntyRankingBonus(state, action),\n",
        )
        rec.write_text(rt)

    save = ENGINE / "strategic-save.ts"
    stext = save.read_text()
    if "StrategicGameplaySaveV53" not in stext:
        stext = insert_after(
            stext,
            "export interface StrategicGameplaySaveV52 extends Omit<StrategicGameplaySaveV51, 'version'> {\n"
            "  version: 52;\n"
            "  coalitionMatriarchOmnipotenceStreakDays: number;\n"
            "}\n",
            "\nexport interface StrategicGameplaySaveV53 extends Omit<StrategicGameplaySaveV52, 'version'> {\n"
            "  version: 53;\n"
            "  coalitionMatriarchSovereigntyStreakDays: number;\n"
            "}\n",
        )
        stext = stext.replace(
            "  | StrategicGameplaySaveV52;",
            "  | StrategicGameplaySaveV52\n  | StrategicGameplaySaveV53;",
        )
        stext = stext.replace(
            "): StrategicGameplaySaveV52 {",
            "): StrategicGameplaySaveV53 {",
        )
        stext = stext.replace("    version: 52,", "    version: 53,", 1)
        stext = insert_after(
            stext,
            "    coalitionMatriarchOmnipotenceStreakDays: state.coalitionMatriarchOmnipotenceStreakDays ?? 0,\n  };\n}",
            "    coalitionMatriarchSovereigntyStreakDays: state.coalitionMatriarchSovereigntyStreakDays ?? 0,\n",
        )
        stext = insert_after(
            stext,
            "    coalitionMatriarchOmnipotenceStreakDays: (save as StrategicGameplaySaveV52).coalitionMatriarchOmnipotenceStreakDays,\n  };\n  }",
            "    coalitionMatriarchSovereigntyStreakDays: 0,\n",
        )
        v52_block = "  if (save.version === 52) {"
        if "save.version === 53" not in stext:
            idx52 = stext.find(v52_block)
            if idx52 == -1:
                raise RuntimeError("v52 deserialize block missing")
            end_marker = "  if (save.version === 51) {"
            v52_section = stext[idx52 : stext.find(end_marker, idx52)]
            v53_section = v52_section.replace("save.version === 52", "save.version === 53")
            v53_section = v53_section.replace(
                "(save as StrategicGameplaySaveV52).coalitionMatriarchOmnipotenceStreakDays,",
                "(save as StrategicGameplaySaveV53).coalitionMatriarchOmnipotenceStreakDays,\n"
                "    coalitionMatriarchSovereigntyStreakDays: (save as StrategicGameplaySaveV53).coalitionMatriarchSovereigntyStreakDays,",
            )
            stext = stext.replace(v52_section, v53_section + v52_section)
        save.write_text(stext)

    bundle = ROOT / "scripts/bundle-chunk-for-agent25.ts"
    bt = bundle.read_text()
    if "coalition-matriarch-sovereignty.ts" not in bt:
        bt = insert_after(
            bt,
            "  'src/engine/coalition-matriarch-omnipotence-gates.ts',\n",
            "  'src/engine/coalition-matriarch-sovereignty.ts',\n"
            "  'src/engine/coalition-matriarch-sovereignty-gates.ts',\n",
        )
    bt = bt.replace("5.14.0", "5.15.0")
    bundle.write_text(bt)

    cj = TESTS / "commitment-journal.test.ts"
    cjt = cj.read_text()
    cjt = re.sub(r"toBe\(\d+\)", "toBe(112)", cjt, count=1)
    cj.write_text(cjt)

    print("gen-wave-round55-matriarch: ok")


if __name__ == "__main__":
    main()
