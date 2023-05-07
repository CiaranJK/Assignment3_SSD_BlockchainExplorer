const crypto = require("crypto");

function generateVersionMessage() {
  const version = Buffer.alloc(4);
  version.writeInt32LE(70016);

  const services = Buffer.alloc(8);
  services.writeBigUInt64LE(BigInt(0));

  const timestamp = Buffer.alloc(8);
  timestamp.writeBigInt64LE(BigInt(Math.floor(Date.now() / 1000)));

  const addrRecvServices = Buffer.alloc(8);
  addrRecvServices.writeBigUInt64LE(BigInt(0));

  const addrRecvIp = Buffer.alloc(16);
  addrRecvIp.write("127.0.0.1");

  const addrRecvPort = Buffer.alloc(2);
  addrRecvPort.writeUInt16BE(8333);

  const addrTransServices = Buffer.alloc(8);
  addrTransServices.writeBigUInt64LE(BigInt(0));

  const addrTransIp = Buffer.alloc(16);
  addrTransIp.write("127.0.0.1");

  const addrTransPort = Buffer.alloc(2);
  addrTransPort.writeUInt16BE(8333);

  const nonce = crypto.randomBytes(8);

  const userAgentBytes = Buffer.alloc(1);
  userAgentBytes.writeUInt8(0);

  const startingHeight = Buffer.alloc(4);
  startingHeight.writeInt32LE(395292);

  const relay = Buffer.alloc(1);
  relay.writeUInt8(0);

  const payload = Buffer.concat([
    version,
    services,
    timestamp,
    addrRecvServices,
    addrRecvIp,
    addrRecvPort,
    addrTransServices,
    addrTransIp,
    addrTransPort,
    nonce,
    userAgentBytes,
    startingHeight,
    relay,
  ]);

  const magic = Buffer.from("f9beb4d9", "hex");
  const command = Buffer.alloc(12);
  command.write("version", "ascii");

  const length = Buffer.alloc(4);
  length.writeUInt32LE(payload.length);

  const check = crypto
    .createHash("sha256")
    .update(crypto.createHash("sha256").update(payload).digest())
    .digest()
    .slice(0, 4);

  const msg = Buffer.concat([magic, command, length, check, payload]);

  return msg;
}

function generateVerackMessage() {
  const verackPayload = Buffer.alloc(0);

  const magicBytes = Buffer.from("f9beb4d9", "hex");
  const verackCommand = Buffer.from("verack".padEnd(12, "\0"), "ascii");
  const payloadLength = Buffer.alloc(4);
  const checksum = Buffer.from("5DF6E0E2", "hex");

  const verack = Buffer.concat([
    magicBytes,
    verackCommand,
    payloadLength,
    checksum,
    verackPayload,
  ]);

  return verack;
}

function createPayloadGetData(blockHash) {
  const count = 1;
  const type = 1;
  const hash = Buffer.from(blockHash, "hex");
  const payload = Buffer.alloc(33);
  payload.writeUInt8(count, 0);
  payload.writeUInt8(type, 1);
  hash.copy(payload, 2);
  return payload;
}

function generateGetDataMessage(hash) {
  const getDataCommand = Buffer.from("getdata".padEnd(12, "\0"), "ascii");
  const magicBytesDataMsg = Buffer.from("f9beb4d9", "hex");
  const getDataPayload = createPayloadGetData(hash);
  const getDataMesssage = Buffer.concat([
    magicBytesDataMsg,
    getDataCommand,
    getDataPayload,
  ]);

  return getDataMesssage;
}

function generateGetBlocksMessage(startBlockHash, stopBlockHash) {

    // Construct the message header
    const magicBytes = Buffer.from('f9beb4d9', 'hex');
    const commandName = Buffer.alloc(12);
    commandName.write('getblocks', 'ascii');
    const payloadLength = 64;
    const checksum = Buffer.alloc(4);
    const messageHeader = Buffer.concat([magicBytes, commandName, Buffer.alloc(4), checksum]);
  
    // Construct the message payload
    const version = 70016;
    const hashCount = 1;
    const startBlockHashBuffer = Buffer.from(startBlockHash, 'hex').reverse();
    const stopBlockHashBuffer = Buffer.from(stopBlockHash, 'hex').reverse();
    const versionBuffer = Buffer.alloc(4);
    versionBuffer.writeUInt32LE(version);
    const hashCountBuffer = Buffer.alloc(1);
    hashCountBuffer.writeUInt8(hashCount);
    const payload = Buffer.concat([
      versionBuffer,
      hashCountBuffer,
      startBlockHashBuffer,
      stopBlockHashBuffer,
      Buffer.alloc(32, 0)
    ]);
  
    const check = crypto
      .createHash("sha256")
      .update(crypto.createHash("sha256").update(payload).digest())
      .digest()
      .slice(0, 4);
  
    // Concatenate the header, payload, and checksum to form the full message
    const message = Buffer.concat([messageHeader, payload, check]);
  
    return message;
  }

module.exports = {
  generateVersionMessage,
  generateVerackMessage,
  generateGetDataMessage,
  generateGetBlocksMessage
};
