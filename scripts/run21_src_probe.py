#!/usr/bin/env python3
"""Run-21 source probe: UA ladder fetch + phrase assertion, per cited URL."""
import re, subprocess, sys

UA_BROWSER=("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36")
UA_CURL="curl/8.5.0"

TARGETS=[
 ("https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart",["165","145","Safe Minimum Internal Temperature"]),
 ("https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/refrigeration",["refrigerator","freezer"]),
 ("https://www.fda.gov/consumers/consumer-updates/food-safety-home",["refrigerator"]),
 ("https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures",["165","145"]),
 ("https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts",["refrigerator","freezer"]),
 ("https://www.foodsafety.gov/food-safety-charts/food-safety-during-power-outage",["4 hours","40"]),
]

def fetch(url,ua):
    cmd=["curl","-sL","--compressed","--max-time","40","-A",ua,"-w","\n@@STATUS:%{http_code}",url]
    out=subprocess.run(cmd,capture_output=True,text=True).stdout
    m=re.search(r"\n@@STATUS:(\d+)$",out)
    return (int(m.group(1)) if m else 0), (out[:m.start()] if m else out)

for url,phrases in TARGETS:
    for ua in (UA_BROWSER,UA_CURL):
        st,body=fetch(url,ua)
        hits=[p for p in phrases if p.lower() in body.lower()]
        print(f"{st} {len(body):7d} {ua.split('/')[0]:8s} hits={len(hits)}/{len(phrases)} {url}")
        if st==200 and len(hits)==len(phrases):
            break
