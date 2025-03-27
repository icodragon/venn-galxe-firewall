#!/bin/bash

# Check if policy address is provided
if [ -z "$1" ]; then
    echo "Error: Policy address not provided"
    echo "Usage: ./venn-dapp.sh <policy_address>"
    exit 1
fi

if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Check if PRIVATE_KEY is set in .env
if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY not found in .env file"
    echo "Please add PRIVATE_KEY=your_private_key to .env file"
    exit 1
fi

# Update venn.config.json with the policy address
echo "Updating venn.config.json with policy address: $1"
sed -i '' "s/\"policyAddress\": \"\"/\"policyAddress\": \"$1\"/" venn.config.json

echo "Available commands:"
echo "1. set <key> <value> - Set a value"
echo "2. get <key> - Get a value"
echo "3. remove <key> - Remove a value"
echo "4. has <key> - Check if key exists"
echo "5. exit - Exit the script"

while true; do
    echo "Enter command (or 'exit' to quit):"
    read command
    
    if [ "$command" = "exit" ]; then
        break
    fi
    
    docker compose run --rm venn-dev node scripts/dapp-execute.js $command
done 