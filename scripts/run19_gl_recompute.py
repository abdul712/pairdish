#!/usr/bin/env python3
"""Run-19: make the glycemic-index tool's GL column reproducible.

The calculator displays a static `gl` per food while also displaying `gi`,
`carbs` and `fiber`. Published GL is GI x available carbohydrate / 100
(available carbohydrate = total carbohydrate - fibre). 44 of 62 stored rows
did not satisfy that identity, so a reader who did the arithmetic got a
different number from the tool. This rewrites every `gl:` from its own row's
inputs and prints the diff.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
P = ROOT / "src/components/tools/GlycemicIndexGuide.tsx"
ROW = re.compile(
    r"\{ id: '(?P<id>[^']+)', name: '(?P<name>[^']+)',[^}]*?gi: (?P<gi>\d+), gl: (?P<gl>\d+),"
    r"[^}]*?carbs: (?P<carbs>[\d.]+), fiber: (?P<fiber>[\d.]+)"
)


def main(write: bool) -> int:
    src = P.read_text(encoding="utf-8")
    out = src
    changed = 0
    for m in ROW.finditer(src):
        gi, gl = int(m.group("gi")), int(m.group("gl"))
        avail = max(float(m.group("carbs")) - float(m.group("fiber")), 0.0)
        new = round(gi * avail / 100)
        if new != gl:
            old = f"gi: {gi}, gl: {gl},"
            new_s = f"gi: {gi}, gl: {new},"
            # scope the substitution to this row's own text
            row_text = m.group(0)
            out = out.replace(row_text, row_text.replace(old, new_s, 1), 1)
            print(f"  {m.group('id'):18s} {m.group('name'):24s} {gl:3d} -> {new:3d}")
            changed += 1
    print(f"changed {changed} rows")
    if write and changed:
        P.write_text(out, encoding="utf-8")
        print(f"wrote {P}")
    return 0


if __name__ == "__main__":
    sys.exit(main("--write" in sys.argv))
