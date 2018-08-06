/**
 *    SPDX-License-Identifier: Apache-2.0
 */

const path = require('path');
const fs = require('fs-extra');

const ProxyServices = require('./service/ProxyServices.js');
const helper = require('../../common/helper');
const logger = helper.getLogger('Platform');
const FabricUtils = require('./utils/FabricUtils.js');
const FabricSyncListener = require('./FabricSyncListener.js');

const fabric_const = require('./utils/FabricUtils.js').fabric.const;

const config_path = path.resolve(__dirname, './config.json');

class Platform {
  constructor(persistence) {
    this.persistence = persistence;
    this.networks = new Map();
    this.proxyServices = new ProxyServices(this, persistence);
    this.defaultNetwork;
    this.defaultClient;
    this.network_configs;
    this.syncListener;
  }

  async initialize() {
    let _self = this;

    // build client context
    logger.debug(
      '******* Initialization started for hyperledger fabric platform ******'
    );
    await this.buildClientsFromFile(config_path);

    if (
      this.networks.size == 0 &&
      this.networks.get(this.defaultNetwork).size == 0
    ) {
      logger.error(
        '************* There is no client found for Hyperledger fabric platform *************'
      );
      throw 'There is no client found for Hyperledger fabric platform';
    }

  }

  async buildClientsFromFile(config_path) {
    let _self = this;
    // loading the config.json
    let all_config = JSON.parse(fs.readFileSync(config_path, 'utf8'));
    let network_configs = all_config[fabric_const.NETWORK_CONFIGS];

    // setting organization enrolment files
    logger.debug('Setting admin organization enrolment files');
    this.network_configs = await FabricUtils.setAdminEnrolmentPath(
      network_configs
    );

    for (let network_name in this.network_configs) {
      this.networks.set(network_name, new Map());

      let client_configs = this.network_configs[network_name];
      if (!this.defaultNetwork) {
        this.defaultNetwork = network_name;
      }

      // Create fabric explorer client for each
      // Each client is connected to only a single peer and monitor that particular peer only
      for (let client_name in client_configs.clients) {
        // set default client as first client
        if (!this.defaultClient) {
          this.defaultClient = client_name;
        }
        // create client instance
        logger.debug('Creatinging client [%s] >> ', client_name);
        let client = await FabricUtils.createFabricClient(
          client_configs,
          client_name,
          this.persistence
        );
        if (client) {
          // set client into clients map
          let clients = this.networks.get(network_name);
          clients.set(client_name, client);
        }
      }
    }
  }

  initializeSyncLocal(broadcaster) {
    this.syncListener = new FabricSyncListener(this, broadcaster);
    this.syncListener.initialize();
  }

  changeNetwork(network_name, client_name, channel_name) {
    let network = this.networks.get(network_name);
    if (network) {
      this.defaultNetwork = network_name;
      let client;
      if (client_name) {
        client = network.get(client_name);
        if (client) {
          this.defaultClient = client_name;
        } else {
          return 'Client [' + network_name + '] is not found in network';
        }
      } else {
        var iterator = network.values();
        client = iterator.next().value;
        if (!client) {
          return 'Client [' + network_name + '] is not found in network';
        }
      }
      if (channel_name) {
        client.setDefaultChannel(channel_name);
      }
    } else {
      return 'Network [' + network_name + '] is not found';
    }
  }

  getNetworks() {
    return this.networks;
  }

  getClient(network_name, client_name) {
    return this.networks
      .get(network_name ? network_name : this.defaultNetwork)
      .get(client_name ? client_name : this.defaultClient);
  }

  getPersistence() {
    return this.persistence;
  }
  getBroadcaster() {
    return this.broadcaster;
  }

  getFabricServices() {
    return this.fabricServices;
  }

  getProxyServices() {
    return this.proxyServices;
  }

  setDefaultClient(defaultClient) {
    this.defaultClient = defaultClient;
  }

  async destroy() {
    console.log(
      '<<<<<<<<<<<<<<<<<<<<<<<<<< Closing explorer  >>>>>>>>>>>>>>>>>>>>>'
    );
    if (this.syncListener) {
      this.syncListener.close();
    }
  }
}
module.exports = Platform;
