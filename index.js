const net = require("net");

const {
  generateVersionMessage,
  generateVerackMessage,
  generateGetDataMessage,
  // generateGetBlocksMessage
} = require("./messageGen");

const { deserialiseMessage, handleBlockMessages } = require("./messageParsers");

const HOST = "seed.btc.petertodd.org";
const PORT = 8333;

const s = net.connect(
  { host: HOST, port: PORT, keepAlive: true, keepAliveInterval: 60000 },
  () => {
    console.log("Connected to " + HOST + ":" + PORT);

    const versionMessage = generateVersionMessage();
    const verackMessage = generateVerackMessage();

    s.write(versionMessage);

    s.on("data", (data) => {
      const message = deserialiseMessage(data);
      console.log(message);

      if (message.command == "version") {
        s.write(verackMessage);
      }
/* 
      if (message.command == 'verack') {
        const startHash = '0000000000000000000591429c636f21c6859d1f50cf9adb83e5b97e4d7e5c41'
        const endHash = '0000000000000000000000000000000000000000000000000000000000000000'
        const getblocksMessage = generateGetBlocksMessage(startHash, endHash)
        s.write(getblocksMessage)
      } */

      if (message.command == "inv") {
        const blockHash = message.payload
        const getDataMesssage = generateGetDataMessage(blockHash);
        s.write(getDataMesssage);
        console.log('Getdata message sent.')
      }
    });

    s.on("error", (err) => {
      console.error("Socket error:", err);
    });

    s.on("close", () => {
      console.log("Connection closed");
    });
  }
);
