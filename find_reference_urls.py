#!/usr/bin/env python3
"""
Chunked bulk lookup: For each of the 300 PairDish keywords, find 3+ article URLs
from the premium sites database. Uses chunked IN queries for speed.
"""
import sqlite3
import csv
import math
from pathlib import Path

DB_PATH = Path("/home/hermes/projects/target-sites-research/research/target_sites.sqlite")
KEYWORDS_CSV = Path("/home/hermes/projects/pairdish/300-recipes.csv")
OUTPUT_CSV = Path("/home/hermes/projects/pairdish/300-keyword-reference-urls.csv")
MIN_PER_KEYWORD = 3
CHUNK_SIZE = 50

# Load keywords
keywords = []
with open(KEYWORDS_CSV) as f:
    reader = csv.DictReader(f)
    for row in reader:
        keywords.append({
            "index": int(row["index"]),
            "tier": int(row["tier"]),
            "category": row["category"],
            "keyword": row["keyword"].strip(),
        })

print(f"Loaded {len(keywords)} keywords")
conn = sqlite3.connect(str(DB_PATH))
cur = conn.cursor()

# Store all matches: keyword -> list of dicts
all_matches = {}

# Chunk 1: Exact keyword matches via article_keywords
print("\nPhase 1: Exact keyword matches...")
chunks = [keywords[i:i+CHUNK_SIZE] for i in range(0, len(keywords), CHUNK_SIZE)]

for chunk_idx, chunk in enumerate(chunks):
    kws = [k["keyword"] for k in chunk]
    placeholders = ",".join(["?"] * len(kws))
    cur.execute(f"""
        SELECT ak.keyword, a.url, a.title, s.domain
        FROM article_keywords ak
        JOIN target_articles a ON a.id = ak.article_id
        JOIN target_sites s ON s.id = a.site_id
        WHERE ak.keyword IN ({placeholders})
          AND a.url IS NOT NULL
        ORDER BY ak.keyword
    """, kws)
    
    for kw, url, title, domain in cur.fetchall():
        if kw not in all_matches:
            all_matches[kw] = []
        if len(all_matches[kw]) < MIN_PER_KEYWORD:
            all_matches[kw].append({
                "article_url": url,
                "article_title": title or "",
                "domain": domain or "",
                "match_type": "exact",
            })

    if (chunk_idx + 1) % 2 == 0:
        covered = sum(1 for kws_inner in chunks[:chunk_idx+1] for k in kws_inner if len(all_matches.get(k["keyword"], [])) >= MIN_PER_KEYWORD)
        total_so_far = (chunk_idx + 1) * CHUNK_SIZE
        print(f"  Chunk {chunk_idx+1}/{len(chunks)} — {covered} keywords fully covered so far")

# Chunk 2: Title/partial matches for under-covered keywords
need_more = [k for k in keywords if len(all_matches.get(k["keyword"], [])) < MIN_PER_KEYWORD]
print(f"\nPhase 2: Title matches for {len(need_more)} under-covered keywords...")

if need_more:
    for i, kw in enumerate(need_more):
        name = kw["keyword"]
        if name not in all_matches:
            all_matches[name] = []
        existing_urls = {e["article_url"] for e in all_matches[name]}
        
        # Try stripped term (remove " recipe")
        term = name.replace(" recipe", "").strip()
        
        # Simple title search
        cur.execute("""
            SELECT a.url, a.title, s.domain
            FROM target_articles a
            JOIN target_sites s ON s.id = a.site_id
            WHERE a.url IS NOT NULL
              AND (a.title LIKE ? OR a.inferred_title LIKE ?)
            LIMIT 10
        """, (f"%{term}%", f"%{term}%"))
        
        for url, title, domain in cur.fetchall():
            if url not in existing_urls and len(all_matches[name]) < MIN_PER_KEYWORD:
                existing_urls.add(url)
                all_matches[name].append({
                    "article_url": url,
                    "article_title": title or "",
                    "domain": domain or "",
                    "match_type": "title",
                })
        
        # If still short, try individual words
        if len(all_matches[name]) < MIN_PER_KEYWORD:
            words = [w for w in term.split() if len(w) > 3]
            for word in words[:2]:
                cur.execute("""
                    SELECT a.url, a.title, s.domain
                    FROM target_articles a
                    JOIN target_sites s ON s.id = a.site_id
                    WHERE a.url IS NOT NULL
                      AND (a.title LIKE ? OR a.inferred_title LIKE ?)
                    LIMIT 8
                """, (f"%{word}%", f"%{word}%"))
                
                for url, title, domain in cur.fetchall():
                    if url not in existing_urls and len(all_matches[name]) < MIN_PER_KEYWORD:
                        existing_urls.add(url)
                        all_matches[name].append({
                            "article_url": url,
                            "article_title": title or "",
                            "domain": domain or "",
                            "match_type": f"word:{word}",
                        })
        
        if (i + 1) % 25 == 0:
            print(f"  {i+1}/{len(need_more)} processed")

conn.close()

# Build final result
results = []
missing = []
covered_count = 0

for kw in keywords:
    name = kw["keyword"]
    urls = all_matches.get(name, [])
    if len(urls) >= MIN_PER_KEYWORD:
        covered_count += 1
        for u in urls[:MIN_PER_KEYWORD]:
            results.append({
                "keyword": name,
                **u
            })
    else:
        missing.append(name)

# Save CSV
with open(OUTPUT_CSV, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["keyword", "article_url", "article_title", "domain", "match_type"])
    for r in results:
        writer.writerow([r["keyword"], r["article_url"], r["article_title"][:100], r["domain"][:40], r["match_type"]])

# Stats
tier_counts = {}
for kw in keywords:
    t = kw["tier"]
    if t not in tier_counts:
        tier_counts[t] = {"total": 0, "covered": 0}
    tier_counts[t]["total"] += 1
    if kw["keyword"] not in missing:
        tier_counts[t]["covered"] += 1

print(f"\n{'='*50}")
print(f"RESULTS")
print(f"{'='*50}")
print(f"Total keywords: {len(keywords)}")
print(f"With 3+ URLs:   {covered_count}")
print(f"With <3 URLs:    {len(missing)}")
print(f"Total URLs saved: {len(results)}")
print(f"\nCoverage by tier:")
for t in sorted(tier_counts):
    c = tier_counts[t]
    pct = c["covered"] / c["total"] * 100 if c["total"] else 0
    print(f"  Tier {t}: {c['covered']}/{c['total']} ({pct:.0f}%)")

if missing:
    print(f"\nInsufficient matches for ({len(missing)} keywords):")
    for m in missing:
        url_count = len(all_matches.get(m, []))
        print(f"  {m} ({url_count} URLs)")

print(f"\nSaved: {OUTPUT_CSV}")
