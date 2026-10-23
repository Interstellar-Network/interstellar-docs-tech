#!/bin/bash
# Run a production build in the background (it takes minutes) and log the output.
cd "$(dirname "$0")" || exit 1
export PATH="$HOME/workspace/bin:$PATH"
rm -f /tmp/docusaurus-build.log /tmp/docusaurus-build.exit
setsid nohup bash -c 'npx docusaurus build > /tmp/docusaurus-build.log 2>&1; echo $? > /tmp/docusaurus-build.exit' < /dev/null > /dev/null 2>&1 &
disown
echo "build started (log: /tmp/docusaurus-build.log)"
