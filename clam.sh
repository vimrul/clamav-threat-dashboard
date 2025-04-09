#!/bin/bash

# Set project root
PROJECT_ROOT="clamav-threat-dashboard"

# Create folders
mkdir -p $PROJECT_ROOT/{backend,frontend/public,frontend/src/{components,pages},scripts}

# Backend files
touch $PROJECT_ROOT/backend/{main.py,database.py,models.py,schemas.py,crud.py,utils.py,config.py,requirements.txt}

# Frontend files
touch $PROJECT_ROOT/frontend/{tailwind.config.js,postcss.config.js,vite.config.js,package.json,yarn.lock}
touch $PROJECT_ROOT/frontend/src/{App.jsx,api.js,index.js}
touch $PROJECT_ROOT/frontend/src/components/{Header.jsx,ReportCard.jsx,TriggerScanModal.jsx}
touch $PROJECT_ROOT/frontend/src/pages/{Dashboard.jsx,ReportDetails.jsx}

# Scripts
touch $PROJECT_ROOT/scripts/{vm_scan.sh,install_agent.sh}

# Root-level files
touch $PROJECT_ROOT/{.env,docker-compose.yml,README.md}

# Make scripts executable
chmod +x $PROJECT_ROOT/scripts/*.sh

echo "✅ Project folder structure created at ./$PROJECT_ROOT"
