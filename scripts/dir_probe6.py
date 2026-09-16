#!/usr/bin/env python3
"""Run-6 directory probes: find food/cooking category ids for qid + swb (phpLD family).
Usage: python3 scripts/dir_probe6.py qid|swb
"""
import sys, re, html, http.cookiejar, urllib.request

UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

TARGETS = {
    'qid': 'https://www.qualityinternetdirectory.com',
    'swb': 'https://www.siteswebdirectory.com',
}

key = sys.argv[1] if len(sys.argv) > 1 else 'qid'
base = TARGETS[key]
jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
opener.addheaders = [('User-Agent', UA), ('Accept-Language', 'en-US,en;q=0.9')]

with opener.open(base + '/submit.php', timeout=45) as r:
    h = r.read().decode('utf-8', 'replace')
print(f'== {base}/submit.php len={len(h)}')

# dump select/option option values that mention food/cook/recipe
opts = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>([^<]*)</option>', h, re.I)
food = [(v, t) for v, t in opts if re.search(r'cook|food|recipe|kitchen|meal', t, re.I)]
print('food-related options:', len(food))
for v, t in food[:30]:
    print(f'  id={v} label={html.unescape(t.strip())[:80]}')

# also look for json/JS category data blobs
for m in re.finditer(r'(category|Category)[^;\n]{0,120}', h):
    pass

# search for the words near ids
for pat in (r'Cooking', r'Food', r'Recipes'):
    for m in re.finditer(r'[^>\n]{0,60}' + pat + r'[^<\n]{0,60}', h):
        s = m.group(0).strip()
        if s and len(s) < 140:
            print(f'  ctx[{pat}]: {s[:140]}')

# field dump (quick)
names = sorted(set(re.findall(r'<(?:input|textarea|select)[^>]*name="([^"]+)"', h, re.I)))
print('fields:', names[:25])
