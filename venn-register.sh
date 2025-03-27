#!/bin/bash

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

# Check if contract address is provided
if [ -z "$1" ]; then
    echo "Error: Contract address not provided"
    echo "Usage: ./register-venn.sh <contract_address>"
    exit 1
fi

# Update venn.config.json with the contract address
echo "Updating venn.config.json with contract address: $1"
sed -i '' "s/\"SimpleStorage\": \"\"/\"SimpleStorage\": \"$1\"/" venn.config.json

# Run Venn enable command
echo "Registering contract with Venn Network..."
docker compose run -e VENN_PRIVATE_KEY=$PRIVATE_KEY --rm venn-dev venn enable --network holesky

echo "Registration complete!"
