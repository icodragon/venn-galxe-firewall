# Venn Network DApp Example

This project demonstrates the integration of a simple storage DApp with the Venn Network firewall protection system. It includes a smart contract that can store and retrieve values, with additional security features provided by the Venn Network.

> The documentation provides an example of running the project using Docker Compose. If you wish to run the project without Docker Compose, please familiarize yourself with the project structure and select an appropriate method accordingly

## Features

- Simple key-value storage smart contract
- Venn Network firewall protection
- Owner-only value removal
- Docker-based development environment
- Easy-to-use CLI interface for contract interaction

## Prerequisites

- Docker and Docker Compose
- Access to Holesky testnet
- Venn Network testnet access

## Project Structure

```
.
├── contracts/                 # Smart contract source files
│   └── SimpleStorage.sol      # Main storage contract
│   └── SimpleStorageABI.json  # Main storage contract ABI
├── scripts/                   # JavaScript scripts
│   └── dapp-execute.js        # Contract interaction script
│   └── deploy.js              # Deploy contract script
├── docker-compose.yml         # Docker services configuration
├── Dockerfile                 # Development environment setup
├── hardhat.config.js          # Hardhat configuration
├── venn.config.json           # Venn Network configuration
├── venn-dapp.sh               # CLI interface script
├── venn-register.sh           # Contract registration script
└── deploy.sh                  # Contract deployment script
```

## Smart Contract

The `SimpleStorage` contract provides the following functionality:
- `setValue(key, value)`: Store a value with a key (firewall protected)
- `getValue(key)`: Retrieve a value by key
- `removeValue(key)`: Remove a value (owner only, firewall protected)
- `hasKey(key)`: Check if a key exists

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd venn-galxe-firewall
```

2. Build project
```bash
docker compose build
```

3. Copy the environment file and configure it:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
```
HOLESKY_RPC_URL=your_holesky_rpc_url
PRIVATE_KEY=your_private_key
VENN_NODE_URL=https://signer2.testnet.venn.build/api/17000/sign
```

5. To execute any commands:
```bash
docker compose run --rm venn-dev <command>
```

## Usage

### Deploying the Contract

```bash
./venn-deploy.sh
```

### Registering with Venn Network

```bash
./venn-register.sh <contract_address>
```

### Interacting with the Contract

```bash
./venn-dapp.sh <policy_address>
```

Available commands:
- `set <key> <value>` - Set a value
- `get <key>` - Get a value
- `remove <key>` - Remove a value
- `has <key>` - Check if key exists
- `exit` - Exit the script

