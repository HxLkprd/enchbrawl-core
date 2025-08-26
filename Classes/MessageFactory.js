const fs = require('fs');
const path = require('path');

class MessageFactory {
  constructor() {
    this.packets = {};
    this.loadPackets();
  }

  loadPackets() {
    const clientPacketsPath = path.join(__dirname, 'Messages', 'Client');
    
    try {
      const files = fs.readdirSync(clientPacketsPath);
      
      files.forEach(file => {
        if (file.endsWith('.js') && file !== 'index.js') {
          try {
            const filePath = path.join(clientPacketsPath, file);
            const PacketClass = require(filePath);
            
            const tempInstance = new PacketClass(Buffer.alloc(0), {});
            if (tempInstance.id) {
              this.packets[tempInstance.id] = PacketClass;
              // console.log(`Loaded packet: ${tempInstance.id} - ${file}`);
            }
          } catch (error) {
            console.log(`Error loading packet ${file}:`, error.message);
          }
        }
      });
      
      // console.log(`Total packets loaded: ${Object.keys(this.packets).length}`);
    } catch (error) {
      console.log('Error reading packets directory:', error.message);
    }
  }

  handle(id) {
    return this.packets[id];
  }

  getPackets() {
    return Object.keys(this.packets);
  }
}

module.exports = MessageFactory;