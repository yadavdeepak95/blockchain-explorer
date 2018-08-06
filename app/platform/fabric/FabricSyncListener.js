/*
    SPDX-License-Identifier: Apache-2.0
*/

const path = require('path');
const { fork } = require('child_process');
var helper = require('../../common/helper.js');
var logger = helper.getLogger('FabricSyncListener');

const fabric_const = require('./utils/FabricUtils.js').fabric.const;

class FabricSyncListener {

    constructor(platform, broadcaster) {
        this.platform = platform;
        this.broadcaster = broadcaster;
        this.clientProcess = [];
    }

    async initialize() {
        let _self = this;
        for (var [network_name, clients] of this.platform.networks.entries()) {

            for (var [client_name, client] of clients.entries()) {

                const clientProcessor = fork(
                    path.resolve(__dirname, '../../../sync.js'),
                    [network_name, client_name]
                );

                this.clientProcess.push(clientProcessor);

                clientProcessor.on('message', msg => {
                    // get message from child process
                    logger.debug('Message from child %j', msg);
                    if (fabric_const.NOTITY_TYPE_NEWCHANNEL === msg.notify_type) {
                        // initialize new channel instance in parent
                        if (msg.network_name && msg.client_name) {
                            let client = _self.platform.networks.get(msg.network_name).get(msg.client_name);
                            if (msg.channel_name) {
                                client.initializeNewChannel(msg.channel_name);
                            } else {
                                logger.error(
                                    'Channel name should pass to proces the notification from child process'
                                );
                            }
                        } else {
                            logger.error(
                                'Network name and client name should pass to proces the notification from child process'
                            );
                        }
                    } else if (
                        fabric_const.NOTITY_TYPE_UPDATECHANNEL === msg.notify_type ||
                        fabric_const.NOTITY_TYPE_CHAINCODE === msg.notify_type
                    ) {
                        // update channel details in parent
                        if (msg.network_name && msg.client_name) {
                            let client = _self.platform.networks.get(msg.network_name).get(msg.client_name);
                            if (msg.channel_name) {
                                client.initializeChannelFromDiscover(msg.channel_name);
                            } else {
                                logger.error(
                                    'Channel name should pass to proces the notification from child process'
                                );
                            }
                        } else {
                            logger.error(
                                'Network name and client name should pass to proces the notification from child process'
                            );
                        }
                    } else if (fabric_const.NOTITY_TYPE_BLOCK === msg.notify_type) {
                        // broad cast new block message to client
                        var notify = {
                            title: msg.title,
                            type: msg.type,
                            message: msg.message,
                            time: msg.time,
                            txcount: msg.txcount,
                            datahash: msg.datahash
                        };
                        this.broadcaster.broadcast(notify);
                    } else if (fabric_const.NOTITY_TYPE_EXISTCHANNEL === msg.notify_type) {
                        throw 'Channel name [' +
                        msg.channel_name +
                        '] is already exist in DB , Kindly re-run the DB scripts to proceed';
                    } else if (msg.error) {
                        throw 'Client Processor Error >> ' + msg.error;
                    } else {
                        logger.error(
                            'Child process notify is not implemented for this type %s ',
                            msg.notify_type
                        );
                    }
                });
                clientProcessor.send({
                    message: 'Successfully send a message to child process'
                });
            }
        }
    }

    close() {
        for (let clientPro of this.clientProcess) {
            clientPro.kill('SIGINT');
        }
    }
}

module.exports = FabricSyncListener;