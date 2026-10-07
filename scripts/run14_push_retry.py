#!/usr/bin/env python3
"""Run-14: retry `git push origin master` until the remote ref matches local HEAD.

GitHub returned `remote rejected ... (Internal Server Error)` twice in a row; this retries with
backoff and verifies by remote ref (never by exit code).
"""
import subprocess
import time

REPO = "/home/hermes/projects/pairdish"


def sh(cmd):
    return subprocess.run(cmd, cwd=REPO, capture_output=True, text=True, shell=False)


local = sh(["git", "rev-parse", "HEAD"]).stdout.strip()
for attempt in range(1, 6):
    r = sh(["git", "push", "origin", "master"])
    tail = (r.stdout + r.stderr).strip().splitlines()[-1:] or [""]
    remote = sh(["git", "ls-remote", "origin", "refs/heads/master"]).stdout.strip().split("\t")[0]
    print(f"attempt {attempt}: exit={r.returncode} last={tail[0][:80]}")
    print(f"  remote={remote[:40]} local={local[:40]}")
    if remote == local:
        print("SYNCED")
        break
    time.sleep(45 * attempt)
else:
    print("NOT SYNCED after retries")
