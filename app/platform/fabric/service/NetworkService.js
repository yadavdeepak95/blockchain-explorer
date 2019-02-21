let config = require('../../../platform/fabric/config.json');

class NetworkService {
  constructor(platform) {
    this.platform = platform;
  }

  async networkList() {
    // Get the list of the networks from the  configuration that was loaded from the config.json
    let networklist = [];
    const networks = this.platform.getNetworks();
    const iterator = networks.entries();
    for (let value of iterator) {
      networklist.push(value);
    }

    return networklist;
  }
}

module.exports = NetworkService;
