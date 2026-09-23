#!/usr/bin/env python3
"""Run-9: probe whether the stored Google refresh token still works (GSC/GA4 outage check).
Prints only status lines -- never tokens."""
import json, pathlib, urllib.parse, urllib.request

p = pathlib.Path.home() / ".hermes/google_token.json"
d = json.loads(p.read_text())
data = urllib.parse.urlencode({
    "client_id": d["client_id"],
    "client_secret": d["client_secret"],
    "refresh_token": d["refresh_token"],
    "grant_type": "refresh_token",
}).encode()
try:
    r = urllib.request.urlopen(urllib.request.Request(d["token_uri"], data=data), timeout=25)
    tok = json.loads(r.read().decode())
    print("REFRESH OK - access token acquired, expires_in:", tok.get("expires_in"))
    print("scopes:", d.get("scopes"))
except Exception as e:
    body = ""
    if hasattr(e, "read"):
        body = e.read().decode()[:200]
    print("REFRESH FAILED:", type(e).__name__, e)
    if body:
        print("body:", body)
