#!/usr/bin/env python3
"""Run-12 phpLD submissions for hosts proven by SIBLING campaigns' newest acknowledgement mail
(mined server-side this run) and never tried by pairdish:

  hulu  huludirectory.com           "Approved Link Submission at HuLu Directory .com" ack 29-Sep
  mwd   marketingwebdirectory.com   "Your Link Request at Marketing web directory" ack 29-Sep

Reuses the verified run-10 phpLD submitter (probe/tree/post) by importing it and swapping the
site table + submitter alias.
  python3 scripts/dir_run12_phpld.py probe <key>
  python3 scripts/dir_run12_phpld.py tree <base-url> <categID>
  python3 scripts/dir_run12_phpld.py post <key> <captcha-code> [category-id]
Set PD_IPV4=1 to force AF_INET (phpLD IPADDRESS column is IPv4-sized).
"""
import importlib.util
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("pd10", ROOT / "scripts/dir_run10_phpld.py")
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

m.SITES = {
    "hulu": {"candidates": ["https://www.huludirectory.com", "https://huludirectory.com"],
             "desc_limit": 1000},
    "mwd": {"candidates": ["https://www.marketingwebdirectory.com",
                           "https://marketingwebdirectory.com"], "desc_limit": 1000},
}
m.OWNER_EMAIL = "mabdulrahim+pairdish-dir12@gmail.com"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(0)
    mode, key = sys.argv[1], sys.argv[2]
    if mode == "probe":
        m.probe(key)
    elif mode == "tree":
        m.tree(key, sys.argv[3])
    elif mode == "post":
        m.post(key, sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else None)
    else:
        print(__doc__)
