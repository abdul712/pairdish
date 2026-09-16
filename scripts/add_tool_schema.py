#!/usr/bin/env python3
"""Run-6b: add per-page WebApplication JSON-LD to tool pages (correct schema
entity for interactive tools; replaces the removed FAQPage markup).
Extracts name/description from each page's BaseLayout props.
Usage: python3 scripts/add_tool_schema.py --dry | --apply
"""
import re, sys, pathlib

UTILS = {
    'unit-converter', 'pan-size-converter', 'yeast-converter', 'oven-temperature',
    'cooking-time', 'recipe-scaler', 'sugar-substitution', 'flour-substitution',
    'caffeine-calculator', 'macro-calculator', 'nutrition-calculator', 'protein-calculator',
    'glycemic-index', 'sourdough-calculator', 'bread-proofing', 'party-calculator',
    'drink-calculator', 'buffet-planner', 'cheese-board-calculator', 'potluck-coordinator',
}

PAGES = sorted(p for p in pathlib.Path('src/pages/tools').glob('*.astro') if p.stem != 'index')

TEMPLATE = """
<!-- WebApplication Structured Data -->
<script type="application/ld+json" set:html={{JSON.stringify({{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "{name}",
  "description": "{desc}",
  "url": "https://pairdish.com/tools/{slug}",
  "applicationCategory": "{cat}",
  "operatingSystem": "Web",
  "offers": {{ "@type": "Offer", "price": "0", "priceCurrency": "USD" }},
  "isPartOf": {{ "@type": "WebSite", "name": "PairDish", "url": "https://pairdish.com/" }}
}})}} />
"""


def js_escape(v):
    return v.replace('\\', '\\\\').replace('"', '\\"')


def main():
    apply = '--apply' in sys.argv
    n = 0
    for p in PAGES:
        s = p.read_text()
        assert 'WebApplication Structured Data' not in s, f'{p.name}: already applied'
        assert s.count('</BaseLayout>') == 1, f'{p.name}: BaseLayout close count'
        block = re.search(r'<BaseLayout\s(.*?)>', s, re.S).group(1)
        title = re.search(r'\btitle="([^"]*)"', block).group(1)
        desc = re.search(r'\bdescription="([^"]*)"', block).group(1)
        cat = 'UtilitiesApplication' if p.stem in UTILS else 'LifestyleApplication'
        frag = TEMPLATE.format(name=js_escape(title), desc=js_escape(desc), slug=p.stem, cat=cat)
        s2 = s.replace('</BaseLayout>', '</BaseLayout>' + frag, 1)
        assert s2.count('"@type": "WebApplication"') == 1
        if apply:
            p.write_text(s2)
        n += 1
    print(f'{n} pages {"updated" if apply else "(dry)"}')


if __name__ == '__main__':
    main()
