
'use strict';

var chaincodeService = require('./chaincodeService.js');

class RestServices {

    constructor(platform, persistence, broadcaster, ) {
        this.platform = platform;
        this.persistence = persistence;
        this.broadcaster = broadcaster;
    }

    async getCurrentChannel() {

        let client = this.platform.getDefaultClient();
        let channel = client.getDefaultChannel();
        let genesis_block_hash = client.getChannelGenHash(channel.getName());
        if (genesis_block_hash) {
            return { "currentChannel": genesis_block_hash };
        }
        else {
            return { "status": 1, "message": "Channel not found in the Context ", "currentChannel": "" };
        }
    }

    async loadChaincodeSrc(path) {
        return chaincodeService.loadChaincodeSrc(path);
    }
    async getPeersStatus(genesis_block_hash) {
        console.log('genesis_block_hash >>>>>>' + genesis_block_hash);

        let peers = await this.persistence.getMetricService().getPeerList(genesis_block_hash);
        console.log(JSON.stringify(peers));


    }

    getChannels() {
        return this.platform.getDefaultClient().getChannelNames();
    }

    getPlatform() {
        return this.platform;
    }

    getPersistence() {
        return this.persistence;
    }

    getBroadcaster() {
        return this.broadcaster;
    }

}

module.exports = RestServices;