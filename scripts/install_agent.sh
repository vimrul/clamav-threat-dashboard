#!/bin/bash

echo "🔐 ClamAV Agent Installer"

read -p "Enter ClamAV Report Server Address (e.g., http://192.168.1.10:8000): " SERVER_URL

# Save server URL
echo "SERVER_URL=\"$SERVER_URL\"" > /etc/clamav-agent.conf

# Install ClamAV if not present
if ! command -v clamscan &> /dev/null; then
  echo "Installing ClamAV..."
  apt update && apt install -y clamav
  freshclam
fi

echo "✅ Agent installed successfully."
echo "You can now run 'vm_scan' to scan the VM and send reports."
