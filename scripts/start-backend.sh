#!/bin/bash

# Start PocketBase backend for Trails of Teak Resort

echo "🌲 Starting Trails of Teak Resort Backend..."

# Navigate to project directory
cd "$(dirname "$0")/.."

# Create pb_data directory if it doesn't exist
mkdir -p pb_data

echo "📦 Starting PocketBase server..."
echo "Admin UI will be available at: http://127.0.0.1:8090/_/"
echo "API will be available at: http://127.0.0.1:8090"
echo ""
echo "🔑 First-time setup:"
echo "1. Open http://127.0.0.1:8090/_/ in your browser"
echo "2. Create admin account"
echo "3. Import the database schema from scripts/init-db.js"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start PocketBase
./backend/pocketbase serve --http="127.0.0.1:8090"