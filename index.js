const net = require('net');
const MessageFactory = require('./Classes/MessageFactory');
require('./Utils/Logger');

const server = new net.Server();
const messageFactory = new MessageFactory();
const PORT = 9339;

server.on('connection', (client) => {
  client.setNoDelay(true);
  
  client.log = function(text) {
    Client(this.remoteAddress, text);
  };

  client.log('New connection!');

  client.on('data', async (packet) => {
    try {
      if (packet.length < 7) return;

      const messageId = packet.readUInt16BE(0);
      
      // if (messageId === 65) {
      //   return;
      // }

      const messageLength = packet.readUIntBE(2, 3);
      const messageVersion = packet.readUInt16BE(5);
      
      if (packet.length < 7 + messageLength) {
        return client.log(`Incomplete packet ${messageId}`);
      }
      
      const payload = packet.slice(7, 7 + messageLength);
      const MessageClass = messageFactory.handle(messageId);
      
      if (MessageClass) {
        const message = new MessageClass(payload, client);
        message.version = messageVersion;
        
        client.log(`Received packet ${messageId} (${message.constructor.name})`);
        
        await message.decode();
        await message.process();
      } else {
        client.log(`Unknown packet: ${messageId}`);
      }
    } catch (error) {
      client.log(`Packet processing error: ${error.message}`);
    }
  });

  client.on('end', () => {
    client.log('Client disconnected');
  });

  client.on('error', (error) => {
    client.log(`Error: ${error.message}`);
    client.destroy();
  });
});

server.once('listening', () => {
  ServerLog(`TCP Server started at 0.0.0.0:${PORT}`);
});

server.listen(PORT);

process.on('uncaughtException', (error) => {
  Err('Unhandled exception:', error.message);
});

process.on('unhandledRejection', (error) => {
  Err('Unhandled promise rejection:', error.message);
});