#!/bin/bash
# Verify live pairdish article pages: gtag, credits, no FAQ, sources, tables, word count
for slug in what-to-serve-with-roasted-potatoes what-to-serve-with-fried-fish what-to-serve-with-pesto-chicken; do
  f=/tmp/pd_live_$slug.html
  curl -s --max-time 20 "https://pairdish.com/articles/$slug" -o "$f"
  echo "== $slug =="
  echo "gtag refs: $(grep -c googletagmanager "$f")"
  echo "photo credit: $(grep -o 'Photo: [A-Za-z][^<]*' "$f" | head -1)"
  echo "FAQ remnant: $(grep -ci 'Frequently asked' "$f")"
  echo "FSIS/MyPlate sources: $(grep -c -E 'fsis.usda.gov|myplate.gov' "$f")"
  echo "tables: $(grep -c '<table' "$f")"
  echo "FAQPage JSON-LD: $(grep -c 'FAQPage' "$f")"
  python3 - "$f" <<'PYEOF'
import sys, re, html
t = html.unescape(open(sys.argv[1], encoding='utf-8', errors='replace').read())
t = re.sub(r'<script.*?</script>', '', t, flags=re.S)
t = re.sub(r'<style.*?</style>', '', t, flags=re.S)
t = re.sub(r'<[^>]+>', ' ', t)
print('rendered words:', len(t.split()))
PYEOF
done