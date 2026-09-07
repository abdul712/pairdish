"""List ALL passing Commons candidates per query so a human/model can pick the best hero.
Read-only helper: prints title | license | WxH | descriptionurl."""
import importlib.util, sys

spec = importlib.util.spec_from_file_location("m", "/home/hermes/projects/pairdish/scripts/source_images_batch_a.py")
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

QUERIES = sys.argv[1:] if len(sys.argv) > 1 else ["fish and chips plate", "battered fried fish golden"]
for q in QUERIES:
    print(f"\n=== {q} ===")
    for c in m.find_candidates(q)[:12]:
        print(f"{c['title'][:75]} | {c['license']} | {c['width']}x{c['height']}")