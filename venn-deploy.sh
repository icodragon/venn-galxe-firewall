#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please copy .env.example to .env and fill in your values"
    exit 1
fi

echo "Starting deploy contract..."
docker compose run --rm venn-dev npm run deploy
