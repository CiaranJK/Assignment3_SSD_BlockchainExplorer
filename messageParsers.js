const crypto = require("crypto");

function deserialiseMessage(data) {
  const message = {};

  // Parse the message command
  message.command = data.slice(4, 16).toString("ascii").replace(/\0+$/, "");

  // Parse the message payload
  message.payload = data.slice(24);

  return message;
}

function parseBlockHeader(header) {
  // Extract the relevant fields from the header
  const timestamp = header.readUInt32LE(4);
  const nonce = header.slice(76, 80);
  const difficulty = header.readUInt32LE(72);
  
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Nonce: ${nonce.toString('hex')}`);
  console.log(`Difficulty: ${difficulty}`);

  return { timestamp, nonce, difficulty };
};

module.exports = { deserialiseMessage };
