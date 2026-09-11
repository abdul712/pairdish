#!/usr/bin/env python3
"""Extract & optionally follow tracking/confirm links from PairDish-related
confirmation emails (Entireweb mandrill-wrapped confirm links etc).

Usage:
  python3 mail_click.py list <imap_uid>          # list candidate click links + destinations
  python3 mail_click.py click <link_index>       # follow link, print redirect chain + final body snippet
Fetches fresh from the mailbox each time.
"""
import imaplib, os, re, sys, quopri, base64, json, subprocess

env = {}
for line in open(os.path.expanduser("~/.hermes/.env")):
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

HOST = "mandrillapp.com/track/click"


def fetch_links(uid):
    M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
    M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])
    M.select("INBOX")
    typ, d = M.fetch(uid.encode(), "(RFC822)")
    txt = quopri.decodestring(d[0][1]).decode("utf-8", "replace")
    M.logout()
    links = re.findall(r"https://[^\s<>\"']*(?:track/click|confirm|verify)[^\s<>\"']*", txt)
    seen, uniq = set(), []
    for l in links:
        l = l.rstrip('>').rstrip('"').rstrip(')')
        if l not in seen:
            seen.add(l)
            uniq.append(l)
    return uniq


def decode_dest(link):
    m = re.search(r"[?&]p=([^&\s]+)", link)
    if not m:
        return "?"
    blob = m.group(1) + "=" * (-len(m.group(1)) % 4)
    try:
        raw = base64.urlsafe_b64decode(blob)
        dm = re.search(rb"https?://[^\"\\ ]+", raw)
        if dm:
            return dm.group(0).decode("utf-8", "replace")
        return raw[:100].decode("utf-8", "replace")
    except Exception as e:
        return f"decode-err {e}"


def main():
    mode = sys.argv[1]
    if mode == "list":
        uid = sys.argv[2]
        links = fetch_links(uid)
        print(f"{len(links)} candidate links in uid {uid}:")
        for i, l in enumerate(links):
            print(f"[{i}] {decode_dest(l)[:150]}")
            print(f"     raw: {l[:100]}...")
    elif mode == "click":
        uid = sys.argv[2]
        idx = int(sys.argv[3])
        links = fetch_links(uid)
        link = links[idx]
        print("clicking:", decode_dest(link)[:150])
        r = subprocess.run(["curl", "-s", "-L", "--max-time", "45",
                            "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                            "-w", "\nFINAL_URL:%{url_effective}\nHTTP:%{http_code}\n",
                            link], capture_output=True, text=True)
        out = r.stdout
        # print redirect targets only + final page text snippet
        print(out[-2000:])
    else:
        print("unknown mode")


if __name__ == "__main__":
    main()
