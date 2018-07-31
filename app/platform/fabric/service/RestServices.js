'use strict';

var chaincodeService = require('./chaincodeService.js');
var helper = require('../../../helper.js');
var logger = helper.getLogger('RestServices');

class RestServices {
  constructor(platform, persistence) {
    this.platform = platform;
    this.persistence = persistence;
  }

  async getCurrentChannel() {
    let client = await this.platform.getClient();
    let channel = client.getDefaultChannel();
    let channel_genesis_hash = client.getChannelGenHash(channel.getName());
    let respose;
    if (channel_genesis_hash) {
      respose = { currentChannel: channel_genesis_hash };
    } else {
      respose = {
        status: 1,
        message: 'Channel not found in the Context ',
        currentChannel: ''
      };
    }
    logger.debug('getCurrentChannel >> %j', respose);
    return respose;
  }

  async loadChaincodeSrc(path) {
    let respose = chaincodeService.loadChaincodeSrc(path);
    logger.debug('loadChaincodeSrc >> %s', respose);
    return respose;
  }

  async getPeersStatus(channel_genesis_hash) {
    let nodes = await this.persistence
      .getMetricService()
      .getPeerList(channel_genesis_hash);
    let peers = [];
    let client = this.platform.getClient();
    for (let node of nodes) {
      if (node.peer_type === 'PEER') {
        let res = await client.getPeerStatus(node);
        console.log(JSON.stringify(res));
        node.status = res.status ? res.status : 'DOWN';
        peers.push(node);
      }
    }
    logger.debug('getPeersStatus >> %j', peers);
    return peers;
  }

  async changeChannel(channel_genesis_hash) {
    let client = this.platform.getClient();
    let respose = client.setDefaultChannelByHash(channel_genesis_hash);
    logger.debug('changeChannel >> %s', respose);
    return respose;
  }

  async getChannelsInfo() {
    let channels = await this.persistence.getCrudService().getChannelsInfo();
    let client = this.platform.getClient();
    let currentchannels = [];
    for (var channel of channels) {
      let channel_genesis_hash = client.getChannelGenHash(channel.channelname);
      if (
        channel_genesis_hash &&
        channel_genesis_hash === channel.channel_genesis_hash
      ) {
        currentchannels.push(channel);
      }
    }
    logger.debug('getChannelsInfo >> %j', currentchannels);
    return currentchannels;
  }

  async getOrganizations(channel_genesis_hash) {
    let client = this.platform.getClient();
    let channel = client.getChannelByHash(channel_genesis_hash);
    let msps = [];
    let organizations = [];
    if (channel._msp_manager) {
      msps = channel._msp_manager.getMSPs();
    }
    for (let msp_id in msps) {
      organizations.push(msp_id);
    }
    return organizations;
  }

  async getBlockByNumber(channel_genesis_hash, number) {
    let client = this.platform.getClient();
    let channel = client.getChannelByHash(channel_genesis_hash);

    let block = channel.queryBlock(
      parseInt(number),
      client.getDefaultPeer().getName(),
      true
    );

    if (block) {
      return block;
    } else {
      logger.error('response_payloads is null');
      return 'response_payloads is null';
    }
  }

  async createChannel(artifacts) {
    let client = this.platform.getClient();
    let respose = await client.createChannel(artifacts);
    return respose;
  }

  async joinChannel(channelName, peers, orgName) {
    let client = this.platform.getClient();
    let respose = await client.joinChannel(channelName, peers, orgName);
    return respose;
  }

  getClientStatus() {
    let client = this.platform.getClient();
    return client.getStatus();
  }

  getChannels() {
    let respose = this.platform.getClient().getChannelNames();
    logger.debug('getChannels >> %j', respose);
    return respose;
  }

  getPlatform() {
    return this.platform;
  }

  getPersistence() {
    return this.persistence;
  }
}

module.exports = RestServices;
