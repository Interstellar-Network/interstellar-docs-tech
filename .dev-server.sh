#!/bin/bash
# Start (or restart) the Docusaurus dev server on port 3456, detached from the
# calling shell's process group so it survives the agent's command timeouts.
cd "$(dirname "$0")" || exit 1
export PATH="$HOME/workspace/bin:$PATH"

# stop any previous instance (ignore failures)
pkill -f "docusaurus start --no-open" >/dev/null 2>&1
sleep 2

setsid nohup npx docusaurus start --no-open --host 0.0.0.0 --port 3456 \
  > /tmp/docusaurus-dev.log 2>&1 < /dev/null &

disown
sleep 1
echo "dev server starting on http://127.0.0.1:3456 (log: /tmp/docusaurus-dev.log)"
