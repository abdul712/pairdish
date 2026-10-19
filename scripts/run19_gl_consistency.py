#!/usr/bin/env python3
"""Run-19 gate: every GL row must equal GI x (carbs - fiber) / 100, rounded."""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
P = ROOT / "src/components/tools/GlycemicIndexGuide.tsx"
ROW = re.compile(
    r"\{ id: '(?P<id>[^']+)', name: '(?P<name>[^']+)',[^}]*?gi: (?P<gi>\d+), gl: (?P<gl>\d+),"
    r"[^}]*?carbs: (?P<carbs>[\d.]+), fiber: (?P<fiber>[\d.]+)"
)
src = P.read_text(encoding="utf-8")
rows = list(ROW.finditer(src))
fails = []
for m in rows:
    gi, gl = int(m.group("gi")), int(m.group("gl"))
    avail = max(float(m.group("carbs")) - float(m.group("fiber")), 0.0)
    want = round(gi * avail / 100)
    if want != gl:
        fails.append((m.group("id"), gi, gl, want))
print(f"rows checked: {len(rows)}")
print(f"GL identity fails: {len(fails)} {fails if fails else ''}")
# band boundaries as documented on the page
assert 'if (gi <= 55) return' in src and 'if (gi <= 69) return' in src, "GI bands moved"
assert 'if (gl <= 10) return' in src, "GL low band moved"
print("band thresholds: GI <=55 / <=69 / high; GL <=10 low  -> present")
sys.exit(1 if fails or len(rows) < 60 else 0)
