const PiranhaMessage = require('../../PiranhaMessage');

class ServerHelloMessage extends PiranhaMessage {
  constructor(client) {
    super(null, client);
    this.id = 20100;
    this.version = 0;
  }

  encode() {
    this.writeInt(24);
    for (let i = 0; i < 24; i++) {
      this.writeByte(1);
    }
  }

  send() {
    this.encode();
    
    const header = Buffer.alloc(7);
    header.writeUInt16BE(this.id, 0);
    header.writeUIntBE(this.buffer.length, 2, 3);
    header.writeUInt16BE(this.version, 5);
    
    const packet = Buffer.concat([header, this.buffer]);
    this.client.write(packet);
    
    // this.client.log(`Send packetik: ${this.id} (${this.constructor.name})`);
  }
}

module.exports = ServerHelloMessage;