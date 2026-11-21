#!/usr/bin/env python3
"""Tell IndexNow (Bing, Yandex and the engines that share it) which addresses of the site changed.

With no arguments it sends every address in the live sitemap; with arguments it sends only those addresses.
The key is the name of the 32-character .txt file in the repository root, which the site serves at its root.

    python bin/indexnow.py
    python bin/indexnow.py https://salihkilic.net/ https://salihkilic.net/cv/
"""
import json
import pathlib
import re
import sys
import urllib.request

SITE = "https://salihkilic.net"
ENDPOINT = "https://api.indexnow.org/indexnow"
ROOT = pathlib.Path(__file__).resolve().parent.parent


def find_key():
    for path in ROOT.glob("*.txt"):
        if re.fullmatch(r"[0-9a-f]{32}", path.stem) and path.read_text(encoding="utf-8").strip() == path.stem:
            return path.stem
    sys.exit("No IndexNow key file (32 hex characters .txt) in the repository root.")


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "indexnow-submit"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def main():
    key = find_key()
    key_url = f"{SITE}/{key}.txt"
    if fetch(key_url).strip() != key:
        sys.exit(f"{key_url} does not serve the key yet; publish the site first.")
    urls = sys.argv[1:] or re.findall(r"<loc>([^<]+)</loc>", fetch(f"{SITE}/sitemap.xml"))
    body = {"host": SITE.split("//")[1], "key": key, "keyLocation": key_url, "urlList": urls}
    request = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        print(f"IndexNow answered {response.status} for {len(urls)} addresses")
    for url in urls:
        print(" ", url)


if __name__ == "__main__":
    main()
