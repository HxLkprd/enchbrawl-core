class ByteStream {
  constructor(data = null) {
    this.buffer = data || Buffer.alloc(0);
    this.offset = 0;
    this.bitOffset = 0;
  }

  readInt() {
    this.bitOffset = 0;
    const value = this.buffer.readInt32BE(this.offset);
    this.offset += 4;
    return value;
  }

  writeInt(value) {
    this.bitOffset = 0;
    this.ensureCapacity(4);
    this.buffer.writeInt32BE(value, this.offset);
    this.offset += 4;
  }

  readShort() {
    this.bitOffset = 0;
    const value = this.buffer.readInt16BE(this.offset);
    this.offset += 2;
    return value;
  }

  writeShort(value) {
    this.bitOffset = 0;
    this.ensureCapacity(2);
    this.buffer.writeInt16BE(value, this.offset);
    this.offset += 2;
  }

  readByte() {
    this.bitOffset = 0;
    const value = this.buffer[this.offset];
    this.offset += 1;
    return value;
  }

  writeByte(value) {
    this.bitOffset = 0;
    this.ensureCapacity(1);
    this.buffer[this.offset] = value;
    this.offset += 1;
  }

  readBoolean() {
    return this.readByte() !== 0;
  }

  writeBoolean(value) {
    this.writeByte(value ? 1 : 0);
  }

  readString() {
    const length = this.readInt();
    if (length <= 0 || length > 90000) return '';
    
    const string = this.buffer.toString('utf8', this.offset, this.offset + length);
    this.offset += length;
    return string;
  }

  writeString(value) {
    if (!value) {
      this.writeInt(-1);
      return;
    }
    
    const stringBuffer = Buffer.from(value, 'utf8');
    this.writeInt(stringBuffer.length);
    this.writeBuffer(stringBuffer);
  }

  readVInt() {
    let result = 0;
    let shift = 0;
    let byte;
    
    do {
      byte = this.readByte();
      result |= (byte & 0x7F) << shift;
      shift += 7;
    } while (byte & 0x80);
    
    return result;
  }

  writeVInt(value) {
    this.bitOffset = 0;
    let temp = value;
    
    while (temp >= 0x80) {
      this.writeByte((temp & 0x7F) | 0x80);
      temp >>= 7;
    }
    
    this.writeByte(temp);
  }

  readDataReference() {
    const a = this.readVInt();
    return [a, a === 0 ? 0 : this.readVInt()];
  }

  writeDataReference(value1, value2) {
    if (value1 === 0) {
      this.writeVInt(0);
    } else {
      this.writeVInt(value1);
      this.writeVInt(value2);
    }
  }

  readBuffer(length) {
    const buffer = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return buffer;
  }

  writeBuffer(buffer) {
    this.ensureCapacity(buffer.length);
    buffer.copy(this.buffer, this.offset);
    this.offset += buffer.length;
  }

  ensureCapacity(capacity) {
    if (this.offset + capacity > this.buffer.length) {
      const newBuffer = Buffer.alloc(this.offset + capacity);
      this.buffer.copy(newBuffer);
      this.buffer = newBuffer;
    }
  }

  getHex() {
    return this.buffer.toString('hex').toUpperCase();
  }
}

module.exports = ByteStream;