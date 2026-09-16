#!/usr/bin/env python3
"""Run-6 directory submissions for pairdish.com.
qid = qualityinternetdirectory.com (3-step POST wizard, cat 297 Recreation & Sports > Cooking)
swb = siteswebdirectory.com (URL-param wizard + DO_MATH, cat 1987 Home > Cooking)
Both phpLD family, free Regular, verified flows from sibling campaigns (2026-09-16).
Usage: python3 scripts/dir_run6_pairdish.py qid|swb [--probe]
"""
import sys, re, http.cookiejar, urllib.request, urllib.parse

UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

TITLE = 'PairDish - Free Food Pairing Tools & Cooking Guides'
URL = 'https://pairdish.com/'
DESCRIPTION = ('PairDish is a free food pairing toolkit for home cooks: a flavor pairing finder backed by '
               'food-science aromatic data, cheese board builder, buffet and party quantity calculators, '
               'recipe nutrition and macro calculators, plus practical pairing guides that answer what to '
               'serve with any main dish. Combines interactive tools with researched, source-cited guides '
               '(USDA MyPlate, FSIS). Free, no signup required.')
META_KEYWORDS = 'food pairing, cheese pairing, meal planning, nutrition calculator, what to serve with, cooking tools'
META_DESCRIPTION = ('Free food pairing tools and guides for home cooks: flavor pairing finder, cheese board '
                    'builder, portion and nutrition calculators, and what-to-serve-with pairing guides.')
OWNER_NAME = 'Abdul Rahim'
OWNER_EMAIL = 'mabdulrahim+pairdish-dir6@gmail.com'

assert len(DESCRIPTION) <= 500, len(DESCRIPTION)
assert len(META_DESCRIPTION) <= 250, len(META_DESCRIPTION)

BASE = {'qid': 'https://www.qualityinternetdirectory.com',
        'swb': 'https://www.siteswebdirectory.com'}

key = sys.argv[1]
base = BASE[key]

jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
opener.addheaders = [('User-Agent', UA), ('Accept', 'text/html,application/xhtml+xml,*/*;q=0.9'),
                     ('Accept-Language', 'en-US,en;q=0.9')]


def get(url):
    with opener.open(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=40) as r:
        return r.read().decode('utf-8', 'replace')


def post(url, fields):
    data = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(url, data=data, headers={
        'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': url})
    with opener.open(req, timeout=60) as r:
        return r.read().decode('utf-8', 'replace')


def report(resp):
    flat = re.sub(r'\s+', ' ', resp)
    ok = ('Link submitted' in flat) or ('awaiting approval' in flat)
    print('SUCCESS_MARKER:', ok, '| resp len', len(resp))
    for m in re.finditer(r'class="(?:msg|errForm)"[^>]*>(.{0,240}?)</', resp, re.S):
        print(' MSG/ERR:', re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', m.group(1))).strip()[:240])
    if not ok:
        open(f'/tmp/pd_{key}_resp.html', 'w').write(resp)
        print(f'saved /tmp/pd_{key}_resp.html')


if key == 'qid':
    CAT = '297'
    if '--probe' in sys.argv:
        h = get(base + '/submit.php')
        print('probe len', len(h))
        for m in re.finditer(r'<(input|select|textarea)\b[^>]*>', h, re.I):
            tag = m.group(0)
            nm = re.search(r'name="([^"]*)"', tag)
            tp = re.search(r'type="([^"]*)"', tag)
            if nm:
                print(f"  {nm.group(1)} | {tp.group(1) if tp else '?'}")
        sys.exit(0)
    get(base + '/submit.php')
    post(base + '/submit.php', {'formSubmitted': '1', 'CATEGORY_ID': CAT})
    post(base + '/submit.php', {'formSubmitted': '1', 'CATEGORY_ID': CAT, 'LINK_TYPE': 'normal'})
    resp = post(base + '/submit.php', {
        'formSubmitted': '1', 'LINK_TYPE': 'normal',
        'TITLE': TITLE, 'URL': URL,
        'DESCRIPTION': DESCRIPTION, 'DESCRIPTION_limit': '500',
        'META_KEYWORDS': META_KEYWORDS,
        'META_DESCRIPTION': META_DESCRIPTION, 'META_DESCRIPTION_limit': '250',
        'OWNER_NAME': OWNER_NAME, 'OWNER_EMAIL': OWNER_EMAIL,
        'CATEGORY_ID': CAT, 'RECPR_URL': '', 'RECPR_TEXT': '',
        'AGREERULES': 'on', 'submit': 'Continue'})
    report(resp)

elif key == 'swb':
    CAT = '1987'
    get(base + '/submit.php')
    get(f'{base}/submit.php?c={CAT}')
    h3 = get(f'{base}/submit.php?c={CAT}&LINK_TYPE=2')
    m = re.search(r'font[^>]*>\s*(\d+)\s*\+\s*(\d+)\s*=', h3)
    if not m:
        print('DO_MATH not found; saved step3')
        open('/tmp/pd_swb_step3.html', 'w').write(h3)
        sys.exit(3)
    answer = int(m.group(1)) + int(m.group(2))
    print(f'DO_MATH: {m.group(1)} + {m.group(2)} = {answer}')
    resp = post(f'{base}/submit.php?c={CAT}&LINK_TYPE=2', {
        'formSubmitted': '1', 'LINK_TYPE': '2',
        'TITLE': TITLE, 'URL': URL, 'DESCRIPTION': DESCRIPTION,
        'OWNER_NAME': OWNER_NAME, 'OWNER_EMAIL': OWNER_EMAIL,
        'CATEGORY_ID': CAT, 'ADD_CATEGORY_ID[]': CAT,
        'DO_MATH': str(answer), 'AGREERULES': 'on', 'continue': 'Continue'})
    report(resp)
