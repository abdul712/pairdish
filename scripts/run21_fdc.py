#!/usr/bin/env python3
"""USDA FoodData Central pull (DEMO_KEY): per-100 g protein for candidate foods."""
import json, subprocess, urllib.parse

FOODS = ["chicken breast raw", "eggs whole raw", "lentils raw", "greek yogurt plain",
         "tofu firm", "ground beef 85% lean raw", "black beans raw", "salmon raw",
         "cottage cheese", "peanut butter", "milk whole", "oats raw"]

for q in FOODS:
    url = ("https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY"
           f"&query={urllib.parse.quote(q)}&dataType=Foundation,SR%20Legacy&pageSize=3")
    out = subprocess.run(["curl","-s","--max-time","45",url],capture_output=True,text=True).stdout
    try:
        d = json.loads(out)
    except Exception:
        print(f"{q}: BAD JSON {out[:120]}"); continue
    foods = d.get("foods") or []
    if not foods:
        print(f"{q}: no results"); continue
    f = foods[0]
    nut = {n.get("nutrientName",""): n.get("value") for n in f.get("foodNutrients", [])}
    prot = nut.get("Protein")
    kcal = nut.get("Energy")
    print(f"{f.get('fdcId')} | {f.get('description')} | protein={prot} g | energy={kcal} kcal | {q}")
