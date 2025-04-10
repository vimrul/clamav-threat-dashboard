#!/bin/bash

CONFIG_FILE="/etc/clamav-agent.conf"

if [ ! -f $CONFIG_FILE ]; then
  echo "❌ Config file not found. Please run install_agent.sh first."
  exit 1
fi

source $CONFIG_FILE
TMP_JSON="/tmp/clamav_report.json"
VM_NAME=$(hostname)
TIMESTAMP=$(date -Iseconds)

echo "🛡️ Scanning in progress..."

SCAN_RESULT=$(clamscan -r / --quiet 2>/dev/null)

if [[ $SCAN_RESULT == *"Infected files: 0"* ]]; then
  REPORT="No threats found."
else
  INFECTED=$(echo "$SCAN_RESULT" | grep "FOUND" | awk '{print $1}' | tr '\n' ',' | sed 's/,$//')
  REPORT="Found threats in: $INFECTED"
fi

cat <<EOF > $TMP_JSON
{
  "vm_name": "$VM_NAME",
  "timestamp": "$TIMESTAMP",
  "report": "$REPORT"
}
EOF

echo "📤 Sending report to $SERVER_URL..."
curl -X POST -H "Content-Type: application/json" -d @$TMP_JSON "$SERVER_URL/report"
