#!/usr/bin/env python3
import json, subprocess, urllib.parse
FOODS = ["Beef, ground, 85% lean meat / 15% fat, raw", "Milk, whole, 3.25% milkfat, with added vitamin D",
         "Oats, raw", "Cheese, cheddar", "Beans, pinto, mature seeds, raw", "Nuts, almonds",
         "Chicken, broilers or fryers, breast, meat only, cooked, roasted", "Rice, white, long-grain, regular, raw, unenriched"]
for q in FOODS:
    url=("https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY"
         f"&query={urllib.parse.quote(q)}&dataType=Foundation,SR%20Legacy&pageSize=3")
    out=subprocess.run(["curl","-s","--max-time","45",url],capture_output=True,text=True).stdout
    try: d=json.loads(out)
    except Exception: print(f"{q}: BAD"); continue
    for f in (d.get("foods") or [])[:2]:
        nut={n.get("nutrientName",""):n.get("value") for n in f.get("foodNutrients",[])}
        print(f"{f.get('fdcId')} | {f.get('description')[:60]} | prot={nut.get('Protein')} | kcal={nut.get('Energy')} | fat={nut.get('Total lipid (fat)')}")
