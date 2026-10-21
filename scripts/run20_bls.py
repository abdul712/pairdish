#!/usr/bin/env python3
"""Run-20: BLS average-price pull for the grocery-list page.

Series ids are APU + 0000 (U.S. city average) + the 6-char item code from BLS
"CPI: Average Price Data" Table 1 (verified from
https://www.bls.gov/cpi/factsheets/average-prices.htm, cached 2026-10-21).
Descriptions here are the BLS item descriptions, not guesses.
"""
import json
import subprocess

SERIES = {
    "APU0000701111": ("Flour, white, all purpose, per lb", "lb"),
    "APU0000701312": ("Rice, white, long grain, uncooked, per lb", "lb"),
    "APU0000702111": ("Bread, white, pan, per lb", "lb"),
    "APU0000703112": ("Ground beef, 100% beef, per lb", "lb"),
    "APU0000FF1101": ("Chicken breast, boneless, per lb", "lb"),
    "APU0000708111": ("Eggs, grade A, large, per doz", "dozen"),
    "APU0000709112": ("Milk, fresh, whole, fortified, per gal", "gallon"),
    "APU0000FS1101": ("Butter, in sticks, per lb", "lb"),
    "APU0000711211": ("Bananas, per lb", "lb"),
    "APU0000712112": ("Potatoes, white, per lb", "lb"),
    "APU0000712311": ("Tomatoes, field grown, per lb", "lb"),
    "APU0000715211": ("Sugar, white, all sizes, per lb", "lb"),
    "APU0000717311": ("Coffee, 100% ground roast, all sizes, per lb", "lb"),
}

payload = json.dumps({
    "seriesid": list(SERIES),
    "startyear": "2025",
    "endyear": "2026",
    "annualaverage": False,
})
res = subprocess.run(
    ["curl", "-s", "--max-time", "90", "-X", "POST",
     "-H", "Content-Type: application/json", "-d", payload,
     "https://api.bls.gov/publicAPI/v1/timeseries/data/"],
    capture_output=True, text=True).stdout
data = json.loads(res)
print("status:", data.get("status"), "message:", (data.get("message") or [])[:2])

rows = {}
for s in (data.get("Results") or {}).get("series", []):
    sid = s.get("seriesID")
    obs = {}
    for r in s.get("data", []):
        if r.get("period", "").startswith("M") and r.get("periodName") != "Annual":
            try:
                obs[(int(r["year"]), r["periodName"])] = float(r["value"])
            except (TypeError, ValueError):
                continue  # BLS publishes '-' when the sample is too small
    rows[sid] = obs

print()
print(f"{'series':14s} {'item':46s} {'Sep2026':>8s} {'Sep2025':>8s} {'chg':>7s}")
out = []
for sid, (desc, unit) in SERIES.items():
    obs = rows.get(sid, {})
    a = obs.get((2026, "September"))
    b = obs.get((2025, "September"))
    chg = f"{(a - b) / b * 100:+.1f}%" if (a and b) else "-"
    print(f"{sid:14s} {desc[:46]:46s} {a if a else '-':>8} {b if b else '-':>8} {chg:>7s}")
    if a:
        out.append((sid, desc, unit, a, b, chg))

with open("outreach/bls_prices_run20.txt", "w", encoding="utf-8") as f:
    f.write("BLS average prices, U.S. city average, September 2026 vs September 2025\n")
    f.write("source: BLS Average Price Data (APU series), API pull 2026-10-21\n\n")
    for sid, desc, unit, a, b, chg in out:
        f.write(f"{sid} | {desc} | ${a:.3f} per {unit} | Sep2025 ${b:.3f} | {chg}\n")
print("\nwrote outreach/bls_prices_run20.txt")
