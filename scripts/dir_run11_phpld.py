#!/usr/bin/env python3
"""Run-11 phpLD submissions for hosts proven by SIBLING campaigns' recent acknowledgement
mail (mined server-side this run) and never tried by this campaign:

  usld  usalistingdirectory.com     "Your Link Request ..." ack 26-Sep (catcafecentral 3/3
                                     first-try: single-form phpLD, LINK_TYPE=normal, no captcha)
  bbd   britainbusinessdirectory.com "Link Request ..." ack 24-Sep (proven free normal link,
                                     cat 45, AGREERULES=on, no captcha)
  ebay  ebay-dir.com                "Your Link Request at Ebay Dir .com" ack 21-Sep (probe)

Reuses the verified run-10 phpLD submitter (probe/tree/post) by importing it and swapping the
site table + submitter alias. Modes mirror the parent script:
  python3 scripts/dir_run11_phpld.py probe <key>
  python3 scripts/dir_run11_phpld.py tree <base-url> <categID>
  python3 scripts/dir_run11_phpld.py post <key> <captcha-code> [category-id]
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
    "usld": {"candidates": ["https://www.usalistingdirectory.com", "https://usalistingdirectory.com"],
             "desc_limit": 1000},
    "bbd": {"candidates": ["https://www.britainbusinessdirectory.com", "https://britainbusinessdirectory.com"],
            "desc_limit": 1000},
    "ebay": {"candidates": ["https://www.ebay-dir.com", "https://ebay-dir.com"],
             "desc_limit": 500},
}
m.OWNER_EMAIL = "mabdulrahim+pairdish-dir11@gmail.com"

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
