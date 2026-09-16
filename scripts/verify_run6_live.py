#!/usr/bin/env python3
"""Run-6 live verification: after deploy, check
 1) all 36 tool pages: 0 'Frequently Asked', 0 'FAQPage' (FAQ removal landed)
 2) the 9 guide-linked pages: 'Related Guides' present + expected /articles/ links
 3) sitemap.xml: tools lastmod = 2026-09-16
 4) sample article page unaffected ('Keep planning your plate' still there)
"""
import re, subprocess, pathlib

BASE = 'https://pairdish.com'
TOOLS = sorted(p.stem for p in pathlib.Path('src/pages/tools').glob('*.astro') if p.stem != 'index')

EXPECTED = {
    'flavor-pairing': 3, 'meal-prep': 3, 'nutrition-calculator': 2, 'macro-calculator': 2,
    'protein-calculator': 2, 'grocery-list': 2, 'pantry-helper': 2, 'recipe-scaler': 1,
    'buffet-planner': 2,
}


def curl(url):
    r = subprocess.run(['curl', '-s', '--compressed', '--max-time', '30', url],
                       capture_output=True, text=True)
    return r.stdout


fails = []
ok = 0
for slug in TOOLS:
    h = curl(f'{BASE}/tools/{slug}')
    if not h:
        fails.append(f'{slug}: EMPTY RESPONSE')
        continue
    bad_faq = h.count('Frequently Asked')
    bad_schema = h.count('FAQPage')
    if bad_faq or bad_schema:
        fails.append(f'{slug}: FAQ leftovers {bad_faq}/{bad_schema}')
        continue
    if h.count('"@type":"WebApplication"') != 1:
        fails.append(f'{slug}: WebApplication schema missing')
        continue
    if slug in EXPECTED:
        guides = h.count('Related Guides')
        links = len(set(re.findall(r'href="/articles/([a-z-]+)"', h)))
        if guides != 1:
            fails.append(f'{slug}: Related Guides block missing ({guides})')
            continue
        if links < EXPECTED[slug]:
            fails.append(f'{slug}: only {links} article links (expected {EXPECTED[slug]})')
            continue
    ok += 1

sm = curl(f'{BASE}/sitemap.xml')
tool_lastmods = re.findall(r'<loc>https://pairdish\.com/tools/([a-z-]+)</loc>\s*\n\s*<lastmod>([^<]+)</lastmod>', sm)
bad_lm = [s for s, d in tool_lastmods if d != '2026-09-16']
if bad_lm:
    fails.append(f'sitemap: tool lastmod not bumped for {len(bad_lm)} pages e.g. {bad_lm[:3]}')

art = curl(f'{BASE}/articles/what-to-serve-with-roasted-potatoes')
if 'Keep planning your plate' not in art or 'FAQPage' in art:
    fails.append('article page regression')

print(f'tool pages ok: {ok}/{len(TOOLS)}')
print(f'sitemap tool lastmods checked: {len(tool_lastmods)}')
print('FAILURES:', len(fails))
for f in fails:
    print(' -', f)
