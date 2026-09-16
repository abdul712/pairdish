#!/usr/bin/env python3
"""Run-6: remove FAQ sections + FAQPage JSON-LD from ALL tool pages (user hard rule:
no FAQ sections). Uniform shape verified 2026-09-16: <h3>Frequently Asked Questions</h3>
+ <div class="space-y-4"> details wrapper inside the Educational Content section,
plus a standalone <!-- FAQ Structured Data --> ld+json script (FAQ-only).

Usage: python3 scripts/remove_tool_faqs.py --dry | --apply
Assertion-guarded; no regex spans across tags (walks div balance instead).
"""
import re, sys, pathlib

TOOLS = sorted(pathlib.Path('src/pages/tools').glob('*.astro'))


def find_faq_span(s, fname):
    i = s.find('Frequently Asked Questions')
    assert i != -1, f'{fname}: heading not found'
    assert s.find('Frequently Asked Questions', i + 1) == -1, f'{fname}: heading appears twice'
    # walk back to the <h3 opening tag
    h3 = s.rfind('<h3', 0, i)
    assert h3 != -1, f'{fname}: no <h3 before heading'
    # extend back to line start (indent)
    ls = s.rfind('\n', 0, h3) + 1
    # walk forward past </h3>
    h3end = s.find('</h3>', i)
    assert h3end != -1, f'{fname}: no </h3>'
    h3end += len('</h3>')
    # find the wrapper div after the heading that holds the details
    dm = re.search(r'<div[^>]*>', s[h3end:])
    assert dm, f'{fname}: no wrapper div after heading'
    div_start = h3end + dm.start()
    # count div balance from div_start
    depth = 0
    pos = div_start
    end = None
    for m in re.finditer(r'<div\b|</div>', s[div_start:]):
        if m.group(0) == '</div>':
            depth -= 1
            if depth == 0:
                end = div_start + m.end()
                break
        else:
            depth += 1
    assert end, f'{fname}: div balance failed'
    span = s[ls:end]
    assert '<details' in span, f'{fname}: span has no details'
    assert 'AdSense' not in span, f'{fname}: span touches AdSense'
    assert 'FAQ Structured Data' not in span, f'{fname}: span reaches script'
    return ls, end, span


def find_jsonld_span(s, fname):
    ci = s.find('<!-- FAQ Structured Data -->')
    assert ci != -1, f'{fname}: comment marker missing'
    script_i = s.find('<script', ci)
    assert script_i != -1, f'{fname}: script tag missing'
    assert s[ci + len('<!-- FAQ Structured Data -->'):script_i].strip() == '', f'{fname}: gap not whitespace'
    em = s.find('})} />', script_i)
    assert em != -1, f'{fname}: script end marker missing'
    block = s[script_i:em + len('})} />')]
    assert 'FAQPage' in block, f'{fname}: block lacks FAQPage'
    assert block.count('<script') == 1, f'{fname}: block has extra script'
    js_start, js_end = ci, em + len('})} />')
    # swallow trailing blank line
    while js_end < len(s) and s[js_end] in ' \t':
        js_end += 1
    if js_end < len(s) and s[js_end] == '\n':
        js_end += 1
    return js_start, js_end, block


def process(path, apply):
    s = path.read_text()
    if 'FAQPage' not in s:
        return path.name, 0, 0, 'skipped (no FAQ)'
    faq_start, faq_end, faq_span = find_faq_span(s, path.name)
    js_start, js_end, js_span = find_jsonld_span(s, path.name)
    n_details = faq_span.count('<details')
    assert n_details >= 2, f'{path.name}: only {n_details} details'
    # remove later span first
    for a, b in sorted([(faq_start, faq_end), (js_start, js_end)], reverse=True):
        s = s[:a] + s[b:]
    assert 'Frequently Asked' not in s, path.name
    assert 'FAQPage' not in s, path.name
    assert 'FAQ Structured Data' not in s, path.name
    if apply:
        path.write_text(s)
    return path.name, n_details, len(faq_span) + len(js_span), 'ok'


def main():
    apply = '--apply' in sys.argv
    tot = 0
    for p in TOOLS:
        name, nd, nbytes, status = process(p, apply)
        if status == 'ok':
            tot += 1
            print(f'{name}: removed {nd} FAQ items + json-ld ({nbytes} bytes)')
        else:
            print(f'{name}: {status}')
    print(f'--- {tot} files processed ({"APPLIED" if apply else "DRY RUN"})')


if __name__ == '__main__':
    main()
