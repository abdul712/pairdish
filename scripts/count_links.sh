#!/bin/bash
# Count structural elements in the three live article pages
for slug in what-to-serve-with-roasted-potatoes what-to-serve-with-fried-fish what-to-serve-with-pesto-chicken; do
  f=/tmp/pd_live_$slug.html
  tables=$(grep -o '<table' "$f" | wc -l)
  tool_links=$(grep -o 'href="/tools/[^"]*"' "$f" | wc -l)
  art_links=$(grep -o 'href="/articles/[^"]*"' "$f" | wc -l)
  ext_links=$(grep -o 'href="https://www\.[^"]*"' "$f" | wc -l)
  echo "$slug: tables=$tables tool_links=$tool_links article_links=$art_links external_links=$ext_links"
done