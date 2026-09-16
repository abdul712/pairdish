"""PairDish directory-submission tracker helper.
Usage:
  python3 scripts/update_tracker.py add "<name>" "<url>" "<status>" "<listing_url_or_proof>" "<notes>"
  python3 scripts/update_tracker.py summary
Dedupe: by domain (strip www., lowercase). Writes outreach/tracker.csv with the csv module
(skill rule: never hand-append quoted text into CSV).
"""
import csv, sys, pathlib
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent.parent
TRACKER = ROOT / "outreach" / "tracker.csv"
FIELDS = ["site_name", "url", "status", "date", "listing_url_or_proof", "notes"]


def norm_domain(url: str) -> str:
    host = urlparse(url if "//" in url else "https://" + url).netloc.lower()
    return host[4:] if host.startswith("www.") else host


def load_rows():
    if not TRACKER.exists():
        return []
    with open(TRACKER, newline="") as f:
        reader = csv.DictReader(f)
        return [r for r in reader
                if r.get("site_name") and reader.fieldnames and "site_name" in (reader.fieldnames or [])]


def append_row(row):
    TRACKER.parent.mkdir(exist_ok=True)
    rows = load_rows()
    with open(TRACKER, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writerow({k: row.get(k, "") for k in FIELDS})


def main():
    args = sys.argv[1:]
    if not args or args[0] == "summary":
        rows = load_rows()
        from collections import Counter
        c = Counter(r["status"] for r in rows)
        print(f"Total tracked: {len(rows)}")
        for k, v in sorted(c.items()):
            print(f"  {k}: {v}")
        return
    if args[0] == "status" and len(args) >= 4:
        # status <domain-or-url> <new-status> [proof] [note-append]
        # Preserves existing notes (appends the new note); fleet lesson: naive
        # status updates REPLACE notes and lose history.
        target = norm_domain(args[1])
        new_status = args[2]
        proof = args[3] if len(args) > 3 else ""
        note = args[4] if len(args) > 4 else ""
        from datetime import date
        rows = load_rows()
        hit = False
        for r in rows:
            if norm_domain(r.get("url", "")) == target:
                hit = True
                r["status"] = new_status
                r["date"] = date.today().isoformat()
                if proof:
                    r["listing_url_or_proof"] = proof
                if note:
                    r["notes"] = (r.get("notes", "") + " | " + note).strip(" |")
        if not hit:
            print(f"NOT FOUND: {target}")
            sys.exit(3)
        with open(TRACKER, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=FIELDS)
            w.writeheader()
            w.writerows({k: r.get(k, "") for k in FIELDS} for r in rows)
        print(f"Updated {target} -> {new_status} (notes preserved/appended)")
        return
    if args[0] == "add" and len(args) >= 4:
        name, url, status = args[1], args[2], args[3]
        proof = args[4] if len(args) > 4 else ""
        notes = args[5] if len(args) > 5 else ""
        dom = norm_domain(url)
        for r in load_rows():
            if norm_domain(r.get("url", "")) == dom:
                print(f"DUPLICATE: {dom} already tracked as {r['status']} — not re-adding")
                sys.exit(2)
        from datetime import date
        append_row({"site_name": name, "url": url, "status": status,
                    "date": date.today().isoformat(),
                    "listing_url_or_proof": proof, "notes": notes})
        print(f"Added: {name} ({dom}) -> {status}")
        return
    print(__doc__)
    sys.exit(1)


if __name__ == "__main__":
    main()