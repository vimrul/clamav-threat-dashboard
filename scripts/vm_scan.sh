#!/bin/bash

# Load configuration
CONFIG_FILE="/etc/clamav-agent.conf"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Config file not found at $CONFIG_FILE"
  exit 1
fi

source "$CONFIG_FILE"

# Temp file for scan output
SCAN_OUTPUT="/tmp/clamav-scan.txt"
> "$SCAN_OUTPUT"

echo "🛡️ Scanning in progress..."

# Run the ClamAV scan
clamscan -r / --bell -i > "$SCAN_OUTPUT"

# Parse threats
INFECTED=$(grep "FOUND" "$SCAN_OUTPUT" | awk -F: '{print $1}' | tr '\n' ',' | sed 's/,$//')

# Determine report message
if [ -z "$INFECTED" ]; then
  REPORT="No threats found."
else
  REPORT="Found threats in: $INFECTED"
fi

# Send to dashboard
echo "📤 Sending report to $SERVER..."
curl -X POST "$SERVER/report" \
  -H "Content-Type: application/json" \
  -d "{\"vm_name\":\"$(hostname)\",\"report\":\"$REPORT\"}"