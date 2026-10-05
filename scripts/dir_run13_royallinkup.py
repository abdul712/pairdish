#!/usr/bin/env python3
"""Run-13 directory submitter — royallinkup.com (phpLD-5 /submit wizard variant).

Sourced from the shared mailbox ack of a sibling campaign (run-13 ack sweep). Reuses the
run-12 wizard implementation verbatim (same family, verified for 3 hosts) with this host's
own category/email.

Modes: probe rl | post rl <captcha-or-dash>
"""
import importlib.util
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location("w12", ROOT / "scripts/dir_run12_wizard.py")
w = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(w)

w.SITES["rl"] = {"bases": ["https://royallinkup.com", "https://www.royallinkup.com"],
                 "cat": "316"}
w.OWNER_EMAIL = "mabdulrahim+pairdish-dir13@gmail.com"

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(0)
    mode, key = sys.argv[1], sys.argv[2]
    if mode == "probe":
        w.probe(key)
    elif mode == "post":
        w.post(key, sys.argv[3] if len(sys.argv) > 3 else "-")
    else:
        print(__doc__)
