const PiranhaMessage = require('../../PiranhaMessage');
const ServerHelloMessage = require('../Server/ServerHelloMessage');

class ClientHelloMessage extends PiranhaMessage {
  constructor(bytes, client) {
    super(bytes, client);
    this.id = 10100;
    this.version = 0;
  }

  decode() {
    this.readInt();
  }

  async process() {
    new ServerHelloMessage(this.client).send();
  }
}

module.exports = ClientHelloMessage;