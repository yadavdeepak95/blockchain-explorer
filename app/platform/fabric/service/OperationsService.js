/**
 *    SPDX-License-Identifier: Apache-2.0
 */

const axios = require('axios');
let helper = require('../../../common/helper');
const logger = helper.getLogger('OperationsService');
const explorer_const = require('./../../../common/ExplorerConst').explorer
  .const;

class OperationsService {
  constructor(platform) {
    this.platform = platform;
    this.proxy = platform.getProxy();
  }

  async getOperationsService(network, checkType) {
    let healthStatus = [];
    let connectionOptions = [];
    const opsServConfig = await this.getOperationsServiceConfig(network);
    if (opsServConfig) {
      for (let i = 0; i < opsServConfig.length; i++) {
        for (let x in opsServConfig[i]) {
          let target = opsServConfig[i][x];

          for (let t in target) {
            let targetUrl = target[t].url + '/' + checkType;
            let targetName = target[t].name;
            if (targetUrl && targetName) {
              console.log(
                'initiated request to HLFabric Operations Service, URL: ',
                targetUrl,
                ' target ',
                targetName
              );
              // call fabric operations service REST
              let data = await this.getOperationsServiceByTarget(
                targetUrl,
                targetName,
                checkType,
                connectionOptions
              );
              healthStatus.push(data);
            } else {
              console.error('Invalid target URL, and Name ', target[t]);
            }
          }
          //
        }
      }
    }

    return healthStatus;
  }

  /**
   *
   * Get the operations service configuration, that is a part of HLFabric network configuration
   */

  async getOperationsServiceConfig(networkName) {
    let operationsServiceConfig = [];
    const network = this.platform.getNetworks().get(networkName);
    for (const [network_name, clients] of network.entries()) {
      if (clients.config && clients.config.operationsservice) {
        let orderers = clients.config.operationsservice.targets.orderers;
        if (orderers) {
          operationsServiceConfig.push({
            orderers: orderers
          });
        }
        let peers = clients.config.operationsservice.targets.peers;
        if (peers) {
          operationsServiceConfig.push({
            peers: peers
          });
        }
        logger.log(
          `\n OperationsService.getOperationsServiceConfig, network ${network_name} `,
          operationsServiceConfig
        );
        console.log(
          `\n OperationsService.getOperationsServiceConfig, network ${network_name} `,
          operationsServiceConfig
        );
        break;
      }
    }

    return operationsServiceConfig;
  }

  async getOperationsServiceByTarget(
    targetUrl,
    targetName,
    type,
    connectionOptions
  ) {
    console.log(
      'getOperationsService: ',
      targetUrl,
      targetName,
      type,
      connectionOptions
    );
    let healthStatus = {};
    let optionSet = new Set();
    let headerType = '# TYPE';
    let headerHelp = '# HELP';
    let tempHeaderHelp = '';
    let tempHeaderType = '';
    let metricsData = [];
    let metricsRow = [];
    let tempOptionName = '';
    try {
      const response = await axios.get(targetUrl);
      let data = null;
      if (type === explorer_const.HEALTHZ) {
        data = JSON.stringify(response.data);
        healthStatus = {
          targetName: targetName,
          targetUrl: targetUrl,
          status: 'SUCCESS',
          data: data
        };
      } else if (type === explorer_const.METRICS) {
        /**
                 * Example response from hlfabric metrics rest api
                line  # HELP ledger_statedb_commit_time Time taken in seconds for committing block changes to state db.
                line  # TYPE ledger_statedb_commit_time histogram
                line  ledger_statedb_commit_time_bucket{channel="mychannel",le="0.005"} 5
                line  ledger_statedb_commit_time_bucket{channel="mychannel",le="0.01"} 5
                line  ledger_statedb_commit_time_bucket{channel="mychannel",le="0.015"} 5
                line  ledger_statedb_commit_time_bucket{channel="mychannel",le="0.05"} 5
                 *
                 */

        // process response from the HLFabric Operations Service
        const lines = response.data.split(/\n|\r/);
        console.debug(
          `Received ${
            lines.length
          } lines from ${targetUrl}, ${targetName} operations service `
        );
        for (let i in lines) {
          if (lines[i]) {
            let line = lines[i].toString().trim();
            if (line.startsWith(headerHelp)) {
              // new set of metrics in
              if (metricsRow.length > 0) {
                metricsData.push({
                  HELP: tempHeaderHelp,
                  TYPE: tempHeaderType,
                  optionData: metricsRow,
                  optionName: tempOptionName
                });
                // reset metrics row
                metricsRow = [];
              }
              tempHeaderHelp = line.replace(headerHelp, '');
              let opt = tempHeaderHelp.trim().split(' ');
              tempOptionName = opt[0];
              optionSet.add(tempOptionName);
              tempHeaderHelp = JSON.stringify(tempHeaderHelp);
            } else if (line.startsWith(headerType)) {
              tempHeaderType = JSON.stringify(line.replace(headerType, ''));
            } else {
              metricsRow.push(JSON.stringify(line));
            }
          }
        }

        // add last option
        if (metricsRow.length > 0) {
          metricsData.push({
            HELP: tempHeaderHelp,
            TYPE: tempHeaderType,
            optionData: metricsRow,
            optionName: tempOptionName
          });
        }

        healthStatus = {
          targetName: targetName,
          targetUrl: targetUrl,
          status: 'SUCCESS',
          data: metricsData,
          options: Array.from(optionSet)
        };
      }
    } catch (error) {
      console.error(error);
      healthStatus = {
        targetName: targetName,
        targetUrl: targetUrl,
        status: 'ERROR',
        error: error
      };
    }

    return healthStatus;
  }
}

module.exports = OperationsService;
