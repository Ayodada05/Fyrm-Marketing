#!/usr/bin/env bash
# build-deploy.sh · Assemble the deploy payload from the repo.
#
#   Usage: bash scripts/build-deploy.sh
#
#   dist/marketing → everything the Fyrm marketing site serves (static only)
#
# Run locally for a manual upload, or from CI (.github/workflows/deploy.yml).
# The payload is the pages, styles, scripts, assets, crawler files.
# Never CLAUDE.md, README, serve.json, scripts/, or .github/.
#
# The future app (app.<domain>) will live in a separate private repo with its
# own build; nothing here touches it.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist/marketing
cp ./*.html dist/marketing/
# robots.txt / sitemap.xml arrive once the domain is decided (CLAUDE.md 5.4);
# copy them when they exist so this script works before and after.
for f in robots.txt sitemap.xml; do
  if [ -f "$f" ]; then cp "$f" dist/marketing/; fi
done
cp -R css js assets dist/marketing/

# Local working trees carry macOS junk that must never be publicly fetchable.
find dist \( -name '.DS_Store' -o -name '._*' \) -type f -delete

echo "dist/marketing: $(find dist/marketing -type f | wc -l | tr -d ' ') files"
exit 0
