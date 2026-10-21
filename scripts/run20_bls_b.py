#!/usr/bin/env python3
"""Run-20b: second BLS pull for the four series the grocery-budget article needs
to move from its August 2026 snapshot to September 2026."""
import json
import subprocess

SERIES = {
    "APU0000706111": "Chicken, fresh, whole, per lb",
    "APU0000701322": "Spaghetti and macaroni, per lb",
    "APU0000714233": "Beans, dried, any type, all sizes, per lb",
    "APU0000712211": "Lettuce, iceberg, per lb",
}
payload = json.dumps({"seriesid": list(SERIES), "startyear": "2026", "endyear": "2026"})
res = subprocess.run(
    ["curl", "-s", "--max-time", "90", "-X", "POST",
     "-H", "Content-Type: application/json", "-d", payload,
     "https://api.bls.gov/publicAPI/v1/timeseries/data/"],
    capture_output=True, text=True).stdout
data = json.loads(res)
print("status:", data.get("status"))
for s in (data.get("Results") or {}).get("series", []):
    sid = s.get("seriesID")
    obs = {}
    for r in s.get("data", []):
        try:
            obs[(int(r["year"]), r["periodName"])] = float(r["value"])
        except (TypeError, ValueError):
            continue
    v = obs.get((2026, "September"))
    print(f"{sid} {SERIES.get(sid,'')}: September 2026 = {v}")
