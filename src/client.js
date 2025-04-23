const { config } = require('./easrlc');

module.exports = class Client {
  constructor(serverKey) {
    this.serverKey = serverKey;
  }

  initiate() {
    config.serverKey = this.serverKey;
  }
};
