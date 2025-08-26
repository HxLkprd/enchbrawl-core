const ByteStream = require('../Utils/ByteStream');

class PiranhaMessage extends ByteStream {
  constructor(bytes, client) {
    super(bytes);
    this.id = 0;
    this.client = client;
    this.version = 0;
  }

  decode() {}

  encode() {}

  process() {}
}

module.exports = PiranhaMessage;