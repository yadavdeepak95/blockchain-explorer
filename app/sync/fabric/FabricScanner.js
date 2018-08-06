const path = require('path');
const fs = require('fs-extra');

const FabricSyncServices = require('./service/FabricSyncServices');
const FabricUtils = require('../../platform/fabric/utils/FabricUtils');
const FabricEvent = require('./FabricEvent.js');

const helper = require('../../common/helper');
const logger = helper.getLogger('FabricScanner');

const fabric_const = require('../../platform/fabric/utils/FabricUtils').fabric.const;
const config_path = path.resolve(__dirname, '../../platform/fabric/config.json');

class FabricScanner {
  constructor(persistence) {
    this.network_name;
    this.client_name;
    this.client;
    this.eventHub;
    this.persistence = persistence;
    this.fabricSyncServices = new FabricSyncServices(this, this.persistence);
    this.synchBlocksTime = 60000;
    this.client_configs;
  }

  async initialize(args) {
    let _self = this;
    this.network_name = args[0];
    this.client_name = args[1];

    logger.debug(
      '******* Initialization started for child client process %s ******',
      this.client_name
    );

    // loading the config.json
    let all_config = JSON.parse(fs.readFileSync(config_path, 'utf8'));
    let network_configs = all_config[fabric_const.NETWORK_CONFIGS];

    // setting the block synch interval time
    await this.setSynchBlocksTime(all_config);

    logger.debug('Blocks synch interval time >> %s', this.synchBlocksTime);
    // update the discovery-cache-life as block synch interval time in global config
    global.hfc.config.set('discovery-cache-life', this.synchBlocksTime);

    let client_configs = network_configs[this.network_name];

    this.client_configs = await FabricUtils.setOrgEnrolmentPath(client_configs);

    this.client = await FabricUtils.createFabricClient(
      this.client_configs,
      this.client_name
    );
    if (!this.client) {
      throw 'There is no client found for Hyperledger fabric scanner';
    }

    // updating the client network and other details to DB
    let res = await this.fabricSyncServices.synchNetworkConfigToDB(this.client);

    if (!res) {
      return;
    }

    //start event
    this.eventHub = new FabricEvent(this.client, this.fabricSyncServices);
    await this.eventHub.initialize();

    // setting interval for validating any missing block from the current client ledger
    // set synchBlocksTime property in platform config.json in minutes
    setInterval(function () {
      _self.isChannelEventHubConnected();
    }, this.synchBlocksTime);
    logger.debug(
      '******* Initialization end for child client process %s ******',
      this.client_name
    );
  }

  async isChannelEventHubConnected() {
    for (var [channel_name, channel] of this.client.getChannels().entries()) {
      // validate channel event is connected
      let status = this.eventHub.isChannelEventHubConnected(channel_name);
      if (status) {
        await this.fabricSyncServices.synchBlocks(this.client, channel);
      } else {
        // channel client is not connected then it will reconnect
        this.eventHub.connectChannelEventHub(channel_name);
      }
    }
  }

  async setSynchBlocksTime(all_config) {
    if (all_config.synchBlocksTime) {
      let time = parseInt(all_config.synchBlocksTime, 10);
      if (!isNaN(time)) {
        this.synchBlocksTime = 1 * 10 * 1000;
        //this.synchBlocksTime = time * 60 * 1000;
      }
    }
  }

  send(notify) {
    try {
      if (process.send) {
        process.send(notify);
      }
    } catch (e) { }
  }

  destroy() {
    if (this.eventHub) {
      this.eventHub.disconnectEventHubs();
    }
    if (this.persistence) {
      this.persistence.closeconnection();
    }
  }
}

module.exports = FabricScanner;
