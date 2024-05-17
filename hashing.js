const crypto = require('crypto');

// Function to compute SHA-256 hash
function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Initialize the blockchain array
let blockchain = [];

// Function to create a new block
function createBlock(data) {
    const index = blockchain.length;
    const prevHash = index > 0 ? blockchain[index - 1].hash : "000000";
    const timestamp = Date.now();

    const block = {
        index,
        prevHash,
        data,
        timestamp
    };

    // Compute the hash of the block
    block.hash = sha256(index + prevHash + data + timestamp);

    // Add the block to the blockchain
    blockchain.push(block);

    return block;
}

// Sample lines of text from a poem
const poemLines = [
    "The sun sets in the west",
    "Birds chirp their evening songs",
    "Shadows grow long and thin",
    "Night falls gently over the land",
    "Stars begin their nightly dance",
    "The moon rises high and bright",
    "Oceans reflect its silver light",
    "Dreams take flight in the night"
];

// Add each line as a block to the blockchain
poemLines.forEach(line => createBlock(line));

// Print out the blockchain to verify
console.log(blockchain);

// Function to verify a single block
function verifyBlock(block, prevBlock = null) {
    if (!block.data) return false;
    if (block.index === 0 && block.hash !== "000000") return false;
    if (block.index !== 0 && !block.prevHash) return false;
    if (!Number.isInteger(block.index) || block.index < 0) return false;

    const recomputedHash = sha256(block.index + block.prevHash + block.data + block.timestamp);
    if (block.hash !== recomputedHash) return false;

    if (prevBlock) {
        if (block.prevHash !== prevBlock.hash) return false;
    }

    return true;
}

// Function to verify the entire blockchain
function verifyChain(blockchain) {
    for (let i = 0; i < blockchain.length; i++) {
        const block = blockchain[i];
        const prevBlock = i > 0 ? blockchain[i - 1] : null;

        if (!verifyBlock(block, prevBlock)) {
            return false;
        }
    }
    return true;
}

// Verify the blockchain and print the result
const isChainValid = verifyChain(blockchain);
console.log("Is the blockchain valid?", isChainValid);
