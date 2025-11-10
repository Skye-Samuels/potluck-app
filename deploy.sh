#!/usr/bin/env bash
set -euo pipefail

cd /srv/potluck-app

echo "Updating repository..."
git fetch origin main
git reset --hard origin/main

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Building app..."
pnpm build

echo "Restarting potluck-app service..."
sudo systemctl restart potluck-app

echo "Deployment complete."