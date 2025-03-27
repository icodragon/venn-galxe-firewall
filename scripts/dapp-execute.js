require('dotenv').config();
const { VennClient } = require('@vennbuild/venn-dapp-sdk');
const { ethers } = require('ethers');
const abi = require('../contracts/SimpleStorageABI.json');
const fs = require('fs');

const provider = new ethers.JsonRpcProvider(process.env.HOLESKY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const vennConfig = JSON.parse(fs.readFileSync('./venn.config.json', 'utf8'));
const contractAddress = vennConfig.networks.holesky.contracts.SimpleStorage;
const policyAddress = vennConfig.networks.holesky.policyAddress;

if (!contractAddress) {
  console.error('❌ Error: Contract address not found in venn.config.json');
  process.exit(1);
}

if (!policyAddress) {
  console.error('❌ Error: Policy Address not found in venn.config.json');
  process.exit(1);
}

// Check for required environment variables
const requiredEnvVars = [
  'HOLESKY_RPC_URL',
  'PRIVATE_KEY',
  'VENN_NODE_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Error: ${envVar} not found in .env file`);
    process.exit(1);
  }
}

const vennURL = process.env.VENN_NODE_URL;
const chainId = 17000;
const vennClient = new VennClient({ 
  vennURL: vennURL, 
  vennPolicyAddress: policyAddress,
});

const storageContract = new ethers.Contract(
  contractAddress, 
  abi, 
  wallet
);

async function setValue(key, value) {
  try {
    console.log(`🔹 Setting value for key "${key}": ${value}`);
    
    const parsedValue = ethers.parseUnits(value, 18);
    const unsignedTx = await storageContract.setValue.populateTransaction(key, parsedValue);
    
    // Prepare transaction parameters exactly as in documentation
    const walletAddress = await wallet.getAddress();
    const txParams = {
      from: walletAddress,
      to: contractAddress,
      data: unsignedTx.data,
      value: '0', // string, not number
      chainId: (await provider.getNetwork()).chainId.toString() // make sure it's a string
    };
    
    console.log("🔹 Requesting approval from Venn...", JSON.stringify(txParams, null, 2));
    
    // Get approved transaction
    const approvedTransaction = await vennClient.approve(txParams);
    
    console.log("✅ Transaction approved! Sending to network...");
    const txResponse = await wallet.sendTransaction(approvedTransaction);
    
    console.log("⏳ Waiting for confirmation...");
    const receipt = await txResponse.wait();
    
    console.log("✅ Value successfully set! Transaction hash:", receipt.hash);
  } catch (error) {
    console.error("❌ Error setting value:", error);
    console.error("Stack trace:", error.stack);
    
    if (error.response) {
      console.error("Error details:", error.response.data);
    }
  }
}

// Function to get value
async function getValue(key) {
  try {
    console.log(`🔹 Getting value for key "${key}"...`);
    const value = await storageContract.getValue(key);
    console.log(`✅ Value for key "${key}": ${value.toString()}`);
    return value;
  } catch (error) {
    console.error(`❌ Error getting value for key "${key}":`, error);
  }
}

// Function to remove value (owner only)
async function removeValue(key) {
  try {
    console.log(`🔹 Removing value for key "${key}"...`);
    
    // Prepare transaction data
    const removeValueFunction = storageContract.getFunction("removeValue");
    const txData = await removeValueFunction.populateTransaction(key);
    txData.from = wallet.address;
    txData.value = '0';
    
    // Send transaction for Venn approval
    console.log("🔹 Requesting approval from Venn...");
    const approvedTransaction = await vennClient.approve({
      from: wallet.address,
      to: contractAddress,
      data: txData.data,
      value: '0',
      chainId // Add chainId to request
    });
    
    console.log("✅ Transaction approved! Sending to network...");
    const txResponse = await wallet.sendTransaction(approvedTransaction);
    
    console.log("⏳ Waiting for confirmation...");
    const receipt = await txResponse.wait();
    
    console.log(`✅ Value for key "${key}" successfully removed! Transaction hash:`, receipt.hash);
  } catch (error) {
    console.error(`❌ Error removing value for key "${key}":`, error);
    if (error.response) {
      console.error("Error details:", error.response.data);
    }
  }
}

// Function to check if key exists
async function hasKey(key) {
  try {
    console.log(`🔹 Checking if key "${key}" exists...`);
    const exists = await storageContract.hasKey(key);
    console.log(`✅ Key "${key}" ${exists ? "exists" : "does not exist"}`);
    return exists;
  } catch (error) {
    console.error(`❌ Error checking if key "${key}" exists:`, error);
  }
}

// Run via command line
const command = process.argv[2];
const args = process.argv.slice(3);

(async () => {
  switch (command) {
    case "set":
      if (args.length < 2) {
        console.error("❌ Please provide key and value.");
        console.error("Example: node dapp-execute.js set myKey 123");
        return;
      }
      await setValue(args[0], args[1]);
      break;
      
    case "get":
      if (args.length < 1) {
        console.error("❌ Please provide key.");
        console.error("Example: node dapp-execute.js get myKey");
        return;
      }
      await getValue(args[0]);
      break;
      
    case "remove":
      if (args.length < 1) {
        console.error("❌ Please provide key to remove.");
        console.error("Example: node dapp-execute.js remove myKey");
        return;
      }
      await removeValue(args[0]);
      break;
      
    case "has":
      if (args.length < 1) {
        console.error("❌ Please provide key to check.");
        console.error("Example: node dapp-execute.js has myKey");
        return;
      }
      await hasKey(args[0]);
      break;
      
    default:
      console.error("❌ Unknown command!");
      console.error("Available commands: set, get, remove, has");
  }
})();
